"""
Task model and schemas for todo task management.
"""
from sqlmodel import Field, SQLModel
from pydantic import field_validator
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional


class Task(SQLModel, table=True):
    """Task model with user ownership and completion tracking."""
    __tablename__ = "tasks"

    # Primary key
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key to users table (enforces data isolation)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)

    # Task content
    title: str = Field(max_length=500, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)

    # Completion tracking
    completed: bool = Field(default=False, nullable=False)
    completed_at: Optional[datetime] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class TaskCreate(SQLModel):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default="", max_length=2000)

    @field_validator('title')
    @classmethod
    def validate_title_not_empty(cls, v: str) -> str:
        """Validate that title is not empty or whitespace only."""
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()


class TaskUpdate(SQLModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)

    @field_validator('title')
    @classmethod
    def validate_title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        """Validate that title is not empty or whitespace only if provided."""
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip() if v else None


class TaskResponse(SQLModel):
    """Schema for task in API responses."""
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    completed: bool
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
