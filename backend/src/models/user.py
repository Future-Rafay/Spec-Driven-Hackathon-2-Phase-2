"""
User models and schemas for authentication.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from pydantic import EmailStr, field_validator
import re


class User(SQLModel, table=True):
    """User account model for authentication."""
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    """Schema for user signup request."""
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8)

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password meets strength requirements."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')

        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')

        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')

        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')

        return v


class UserSignIn(SQLModel):
    """Schema for user sign-in request."""
    email: EmailStr = Field(max_length=255)
    password: str


class UserResponse(SQLModel):
    """Schema for user data in responses (no password)."""
    id: UUID
    email: str
    created_at: datetime


class AuthResponse(SQLModel):
    """Schema for authentication response with user and token."""
    user: UserResponse
    token: str
