# Implementation Plan: Auth Session Flicker Fix

**Branch**: `005-auth-session-flicker` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-auth-session-flicker/spec.md`

## Context

**Problem**: On app start, the UI rapidly switches between signin and authenticated views, creating a jarring user experience. This flicker is caused by unstable auth session detection during initial load and race conditions between session fetch, route protection logic, and UI rendering.

**Why this is needed**: The current authentication implementation has no centralized state management, causing each component to independently check authentication status. This results in multiple loading states, race conditions, and inconsistent routing decisions. Additionally, critical bugs in token key naming (`token` vs `auth_token`) cause authentication to fail even when users are logged in.

**Problem being solved**: Stabilize authentication state resolution by creating a centralized auth initialization layer that blocks UI rendering until session status is confirmed, preventing race conditions and ensuring consistent routing decisions across all entry points (initial load, refresh, direct URL access).

**Intended outcome**: Zero visible flickers between signin and dashboard views during application initialization, with authentication state resolved within 500ms and consistent routing behavior across all scenarios.

## Summary

This fix implements a centralized AuthProvider that manages global authentication state and coordinates session checking before any route rendering. The solution includes fixing critical token key bugs, adding a global loading state during auth initialization, and ensuring single-source-of-truth session management using Better Auth.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16+ (App Router)
**Primary Dependencies**:
- React 19 (client components for auth state)
- next-themes (already installed for theme management)
- jwt-decode (already installed for token parsing)
- @tanstack/react-query (already installed for data fetching)

**Storage**: localStorage for JWT token persistence (client-side only)
**Testing**: Manual testing via browser (no automated tests in scope)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend-only changes)
**Performance Goals**:
- Auth state resolution within 500ms
- Zero visible flickers during initialization
- Single session check per app load

**Constraints**:
- Frontend-only solution (no backend changes)
- Must use Better Auth session as single source of truth
- Must maintain Next.js App Router structure
- Cannot use hard redirects before auth state resolved
- Must not break existing authentication flow

**Scale/Scope**:
- 3 user stories (P1-P3)
- ~8 files to modify
- 1 new AuthProvider component
- Fix 2 critical token key bugs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Spec-Driven Development First
✅ **PASS** - Following spec → plan → tasks → implementation workflow
- Specification created: `specs/005-auth-session-flicker/spec.md`
- Plan being created: `specs/005-auth-session-flicker/plan.md`
- Tasks will be generated via `/sp.tasks`
- Implementation via `/sp.implement`

### Principle II: Security-by-Design
✅ **PASS** - No security changes, only fixing existing auth bugs
- Fixes token key mismatch bugs that currently break authentication
- Maintains JWT-based authentication
- No changes to backend security model
- Improves security by fixing broken auth checks

### Principle III: Deterministic & Reproducible
✅ **PASS** - All changes are deterministic and reproducible
- Centralized auth state management (React Context)
- Consistent token key usage (`auth_token` everywhere)
- Single auth check on app initialization
- No environment variable changes needed

### Principle IV: Separation of Concerns
✅ **PASS** - Clear separation maintained
- Auth logic centralized in AuthProvider
- UI components consume auth state via context
- No mixing of auth logic with business logic
- Clear boundaries between auth, routing, and UI

### Principle V: Zero Manual Coding
✅ **PASS** - All implementation via structured prompts
- Plan defines exact changes needed
- Tasks will break down implementation steps
- Implementation via `/sp.implement` command

### Principle VI: Production-Oriented Architecture
✅ **PASS** - Production-grade patterns
- Centralized state management (industry standard)
- Error handling and timeout logic
- Loading states for better UX
- Maintains existing JWT token persistence

**Overall Status**: ✅ ALL GATES PASSED

## Project Structure

### Documentation (this feature)

```text
specs/005-auth-session-flicker/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Technical research and decisions
├── data-model.md        # Auth state data model
├── quickstart.md        # Testing and validation guide
├── contracts/           # Auth state contracts
│   └── auth-provider-contract.md
└── checklists/
    └── requirements.md  # Spec quality checklist (completed)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout - ADD AuthProvider
│   │   ├── providers.tsx                 # Providers wrapper - ADD AuthProvider
│   │   ├── (auth)/
│   │   │   ├── layout.tsx               # Auth layout (no changes)
│   │   │   ├── signin/
│   │   │   │   └── page.tsx             # MODIFY: Remove local auth check
│   │   │   └── signup/
│   │   │       └── page.tsx             # MODIFY: Remove local auth check
│   │   └── (protected)/
│   │       ├── layout.tsx               # MODIFY: Use AuthProvider instead of local state
│   │       └── dashboard/
│   │           └── page.tsx             # No changes needed
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx         # CREATE: New centralized auth provider
│   │   │   ├── AuthLoadingScreen.tsx    # CREATE: Global loading indicator
│   │   │   ├── SigninForm.tsx           # MODIFY: Fix token key bug
│   │   │   └── SignupForm.tsx           # MODIFY: Fix token key bug
│   │   └── layout/
│   │       └── Header.tsx               # No changes needed
│   ├── lib/
│   │   ├── auth.ts                      # MODIFY: Fix useSignout token key bug
│   │   └── api-client.ts                # No changes needed (already correct)
│   ├── hooks/
│   │   └── useAuth.ts                   # CREATE: Hook to consume auth context
│   └── types/
│       └── auth.ts                      # MODIFY: Add AuthState and AuthContext types
└── tests/                               # Manual testing only (no automated tests)
```

**Structure Decision**: Web application structure with frontend-only changes. All modifications are in the `frontend/src` directory. No backend changes required as this is purely a client-side state management and routing fix.

## Complexity Tracking

> **Not applicable** - All constitution checks passed. No violations to justify.

---

## Critical Design Decisions

### Decision 1: Centralized AuthProvider with React Context

**Chosen Approach**: Create a global `AuthProvider` component that wraps the entire application and manages authentication state in React Context.

**Rationale**:
- **Single Source of Truth**: All components consume auth state from one place
- **Prevents Race Conditions**: Auth check happens once at app initialization, before any routing
- **Eliminates Flicker**: UI doesn't render until auth state is resolved
- **Standard Pattern**: React Context is the idiomatic way to share global state in React
- **No External Dependencies**: Uses built-in React features (no new libraries needed)

**Rejected Alternatives**:
- **Component-level checks**: Current approach causes race conditions and flicker
- **Middleware-only solution**: Can't access localStorage in Next.js middleware (server-side)
- **Global state library (Redux/Zustand)**: Overkill for simple auth state, adds dependency

**Implementation Pattern**:
```typescript
// frontend/src/components/auth/AuthProvider.tsx
interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userEmail: string | null
  error: string | null
}

interface AuthContextValue extends AuthState {
  signout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,  // Start in loading state
    userEmail: null,
    error: null,
  })

  useEffect(() => {
    // Run auth check ONCE on mount
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      const token = localStorage.getItem('auth_token')  // Fixed key

      if (!token || isTokenExpired(token)) {
        // No valid token
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userEmail: null,
          error: null,
        })
        return
      }

      // Valid token found
      const email = getUserEmailFromToken(token)
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userEmail: email,
        error: null,
      })
    } catch (error) {
      // Error during check - default to unauthenticated
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userEmail: null,
        error: 'Auth check failed',
      })
    }
  }

  // Don't render children until auth state is resolved
  if (authState.isLoading) {
    return <AuthLoadingScreen />
  }

  return (
    <AuthContext.Provider value={{ ...authState, signout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

### Decision 2: Fix Token Key Inconsistency Bugs

**Problem Identified**: Critical bug where token is stored as `'auth_token'` but retrieved as `'token'` in protected layout.

**Chosen Approach**: Standardize on `'auth_token'` everywhere (matches existing signin/signup/api-client usage).

**Files to Fix**:

1. **`frontend/src/app/(protected)/layout.tsx`** (Line 27):
   ```typescript
   // BEFORE (WRONG):
   const token = localStorage.getItem('token')

   // AFTER (CORRECT):
   const token = localStorage.getItem('auth_token')
   ```

2. **`frontend/src/lib/auth.ts`** - `useSignout` hook:
   ```typescript
   // BEFORE (WRONG):
   localStorage.removeItem('token')

   // AFTER (CORRECT):
   localStorage.removeItem('auth_token')
   ```

**Rationale**:
- `'auth_token'` is already used in 4 places (signin, signup, api-client, signin page check)
- Only 2 places use wrong key: protected layout and useSignout
- Changing 2 files is less risky than changing 4 files
- API client already uses correct key, so API calls work properly

**Impact**: This bug currently causes infinite redirect loops. Users sign in successfully, but protected layout can't find the token and redirects back to signin.

---

### Decision 3: Auth Initialization Before Routing

**Chosen Approach**: Block all route rendering until auth state is resolved. Show global loading screen during auth check.

**Rationale**:
- **Prevents Flicker**: User never sees wrong page flash
- **Single Check**: Auth check runs once at app start, not on every route
- **Consistent Behavior**: Same flow for initial load, refresh, and direct URL access
- **Better UX**: Clear loading state instead of rapid page switching

**Implementation Strategy**:
```typescript
// In AuthProvider
if (authState.isLoading) {
  return <AuthLoadingScreen />  // Blocks entire app
}

// In protected layout
const { isAuthenticated } = useAuth()

if (!isAuthenticated) {
  redirect('/signin')  // Only runs after auth state resolved
}

// In signin page
const { isAuthenticated } = useAuth()

if (isAuthenticated) {
  redirect('/dashboard')  // Only runs after auth state resolved
}
```

**Key Principle**: No routing decisions until `isLoading === false`.

---

### Decision 4: Remove Component-Level Auth Checks

**Chosen Approach**: Remove all local auth state management from individual components. Components only consume global auth state via `useAuth()` hook.

**Components to Simplify**:

1. **Protected Layout**: Remove local `isChecking`, `isAuthenticated`, `userEmail` state
2. **Signin Page**: Remove local `isChecking` state
3. **Signup Page**: No changes needed (doesn't have auth check)

**Before (Protected Layout)**:
```typescript
const [isChecking, setIsChecking] = useState(true)
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [userEmail, setUserEmail] = useState<string>('User')

useEffect(() => {
  const token = localStorage.getItem('token')  // Wrong key + race condition
  if (!token || isTokenExpired(token)) {
    router.push('/signin')
    return
  }
  setIsAuthenticated(true)
  setUserEmail(getUserEmailFromToken(token))
  setIsChecking(false)
}, [router])

if (isChecking) {
  return <div>Loading...</div>
}
```

**After (Protected Layout)**:
```typescript
const { isAuthenticated, userEmail } = useAuth()  // From global context

if (!isAuthenticated) {
  redirect('/signin')  // Only runs after global auth check
}

// No loading state needed - handled by AuthProvider
```

**Rationale**:
- Eliminates duplicate auth logic
- Removes race conditions
- Simplifies component code
- Single loading screen instead of multiple

---

### Decision 5: Auth State Update on Login/Logout

**Chosen Approach**: Update global auth state immediately after successful login/logout, then navigate.

**Login Flow**:
```typescript
// In SigninForm
const { refreshAuth } = useAuth()

async function handleSubmit(e: FormEvent) {
  // ... API call to signin
  localStorage.setItem('auth_token', response.token)  // Fixed key

  // Refresh global auth state
  await refreshAuth()

  // Navigate to dashboard (auth state already updated)
  router.push('/dashboard')
}
```

**Logout Flow**:
```typescript
// In useSignout hook (lib/auth.ts)
export function useSignout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { refreshAuth } = useAuth()

  return async () => {
    queryClient.clear()
    localStorage.removeItem('auth_token')  // Fixed key

    // Refresh global auth state (will set isAuthenticated = false)
    await refreshAuth()

    router.push('/signin')
  }
}
```

**Rationale**:
- Keeps global auth state in sync with localStorage
- Prevents stale auth state after login/logout
- Ensures consistent behavior across all components

---

### Decision 6: Timeout and Error Handling

**Chosen Approach**: Add timeout to auth check with fallback to unauthenticated state.

**Implementation**:
```typescript
async function checkAuthStatus() {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Auth check timeout')), 5000)
  )

  const authCheck = new Promise((resolve) => {
    const token = localStorage.getItem('auth_token')
    if (!token || isTokenExpired(token)) {
      resolve({ isAuthenticated: false })
    } else {
      resolve({
        isAuthenticated: true,
        userEmail: getUserEmailFromToken(token)
      })
    }
  })

  try {
    const result = await Promise.race([authCheck, timeout])
    setAuthState({ ...result, isLoading: false, error: null })
  } catch (error) {
    // Timeout or error - default to unauthenticated
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      userEmail: null,
      error: 'Auth check failed',
    })
  }
}
```

**Rationale**:
- Prevents infinite loading if auth check hangs
- Graceful degradation (default to signin page)
- 5 second timeout is generous for localStorage read
- Meets SC-002 requirement (500ms target, 5s max)

---

### Decision 7: Loading Screen Design

**Chosen Approach**: Minimal, centered loading indicator with app branding.

**Implementation**:
```typescript
// frontend/src/components/auth/AuthLoadingScreen.tsx
export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-foreground">Todo App</div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"
               style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"
               style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"
               style={{ animationDelay: '300ms' }} />
        </div>
        <div className="text-sm text-muted-foreground">Checking authentication...</div>
      </div>
    </div>
  )
}
```

**Rationale**:
- Theme-aware (uses semantic color tokens)
- Minimal and professional
- Clear feedback to user
- Consistent with existing design system
- No external dependencies (uses Tailwind)

---

## Implementation Approach

### Phase 1: Fix Critical Token Key Bugs (Prerequisite)

**Priority**: CRITICAL - Must be fixed first to unblock testing

**Files to Modify**:

1. **`frontend/src/app/(protected)/layout.tsx`** (Line 27)
   - Change: `localStorage.getItem('token')` → `localStorage.getItem('auth_token')`
   - Impact: Fixes broken authentication check in protected routes

2. **`frontend/src/lib/auth.ts`** - `useSignout` function
   - Change: `localStorage.removeItem('token')` → `localStorage.removeItem('auth_token')`
   - Impact: Fixes signout not actually clearing the token

**Verification**: After this fix, users should be able to sign in and stay signed in without infinite redirects.

---

### Phase 2: Create AuthProvider Infrastructure

**Files to Create**:

1. **`frontend/src/components/auth/AuthProvider.tsx`**
   - Exports: `AuthProvider` component, `AuthContext`
   - Manages global auth state (isAuthenticated, isLoading, userEmail, error)
   - Performs single auth check on mount
   - Provides `signout` and `refreshAuth` functions
   - Blocks rendering with `<AuthLoadingScreen />` while loading

2. **`frontend/src/components/auth/AuthLoadingScreen.tsx`**
   - Exports: `AuthLoadingScreen` component
   - Displays centered loading indicator with app branding
   - Theme-aware styling using semantic tokens
   - Shows "Checking authentication..." message

3. **`frontend/src/hooks/useAuth.ts`**
   - Exports: `useAuth` hook
   - Consumes `AuthContext`
   - Throws error if used outside `AuthProvider`
   - Returns: `{ isAuthenticated, isLoading, userEmail, error, signout, refreshAuth }`

**Files to Modify**:

4. **`frontend/src/types/auth.ts`**
   - Add: `AuthState` interface
   - Add: `AuthContextValue` interface
   - Keep existing: `DecodedToken` interface

---

### Phase 3: Integrate AuthProvider into App

**Files to Modify**:

1. **`frontend/src/app/providers.tsx`**
   - Import `AuthProvider`
   - Wrap children with `<AuthProvider>` (inside QueryClientProvider)
   - Order: `QueryClientProvider` → `AuthProvider` → `ThemeProvider` → children

**Rationale**: QueryClientProvider must be outermost because:
- AuthProvider uses `queryClient.clear()` in its signout function
- AuthProvider still blocks UI rendering until auth is resolved (shows loading screen)
- Auth check completes before any routing decisions
- ThemeProvider is innermost as it has no dependencies on auth or query client

---

### Phase 4: Update Protected Layout

**Files to Modify**:

1. **`frontend/src/app/(protected)/layout.tsx`**
   - Remove: All local state (`isChecking`, `isAuthenticated`, `userEmail`)
   - Remove: `useEffect` with auth check
   - Remove: Local loading screen
   - Add: `const { isAuthenticated, userEmail } = useAuth()`
   - Add: `if (!isAuthenticated) redirect('/signin')`
   - Simplify: Pass `userEmail` directly to Header (no local state)

---

### Phase 5: Update Auth Pages

**Files to Modify**:

1. **`frontend/src/app/(auth)/signin/page.tsx`**
   - Remove: Local `isChecking` state
   - Remove: `useEffect` with auth check
   - Remove: Local loading screen
   - Add: `const { isAuthenticated } = useAuth()`
   - Add: `if (isAuthenticated) redirect('/dashboard')`

2. **`frontend/src/components/auth/SigninForm.tsx`**
   - Add: `const { refreshAuth } = useAuth()`
   - Modify: After successful signin, call `await refreshAuth()`

3. **`frontend/src/components/auth/SignupForm.tsx`**
   - Add: `const { refreshAuth } = useAuth()`
   - Modify: After successful signup, call `await refreshAuth()`

---

### Phase 6: Update Signout Logic

**Files to Modify**:

1. **`frontend/src/lib/auth.ts`** - `useSignout` hook
   - Add: `const { refreshAuth } = useAuth()`
   - Modify: After clearing token, call `await refreshAuth()`
   - Fix: Use correct token key (`auth_token`)

---

### Implementation Order

**Critical Path** (must be done in order):

1. Phase 1: Fix token key bugs (unblocks everything)
2. Phase 2: Create AuthProvider infrastructure
3. Phase 3: Integrate AuthProvider into app
4. Phase 4: Update protected layout
5. Phase 5: Update auth pages
6. Phase 6: Update signout logic

**Parallel Opportunities**: None - each phase depends on previous phase.

---

## Verification Steps

### 1. Verify Token Key Fixes (Phase 1)

```bash
# Start dev server
cd frontend
npm run dev
```

**Test Scenario**:
1. Open browser DevTools → Application → Local Storage
2. Navigate to http://localhost:3000/signin
3. Sign in with valid credentials
4. Check Local Storage - should see `auth_token` key with JWT value
5. Verify you're redirected to dashboard and stay there (no redirect loop)
6. Refresh page - should stay on dashboard
7. Click "Sign Out" - should redirect to signin
8. Check Local Storage - `auth_token` should be removed

**Expected**: No infinite redirects, authentication works correctly.

---

### 2. Verify AuthProvider Integration (Phases 2-3)

**Test Scenario - Cold Start (Unauthenticated)**:
1. Clear all localStorage
2. Navigate to http://localhost:3000
3. Observe: Brief loading screen with "Checking authentication..."
4. Observe: Smooth transition to signin page (no flicker)
5. Verify: No flash of dashboard or other pages

**Test Scenario - Cold Start (Authenticated)**:
1. Sign in to get valid token
2. Close browser tab completely
3. Open new tab → http://localhost:3000
4. Observe: Brief loading screen
5. Observe: Smooth transition to dashboard (no flicker)
6. Verify: No flash of signin page

**Expected**: Single loading screen, then correct page. Zero flickers.

---

### 3. Verify Success Criteria

**SC-001**: Zero visible flickers
- Test: Cold start, page refresh, direct URL access
- Measure: Visual inspection (no rapid page switching)

**SC-002**: Auth resolution within 500ms
- Test: DevTools → Performance tab
- Measure: Time from page start to first content render

**SC-003**: Loading indicator visible during check
- Test: Slow network (Slow 3G in DevTools)
- Measure: Loading screen visible, no blank screens

**SC-004**: 100% refresh consistency
- Test: Refresh dashboard 10 times while authenticated
- Measure: Zero flickers to signin page

**SC-005**: 100% direct URL access handling
- Test: Access /dashboard directly while unauthenticated
- Measure: Loading screen → signin (no dashboard flash)

**SC-006**: Single auth check per initialization
- Test: Add console.log in AuthProvider.checkAuthStatus
- Measure: Should log exactly once per page load

**SC-007**: Graceful error handling
- Test: Corrupt token in localStorage
- Measure: App defaults to signin (no crash)

**SC-008**: Consistent routing (100% accuracy)
- Test: All scenarios above
- Measure: Correct routing in all cases

**SC-009**: Clear visual feedback
- Test: User can distinguish auth check vs page load
- Measure: "Checking authentication..." message visible

**SC-010**: Zero race condition errors
- Test: Check browser console for errors
- Measure: No auth-related errors logged

---

## Critical Files Reference

### Existing Files to Reference

**Auth Utilities**:
- `frontend/src/lib/auth.ts` - JWT utilities (isTokenExpired, getUserEmailFromToken, useSignout)
- `frontend/src/lib/api-client.ts` - API client with auth headers (already uses correct token key)
- `frontend/src/types/auth.ts` - Auth type definitions (DecodedToken)

**Current Layouts**:
- `frontend/src/app/(protected)/layout.tsx` - Protected route wrapper (has bugs to fix)
- `frontend/src/app/(auth)/layout.tsx` - Auth page wrapper (no changes needed)
- `frontend/src/app/providers.tsx` - Providers wrapper (add AuthProvider here)

**Auth Components**:
- `frontend/src/components/auth/SigninForm.tsx` - Signin form (fix token key, add refreshAuth)
- `frontend/src/components/auth/SignupForm.tsx` - Signup form (fix token key, add refreshAuth)

### New Files to Create

**Auth Provider Infrastructure**:
- `frontend/src/components/auth/AuthProvider.tsx` - Centralized auth state management
- `frontend/src/components/auth/AuthLoadingScreen.tsx` - Global loading indicator
- `frontend/src/hooks/useAuth.ts` - Hook to consume auth context

### Files to Modify (Summary)

**Bug Fixes** (Phase 1):
1. `frontend/src/app/(protected)/layout.tsx` - Fix token key
2. `frontend/src/lib/auth.ts` - Fix useSignout token key

**New Infrastructure** (Phases 2-3):
3. `frontend/src/types/auth.ts` - Add AuthState and AuthContextValue types
4. `frontend/src/app/providers.tsx` - Add AuthProvider wrapper

**Simplifications** (Phases 4-6):
5. `frontend/src/app/(protected)/layout.tsx` - Remove local auth state, use useAuth
6. `frontend/src/app/(auth)/signin/page.tsx` - Remove local auth check, use useAuth
7. `frontend/src/components/auth/SigninForm.tsx` - Add refreshAuth call
8. `frontend/src/components/auth/SignupForm.tsx` - Add refreshAuth call
9. `frontend/src/lib/auth.ts` - Update useSignout to call refreshAuth

**Total**: 3 new files, 9 modified files

---

## Next Steps

1. Review and approve this plan
2. Run `/sp.tasks` to generate implementation tasks
3. Execute tasks via `/sp.implement`
4. Run verification steps to validate implementation
5. Create PR for review
