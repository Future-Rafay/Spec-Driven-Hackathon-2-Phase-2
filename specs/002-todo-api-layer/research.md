# Technical Research: Todo Backend API & Data Layer

**Feature**: 002-todo-api-layer
**Date**: 2026-02-08
**Purpose**: Document technical decisions and rationale for task management API implementation

## Decision 1: API URL Structure

**Context**: Need to determine how to structure task API endpoints and whether to include user_id in URLs.

**Options Considered**:
1. `/api/{user_id}/tasks` - User ID in URL path
2. `/api/tasks` - No user ID in URL, rely on JWT only

**Decision**: Use `/api/tasks` without user_id in URL

**Rationale**:
- User identity comes from verified JWT token, not URL parameters
- Prevents clients from attempting to access other users' data by manipulating URLs
- Simpler API surface with fewer parameters
- Follows security best practice: never trust client-provided identity
- Consistent with existing protected endpoint pattern in `backend/src/api/protected.py`

**Implementation**:
```python
router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.get("/")
async def list_tasks(
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    # user_id comes from JWT, not URL
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
```

**Trade-offs**:
- Pro: More secure, simpler API
- Pro: Impossible for client to provide wrong user_id
- Con: URL doesn't explicitly show user context (acceptable trade-off)

---

## Decision 2: Data Isolation Enforcement Strategy

**Context**: Need to ensure users can only access their own tasks across all operations.

**Options Considered**:
1. Service layer validation - Check ownership in business logic
2. Query layer filtering - Filter all queries by user_id
3. Database views - Create per-user views
4. Row-level security - PostgreSQL RLS policies

**Decision**: Query layer filtering with explicit WHERE clauses

**Rationale**:
- Simple and explicit - every query shows the filter
- Follows existing pattern from auth layer
- No additional database configuration required
- Easy to audit and verify
- Performance is good with proper indexing

**Implementation Pattern**:
```python
# Always filter by authenticated user_id
tasks = session.exec(
    select(Task).where(Task.user_id == user_id)
).all()

# For single task access, check ownership after retrieval
task = session.get(Task, task_id)
if not task:
    raise HTTPException(status_code=404)
if str(task.user_id) != user_id:
    raise HTTPException(status_code=403)
```

**Trade-offs**:
- Pro: Explicit and auditable
- Pro: No database-level complexity
- Pro: Consistent with existing codebase
- Con: Must remember to add filter to every query (mitigated by code review)

---

## Decision 3: PATCH vs PUT Endpoint Design

**Context**: Need to determine how to handle task updates and completion toggling.

**Options Considered**:
1. Single PUT endpoint for all updates including completion
2. Separate PATCH endpoint for completion, PUT for content
3. POST endpoint for completion action (e.g., `/tasks/{id}/complete`)

**Decision**: PUT for content updates, PATCH for completion toggle

**Rationale**:
- PUT `/api/tasks/{id}` - Full resource update (title, description)
- PATCH `/api/tasks/{id}/complete` - Partial update (completion state only)
- Follows REST semantics (PUT = replace, PATCH = modify)
- Clear separation of concerns
- Completion is a state toggle, not content modification

**Implementation**:
```python
# PUT - Update task content
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: UUID, task_data: TaskUpdate, ...):
    # Update title and/or description
    pass

# PATCH - Toggle completion status
@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(task_id: UUID, ...):
    # Toggle completed flag and set/clear completed_at
    pass
```

**Trade-offs**:
- Pro: Clear separation of content vs state
- Pro: Follows REST conventions
- Pro: Easier to understand API surface
- Con: Two endpoints instead of one (acceptable for clarity)

---

## Decision 4: Error Response Order (404 vs 403)

**Context**: When a user requests a task that doesn't exist or belongs to another user, which error should be returned first?

**Options Considered**:
1. Check ownership first (403 before 404)
2. Check existence first (404 before 403)

**Decision**: Check existence first, return 404 before 403

**Rationale**:
- Prevents information leakage
- Don't reveal that a task exists if user can't access it
- Security best practice
- Consistent error handling pattern

**Implementation**:
```python
task = session.get(Task, task_id)

# 1. Check existence first
if not task:
    raise HTTPException(status_code=404, detail="Task not found")

# 2. Then check ownership
if str(task.user_id) != user_id:
    raise HTTPException(status_code=403, detail="Access denied")
```

**Trade-offs**:
- Pro: More secure (no information leakage)
- Pro: Consistent user experience
- Con: Slightly less specific error for debugging (acceptable for security)

---

## Decision 5: SQLModel ORM vs Raw SQL

**Context**: Need to choose between SQLModel ORM and raw SQL queries for database operations.

**Options Considered**:
1. SQLModel ORM for all operations
2. Raw SQL with psycopg2
3. Hybrid approach (ORM for simple, SQL for complex)

**Decision**: SQLModel ORM for all operations

**Rationale**:
- Already configured and used in auth layer (consistency)
- Type-safe queries with Python type hints
- Automatic validation via Pydantic
- Sufficient for CRUD operations
- Easier to maintain and test
- Follows existing codebase patterns

**Implementation**:
```python
# Create
task = Task(user_id=user_id, title=title, description=description)
session.add(task)
session.commit()
session.refresh(task)

# Read
tasks = session.exec(select(Task).where(Task.user_id == user_id)).all()

# Update
task.title = new_title
session.add(task)
session.commit()

# Delete
session.delete(task)
session.commit()
```

**Trade-offs**:
- Pro: Type safety and validation
- Pro: Consistent with existing code
- Pro: Less boilerplate
- Con: Slightly less control than raw SQL (acceptable for this use case)
- Con: Learning curve for SQLModel-specific patterns (already overcome in auth layer)

---

## Decision 6: Task Ownership Immutability

**Context**: Should tasks be transferable between users or permanently owned by creator?

**Options Considered**:
1. Immutable ownership (set on creation, never changed)
2. Transferable ownership (allow reassignment)

**Decision**: Immutable ownership

**Rationale**:
- Simpler security model
- No transfer endpoint needed
- Matches specification requirement (FR-018)
- Prevents accidental or malicious ownership changes
- Consistent with single-user task model

**Implementation**:
```python
# Set user_id on creation from JWT
task = Task(
    user_id=UUID(user_id),  # From JWT token
    title=task_data.title,
    description=task_data.description
)

# Never allow user_id to be updated
# TaskUpdate schema does not include user_id field
```

**Trade-offs**:
- Pro: Simpler and more secure
- Pro: No transfer logic needed
- Con: Cannot reassign tasks (acceptable per spec)

---

## Decision 7: Completion Timestamp Behavior

**Context**: How should completion timestamps be managed when toggling task completion?

**Options Considered**:
1. Set timestamp on complete, clear on incomplete
2. Set timestamp on complete, keep on incomplete
3. Track all completion events (history)

**Decision**: Set timestamp on complete, clear on incomplete

**Rationale**:
- Matches specification requirements (FR-019, FR-020)
- Simple toggle behavior
- Timestamp represents current completion state
- No history tracking needed for MVP

**Implementation**:
```python
@router.patch("/{task_id}/complete")
async def toggle_task_completion(...):
    if not task.completed:
        # Mark as complete
        task.completed = True
        task.completed_at = datetime.utcnow()
    else:
        # Mark as incomplete
        task.completed = False
        task.completed_at = None

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
```

**Trade-offs**:
- Pro: Simple and clear
- Pro: Timestamp always reflects current state
- Con: No completion history (acceptable for MVP)

---

## Decision 8: Task Ordering Strategy

**Context**: How should tasks be ordered when listing?

**Options Considered**:
1. Creation date descending (newest first)
2. Creation date ascending (oldest first)
3. Completion status then creation date
4. User-configurable sorting

**Decision**: Creation date descending (newest first)

**Rationale**:
- Matches specification requirement (FR-017)
- Most recent tasks are typically most relevant
- Simple and predictable
- No additional sorting parameters needed
- Database index supports efficient ordering

**Implementation**:
```python
tasks = session.exec(
    select(Task)
    .where(Task.user_id == user_id)
    .order_by(Task.created_at.desc())
).all()
```

**Database Index**:
```sql
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

**Trade-offs**:
- Pro: Simple and efficient
- Pro: Newest tasks appear first
- Con: No custom sorting (acceptable for MVP)

---

## Technology Stack Validation

**Backend Framework**: FastAPI 0.115.0
- ✅ Already configured in auth layer
- ✅ Supports dependency injection for auth
- ✅ Automatic OpenAPI documentation
- ✅ Type-safe with Pydantic validation

**ORM**: SQLModel 0.0.22
- ✅ Already configured in auth layer
- ✅ Combines SQLAlchemy and Pydantic
- ✅ Type-safe queries
- ✅ Automatic validation

**Database**: Neon Serverless PostgreSQL
- ✅ Already provisioned
- ✅ Supports UUID extension
- ✅ Foreign key constraints
- ✅ Triggers for updated_at

**Authentication**: JWT via existing middleware
- ✅ `get_current_user` dependency available
- ✅ Returns user_id from verified token
- ✅ Handles 401 errors automatically

---

## Integration Points

### Existing Auth Layer Integration

**Dependency**: `backend/src/auth/dependencies.py`
```python
from ..auth.dependencies import get_current_user

# Usage in task endpoints
async def endpoint(
    user_id: Annotated[str, Depends(get_current_user)],
    ...
):
    # user_id is automatically extracted from JWT
```

**Database Session**: `backend/src/core/database.py`
```python
from ..core.database import get_session

# Usage in task endpoints
async def endpoint(
    session: Annotated[Session, Depends(get_session)],
    ...
):
    # session is automatically managed
```

**User Model**: `backend/src/models/user.py`
```python
# Task model references User via foreign key
user_id: UUID = Field(foreign_key="users.id")
```

---

## Performance Considerations

**Database Indexes**:
- `idx_tasks_user_id` - Fast filtering by user
- `idx_tasks_created_at` - Fast ordering by creation date
- `idx_tasks_completed` - Fast filtering by completion status (future use)

**Query Optimization**:
- All queries filter by user_id (indexed)
- Ordering uses indexed column (created_at)
- No N+1 query issues (single query per operation)

**Expected Performance**:
- Task creation: < 100ms
- Task listing (100 tasks): < 200ms
- Task retrieval: < 50ms
- Task update: < 100ms
- Task deletion: < 100ms

All well within SC-008 requirement (< 500ms)

---

## Security Considerations

**Authentication**:
- All endpoints require valid JWT token
- Token verification handled by existing middleware
- 401 returned for missing/invalid tokens

**Authorization**:
- All queries filtered by authenticated user_id
- Ownership checked before modify/delete operations
- 403 returned for cross-user access attempts

**Data Validation**:
- Title required, max 500 characters
- Description optional, max 2000 characters
- UUID format validated before database queries
- Pydantic validation for all input schemas

**Information Leakage Prevention**:
- 404 returned before 403 (don't reveal task existence)
- Generic error messages
- No stack traces in production

---

## Summary

All technical decisions align with:
- ✅ Specification requirements (25 functional requirements)
- ✅ Constitutional principles (security-by-design, separation of concerns)
- ✅ Existing codebase patterns (auth layer, database layer)
- ✅ REST conventions and best practices
- ✅ Performance requirements (< 500ms operations)
- ✅ Security requirements (data isolation, authentication)
