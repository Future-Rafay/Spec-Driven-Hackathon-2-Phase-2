# Technical Research: Todo Frontend Application

**Feature**: 003-todo-frontend
**Date**: 2026-02-08
**Purpose**: Resolve technical unknowns and document architectural decisions

## Overview

This document contains research findings for integrating Better Auth JWT authentication with the existing FastAPI backend, selecting appropriate state management and testing frameworks, and establishing implementation patterns.

## 1. Better Auth JWT Plugin Configuration

### Research Question
How to configure Better Auth to issue JWT tokens compatible with FastAPI python-jose verification?

### Findings

**Better Auth JWT Plugin**: Better Auth provides a JWT plugin that can issue standard JWT tokens using HS256 algorithm, compatible with any JWT verification library including python-jose.

**Configuration Approach**:
```typescript
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
  ]
})
```

**Key Configuration Parameters**:
- **algorithm**: "HS256" (matches backend ALGORITHM constant)
- **expiresIn**: "7d" (matches backend ACCESS_TOKEN_EXPIRE_DAYS = 7)
- **issuer**: "todo-app" (matches backend payload.iss)
- **secret**: Shared BETTER_AUTH_SECRET environment variable

**JWT Payload Structure**:
Better Auth JWT plugin creates tokens with standard claims:
- `sub`: Subject (user identifier)
- `exp`: Expiration timestamp
- `iat`: Issued at timestamp
- `iss`: Issuer identifier

**Custom Claims**: Better Auth allows adding custom claims to the JWT payload through the `jwt.encode()` method, which we can use to add `user_id` and `email` fields to match backend expectations.

### Decision

**Use Better Auth JWT plugin with custom claim injection** to ensure payload compatibility with FastAPI backend.

**Implementation Strategy**:
1. Configure Better Auth with JWT plugin
2. Create custom credential provider that calls FastAPI /auth/signin
3. Backend returns JWT token from FastAPI (already includes sub, user_id, email, exp, iat, iss)
4. Store token in Better Auth session
5. Inject token into Authorization header for all API requests

**Rationale**: Since the backend already generates JWT tokens with the correct structure, we can use the backend-generated tokens directly rather than having Better Auth generate new tokens. This simplifies integration and ensures 100% compatibility.

## 2. Backend JWT Verification Compatibility

### Research Question
Can FastAPI jwt_handler.py decode Better Auth JWT tokens? Does payload structure match?

### Findings

**Backend JWT Handler Analysis** (from `backend/src/auth/jwt_handler.py`):

**Token Creation** (lines 15-43):
```python
def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "user_id": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": "todo-app"
    }
    encoded_jwt = jwt.encode(
        payload,
        settings.BETTER_AUTH_SECRET,
        algorithm="HS256"
    )
```

**Token Verification** (lines 46-64):
```python
def verify_jwt_token(token: str) -> Optional[dict]:
    payload = jwt.decode(
        token,
        settings.BETTER_AUTH_SECRET,
        algorithms=["HS256"]
    )
    return payload
```

**User ID Extraction** (lines 67-82):
```python
def extract_user_id_from_token(token: str) -> Optional[str]:
    payload = verify_jwt_token(token)
    user_id: Optional[str] = payload.get("user_id")
    return user_id
```

**Compatibility Analysis**:

✅ **Algorithm**: Backend uses HS256 (matches Better Auth default)
✅ **Secret**: Backend uses BETTER_AUTH_SECRET (same as frontend)
✅ **Payload Fields**: Backend includes sub, user_id, email, exp, iat, iss
✅ **Expiry**: Backend uses 7 days (matches Better Auth configuration)
✅ **Issuer**: Backend uses "todo-app" (matches Better Auth configuration)
✅ **User ID Field**: Backend extracts "user_id" from payload (present in backend tokens)

**Conclusion**: **100% Compatible** - No backend modifications needed.

### Decision

**Use backend-generated JWT tokens directly** rather than having Better Auth generate new tokens.

**Implementation Approach**:
1. Better Auth custom credential provider calls FastAPI /auth/signin
2. Backend returns JWT token (already properly formatted)
3. Better Auth stores token in session
4. Frontend includes token in Authorization header for API requests
5. Backend verifies token using existing jwt_handler.py (no changes needed)

**Rationale**:
- Backend tokens already have correct structure
- No risk of payload mismatch
- Simpler implementation (no token translation layer)
- Backend verification logic unchanged

## 3. Better Auth Custom Provider for FastAPI

### Research Question
How to configure Better Auth to call FastAPI /auth/signup and /auth/signin endpoints?

### Findings

**Better Auth Custom Credential Provider**: Better Auth supports custom authentication providers that can call external APIs.

**Implementation Pattern**:
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  providers: {
    credentials: {
      id: "credentials",
      name: "Credentials",
      async authorize(credentials: { email: string; password: string }) {
        try {
          // Call FastAPI signin endpoint
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
              })
            }
          )

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Authentication failed")
          }

          const data = await response.json()

          // Backend returns: { user: { id, email, created_at }, token: "jwt..." }
          return {
            id: data.user.id,
            email: data.user.email,
            token: data.token
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      }
    }
  }
})
```

**Signup Flow**: For signup, we'll call FastAPI /auth/signup directly from the SignupForm component, then automatically sign in the user with the returned token.

**Error Handling**:
- 401: Invalid credentials → Display "Invalid email or password"
- 422: Validation error → Display specific validation messages
- 500: Server error → Display "Something went wrong, please try again"
- Network error → Display "Connection error, please check your internet"

### Decision

**Use Better Auth custom credential provider for signin, direct API call for signup**.

**Rationale**:
- Better Auth credential provider handles signin flow and session management
- Signup is a one-time operation, simpler to call API directly
- Allows displaying backend validation errors during signup
- Maintains compatibility with existing backend endpoints

## 4. React Query Best Practices for Task Management

### Research Question
What are the best practices for using React Query with task management (query keys, optimistic updates, cache invalidation)?

### Findings

**Query Keys Structure**:
```typescript
// Hierarchical query keys for tasks
const queryKeys = {
  tasks: {
    all: ["tasks"] as const,
    lists: () => [...queryKeys.tasks.all, "list"] as const,
    list: (filters: string) => [...queryKeys.tasks.lists(), { filters }] as const,
    details: () => [...queryKeys.tasks.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  }
}
```

**Fetching Tasks**:
```typescript
// hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query"
import { getTasks } from "@/lib/api/tasks"

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}
```

**Optimistic Updates Pattern**:
```typescript
// hooks/useTaskMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useToggleTaskCompletion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => toggleTaskCompletion(taskId),

    // Optimistic update
    onMutate: async (taskId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] })

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks"])

      // Optimistically update
      queryClient.setQueryData(["tasks"], (old: Task[]) =>
        old.map(task =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        )
      )

      return { previousTasks }
    },

    // Rollback on error
    onError: (err, taskId, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks)
    },

    // Refetch on success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
}
```

**Cache Invalidation Strategy**:
- **After Create**: Invalidate `["tasks"]` to refetch list
- **After Update**: Invalidate `["tasks"]` and `["tasks", taskId]`
- **After Delete**: Invalidate `["tasks"]` to refetch list
- **After Toggle**: Optimistic update + invalidate on settled

**Best Practices**:
1. Use hierarchical query keys for related data
2. Set appropriate staleTime (5 min for tasks)
3. Use optimistic updates for instant feedback
4. Always provide rollback in onError
5. Invalidate queries after mutations
6. Use gcTime (garbage collection time) to control cache retention

### Decision

**Use React Query with optimistic updates for all task mutations**.

**Implementation**:
- Create `hooks/useTasks.ts` for fetching tasks
- Create `hooks/useTaskMutations.ts` for create/update/delete/toggle
- Use optimistic updates for toggle completion (instant feedback)
- Use standard mutations for create/update/delete (with loading states)
- Invalidate queries after all mutations to ensure data consistency

**Rationale**:
- Optimistic updates improve perceived performance
- React Query handles caching and refetching automatically
- Reduces boilerplate compared to manual state management
- Industry standard pattern for server state in React

## 5. Testing Framework Selection

### Research Question
Which testing frameworks to use: Jest vs Vitest for unit tests, Playwright vs Cypress for E2E?

### Findings

**Unit Testing: Jest vs Vitest**

**Jest**:
- ✅ Most popular, mature ecosystem
- ✅ Excellent React Testing Library integration
- ✅ Extensive documentation and community support
- ❌ Slower than Vitest
- ❌ Requires additional configuration for ESM

**Vitest**:
- ✅ Faster execution (uses Vite)
- ✅ Native ESM support
- ✅ Compatible with Jest API (easy migration)
- ✅ Better TypeScript support
- ❌ Smaller ecosystem
- ❌ Less mature than Jest

**E2E Testing: Playwright vs Cypress**

**Playwright**:
- ✅ Faster execution
- ✅ Better cross-browser support (Chrome, Firefox, Safari, Edge)
- ✅ Native TypeScript support
- ✅ Parallel test execution
- ✅ Better for CI/CD pipelines
- ❌ Steeper learning curve

**Cypress**:
- ✅ Excellent developer experience
- ✅ Time-travel debugging
- ✅ Easier to learn
- ✅ Great documentation
- ❌ Slower than Playwright
- ❌ Limited cross-browser support

### Decision

**Unit Tests**: **Vitest** with React Testing Library
**E2E Tests**: **Playwright**

**Rationale**:

**Vitest**:
- Faster test execution improves developer experience
- Native ESM and TypeScript support (matches Next.js 16)
- Compatible with Jest API (familiar syntax)
- Better integration with Vite-based tools
- Future-proof choice for modern React applications

**Playwright**:
- Superior cross-browser testing (important for production)
- Faster execution and parallel testing
- Better CI/CD integration
- Native TypeScript support
- Industry trend moving toward Playwright

**Implementation**:
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

## 6. Token Refresh Strategy

### Research Question
Should we implement token refresh (7-day expiry only vs refresh tokens)?

### Findings

**Current Backend Implementation**:
- JWT tokens expire after 7 days
- No refresh token mechanism implemented
- No token refresh endpoint available

**Options**:

**Option 1: No Refresh (Current)**
- User must sign in again after 7 days
- Simpler implementation
- Acceptable for MVP

**Option 2: Refresh Tokens**
- Requires backend changes (new endpoint, refresh token storage)
- More complex implementation
- Better user experience (seamless re-authentication)

### Decision

**No token refresh for MVP** - Users must sign in again after 7 days.

**Rationale**:
- Backend doesn't support refresh tokens
- 7-day expiry is reasonable for MVP
- Avoids backend modifications
- Can be added in future iteration if needed

**Future Enhancement**: Implement refresh tokens in backend and frontend for seamless re-authentication.

## 7. API Client Architecture

### Research Question
How to structure the API client to inject JWT tokens from Better Auth?

### Findings

**Current Implementation** (`frontend/src/lib/api-client.ts`):
- Reads token from localStorage
- Injects into Authorization header
- Handles 401 errors (clears token, redirects)

**Better Auth Integration**:
Better Auth provides session management APIs:
```typescript
import { auth } from "@/lib/auth"

// Get current session
const session = await auth.api.getSession()

// Get token from session
const token = session?.token
```

**Enhanced API Client**:
```typescript
// lib/api-client.ts
import { auth } from "./auth"

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get token from Better Auth session
  const session = await auth.api.getSession()
  const token = session?.token

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Inject JWT token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  )

  // Handle 401 (token expired or invalid)
  if (response.status === 401) {
    await auth.api.signOut()
    window.location.href = "/signin"
    throw new Error("Session expired")
  }

  // Handle other errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Request failed")
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
```

### Decision

**Enhance existing api-client.ts to use Better Auth session** instead of localStorage.

**Changes**:
1. Replace `localStorage.getItem('auth_token')` with `auth.api.getSession()`
2. Replace `localStorage.removeItem('auth_token')` with `auth.api.signOut()`
3. Keep existing error handling logic
4. Add TypeScript types for all API responses

**Rationale**:
- Maintains existing API client pattern
- Better Auth provides more robust session management
- Centralized token management
- Easier to add features like token refresh later

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Better Auth JWT** | Use backend-generated tokens directly | 100% compatible, no backend changes needed |
| **Custom Provider** | Credential provider for signin, direct API for signup | Leverages Better Auth session management |
| **State Management** | React Query with optimistic updates | Industry standard, reduces boilerplate |
| **Unit Testing** | Vitest + React Testing Library | Faster, better TypeScript support |
| **E2E Testing** | Playwright | Cross-browser support, faster execution |
| **Token Refresh** | No refresh for MVP (7-day expiry) | Simpler, acceptable for MVP |
| **API Client** | Enhance existing with Better Auth session | Maintains pattern, better session management |

## Implementation Priorities

1. **Phase 0 (Foundation)**: Better Auth setup, JWT integration verification
2. **Phase 1 (Auth UI)**: Update signin/signup forms, middleware
3. **Phase 2 (API Layer)**: React Query setup, typed API functions
4. **Phase 3 (UI Components)**: Reusable components (Button, Input, Modal)
5. **Phase 4 (Task UI)**: Task list, task item, loading states
6. **Phase 5 (CRUD)**: Create, edit, delete, toggle completion
7. **Phase 6 (Polish)**: Responsive design, accessibility, testing

## Risks & Mitigations

**Risk**: Better Auth session management conflicts with existing localStorage approach
- **Mitigation**: Thoroughly test auth flows before building task UI
- **Fallback**: Keep localStorage approach if Better Auth causes issues

**Risk**: React Query learning curve slows development
- **Mitigation**: Start with simple queries, add optimistic updates incrementally
- **Fallback**: Use native fetch + useState for initial implementation

**Risk**: Playwright tests difficult to set up in CI/CD
- **Mitigation**: Use Playwright's built-in CI configurations
- **Fallback**: Manual testing for MVP, add E2E tests post-launch

## Next Steps

1. ✅ Research complete - All NEEDS CLARIFICATION items resolved
2. ⏭️ Generate data-model.md (frontend entities and state)
3. ⏭️ Generate contracts/ (API client TypeScript interfaces)
4. ⏭️ Generate quickstart.md (setup and testing guide)
5. ⏭️ Update agent context with new technologies
6. ⏭️ Generate tasks.md via `/sp.tasks`
