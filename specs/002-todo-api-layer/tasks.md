---
description: "Task list for Todo Backend API & Data Layer implementation"
---

# Tasks: Todo Backend API & Data Layer

**Input**: Design documents from `/specs/002-todo-api-layer/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/migrations/`
- Paths shown below follow backend structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies

- [x] T001 Verify backend project structure exists (backend/src/, backend/migrations/)
- [x] T002 Verify FastAPI dependencies installed (fastapi==0.115.0, sqlmodel==0.0.22, python-jose, passlib, psycopg2-binary, uvicorn)
- [x] T003 Verify authentication layer is functional (backend/src/auth/dependencies.py exists with get_current_user)
- [x] T004 Verify database connection configured (backend/src/core/database.py exists with get_session)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create database migration file backend/migrations/002_create_tasks_table.sql with tasks table schema
- [x] T006 Add CREATE TABLE statement for tasks with id, user_id, title, description, completed, completed_at, created_at, updated_at columns
- [x] T007 Add foreign key constraint from tasks.user_id to users.id with ON DELETE CASCADE
- [x] T008 Add CHECK constraint for title_not_empty (LENGTH(TRIM(title)) > 0)
- [x] T009 Add index idx_tasks_user_id on tasks(user_id) for fast user filtering
- [x] T010 Add index idx_tasks_created_at on tasks(created_at DESC) for ordering
- [x] T011 Add index idx_tasks_completed on tasks(completed) for future filtering
- [x] T012 Add trigger update_tasks_updated_at using existing update_updated_at_column function
- [x] T013 [P] Create Task model in backend/src/models/task.py with SQLModel table=True
- [x] T014 [P] Add Task model fields: id (UUID, primary key), user_id (UUID, foreign key), title (str, max 500), description (Optional[str], max 2000)
- [x] T015 [P] Add Task model fields: completed (bool, default False), completed_at (Optional[datetime]), created_at (datetime), updated_at (datetime)
- [x] T016 [P] Create TaskCreate schema in backend/src/models/task.py with title and description fields
- [x] T017 [P] Add field validator to TaskCreate for title (min_length=1, max_length=500, strip whitespace, reject empty)
- [x] T018 [P] Create TaskUpdate schema in backend/src/models/task.py with optional title and description
- [x] T019 [P] Add field validator to TaskUpdate for title (if provided, must be non-empty after stripping)
- [x] T020 [P] Create TaskResponse schema in backend/src/models/task.py with all Task fields for API responses
- [x] T021 Create task router file backend/src/api/tasks.py with APIRouter prefix="/api/tasks" and tags=["Tasks"]
- [x] T022 Import dependencies in backend/src/api/tasks.py (get_current_user, get_session, Task models, HTTPException, status)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks and view their personal task list

**Independent Test**: Authenticate a user, create multiple tasks via POST endpoint, retrieve task list via GET endpoint. Verify only authenticated user's tasks are returned and tasks persist across requests.

### Implementation for User Story 1

- [x] T023 [US1] Implement POST /api/tasks endpoint in backend/src/api/tasks.py with create_task function
- [x] T024 [US1] Add dependencies to create_task: task_data (TaskCreate), user_id (get_current_user), session (get_session)
- [x] T025 [US1] Create Task instance in create_task with user_id from JWT (UUID(user_id)), title, and description
- [x] T026 [US1] Persist task to database in create_task using session.add(), session.commit(), session.refresh()
- [x] T027 [US1] Return TaskResponse with status_code=201 from create_task endpoint
- [x] T028 [US1] Implement GET /api/tasks endpoint in backend/src/api/tasks.py with list_tasks function
- [x] T029 [US1] Add dependencies to list_tasks: user_id (get_current_user), session (get_session)
- [x] T030 [US1] Query tasks in list_tasks filtered by user_id using select(Task).where(Task.user_id == user_id)
- [x] T031 [US1] Order tasks by created_at DESC in list_tasks query using .order_by(Task.created_at.desc())
- [x] T032 [US1] Return list of TaskResponse with status_code=200 from list_tasks endpoint
- [x] T033 [US1] Implement GET /api/tasks/{task_id} endpoint in backend/src/api/tasks.py with get_task function
- [x] T034 [US1] Add dependencies to get_task: task_id (UUID), user_id (get_current_user), session (get_session)
- [x] T035 [US1] Query task by ID in get_task using session.get(Task, task_id)
- [x] T036 [US1] Check if task exists in get_task, raise HTTPException 404 if not found
- [x] T037 [US1] Check task ownership in get_task, raise HTTPException 403 if user_id doesn't match
- [x] T038 [US1] Return TaskResponse with status_code=200 from get_task endpoint
- [x] T039 [US1] Register task router in backend/src/main.py by importing tasks router and calling app.include_router(tasks_router)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Delete Tasks (Priority: P2)

**Goal**: Enable users to modify existing tasks and remove tasks that are no longer needed

**Independent Test**: Create a task (using P1 functionality), update its title/description via PUT endpoint, delete it via DELETE endpoint. Verify updates persist and deletions remove the task permanently.

### Implementation for User Story 2

- [x] T040 [US2] Implement PUT /api/tasks/{task_id} endpoint in backend/src/api/tasks.py with update_task function
- [x] T041 [US2] Add dependencies to update_task: task_id (UUID), task_data (TaskUpdate), user_id (get_current_user), session (get_session)
- [x] T042 [US2] Query task by ID in update_task using session.get(Task, task_id)
- [x] T043 [US2] Check if task exists in update_task, raise HTTPException 404 if not found
- [x] T044 [US2] Check task ownership in update_task, raise HTTPException 403 if user_id doesn't match
- [x] T045 [US2] Update task fields in update_task: if task_data.title is not None, set task.title
- [x] T046 [US2] Update task fields in update_task: if task_data.description is not None, set task.description
- [x] T047 [US2] Update task.updated_at to datetime.utcnow() in update_task
- [x] T048 [US2] Persist changes in update_task using session.add(), session.commit(), session.refresh()
- [x] T049 [US2] Return TaskResponse with status_code=200 from update_task endpoint
- [x] T050 [US2] Implement DELETE /api/tasks/{task_id} endpoint in backend/src/api/tasks.py with delete_task function
- [x] T051 [US2] Add dependencies to delete_task: task_id (UUID), user_id (get_current_user), session (get_session)
- [x] T052 [US2] Query task by ID in delete_task using session.get(Task, task_id)
- [x] T053 [US2] Check if task exists in delete_task, raise HTTPException 404 if not found
- [x] T054 [US2] Check task ownership in delete_task, raise HTTPException 403 if user_id doesn't match
- [x] T055 [US2] Delete task in delete_task using session.delete(task), session.commit()
- [x] T056 [US2] Return None with status_code=204 from delete_task endpoint

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Tasks as Complete (Priority: P3)

**Goal**: Enable users to mark tasks as complete to track progress

**Independent Test**: Create a task (using P1), toggle its completion status via PATCH endpoint. Verify the completed flag persists and can be toggled back to incomplete.

### Implementation for User Story 3

- [x] T057 [US3] Implement PATCH /api/tasks/{task_id}/complete endpoint in backend/src/api/tasks.py with toggle_task_completion function
- [x] T058 [US3] Add dependencies to toggle_task_completion: task_id (UUID), user_id (get_current_user), session (get_session)
- [x] T059 [US3] Query task by ID in toggle_task_completion using session.get(Task, task_id)
- [x] T060 [US3] Check if task exists in toggle_task_completion, raise HTTPException 404 if not found
- [x] T061 [US3] Check task ownership in toggle_task_completion, raise HTTPException 403 if user_id doesn't match
- [x] T062 [US3] Toggle completion status in toggle_task_completion: if not task.completed, set to True and record completed_at
- [x] T063 [US3] Toggle completion status in toggle_task_completion: if task.completed, set to False and clear completed_at
- [x] T064 [US3] Update task.updated_at to datetime.utcnow() in toggle_task_completion
- [x] T065 [US3] Persist changes in toggle_task_completion using session.add(), session.commit(), session.refresh()
- [x] T066 [US3] Return TaskResponse with status_code=200 from toggle_task_completion endpoint

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T067 [P] Verify all endpoints use proper response_model (TaskResponse or list[TaskResponse])
- [x] T068 [P] Verify all endpoints have proper status_code parameters (201, 200, 204)
- [x] T069 [P] Verify all error responses use appropriate HTTPException status codes (401, 403, 404, 422)
- [x] T070 [P] Verify database migration can be applied successfully (psql $DATABASE_URL -f backend/migrations/002_create_tasks_table.sql)
- [x] T071 [P] Verify FastAPI automatic documentation includes all task endpoints at /docs
- [x] T072 [P] Run validation tests from specs/002-todo-api-layer/quickstart.md to verify all success criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)

### Within Each User Story

- Models before endpoints (but models are in Foundational phase)
- Endpoints can be implemented in any order within a story
- Router registration after all endpoints for that story

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# After Foundational phase is complete, these can run in parallel:
# (Note: In practice, endpoints depend on models from Foundational phase)

# Implement all three endpoints in parallel:
Task: "Implement POST /api/tasks endpoint" (T023-T027)
Task: "Implement GET /api/tasks endpoint" (T028-T032)
Task: "Implement GET /api/tasks/{id} endpoint" (T033-T038)

# Then register router:
Task: "Register task router in main.py" (T039)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T023-T039)
   - Developer B: User Story 2 (T040-T056)
   - Developer C: User Story 3 (T057-T066)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 72
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 18 tasks (BLOCKS all user stories)
- **Phase 3 (User Story 1 - Create and View Tasks)**: 17 tasks
- **Phase 4 (User Story 2 - Update and Delete Tasks)**: 17 tasks
- **Phase 5 (User Story 3 - Mark Tasks Complete)**: 10 tasks
- **Phase 6 (Polish)**: 6 tasks

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- **US1**: Authenticate user → create tasks → list tasks → verify only user's tasks returned
- **US2**: Create task → update task → verify changes persist → delete task → verify removal
- **US3**: Create task → toggle completion → verify status persists → toggle back → verify cleared

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 39 tasks

**Format Validation**: ✅ All 72 tasks follow checklist format with checkbox, ID, optional [P] and [Story] labels, and file paths
