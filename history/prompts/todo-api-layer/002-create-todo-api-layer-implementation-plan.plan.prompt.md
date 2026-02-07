---
id: 002
title: Create Todo API Layer Implementation Plan
stage: plan
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5
feature: todo-api-layer
branch: 002-todo-api-layer
user: Abdul Rafay
command: /sp.plan
labels: ["planning", "architecture", "backend", "api", "todo", "fastapi", "sqlmodel"]
links:
  spec: specs/002-todo-api-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-todo-api-layer/plan.md
  - specs/002-todo-api-layer/research.md
  - specs/002-todo-api-layer/data-model.md
  - specs/002-todo-api-layer/contracts/tasks-api.yaml
  - specs/002-todo-api-layer/quickstart.md
  - C:\Users\MY PC\.claude\plans\staged-swinging-clarke.md
tests:
  - Planning artifacts validation - PASS (all required documents created)
---

## Prompt

```text
Create:
- Backend architecture sketch (FastAPI + SQLModel + Neon PostgreSQL)
- Explicit API contract for all endpoints
- Task data model definition
- Error-handling and validation matrix
- Acceptance checklist based on success criteria

Agent & skill execution:
- Use backend-specialized agents and skills for:
  - FastAPI project structure and routing
  - SQLModel schema definition
  - Neon PostgreSQL integration
  - Auth-aware request scoping
- Prefer existing backend/database/auth-integration agents for implementation decisions

Architecture & structure:
- FastAPI app with modular routing
- Auth middleware resolves authenticated user from JWT
- Route handlers operate using authenticated user context
- SQLModel handles schema + ORM mapping
- Neon PostgreSQL as single source of truth

API design approach:
- RESTful resource-based endpoints
- Auth verified before route logic executes
- Business logic inside route handlers
- Persistence handled via SQLModel sessions
- Never trust `user_id` in URL unless it matches JWT identity

Data modeling:
- Task model includes:
  - id
  - title
  - description (optional)
  - completed flag
  - user_id (owner)
  - timestamps (optional if needed)
- Index user_id for faster per-user queries

Decisions needing documentation:
- Ownership enforcement at query layer vs service layer
- SQLModel abstraction vs raw SQL tradeoffs
- URL user_id vs JWT identity validation strategy
- PATCH vs PUT responsibility split
- Error handling structure for not-found vs forbidden

Testing & validation:
- Create task → persists correctly
- List tasks → returns only authenticated user's tasks
- Get task by ID → blocked if not owner
- Update task → only owner allowed
- Delete task → only owner allowed
- Toggle completion → state persists
- Invalid task ID → 404
- JWT mismatch with URL user_id → reject request
- No token → 401 Unauthorized

Quality checks:
- All endpoints defined before implementation
- No route bypasses auth enforcement
- All queries scoped by authenticated user
- No hardcoded DB credentials or secrets
- Structure is clear enough to generate backend without ambiguity

Execution order:
- Define schema → define routes → define validation/error behavior → implement
- Delegate structure, DB setup, and routing to backend/database agents and skills
```

## Response snapshot

Successfully created comprehensive implementation plan for Todo Backend API & Data Layer.

**Planning Workflow Executed**:

**Phase 1: Initial Understanding** - Launched 3 Explore agents in parallel:
1. Auth implementation patterns - Explored JWT middleware, get_current_user dependency, protected endpoint patterns
2. SQLModel database patterns - Explored model definitions, session management, migrations, database configuration
3. API structure patterns - Explored router organization, request/response schemas, validation, error handling, CRUD operations

**Phase 2: Design** - Analyzed exploration results and designed implementation approach

**Phase 3: Review** - Read specification and constitution to ensure alignment

**Phase 4: Final Plan** - Created comprehensive plan with all required sections

**Phase 5: Artifacts Created**:
1. **research.md** - 8 technical decisions documented:
   - Decision 1: API URL structure (no user_id in URL)
   - Decision 2: Data isolation enforcement (query layer filtering)
   - Decision 3: PATCH vs PUT endpoint design
   - Decision 4: Error response order (404 before 403)
   - Decision 5: SQLModel ORM vs raw SQL
   - Decision 6: Task ownership immutability
   - Decision 7: Completion timestamp behavior
   - Decision 8: Task ordering strategy

2. **data-model.md** - Complete database schema documentation:
   - Task entity with 8 fields (id, user_id, title, description, completed, completed_at, created_at, updated_at)
   - Foreign key relationship to User entity
   - Database migration SQL with indexes and triggers
   - SQLModel definitions (Task, TaskCreate, TaskUpdate, TaskResponse)
   - Query patterns and performance characteristics

3. **contracts/tasks-api.yaml** - OpenAPI 3.0 specification:
   - 6 endpoints fully documented (POST /, GET /, GET /{id}, PUT /{id}, DELETE /{id}, PATCH /{id}/complete)
   - Request/response schemas with examples
   - Error responses (401, 403, 404, 422)
   - Security scheme (Bearer JWT)

4. **quickstart.md** - Step-by-step testing guide:
   - Environment setup instructions
   - Implementation checklist
   - Test scenarios for all 3 user stories (15 tests total)
   - Success criteria validation (10 criteria)
   - Troubleshooting section

5. **plan.md** - Master implementation plan:
   - Context and problem statement
   - Architecture overview with diagrams
   - 5 critical design decisions with rationale
   - Data model specifications
   - API contracts for all 6 endpoints
   - Implementation approach with code patterns
   - Verification steps (12 test scenarios)
   - Constitutional compliance checklist

**Key Architectural Decisions**:

1. **URL Structure**: `/api/tasks` (no user_id in URL) - User identity from JWT only
2. **Data Isolation**: Query-level filtering with `WHERE user_id = authenticated_user_id`
3. **Endpoint Design**: PUT for content updates, PATCH for completion toggle
4. **Error Handling**: 404 before 403 to prevent information leakage
5. **ORM Choice**: SQLModel for all operations (consistency with auth layer)

**Implementation Patterns Identified**:
- Reuse `get_current_user` dependency from auth layer
- Reuse `get_session` dependency from database layer
- Follow User model pattern for Task model structure
- Follow auth.py pattern for endpoint implementation
- Follow migration pattern from 001_create_users_table.sql

**Files to Create** (7 files):
1. backend/src/models/task.py
2. backend/src/api/tasks.py
3. backend/migrations/002_create_tasks_table.sql
4. specs/002-todo-api-layer/contracts/tasks-api.yaml ✅
5. specs/002-todo-api-layer/data-model.md ✅
6. specs/002-todo-api-layer/research.md ✅
7. specs/002-todo-api-layer/quickstart.md ✅

**Files to Modify** (1 file):
1. backend/src/main.py - Register task router

**API Endpoints Designed**:
- POST /api/tasks - Create task (201)
- GET /api/tasks - List tasks (200)
- GET /api/tasks/{id} - Get task (200/403/404)
- PUT /api/tasks/{id} - Update task (200/403/404/422)
- DELETE /api/tasks/{id} - Delete task (204/403/404)
- PATCH /api/tasks/{id}/complete - Toggle completion (200/403/404)

**Security Guarantees**:
- ✅ All endpoints require JWT authentication
- ✅ User identity extracted from JWT, never from client input
- ✅ All queries filtered by authenticated user_id
- ✅ Ownership checked before modify/delete operations
- ✅ 401 for missing/invalid tokens
- ✅ 403 for cross-user access attempts
- ✅ 404 returned before 403 (no information leakage)

**Constitutional Compliance**:
- ✅ Spec-Driven Development: Follows spec → plan → tasks workflow
- ✅ Security-by-Design: JWT enforcement, data isolation, ownership checks
- ✅ Deterministic: All patterns follow existing codebase conventions
- ✅ Separation of Concerns: Clear boundaries between layers
- ✅ Zero Manual Coding: All via structured prompts
- ✅ Production-Oriented: Persistent storage, proper error handling

## Outcome

- ✅ Impact: Complete implementation plan created with 5 planning artifacts (research, data model, API contracts, quickstart, master plan). All 8 technical decisions documented. Ready for task generation.
- 🧪 Tests: Planning artifacts validation - PASS (all required documents created and validated)
- 📁 Files: 5 planning artifacts created (research.md, data-model.md, tasks-api.yaml, quickstart.md, plan.md)
- 🔁 Next prompts: Run `/sp.tasks` to generate implementation tasks, then `/sp.implement` to execute
- 🧠 Reflection: Planning phase completed successfully with comprehensive exploration of existing codebase patterns. All design decisions align with specification requirements and constitutional principles. Implementation approach is clear and follows established patterns from auth layer.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning phases completed successfully
- Graders run and results (PASS/FAIL): Planning artifacts validation - PASS (all required documents created with proper structure)
- Prompt variant (if applicable): Standard /sp.plan with detailed user requirements for architecture and design approach
- Next experiment (smallest change to try): Proceed with `/sp.tasks` to generate atomic, testable implementation tasks organized by user story priority
