# Quickstart: Todo Backend API & Data Layer

**Feature**: 002-todo-api-layer
**Date**: 2026-02-08
**Purpose**: Step-by-step guide for implementing and testing task management API

## Prerequisites

- Feature 001-auth-layer fully implemented and functional
- Backend server running on port 8080
- PostgreSQL database accessible
- Python 3.11+ with dependencies installed
- Valid JWT token from authentication

## Environment Setup

### 1. Verify Authentication Layer

```bash
# Ensure backend server is running
cd backend
uvicorn src.main:app --reload --port 8080

# Test authentication endpoints
curl http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!"}'

# Save the token from response
TOKEN="<jwt_token_from_response>"
```

### 2. Apply Database Migration

```bash
# Apply tasks table migration
psql $DATABASE_URL -f backend/migrations/002_create_tasks_table.sql

# Verify table created
psql $DATABASE_URL -c "\d tasks"

# Expected output: tasks table with columns id, user_id, title, description, completed, completed_at, created_at, updated_at
```

### 3. Verify Dependencies

All required dependencies should already be installed from feature 001:
- fastapi==0.115.0
- sqlmodel==0.0.22
- psycopg2-binary==2.9.9
- uvicorn[standard]==0.30.0
- pydantic-settings==2.5.0

## Implementation Checklist

### Files to Create

- [ ] `backend/src/models/task.py` - Task model and schemas
- [ ] `backend/src/api/tasks.py` - Task router with 6 endpoints
- [ ] `backend/migrations/002_create_tasks_table.sql` - Database migration

### Files to Modify

- [ ] `backend/src/main.py` - Register task router

### Implementation Steps

1. Create Task model in `backend/src/models/task.py`
2. Create Task router in `backend/src/api/tasks.py`
3. Register router in `backend/src/main.py`
4. Apply database migration
5. Restart backend server
6. Run validation tests

## Testing the Task API

### Setup: Get Authentication Token

```bash
# Sign up or sign in to get JWT token
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!"}'

# Extract token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### User Story 1: Create and View Tasks (P1)

#### Test 1.1: Create Task

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'

# Expected Response (201 Created):
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "user_id": "123e4567-e89b-12d3-a456-426614174000",
#   "title": "Buy groceries",
#   "description": "Milk, eggs, bread",
#   "completed": false,
#   "completed_at": null,
#   "created_at": "2026-02-08T12:00:00Z",
#   "updated_at": "2026-02-08T12:00:00Z"
# }

# Save task ID for later tests
TASK_ID="550e8400-e29b-41d4-a716-446655440000"
```

**Validation**:
- ✅ Status code is 201
- ✅ Response includes task ID (UUID format)
- ✅ user_id matches authenticated user
- ✅ completed is false
- ✅ completed_at is null
- ✅ Timestamps are present

#### Test 1.2: List Tasks

```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200 OK):
# [
#   {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "user_id": "123e4567-e89b-12d3-a456-426614174000",
#     "title": "Buy groceries",
#     "description": "Milk, eggs, bread",
#     "completed": false,
#     "completed_at": null,
#     "created_at": "2026-02-08T12:00:00Z",
#     "updated_at": "2026-02-08T12:00:00Z"
#   }
# ]
```

**Validation**:
- ✅ Status code is 200
- ✅ Returns array of tasks
- ✅ Tasks ordered by created_at DESC (newest first)
- ✅ All tasks belong to authenticated user

#### Test 1.3: Get Task by ID

```bash
curl -X GET http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200 OK):
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "user_id": "123e4567-e89b-12d3-a456-426614174000",
#   "title": "Buy groceries",
#   "description": "Milk, eggs, bread",
#   "completed": false,
#   "completed_at": null,
#   "created_at": "2026-02-08T12:00:00Z",
#   "updated_at": "2026-02-08T12:00:00Z"
# }
```

**Validation**:
- ✅ Status code is 200
- ✅ Returns correct task details
- ✅ Task belongs to authenticated user

#### Test 1.4: Access Control - Unauthenticated Request

```bash
curl -X GET http://localhost:8080/api/tasks

# Expected Response (401 Unauthorized):
# {
#   "detail": "Could not validate credentials"
# }
```

**Validation**:
- ✅ Status code is 401
- ✅ Error message indicates authentication failure

#### Test 1.5: Access Control - Cross-User Access

```bash
# Sign up second user
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user2@example.com", "password": "SecurePass123!"}'

TOKEN2="<jwt_token_for_user2>"

# Try to access user1's task with user2's token
curl -X GET http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN2"

# Expected Response (403 Forbidden):
# {
#   "detail": "Access denied"
# }
```

**Validation**:
- ✅ Status code is 403
- ✅ User2 cannot access User1's task

---

### User Story 2: Update and Delete Tasks (P2)

#### Test 2.1: Update Task

```bash
curl -X PUT http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and cook dinner",
    "description": "Milk, eggs, bread, chicken"
  }'

# Expected Response (200 OK):
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "user_id": "123e4567-e89b-12d3-a456-426614174000",
#   "title": "Buy groceries and cook dinner",
#   "description": "Milk, eggs, bread, chicken",
#   "completed": false,
#   "completed_at": null,
#   "created_at": "2026-02-08T12:00:00Z",
#   "updated_at": "2026-02-08T12:05:00Z"
# }
```

**Validation**:
- ✅ Status code is 200
- ✅ Title and description updated
- ✅ updated_at timestamp changed
- ✅ created_at timestamp unchanged

#### Test 2.2: Update with Invalid Data

```bash
curl -X PUT http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "Test"
  }'

# Expected Response (422 Unprocessable Entity):
# {
#   "detail": [
#     {
#       "loc": ["body", "title"],
#       "msg": "Title cannot be empty or whitespace only",
#       "type": "value_error"
#     }
#   ]
# }
```

**Validation**:
- ✅ Status code is 422
- ✅ Validation error message returned

#### Test 2.3: Update Non-Existent Task

```bash
curl -X PUT http://localhost:8080/api/tasks/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test"
  }'

# Expected Response (404 Not Found):
# {
#   "detail": "Task not found"
# }
```

**Validation**:
- ✅ Status code is 404
- ✅ Error message indicates task not found

#### Test 2.4: Delete Task

```bash
curl -X DELETE http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (204 No Content):
# (empty response body)
```

**Validation**:
- ✅ Status code is 204
- ✅ No response body

#### Test 2.5: Verify Deletion

```bash
curl -X GET http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (404 Not Found):
# {
#   "detail": "Task not found"
# }
```

**Validation**:
- ✅ Status code is 404
- ✅ Task no longer exists

---

### User Story 3: Mark Tasks as Complete (P3)

#### Test 3.1: Create Task for Completion Testing

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task to complete"
  }'

# Save new task ID
TASK_ID="<new_task_id>"
```

#### Test 3.2: Mark Task as Complete

```bash
curl -X PATCH http://localhost:8080/api/tasks/$TASK_ID/complete \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200 OK):
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "user_id": "123e4567-e89b-12d3-a456-426614174000",
#   "title": "Task to complete",
#   "description": null,
#   "completed": true,
#   "completed_at": "2026-02-08T12:10:00Z",
#   "created_at": "2026-02-08T12:00:00Z",
#   "updated_at": "2026-02-08T12:10:00Z"
# }
```

**Validation**:
- ✅ Status code is 200
- ✅ completed is true
- ✅ completed_at has timestamp
- ✅ updated_at changed

#### Test 3.3: Mark Task as Incomplete

```bash
curl -X PATCH http://localhost:8080/api/tasks/$TASK_ID/complete \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200 OK):
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "user_id": "123e4567-e89b-12d3-a456-426614174000",
#   "title": "Task to complete",
#   "description": null,
#   "completed": false,
#   "completed_at": null,
#   "created_at": "2026-02-08T12:00:00Z",
#   "updated_at": "2026-02-08T12:15:00Z"
# }
```

**Validation**:
- ✅ Status code is 200
- ✅ completed is false
- ✅ completed_at is null
- ✅ updated_at changed

#### Test 3.4: Verify Completion in List

```bash
# Create multiple tasks with different completion states
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Task 1"}'

curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Task 2"}'

# Mark one as complete
TASK2_ID="<task2_id>"
curl -X PATCH http://localhost:8080/api/tasks/$TASK2_ID/complete \
  -H "Authorization: Bearer $TOKEN"

# List all tasks
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected: Array with tasks showing accurate completion status
```

**Validation**:
- ✅ All tasks returned with correct completion status
- ✅ Completed tasks have completed_at timestamp
- ✅ Incomplete tasks have completed_at as null

---

## Success Criteria Validation

### SC-001: Create and View Within 2 Seconds

```bash
# Measure time for create + list operations
time (
  curl -X POST http://localhost:8080/api/tasks \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test task"}' && \
  curl -X GET http://localhost:8080/api/tasks \
    -H "Authorization: Bearer $TOKEN"
)

# Expected: Total time < 2 seconds
```

### SC-002: List 100 Tasks Within 1 Second

```bash
# Create 100 tasks (use script)
for i in {1..100}; do
  curl -X POST http://localhost:8080/api/tasks \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"Task $i\"}"
done

# Measure list time
time curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected: Time < 1 second
```

### SC-003: 100% Rejection Without Token

```bash
# Test all endpoints without token
curl -X GET http://localhost:8080/api/tasks
curl -X POST http://localhost:8080/api/tasks -H "Content-Type: application/json" -d '{"title": "Test"}'
curl -X GET http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000
curl -X PUT http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000 -H "Content-Type: application/json" -d '{"title": "Test"}'
curl -X DELETE http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000
curl -X PATCH http://localhost:8080/api/tasks/550e8400-e29b-41d4-a716-446655440000/complete

# Expected: All return 401 Unauthorized
```

### SC-004: 100% Cross-User Access Blocked

```bash
# Create task with user1
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "User1 task"}'

TASK_ID="<task_id>"

# Try to access with user2 token
curl -X GET http://localhost:8080/api/tasks/$TASK_ID -H "Authorization: Bearer $TOKEN2"
curl -X PUT http://localhost:8080/api/tasks/$TASK_ID -H "Authorization: Bearer $TOKEN2" -H "Content-Type: application/json" -d '{"title": "Hacked"}'
curl -X DELETE http://localhost:8080/api/tasks/$TASK_ID -H "Authorization: Bearer $TOKEN2"
curl -X PATCH http://localhost:8080/api/tasks/$TASK_ID/complete -H "Authorization: Bearer $TOKEN2"

# Expected: All return 403 Forbidden
```

### SC-005: Persistence Across Restarts

```bash
# Create task
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Persistent task"}'

TASK_ID="<task_id>"

# Restart backend server
# (Stop and start uvicorn)

# Verify task still exists
curl -X GET http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: Task returned with same data
```

### SC-006: 50 Concurrent Users

```bash
# Use Apache Bench or similar tool
ab -n 500 -c 50 -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/tasks

# Expected: No errors, no data corruption
```

### SC-007: Zero Cross-User Data Leakage

```bash
# Create tasks with multiple users
# Verify each user only sees their own tasks
# Check database directly to confirm isolation

psql $DATABASE_URL -c "SELECT user_id, COUNT(*) FROM tasks GROUP BY user_id"

# Expected: Each user has correct count, no mixing
```

### SC-008: Operations Complete Within 500ms

```bash
# Measure individual operation times
time curl -X POST http://localhost:8080/api/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title": "Test"}'
time curl -X GET http://localhost:8080/api/tasks -H "Authorization: Bearer $TOKEN"
time curl -X PUT http://localhost:8080/api/tasks/$TASK_ID -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title": "Updated"}'
time curl -X DELETE http://localhost:8080/api/tasks/$TASK_ID -H "Authorization: Bearer $TOKEN"

# Expected: All < 500ms
```

### SC-009: Appropriate HTTP Status Codes

Verify all status codes match specification:
- ✅ 200 OK - Successful GET, PUT, PATCH
- ✅ 201 Created - Successful POST
- ✅ 204 No Content - Successful DELETE
- ✅ 401 Unauthorized - Missing/invalid token
- ✅ 403 Forbidden - Cross-user access
- ✅ 404 Not Found - Non-existent task
- ✅ 422 Unprocessable Entity - Validation errors

### SC-010: 95% Success Rate

```bash
# Run full test suite multiple times
# Track success/failure rate
# Expected: ≥95% success rate
```

## Troubleshooting

### Issue: "Task not found" for valid task ID

**Cause**: Task belongs to different user or doesn't exist

**Solutions**:
1. Verify task ID is correct
2. Check that token belongs to task owner
3. Query database directly: `SELECT * FROM tasks WHERE id = '<task_id>'`

### Issue: "Could not validate credentials"

**Cause**: JWT token invalid or expired

**Solutions**:
1. Sign in again to get fresh token
2. Verify BETTER_AUTH_SECRET matches between frontend and backend
3. Check token expiry (7 days from issuance)

### Issue: Empty task list when tasks exist

**Cause**: Tasks belong to different user

**Solutions**:
1. Verify using correct authentication token
2. Check user_id in database: `SELECT user_id FROM tasks`
3. Ensure token user_id matches task user_id

### Issue: Validation errors on task creation

**Cause**: Invalid input data

**Solutions**:
1. Ensure title is non-empty (1-500 characters)
2. Ensure description is ≤2000 characters
3. Check request Content-Type is application/json

## Next Steps

After completing validation:

1. **Run `/sp.tasks`** to generate implementation tasks
2. **Implement tasks** in priority order (P1 → P2 → P3)
3. **Run validation checklist** after each user story
4. **Document any deviations** from the plan
5. **Create PR** when all user stories complete

## Reference Documentation

- **Spec**: [spec.md](./spec.md) - Feature requirements
- **Plan**: [plan.md](./plan.md) - Implementation architecture
- **Research**: [research.md](./research.md) - Technical decisions
- **Data Model**: [data-model.md](./data-model.md) - Database schema
- **API Contract**: [contracts/tasks-api.yaml](./contracts/tasks-api.yaml) - OpenAPI specification
