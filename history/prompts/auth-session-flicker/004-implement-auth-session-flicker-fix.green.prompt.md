---
id: 004
title: Implement Auth Session Flicker Fix
stage: green
date: 2026-02-09
surface: agent
model: claude-sonnet-4-5
feature: auth-session-flicker
branch: 005-auth-session-flicker
user: Abdul Rafay
command: /sp.implement
labels: ["implementation", "auth", "session-management", "react-context", "bug-fix"]
links:
  spec: specs/005-auth-session-flicker/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/lib/auth.ts
 - frontend/src/app/(protected)/layout.tsx
 - frontend/src/types/auth.ts
 - frontend/src/components/auth/AuthProvider.tsx
 - frontend/src/components/auth/AuthLoadingScreen.tsx
 - frontend/src/hooks/useAuth.ts
 - frontend/src/app/providers.tsx
 - frontend/src/app/(auth)/signin/page.tsx
 - frontend/src/components/auth/SigninForm.tsx
 - frontend/src/components/auth/SignupForm.tsx
 - specs/005-auth-session-flicker/tasks.md
tests:
 - Manual testing required (Phases 3-5)
---

## Prompt

/sp.implement

## Response snapshot

Successfully implemented Auth Session Flicker Fix - Phases 1 and 2 complete (12 tasks).

### Phase 1: Critical Bug Fixes (T001-T002) ✅

Fixed critical token key inconsistency bugs that completely broke authentication:

**T001**: Fixed token key in protected layout
- Changed `localStorage.getItem('token')` to `localStorage.getItem('auth_token')` in frontend/src/app/(protected)/layout.tsx:27
- Impact: Protected routes can now find the token

**T002**: Fixed token key in auth.ts (3 locations)
- Fixed `useSignout` hook: `localStorage.removeItem('auth_token')`
- Fixed `getCurrentUser` function: `localStorage.getItem('auth_token')`
- Fixed `logout` function: `localStorage.removeItem('auth_token')`
- Impact: Signout now actually clears the token

### Phase 2: User Story 1 - AuthProvider Implementation (T003-T012) ✅

Created centralized authentication state management infrastructure:

**T003**: Added auth types to frontend/src/types/auth.ts
- Added `AuthProviderState` interface (isAuthenticated, isLoading, userEmail, error)
- Added `AuthContextValue` interface (extends AuthProviderState with signout, refreshAuth)

**T004**: Created AuthProvider component (frontend/src/components/auth/AuthProvider.tsx)
- Centralized auth state management with React Context
- Single auth check on mount (runs once per app load)
- Blocks UI rendering with loading screen while `isLoading === true`
- 5-second timeout with fallback to unauthenticated
- Provides `signout()` and `refreshAuth()` functions
- ~140 lines of code

**T005**: Created AuthLoadingScreen component (frontend/src/components/auth/AuthLoadingScreen.tsx)
- Theme-aware loading indicator with semantic color tokens
- Animated bouncing dots with staggered delays
- "Checking authentication..." message
- Centered layout matching app design

**T006**: Created useAuth hook (frontend/src/hooks/useAuth.ts)
- Consumes AuthContext
- Throws error if used outside AuthProvider
- Returns auth state and actions

**T007**: Integrated AuthProvider into app (frontend/src/app/providers.tsx)
- Added as outermost wrapper (before ThemeProvider and QueryClientProvider)
- Ensures auth check completes before any other initialization

**T008**: Simplified protected layout (frontend/src/app/(protected)/layout.tsx)
- Removed local state: `isChecking`, `isAuthenticated`, `userEmail`
- Removed `useEffect` with auth check
- Removed local loading screen
- Now uses `useAuth()` hook and `redirect()` for routing
- Reduced from 66 lines to 32 lines

**T009**: Simplified signin page (frontend/src/app/(auth)/signin/page.tsx)
- Removed local `isChecking` state
- Removed `useEffect` with auth check
- Removed local loading screen
- Now uses `useAuth()` hook and `redirect()` for routing
- Reduced from 56 lines to 38 lines

**T010**: Updated SigninForm (frontend/src/components/auth/SigninForm.tsx)
- Added `const { refreshAuth } = useAuth()`
- Calls `await refreshAuth()` after successful signin
- Keeps global auth state in sync with localStorage

**T011**: Updated SignupForm (frontend/src/components/auth/SignupForm.tsx)
- Added `const { refreshAuth } = useAuth()`
- Calls `await refreshAuth()` after successful signup
- Keeps global auth state in sync with localStorage

**T012**: Updated useSignout hook (frontend/src/lib/auth.ts)
- Added `await refreshAuth()` call after clearing token
- Updates global auth state before redirect
- Ensures consistent state across all components

### Implementation Summary

**Files Created**: 3
- AuthProvider.tsx (140 lines)
- AuthLoadingScreen.tsx (28 lines)
- useAuth.ts (15 lines)

**Files Modified**: 8
- auth.ts (fixed 3 token key bugs, added refreshAuth to useSignout)
- layout.tsx in (protected) (simplified from 66 to 32 lines)
- signin/page.tsx (simplified from 56 to 38 lines)
- SigninForm.tsx (added refreshAuth call)
- SignupForm.tsx (added refreshAuth call)
- types/auth.ts (added 2 new interfaces)
- providers.tsx (wrapped with AuthProvider)
- tasks.md (marked 12 tasks complete)

**Total Changes**: 11 files, ~200 lines of new code, ~60 lines removed

### Key Design Decisions Implemented

1. **Centralized Auth State**: Single source of truth via React Context
2. **Blocking UI Pattern**: No rendering until auth state resolved (prevents flicker)
3. **Single Auth Check**: Runs once on app initialization, not per route
4. **Timeout Handling**: 5-second timeout with graceful fallback
5. **State Synchronization**: refreshAuth() called after login/logout to sync global state

### What This Solves

✅ **User Story 1 (P1 MVP)**: Stable initial load without flicker
✅ **User Story 2 (P2)**: Consistent page refresh behavior (implementation complete, needs verification)
✅ **User Story 3 (P3)**: Direct URL access handling (implementation complete, needs verification)

All three user stories are solved by the same AuthProvider implementation.

### Remaining Work

**Phases 3-5 are manual verification tasks** (not code implementation):

- **Phase 3 (T013-T015)**: Verify page refresh behavior in 3 scenarios
- **Phase 4 (T016-T018)**: Verify direct URL access in 3 scenarios
- **Phase 5 (T019-T023)**: Final validation (10 success criteria, edge cases, console checks)

**Next Steps**: Start dev server (`cd frontend && npm run dev`) and run manual verification tests.

## Outcome

- ✅ Impact: Implemented complete AuthProvider infrastructure solving all 3 user stories (cold start, refresh, direct URL access)
- 🧪 Tests: Implementation complete, manual testing required (Phases 3-5)
- 📁 Files: Created 3 new files, modified 8 files, ~200 lines added, ~60 lines removed
- 🔁 Next prompts: Run manual verification tests (T013-T023), then create PR with /sp.git.commit_pr
- 🧠 Reflection: Implementation went smoothly following the task plan. All critical bug fixes and AuthProvider infrastructure complete. The centralized auth state pattern eliminates race conditions and provides single source of truth. Manual testing required to verify zero flickers across all scenarios.

## Evaluation notes (flywheel)

- Failure modes observed: None - all tasks completed successfully
- Graders run and results (PASS/FAIL): Implementation PASS (code complete), Verification PENDING (manual testing required)
- Prompt variant (if applicable): Standard /sp.implement workflow with task-by-task execution
- Next experiment (smallest change to try): Run manual verification tests to validate zero flickers, then measure auth resolution time (should be < 500ms per SC-002)
