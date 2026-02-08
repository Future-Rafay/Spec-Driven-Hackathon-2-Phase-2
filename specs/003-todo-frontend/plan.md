# Implementation Plan: Todo Frontend Application & API Integration

**Branch**: `003-todo-frontend` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-todo-frontend/spec.md`

## Context

This feature implements a complete frontend application for the Todo system, integrating Better Auth for JWT-based authentication with the existing FastAPI backend. Users need a responsive web interface to manage their tasks (create, view, update, delete, toggle completion) with secure authentication and session management.

**Why this is needed**: The backend API (features 001 and 002) provides authentication and task management endpoints, but users have no way to interact with the system. This feature delivers the user-facing application that makes the backend functionality accessible.

**Problem being solved**: Enable users to manage their todo lists through a modern, responsive web interface with secure JWT-based authentication that integrates seamlessly with the FastAPI backend.

**Intended outcome**: A fully functional Next.js application with Better Auth JWT integration, complete task management UI, protected routes, responsive design, and proper error handling.

## Summary

Build a Next.js 16 App Router frontend with Better Auth configured to issue JWT tokens compatible with the existing FastAPI backend. Implement complete task management UI (list, create, edit, delete, toggle completion) with React Query for state management, responsive Tailwind CSS styling, and comprehensive error handling. Both frontend (Better Auth) and backend (FastAPI) will verify JWTs using the shared BETTER_AUTH_SECRET.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.6
**Primary Dependencies**: Next.js 16, React 19, Better Auth (JWT plugin), @tanstack/react-query, Tailwind CSS 4
**Storage**: Backend PostgreSQL via REST API (no direct database access from frontend)
**Testing**: NEEDS CLARIFICATION (Jest, Vitest, or Playwright for E2E)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) - desktop and mobile
**Project Type**: Web application (frontend only, integrates with existing backend)
**Performance Goals**: <2s initial page load, <500ms API response rendering, 60fps UI interactions
**Constraints**: Must use existing FastAPI backend, JWT tokens only (no session cookies), responsive design required
**Scale/Scope**: Single-user task management, ~50 tasks per user expected, 4 main pages (signin, signup, dashboard, landing)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

✅ **Spec-Driven Development**: Following spec → plan → tasks → implementation workflow
✅ **Security-by-Design**: JWT authentication, no hardcoded secrets, token verification on both ends
✅ **Deterministic & Reproducible**: All dependencies versioned, clear setup steps
✅ **Separation of Concerns**: Frontend/backend separation, component-based architecture
✅ **Zero Manual Coding**: Implementation via structured tasks
✅ **Production-Oriented**: Error handling, loading states, responsive design

### Technology Stack Compliance

✅ **Frontend**: Next.js 16+ App Router (as specified in constitution)
✅ **Authentication**: Better Auth with JWT plugin (integrates with existing backend)
✅ **Styling**: Tailwind CSS (already configured)
✅ **API Communication**: REST with JWT in Authorization header
⚠️ **State Management**: React Query (not specified in constitution, but appropriate for server state)

### Architectural Standards Compliance

✅ **API Standards**: RESTful endpoints, JWT via Authorization header
✅ **Security Standards**: No hardcoded secrets, token expiry enforcement, HTTPS in production
✅ **Code Quality**: TypeScript for type safety, component-based architecture
✅ **Testing Standards**: NEEDS CLARIFICATION - test framework not yet chosen

### Gates Status

**PASS** - All constitutional requirements met. React Query addition justified as industry standard for server state management in React applications.

## Project Structure

### Documentation (this feature)

```text
specs/003-todo-frontend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output - Better Auth JWT integration research
├── data-model.md        # Phase 1 output - Frontend entities and state
├── quickstart.md        # Phase 1 output - Setup and testing guide
└── contracts/           # Phase 1 output - API integration contracts
    └── api-client.ts    # TypeScript API client interface
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with providers (MODIFY)
│   │   ├── page.tsx             # Landing page (MODIFY)
│   │   ├── (auth)/              # Public auth routes (EXISTS)
│   │   │   ├── layout.tsx       # Auth layout (CREATE)
│   │   │   ├── signin/
│   │   │   │   └── page.tsx    # Signin page (EXISTS - MODIFY)
│   │   │   └── signup/
│   │   │       └── page.tsx    # Signup page (EXISTS - MODIFY)
│   │   └── (protected)/         # Protected routes (CREATE)
│   │       ├── layout.tsx       # Protected layout with auth check
│   │       └── dashboard/
│   │           └── page.tsx    # Task dashboard (REPLACE)
│   ├── components/
│   │   ├── auth/                # Auth components (EXISTS)
│   │   │   ├── SigninForm.tsx  # Signin form (MODIFY for Better Auth)
│   │   │   └── SignupForm.tsx  # Signup form (MODIFY for Better Auth)
│   │   ├── layout/              # Layout components (CREATE)
│   │   │   ├── Header.tsx      # App header with user menu
│   │   │   └── Container.tsx   # Responsive container
│   │   ├── tasks/               # Task components (CREATE)
│   │   │   ├── TaskList.tsx    # Main task list container
│   │   │   ├── TaskItem.tsx    # Individual task item
│   │   │   ├── CreateTaskForm.tsx  # Create task form
│   │   │   ├── EditTaskModal.tsx   # Edit task modal
│   │   │   ├── DeleteConfirmDialog.tsx  # Delete confirmation
│   │   │   ├── TaskEmptyState.tsx  # Empty state
│   │   │   └── TaskSkeleton.tsx    # Loading skeleton
│   │   └── ui/                  # Reusable UI (CREATE)
│   │       ├── Button.tsx      # Button component
│   │       ├── Input.tsx       # Input component
│   │       ├── Modal.tsx       # Modal component
│   │       └── Spinner.tsx     # Loading spinner
│   ├── lib/
│   │   ├── auth.ts             # Better Auth config (REPLACE)
│   │   ├── api-client.ts       # API client (MODIFY for Better Auth)
│   │   └── api/                # API functions (CREATE)
│   │       └── tasks.ts        # Typed task API functions
│   ├── hooks/                   # Custom hooks (CREATE)
│   │   ├── useTasks.ts         # React Query hook for tasks
│   │   └── useTaskMutations.ts # React Query mutations
│   ├── types/                   # TypeScript types (CREATE)
│   │   ├── auth.ts             # Auth types
│   │   └── task.ts             # Task types
│   └── middleware.ts            # Next.js middleware (MODIFY)
├── package.json                 # Dependencies (MODIFY)
├── .env.example                 # Environment template (EXISTS)
└── .env.local                   # Local environment (EXISTS)

backend/
├── src/
│   └── auth/
│       └── jwt_handler.py       # JWT verification (VERIFY COMPATIBILITY)
└── .env                         # Shared BETTER_AUTH_SECRET (VERIFY)
```

**Structure Decision**: Web application structure with frontend/ and backend/ directories. Frontend uses Next.js App Router with route groups for public (auth) and protected (dashboard) routes. Backend remains unchanged but JWT verification compatibility must be verified.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitutional requirements met.

## Phase 0: Research & Unknowns

### Research Tasks

1. **Better Auth JWT Plugin Configuration**
   - How to configure Better Auth to issue JWT tokens compatible with FastAPI python-jose
   - JWT payload structure (sub, user_id, email, exp, iat, iss)
   - Token signing algorithm (HS256) and secret sharing
   - **Output**: research.md section on Better Auth JWT setup

2. **Backend JWT Verification Compatibility**
   - Verify FastAPI jwt_handler.py can decode Better Auth JWT tokens
   - Check if payload structure matches (sub vs user_id field)
   - Determine if backend modifications needed
   - **Output**: research.md section on backend compatibility

3. **Better Auth Custom Provider for FastAPI**
   - How to configure Better Auth to call FastAPI /auth/signup and /auth/signin
   - Custom credential provider configuration
   - Error handling for backend validation errors
   - **Output**: research.md section on custom provider setup

4. **React Query Best Practices for Task Management**
   - Query keys structure for tasks
   - Optimistic updates pattern
   - Cache invalidation strategy
   - **Output**: research.md section on state management

5. **Testing Framework Selection**
   - Compare Jest vs Vitest for unit tests
   - Playwright vs Cypress for E2E tests
   - Integration with Next.js 16
   - **Output**: research.md section on testing approach

### Unknowns to Resolve

- **NEEDS CLARIFICATION**: Testing framework preference (Jest/Vitest + Playwright/Cypress)
- **NEEDS CLARIFICATION**: Better Auth JWT payload compatibility with existing backend
- **NEEDS CLARIFICATION**: Whether backend jwt_handler.py needs modifications
- **NEEDS CLARIFICATION**: Token refresh strategy (7-day expiry, no refresh vs refresh tokens)

## Phase 1: Design & Contracts

### Data Model (data-model.md)

**Frontend Entities**:
1. **User** (from JWT token)
   - id: UUID
   - email: string
   - Session managed by Better Auth

2. **Task** (from backend API)
   - id: UUID
   - user_id: UUID
   - title: string (1-500 chars)
   - description: string | null (max 2000 chars)
   - completed: boolean
   - completed_at: datetime | null
   - created_at: datetime
   - updated_at: datetime

3. **AuthState** (Better Auth session)
   - isAuthenticated: boolean
   - user: User | null
   - token: string | null
   - loading: boolean

### API Contracts (contracts/)

**Authentication Endpoints** (existing backend):
- POST /auth/signup → { user, token }
- POST /auth/signin → { user, token }
- GET /auth/me → { user }

**Task Endpoints** (existing backend):
- GET /api/tasks → Task[]
- POST /api/tasks → Task
- GET /api/tasks/{id} → Task
- PUT /api/tasks/{id} → Task
- DELETE /api/tasks/{id} → 204
- PATCH /api/tasks/{id}/complete → Task

**Frontend API Client Interface**:
```typescript
// contracts/api-client.ts
interface ApiClient {
  auth: {
    signup(email: string, password: string): Promise<AuthResponse>
    signin(email: string, password: string): Promise<AuthResponse>
    getMe(): Promise<User>
  }
  tasks: {
    list(): Promise<Task[]>
    get(id: string): Promise<Task>
    create(data: TaskCreate): Promise<Task>
    update(id: string, data: TaskUpdate): Promise<Task>
    delete(id: string): Promise<void>
    toggleComplete(id: string): Promise<Task>
  }
}
```

### Quickstart Guide (quickstart.md)

**Setup Steps**:
1. Install dependencies: `npm install`
2. Configure environment: Copy .env.example to .env.local
3. Ensure backend running on http://localhost:8080
4. Start dev server: `npm run dev`
5. Access at http://localhost:3000

**Testing Flows**:
1. Sign up new user
2. Sign in existing user
3. Create task
4. Toggle task completion
5. Edit task
6. Delete task
7. Sign out

## Critical Design Decisions

### Decision 1: Better Auth JWT Integration Strategy

**Chosen Approach**: Configure Better Auth with custom credential provider that calls FastAPI endpoints and JWT plugin that issues tokens compatible with backend verification.

**Rationale**:
- Better Auth can issue JWT tokens that FastAPI can verify using shared secret
- Custom provider allows calling existing FastAPI /auth/signup and /auth/signin
- No backend changes required if JWT payload structure matches
- Better session management than localStorage alone

**Implementation**:
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    jwt({
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: "todo-app"
    })
  ],
  providers: {
    credentials: {
      async authorize(credentials) {
        // Call FastAPI /auth/signin
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials)
        })
        if (!response.ok) throw new Error("Invalid credentials")
        const { user, token } = await response.json()
        return { user, token }
      }
    }
  }
})
```

**Alternatives Considered**:
- Keep custom localStorage approach: Rejected because Better Auth provides better session management
- Use Better Auth database adapter: Rejected because backend already handles user storage

### Decision 2: State Management with React Query

**Chosen Approach**: Use @tanstack/react-query for server state (tasks) and Better Auth for auth state.

**Rationale**:
- Tasks are server data, not client state
- React Query provides caching, optimistic updates, automatic refetching
- Separates concerns: Better Auth for auth, React Query for data
- Industry standard for server state in React

**Implementation**:
```typescript
// hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query"
import { getTasks } from "@/lib/api/tasks"

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

**Alternatives Considered**:
- SWR: Rejected because React Query has better TypeScript support
- Native fetch + useState: Rejected because too much boilerplate

### Decision 3: Component Architecture

**Chosen Approach**: Atomic design with ui/ (atoms), layout/ (molecules), tasks/ (organisms).

**Rationale**:
- Clear separation of concerns
- Reusable components (Button, Input, Modal)
- Easy to test and maintain
- Follows React best practices

**Component Hierarchy**:
```
TaskList (organism)
├── CreateTaskForm (molecule)
│   ├── Input (atom)
│   └── Button (atom)
├── TaskItem (molecule)
│   ├── Button (atom)
│   └── EditTaskModal (molecule)
│       ├── Modal (atom)
│       ├── Input (atom)
│       └── Button (atom)
└── TaskEmptyState (molecule)
```

### Decision 4: Route Protection Strategy

**Chosen Approach**: Use Next.js middleware to check Better Auth session and redirect unauthenticated users.

**Rationale**:
- Server-side protection before page renders
- Better Auth provides session checking utilities
- Prevents flash of protected content
- Centralized auth logic

**Implementation**:
```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })

  const isAuthPage = request.nextUrl.pathname.startsWith("/signin") ||
                     request.nextUrl.pathname.startsWith("/signup")
  const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard")

  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
```

### Decision 5: Error Handling Strategy

**Chosen Approach**: Centralized error handling in API client with user-friendly messages and React Query error boundaries.

**Rationale**:
- Consistent error messages across app
- Automatic retry for network errors
- User-friendly error display
- Logging for debugging

**Error Mapping**:
- 401: "Session expired. Please sign in again." → Clear token, redirect to /signin
- 403: "You don't have permission to access this resource."
- 404: "The requested task could not be found."
- 422: Display validation errors from backend
- 500: "Something went wrong. Please try again later."
- Network: "Connection error. Please check your internet."

## Implementation Phases

### Phase 1: Better Auth Setup & Integration (Foundation)

**Goal**: Install and configure Better Auth with JWT plugin, integrate with FastAPI backend

**Tasks**:
1. Install Better Auth and dependencies
2. Configure Better Auth with JWT plugin (lib/auth.ts)
3. Create custom credential provider for FastAPI
4. Update environment variables (.env.example, .env.local)
5. Verify JWT token compatibility with backend
6. Update root layout with Better Auth provider
7. Test signup/signin flow with Better Auth

**Verification**: User can sign up and sign in, JWT token issued, backend accepts token

### Phase 2: Authentication UI Updates

**Goal**: Update existing auth forms to use Better Auth

**Tasks**:
1. Modify SigninForm.tsx to use Better Auth signin
2. Modify SignupForm.tsx to use Better Auth signup
3. Update middleware.ts for route protection
4. Create auth layout for signin/signup pages
5. Test auth flows (signup, signin, redirect, logout)

**Verification**: Auth UI works with Better Auth, protected routes redirect correctly

### Phase 3: API Client & React Query Setup

**Goal**: Create typed API client and React Query hooks

**Tasks**:
1. Install @tanstack/react-query
2. Create TypeScript types (types/task.ts, types/auth.ts)
3. Create API client functions (lib/api/tasks.ts)
4. Update api-client.ts to inject Better Auth JWT
5. Create React Query hooks (hooks/useTasks.ts, hooks/useTaskMutations.ts)
6. Add QueryClientProvider to root layout
7. Test API calls with JWT authentication

**Verification**: API client successfully calls backend with JWT, React Query caching works

### Phase 4: UI Components (Reusable)

**Goal**: Build reusable UI components

**Tasks**:
1. Create Button component (components/ui/Button.tsx)
2. Create Input component (components/ui/Input.tsx)
3. Create Modal component (components/ui/Modal.tsx)
4. Create Spinner component (components/ui/Spinner.tsx)
5. Create Header component (components/layout/Header.tsx)
6. Create Container component (components/layout/Container.tsx)
7. Test components in isolation

**Verification**: All UI components render correctly and are reusable

### Phase 5: Task Management UI (Core)

**Goal**: Build main task management interface

**Tasks**:
1. Create TaskSkeleton component (loading state)
2. Create TaskEmptyState component (no tasks)
3. Create TaskItem component (individual task)
4. Create TaskList component (main container)
5. Create protected layout (app/(protected)/layout.tsx)
6. Update dashboard page with TaskList
7. Test task display and loading states

**Verification**: Tasks display correctly, loading states work, empty state shows

### Phase 6: Task Actions (CRUD)

**Goal**: Implement create, edit, delete, toggle completion

**Tasks**:
1. Create CreateTaskForm component
2. Create EditTaskModal component
3. Create DeleteConfirmDialog component
4. Integrate actions into TaskList and TaskItem
5. Implement optimistic updates with React Query
6. Add error handling and user feedback
7. Test all CRUD operations

**Verification**: All task operations work, optimistic updates function, errors handled

### Phase 7: Responsive Design & Polish

**Goal**: Ensure mobile responsiveness and final polish

**Tasks**:
1. Add responsive styles (mobile breakpoints)
2. Test on mobile devices (iOS Safari, Android Chrome)
3. Add loading indicators for all async operations
4. Add success/error toast notifications
5. Improve accessibility (keyboard navigation, ARIA labels)
6. Add final error boundaries
7. Performance optimization (code splitting, lazy loading)

**Verification**: App works on mobile and desktop, accessible, performant

## Verification Strategy

### Unit Testing (Component Level)

**Test Framework**: NEEDS CLARIFICATION (Jest or Vitest)

**Components to Test**:
- TaskItem: renders correctly, handles interactions
- CreateTaskForm: validates input, submits correctly
- EditTaskModal: pre-populates data, updates task
- DeleteConfirmDialog: shows confirmation, deletes on confirm
- All UI components: render without errors

### Integration Testing (Flow Level)

**Test Framework**: NEEDS CLARIFICATION (Playwright or Cypress)

**Flows to Test**:
1. **Auth Flow**: Signup → Signin → Dashboard → Logout
2. **Task CRUD**: Create → View → Edit → Delete
3. **Task Completion**: Toggle complete → Verify persistence
4. **Error Handling**: Invalid credentials, network errors, validation errors
5. **Protected Routes**: Unauthenticated access redirects to signin

### Manual Testing Checklist

**Desktop (Chrome, Firefox, Safari)**:
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Create task with title and description
- [ ] Edit task
- [ ] Toggle task completion
- [ ] Delete task
- [ ] Sign out
- [ ] Protected route redirects when not authenticated
- [ ] Loading states display correctly
- [ ] Error messages display correctly

**Mobile (iOS Safari, Android Chrome)**:
- [ ] All desktop tests pass
- [ ] Touch interactions work smoothly
- [ ] Layouts adapt to small screens
- [ ] Modals are mobile-friendly
- [ ] Forms are easy to use
- [ ] No horizontal scrolling

**Edge Cases**:
- [ ] Very long task titles (500 chars)
- [ ] Very long descriptions (2000 chars)
- [ ] Many tasks (50+ tasks)
- [ ] Rapid clicking (double-click prevention)
- [ ] Slow network (loading states)
- [ ] Network error (error handling)
- [ ] Token expiration (redirect to signin)
- [ ] Empty task list (empty state)

## Dependencies to Install

```json
{
  "dependencies": {
    "better-auth": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "NEEDS CLARIFICATION": "jest or vitest",
    "NEEDS CLARIFICATION": "playwright or cypress"
  }
}
```

## Environment Variables

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
BETTER_AUTH_SECRET=<shared-secret-with-backend>
BETTER_AUTH_URL=http://localhost:3000
```

**Backend (.env)**:
```
BETTER_AUTH_SECRET=<same-secret-as-frontend>
DATABASE_URL=<postgresql-connection-string>
```

**Critical**: Both frontend and backend MUST use the same BETTER_AUTH_SECRET for JWT signing and verification.

## Critical Files Reference

**Existing Files to Reference**:
- `frontend/src/components/auth/SigninForm.tsx` - Current signin implementation
- `frontend/src/components/auth/SignupForm.tsx` - Current signup implementation
- `frontend/src/lib/api-client.ts` - Current API client pattern
- `backend/src/auth/jwt_handler.py` - Backend JWT verification logic
- `backend/src/api/tasks.py` - Backend task endpoints

**New Files to Create**:
- `frontend/src/lib/auth.ts` - Better Auth configuration
- `frontend/src/hooks/useTasks.ts` - React Query hooks
- `frontend/src/components/tasks/TaskList.tsx` - Main task UI
- `frontend/src/lib/api/tasks.ts` - Typed API functions
- `frontend/src/types/task.ts` - TypeScript types

## Risks & Mitigation

**Risk 1**: Better Auth JWT payload incompatible with FastAPI jwt_handler.py
- **Mitigation**: Research phase will verify payload structure compatibility
- **Fallback**: Modify backend jwt_handler.py to accept Better Auth payload format

**Risk 2**: Token refresh not implemented (7-day expiry only)
- **Mitigation**: Document token expiry behavior, implement refresh tokens in future iteration
- **Fallback**: User must sign in again after 7 days (acceptable for MVP)

**Risk 3**: CORS issues between frontend (localhost:3000) and backend (localhost:8080)
- **Mitigation**: Backend already configured with CORS for localhost:3000
- **Fallback**: Update backend CORS configuration if needed

**Risk 4**: Performance issues with many tasks (50+ tasks)
- **Mitigation**: React Query caching reduces API calls
- **Fallback**: Implement pagination or virtual scrolling in future iteration

## Next Steps

1. **Phase 0 Research**: Generate research.md resolving all NEEDS CLARIFICATION items
2. **Phase 1 Design**: Generate data-model.md, contracts/, quickstart.md
3. **Update Agent Context**: Run update-agent-context.ps1 to add Better Auth and React Query
4. **Generate Tasks**: Run `/sp.tasks` to create implementation tasks from this plan
5. **Implementation**: Execute tasks via `/sp.implement`
6. **Verification**: Run test suite and manual testing checklist
7. **Create PR**: Submit for review with all verification passing
