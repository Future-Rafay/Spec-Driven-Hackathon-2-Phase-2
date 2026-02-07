# Implementation Plan: Todo Backend API & Data Layer

## Context

This feature implements a secure RESTful API for task management (CRUD operations) in a multi-user todo application. Users need to create, view, update, delete, and mark tasks as complete, with strict data isolation ensuring users can only access their own tasks.

**Why this is needed**: The authentication layer (feature 001) provides user identity, but users currently have no way to create or manage todo tasks. This feature delivers the core value proposition of the application.

**Problem being solved**: Enable authenticated users to manage personal todo lists through a secure backend API that enforces data isolation and follows production-grade patterns.

**Intended outcome**: A fully functional task management API with 6 endpoints (list, create, get, update, delete, toggle completion) that integrates seamlessly with the existing JWT authentication system.

## Architecture Overview

### Technology Stack
- **Backend Framework**: FastAPI (already configured)
- **ORM**: SQLModel (already configured)
- **Database**: Neon Serverless PostgreSQL (already configured)
- **Authentication**: JWT via existing `get_current_user` dependency

### System Architecture

```
┌─────────────────┐
│   Client        │
│  (Frontend)     │
└────────┬────────┘
         │ JWT Token in Authorization header
         ▼
┌─────────────────────────────────────────┐
│   FastAPI Application                   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Auth Middleware                 │  │
│  │  (get_current_user dependency)   │  │
│  │  - Extracts JWT from header      │  │
│  │  - Verifies signature            │  │
│  │  - Returns user_id               │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │  Task Router                     │  │
│  │  (/api/tasks)                    │  │
│  │  - POST   /                      │  │
│  │  - GET    /                      │  │
│  │  - GET    /{task_id}             │  │
│  │  - PUT    /{task_id}             │  │
│  │  - DELETE /{task_id}             │  │
│  │  - PATCH  /{task_id}/complete    │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │  SQLModel ORM                    │  │
│  │  - Task model                    │  │
│  │  - Query filtering by user_id    │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼───────────────────────┘
                  │
         ┌────────▼────────┐
         │  PostgreSQL     │
         │  - users table  │
         │  - tasks table  │
         └─────────────────┘
```

### Data Flow Example (Create Task)

1. Client sends POST /api/tasks with JWT token and task data
2. FastAPI extracts JWT from Authorization header
3. `get_current_user` dependency verifies JWT and extracts user_id
4. Task router receives user_id and task data
5. Router creates Task model with user_id from JWT (not from client)
6. SQLModel persists task to database
7. Router returns created task with 201 status

## Critical Design Decisions

### Decision 1: URL Structure - No user_id in URL

**Chosen Approach**: `/api/tasks` (user_id from JWT only)

**Rationale**:
- User identity comes from verified JWT token, not URL parameters
- Prevents client from attempting to access other users' data by changing URL
- Simpler API surface
- Follows security best practice: never trust client-provided identity

**Rejected Alternative**: `/api/{user_id}/tasks`
- Would require validation that URL user_id matches JWT user_id
- Adds unnecessary complexity
- Could mislead developers into trusting URL parameter

### Decision 2: Ownership Enforcement at Query Layer

**Chosen Approach**: Filter all queries with `WHERE task.user_id = authenticated_user_id`

**Rationale**:
- Enforces data isolation at the database query level
- Impossible to accidentally return wrong user's data
- Simple and explicit
- Follows existing pattern from auth layer

**Implementation Pattern**:
```python
# Always filter by user_id from JWT
tasks = session.exec(
    select(Task).where(Task.user_id == user_id)
).all()
```

### Decision 3: PATCH vs PUT Responsibility Split

**Chosen Approach**:
- **PUT /api/tasks/{id}**: Update title and/or description (full resource update)
- **PATCH /api/tasks/{id}/complete**: Toggle completion status only

**Rationale**:
- PATCH for partial updates (completion is a state toggle)
- PUT for full resource updates (title/description are the main content)
- Clear separation of concerns
- Follows REST semantics

### Decision 4: Error Handling Order

**Chosen Approach**: Check existence (404) before ownership (403)

**Rationale**:
- Prevents information leakage (don't reveal that a task exists if user can't access it)
- Consistent error handling pattern
- Security best practice

**Implementation Pattern**:
```python
task = session.get(Task, task_id)
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
if str(task.user_id) != user_id:
    raise HTTPException(status_code=403, detail="Access denied")
```

### Decision 5: SQLModel vs Raw SQL

**Chosen Approach**: SQLModel ORM for all operations

**Rationale**:
- Already configured and used in auth layer
- Type-safe queries
- Automatic validation
- Consistent with existing codebase
- Sufficient for CRUD operations

**Trade-off**: Slightly less control than raw SQL, but acceptable for this use case

## Data Model

### Task Model

**File**: `backend/src/models/task.py`

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
```

**Key Design Points**:
- UUID primary key (consistent with User model)
- Foreign key to users table with index for fast filtering
- Title required, description optional
- Completion tracking with timestamp
- Immutable user_id (set on creation, never changed)

### Request/Response Schemas

```python
class TaskCreate(SQLModel):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default="", max_length=2000)

    @field_validator('title')
    @classmethod
    def validate_title_not_empty(cls, v: str) -> str:
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
```

### Database Migration

**File**: `backend/migrations/002_create_tasks_table.sql`

```sql
-- Migration: 002_create_tasks_table
-- Description: Create tasks table with user ownership
-- Date: 2026-02-08

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
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

## API Contracts

### Endpoint Specifications

#### 1. Create Task
```
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

Request Body:
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "completed_at": null,
  "created_at": "2026-02-08T12:00:00Z",
  "updated_at": "2026-02-08T12:00:00Z"
}

Errors:
- 401: Missing or invalid JWT token
- 422: Validation error (empty title, title too long, etc.)
```

#### 2. List Tasks
```
GET /api/tasks
Authorization: Bearer <jwt_token>

Response: 200 OK
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "completed_at": null,
    "created_at": "2026-02-08T12:00:00Z",
    "updated_at": "2026-02-08T12:00:00Z"
  }
]

Notes:
- Returns only tasks belonging to authenticated user
- Ordered by created_at DESC (newest first)
- Empty array if no tasks

Errors:
- 401: Missing or invalid JWT token
```

#### 3. Get Task by ID
```
GET /api/tasks/{task_id}
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "completed_at": null,
  "created_at": "2026-02-08T12:00:00Z",
  "updated_at": "2026-02-08T12:00:00Z"
}

Errors:
- 401: Missing or invalid JWT token
- 403: Task belongs to another user
- 404: Task not found
- 422: Invalid UUID format
```

#### 4. Update Task
```
PUT /api/tasks/{task_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

Request Body:
{
  "title": "Buy groceries and cook dinner",
  "description": "Milk, eggs, bread, chicken"
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries and cook dinner",
  "description": "Milk, eggs, bread, chicken",
  "completed": false,
  "completed_at": null,
  "created_at": "2026-02-08T12:00:00Z",
  "updated_at": "2026-02-08T12:05:00Z"
}

Errors:
- 401: Missing or invalid JWT token
- 403: Task belongs to another user
- 404: Task not found
- 422: Validation error or invalid UUID format
```

#### 5. Delete Task
```
DELETE /api/tasks/{task_id}
Authorization: Bearer <jwt_token>

Response: 204 No Content

Errors:
- 401: Missing or invalid JWT token
- 403: Task belongs to another user
- 404: Task not found
- 422: Invalid UUID format
```

#### 6. Toggle Task Completion
```
PATCH /api/tasks/{task_id}/complete
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "completed_at": "2026-02-08T12:10:00Z",
  "created_at": "2026-02-08T12:00:00Z",
  "updated_at": "2026-02-08T12:10:00Z"
}

Behavior:
- If task.completed == False: Set to True, record completed_at timestamp
- If task.completed == True: Set to False, clear completed_at timestamp

Errors:
- 401: Missing or invalid JWT token
- 403: Task belongs to another user
- 404: Task not found
- 422: Invalid UUID format
```

## Implementation Approach

### Files to Create

1. **`backend/src/models/task.py`** - Task model and schemas
2. **`backend/src/api/tasks.py`** - Task router with 6 endpoints
3. **`backend/migrations/002_create_tasks_table.sql`** - Database migration

### Files to Modify

1. **`backend/src/main.py`** - Register task router
   ```python
   from .api.tasks import router as tasks_router
   app.include_router(tasks_router)
   ```

### Implementation Pattern for Each Endpoint

**Standard Pattern**:
```python
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from ..auth.dependencies import get_current_user
from ..core.database import get_session
from ..models.task import Task, TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Create a new task for authenticated user."""
    # 1. Create task with user_id from JWT
    task = Task(
        user_id=UUID(user_id),
        title=task_data.title,
        description=task_data.description
    )

    # 2. Persist to database
    session.add(task)
    session.commit()
    session.refresh(task)

    # 3. Return created task
    return TaskResponse.from_orm(task)
```

**Security Pattern** (for get/update/delete):
```python
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Get a specific task by ID."""
    # 1. Query task
    task = session.get(Task, task_id)

    # 2. Check existence (404 before 403 to prevent info leakage)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # 3. Check ownership
    if str(task.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # 4. Return task
    return TaskResponse.from_orm(task)
```

### Reusable Patterns from Existing Code

**From `backend/src/auth/dependencies.py`**:
- Use `get_current_user` dependency for authentication
- Returns user_id as string (UUID format)

**From `backend/src/core/database.py`**:
- Use `get_session` dependency for database access
- Session automatically managed (commit/rollback)

**From `backend/src/models/user.py`**:
- SQLModel with `table=True` for database models
- Separate schemas for Create/Update/Response
- UUID primary keys with `uuid4` factory
- Timestamps with `datetime.utcnow` factory

**From `backend/src/api/auth.py`**:
- HTTPException for error responses
- Status codes from `fastapi.status`
- Response models for validation

## Verification Steps

See [quickstart.md](./quickstart.md) for complete testing guide with 12 verification scenarios covering all user stories and success criteria.

## Critical Files Reference

**Existing Files to Reference**:
- `backend/src/auth/dependencies.py` - Authentication dependency pattern
- `backend/src/core/database.py` - Database session management
- `backend/src/models/user.py` - Model and schema patterns
- `backend/src/api/auth.py` - Endpoint and error handling patterns
- `backend/migrations/001_create_users_table.sql` - Migration pattern

**New Files to Create**:
- `backend/src/models/task.py` - Task model (follow User model pattern)
- `backend/src/api/tasks.py` - Task router (follow auth.py pattern)
- `backend/migrations/002_create_tasks_table.sql` - Tasks table migration

## Constitutional Compliance

✅ **Spec-Driven Development**: This plan follows spec → plan → tasks → implementation workflow
✅ **Security-by-Design**: JWT authentication enforced, data isolation at query level, ownership checks
✅ **Deterministic**: All patterns follow existing codebase conventions
✅ **Separation of Concerns**: Clear boundaries between auth, routing, models, and database
✅ **Zero Manual Coding**: All implementation via structured prompts
✅ **Production-Oriented**: Persistent storage, proper error handling, multi-user design

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Execute tasks via `/sp.implement`
3. Run verification steps from quickstart.md
4. Create PR for review
