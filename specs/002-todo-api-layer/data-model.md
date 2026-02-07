# Data Model: Todo Backend API & Data Layer

**Feature**: 002-todo-api-layer
**Date**: 2026-02-08
**Purpose**: Define database schema and entity relationships for task management

## Entity Overview

This feature introduces one new entity: **Task**. It references the existing **User** entity from the authentication layer.

```
┌─────────────────┐
│     User        │
│  (from 001)     │
├─────────────────┤
│ id: UUID (PK)   │
│ email: string   │
│ hashed_password │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│     Task        │
│   (new)         │
├─────────────────┤
│ id: UUID (PK)   │
│ user_id: UUID   │◄── Foreign Key
│ title: string   │
│ description     │
│ completed: bool │
│ completed_at    │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## Task Entity

### Purpose
Represents a todo item that belongs to a specific user. Each task tracks its content (title, description), completion status, and timestamps.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the task |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL, INDEXED | Owner of the task (immutable) |
| `title` | VARCHAR(500) | NOT NULL, CHECK(LENGTH(TRIM(title)) > 0) | Task title (required, non-empty) |
| `description` | TEXT | NULLABLE | Optional task description (max 2000 chars in app) |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `completed_at` | TIMESTAMP | NULLABLE | When task was marked complete (null if incomplete) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When task was created |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When task was last modified |

### Constraints

**Primary Key**:
- `id` - UUID generated on creation

**Foreign Keys**:
- `user_id` → `users(id)` ON DELETE CASCADE
  - When a user is deleted, all their tasks are automatically deleted
  - Enforces referential integrity at database level

**Check Constraints**:
- `title_not_empty`: `LENGTH(TRIM(title)) > 0`
  - Prevents empty or whitespace-only titles

**Indexes**:
- `idx_tasks_user_id` on `user_id` - Fast filtering by user (critical for data isolation)
- `idx_tasks_created_at` on `created_at DESC` - Fast ordering for list queries
- `idx_tasks_completed` on `completed` - Fast filtering by completion status (future use)

### Field Details

#### id (UUID)
- **Purpose**: Unique identifier for the task
- **Generation**: `uuid_generate_v4()` at database level, `uuid4()` at application level
- **Immutable**: Never changes after creation
- **Format**: Standard UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)

#### user_id (UUID)
- **Purpose**: Links task to its owner
- **Source**: Extracted from JWT token during task creation
- **Immutable**: Cannot be changed after creation (enforces ownership)
- **Indexed**: Critical for performance of user-filtered queries
- **Cascade**: Tasks deleted when user is deleted

#### title (VARCHAR(500))
- **Purpose**: Main content of the task
- **Required**: Cannot be null or empty
- **Validation**:
  - Application: 1-500 characters, trimmed, non-whitespace
  - Database: CHECK constraint ensures non-empty after trimming
- **Examples**: "Buy groceries", "Complete project report"

#### description (TEXT)
- **Purpose**: Optional additional details about the task
- **Optional**: Can be null or empty string
- **Validation**:
  - Application: 0-2000 characters
  - Database: No constraint (TEXT type)
- **Examples**: "Milk, eggs, bread, chicken", "Include Q4 metrics and projections"

#### completed (BOOLEAN)
- **Purpose**: Tracks whether task is done
- **Default**: FALSE (new tasks are incomplete)
- **Toggle**: Changed via PATCH /api/tasks/{id}/complete endpoint
- **Behavior**:
  - FALSE → TRUE: Set `completed_at` to current timestamp
  - TRUE → FALSE: Clear `completed_at` to null

#### completed_at (TIMESTAMP)
- **Purpose**: Records when task was marked complete
- **Nullable**: NULL when task is incomplete
- **Set**: Automatically set to current timestamp when `completed` becomes TRUE
- **Cleared**: Set to NULL when `completed` becomes FALSE
- **Timezone**: Stored in UTC

#### created_at (TIMESTAMP)
- **Purpose**: Records when task was created
- **Immutable**: Never changes after creation
- **Default**: Current timestamp at creation time
- **Timezone**: Stored in UTC
- **Used for**: Ordering tasks (newest first)

#### updated_at (TIMESTAMP)
- **Purpose**: Records when task was last modified
- **Mutable**: Updated on every change (title, description, completion)
- **Default**: Current timestamp at creation time
- **Trigger**: Automatically updated via database trigger
- **Timezone**: Stored in UTC

## User Entity (Reference)

### Purpose
Represents an authenticated user account. Defined in feature 001-auth-layer.

### Relationship to Tasks
- One user can have many tasks (1:N relationship)
- Tasks reference users via `user_id` foreign key
- Deleting a user cascades to delete all their tasks

### Fields (Summary)
- `id`: UUID - Primary key
- `email`: VARCHAR(255) - Unique, indexed
- `hashed_password`: VARCHAR(255) - bcrypt hash
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Database Schema (SQL)

### Migration: 002_create_tasks_table.sql

```sql
-- Migration: 002_create_tasks_table
-- Description: Create tasks table with user ownership
-- Date: 2026-02-08
-- Dependencies: 001_create_users_table.sql

BEGIN;

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

-- Create indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Create trigger for updated_at
-- Note: update_updated_at_column() function already exists from 001 migration
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

## SQLModel Definitions

### Task Model (Table)

```python
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """Task model with user ownership and completion tracking."""
    __tablename__ = "tasks"

    # Primary key
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key to users table
    user_id: UUID = Field(
        foreign_key="users.id",
        index=True,
        nullable=False
    )

    # Task content
    title: str = Field(
        max_length=500,
        nullable=False,
        min_length=1
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000
    )

    # Completion tracking
    completed: bool = Field(default=False, nullable=False)
    completed_at: Optional[datetime] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
```

### TaskCreate Schema (Request)

```python
from pydantic import field_validator

class TaskCreate(SQLModel):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default="", max_length=2000)

    @field_validator('title')
    @classmethod
    def validate_title_not_empty(cls, v: str) -> str:
        """Ensure title is not empty or whitespace only."""
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()
```

### TaskUpdate Schema (Request)

```python
class TaskUpdate(SQLModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)

    @field_validator('title')
    @classmethod
    def validate_title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        """Ensure title is not empty or whitespace only if provided."""
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip() if v else None
```

### TaskResponse Schema (Response)

```python
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
```

## Data Validation Rules

### Application-Level Validation (Pydantic)

**Title**:
- Required for creation
- Optional for update (if provided, must be valid)
- Min length: 1 character (after trimming)
- Max length: 500 characters
- Must not be empty or whitespace only
- Automatically trimmed

**Description**:
- Optional for creation and update
- Max length: 2000 characters
- Can be empty string or null

**Completed**:
- Boolean only (true/false)
- Default: false for new tasks

**UUID Fields**:
- Must be valid UUID format
- Validated by FastAPI/Pydantic automatically

### Database-Level Validation (PostgreSQL)

**Title**:
- NOT NULL constraint
- CHECK constraint: `LENGTH(TRIM(title)) > 0`

**User ID**:
- NOT NULL constraint
- FOREIGN KEY constraint to users(id)
- ON DELETE CASCADE

**Completed**:
- NOT NULL constraint
- DEFAULT FALSE

**Timestamps**:
- NOT NULL constraints
- DEFAULT CURRENT_TIMESTAMP

## Query Patterns

### List All Tasks for User

```python
tasks = session.exec(
    select(Task)
    .where(Task.user_id == user_id)
    .order_by(Task.created_at.desc())
).all()
```

**Index Used**: `idx_tasks_user_id`, `idx_tasks_created_at`

### Get Single Task by ID

```python
task = session.get(Task, task_id)
```

**Index Used**: Primary key index on `id`

### Create Task

```python
task = Task(
    user_id=UUID(user_id),
    title=task_data.title,
    description=task_data.description
)
session.add(task)
session.commit()
session.refresh(task)
```

### Update Task

```python
task.title = new_title
task.description = new_description
task.updated_at = datetime.utcnow()
session.add(task)
session.commit()
session.refresh(task)
```

**Trigger**: `update_tasks_updated_at` automatically updates `updated_at`

### Delete Task

```python
session.delete(task)
session.commit()
```

### Toggle Completion

```python
if not task.completed:
    task.completed = True
    task.completed_at = datetime.utcnow()
else:
    task.completed = False
    task.completed_at = None

task.updated_at = datetime.utcnow()
session.add(task)
session.commit()
session.refresh(task)
```

## Data Isolation Strategy

### Enforcement Points

1. **Query Level**: All SELECT queries filter by `user_id`
2. **Ownership Check**: Before UPDATE/DELETE, verify `task.user_id == authenticated_user_id`
3. **Creation**: Set `user_id` from JWT token, never from client input
4. **Database Level**: Foreign key constraint ensures valid user references

### Security Guarantees

- ✅ Users can only see their own tasks
- ✅ Users cannot modify other users' tasks
- ✅ Users cannot delete other users' tasks
- ✅ User ID comes from verified JWT, not client input
- ✅ Database enforces referential integrity

## Performance Characteristics

### Expected Query Performance

| Operation | Expected Time | Index Used |
|-----------|---------------|------------|
| List tasks (100 items) | < 200ms | `idx_tasks_user_id`, `idx_tasks_created_at` |
| Get single task | < 50ms | Primary key |
| Create task | < 100ms | N/A |
| Update task | < 100ms | Primary key |
| Delete task | < 100ms | Primary key |

### Index Strategy

**idx_tasks_user_id** (B-tree):
- Supports fast filtering by user
- Critical for data isolation queries
- Used in every list operation

**idx_tasks_created_at** (B-tree, DESC):
- Supports fast ordering by creation date
- Used in list operations
- DESC order matches query pattern

**idx_tasks_completed** (B-tree):
- Supports filtering by completion status
- Reserved for future filtering features
- Low overhead (boolean column)

## Migration Dependencies

### Prerequisites
- `001_create_users_table.sql` must be applied first
- `uuid-ossp` extension must be enabled
- `update_updated_at_column()` function must exist

### Rollback Strategy

```sql
-- Rollback: 002_create_tasks_table
BEGIN;

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP INDEX IF EXISTS idx_tasks_completed;
DROP INDEX IF EXISTS idx_tasks_created_at;
DROP INDEX IF EXISTS idx_tasks_user_id;
DROP TABLE IF EXISTS tasks;

COMMIT;
```

## Summary

The Task entity provides a simple, secure data model for todo items with:
- ✅ Strong ownership via foreign key to users
- ✅ Immutable ownership (user_id cannot change)
- ✅ Completion tracking with timestamps
- ✅ Efficient querying via strategic indexes
- ✅ Data integrity via constraints and triggers
- ✅ Clear validation rules at both application and database levels
