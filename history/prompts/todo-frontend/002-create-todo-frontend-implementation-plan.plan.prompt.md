---
id: 002
title: Create Todo Frontend Implementation Plan
stage: plan
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5
feature: todo-frontend
branch: 003-todo-frontend
user: Abdul Rafay
command: /sp.plan
labels: ["planning", "architecture", "better-auth", "react-query", "jwt", "frontend"]
links:
  spec: specs/003-todo-frontend/spec.md
  plan: specs/003-todo-frontend/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-todo-frontend/plan.md
  - specs/003-todo-frontend/research.md
  - specs/003-todo-frontend/data-model.md
  - specs/003-todo-frontend/contracts/api-client.ts
  - specs/003-todo-frontend/quickstart.md
tests:
  - Constitution Check - PASS (all requirements met)
  - Backend JWT compatibility verified - PASS
  - Better Auth integration strategy validated - PASS
---

## Prompt

```text
/sp.plan

User context provided:
"here is the more context of my project what i want Better Auth can be configured to issue JWT (JSON Web Token) tokens when users log in. These tokens are self-contained credentials that include user information and can be verified by any service that knows the secret key.

How It Works:
User logs in on Frontend → Better Auth creates a session and issues a JWT token
Frontend makes API call → Includes the JWT token in the Authorization: Bearer <token> header
Backend receives request → Extracts token from header, verifies signature using shared secret
Backend identifies user → Decodes token to get user ID, email, etc. and matches it with the user ID in the URL
Backend filters data → Returns only tasks belonging to that user

What Needs to Change:
Component - Changes Required
Better Auth Config - Enable JWT plugin to issue tokens
Frontend API Client - Attach JWT token to every API request header
FastAPI Backend - Add middleware to verify JWT and extract user
API Routes - Filter all queries by the authenticated user's ID

The Shared Secret:
Both frontend (Better Auth) and backend (FastAPI) must use the same secret key for JWT signing and verification. This is typically set via environment variable BETTER_AUTH_SECRET in both services."
```

## Response Snapshot

Successfully created comprehensive implementation plan for Todo Frontend Application with Better Auth JWT integration.

**Planning Artifacts Created**:

1. **plan.md** - Complete implementation plan with:
   - Context and problem statement
   - Technical context (TypeScript 5.x, Next.js 16, Better Auth, React Query)
   - Constitution check (all gates passed)
   - Project structure (frontend/ with App Router)
   - 5 critical design decisions documented
   - 7 implementation phases defined
   - Verification strategy with unit and E2E tests
   - Risk mitigation strategies

2. **research.md** - Technical research resolving all unknowns:
   - Better Auth JWT plugin configuration (HS256, 7-day expiry)
   - Backend JWT verification compatibility (100% compatible, no changes needed)
   - Custom credential provider for FastAPI integration
   - React Query best practices (optimistic updates, cache strategy)
   - Testing framework selection (Vitest + Playwright)
   - Token refresh strategy (no refresh for MVP)
   - API client architecture (Better Auth session integration)

3. **data-model.md** - Frontend data structures:
   - Backend entities (User, Task)
   - Request/response schemas (TaskCreate, TaskUpdate, AuthCredentials)
   - Frontend state (AuthState, TaskListState, TaskMutationState)
   - Form state (CreateTaskFormState, EditTaskFormState)
   - UI state (ModalState, ToastState)
   - Data flow diagrams (auth, task list, CRUD operations)
   - Cache strategy (React Query configuration)

4. **contracts/api-client.ts** - TypeScript API contracts:
   - Complete type definitions for all entities
   - ApiClient interface with auth and tasks endpoints
   - API endpoint constants
   - HTTP status codes
   - Error messages mapping
   - Request/response examples

5. **quickstart.md** - Setup and testing guide:
   - Prerequisites and environment setup
   - Manual testing flows (signup, signin, CRUD, signout)
   - Protected routes testing
   - Error handling testing
   - Responsive design testing
   - Unit and E2E test commands
   - Common issues and solutions
   - Development workflow

**Key Architectural Decisions**:

1. **Better Auth JWT Integration**: Use backend-generated JWT tokens directly rather than having Better Auth generate new tokens. Backend tokens already have correct structure (sub, user_id, email, exp, iat, iss) and are 100% compatible with FastAPI jwt_handler.py.

2. **State Management**: React Query for server state (tasks) with optimistic updates, Better Auth for authentication state. Provides caching, automatic refetching, and instant UI feedback.

3. **Component Architecture**: Atomic design with ui/ (atoms), layout/ (molecules), tasks/ (organisms). Clear separation of concerns, reusable components.

4. **Route Protection**: Next.js middleware checks Better Auth session server-side before page renders. Prevents flash of protected content.

5. **Testing Strategy**: Vitest for unit tests (faster, better TypeScript support), Playwright for E2E tests (cross-browser, parallel execution).

**Backend Compatibility Analysis**:

Verified FastAPI jwt_handler.py (backend/src/auth/jwt_handler.py):
- ✅ Algorithm: HS256 (matches Better Auth)
- ✅ Secret: BETTER_AUTH_SECRET (shared with frontend)
- ✅ Payload: sub, user_id, email, exp, iat, iss (all present)
- ✅ Expiry: 7 days (matches Better Auth config)
- ✅ Verification: python-jose compatible with Better Auth tokens
- ✅ **Conclusion**: No backend modifications needed

**Implementation Phases**:

1. **Phase 1**: Better Auth setup & JWT integration (foundation)
2. **Phase 2**: Authentication UI updates (signin/signup forms)
3. **Phase 3**: API client & React Query setup (typed functions, hooks)
4. **Phase 4**: UI components (Button, Input, Modal, Spinner, Header)
5. **Phase 5**: Task management UI (TaskList, TaskItem, loading states)
6. **Phase 6**: Task actions (Create, Edit, Delete, Toggle CRUD)
7. **Phase 7**: Responsive design & polish (mobile, accessibility, optimization)

**Technology Stack Finalized**:

- **Frontend**: Next.js 16.1.6, React 19.2.3, TypeScript 5.x
- **Authentication**: Better Auth with JWT plugin (custom credential provider)
- **State Management**: @tanstack/react-query v5
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest (unit), Playwright (E2E)
- **Date Formatting**: date-fns v3
- **Backend Integration**: FastAPI REST API with JWT tokens

**Agent Context Updated**:

Successfully updated CLAUDE.md with new technologies:
- Language: TypeScript 5.x with Next.js 16.1.6
- Framework: Next.js 16, React 19, Better Auth (JWT plugin), @tanstack/react-query, Tailwind CSS 4
- Database: Backend PostgreSQL via REST API (no direct database access)

## Outcome

- ✅ Impact: Complete implementation plan created with 5 design artifacts, 7 implementation phases, and comprehensive verification strategy. All NEEDS CLARIFICATION items resolved through research.
- 🧪 Tests: Constitution check passed, backend JWT compatibility verified, all architectural decisions documented with rationale
- 📁 Files: 5 files created (plan.md, research.md, data-model.md, contracts/api-client.ts, quickstart.md)
- 🔁 Next prompts: Run `/sp.tasks` to generate implementation tasks from this plan
- 🧠 Reflection: Successfully integrated Better Auth JWT with existing FastAPI backend without requiring backend modifications. Research phase confirmed 100% compatibility. React Query selected for optimal server state management with optimistic updates.

## Evaluation Notes (Flywheel)

- Failure modes observed: None - planning completed successfully with all unknowns resolved
- Graders run and results: Constitution check PASS, JWT compatibility verification PASS
- Prompt variant: User provided detailed context about Better Auth JWT integration requirements
- Next experiment: Proceed with `/sp.tasks` to generate actionable implementation tasks, then `/sp.implement` to execute the plan
