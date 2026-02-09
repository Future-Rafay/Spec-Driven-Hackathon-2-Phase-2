# Research: Auth Session Flicker Fix

**Feature**: Auth Session Flicker Fix
**Date**: 2026-02-08
**Status**: Complete

## Research Questions

### Q1: What causes the auth session flicker?

**Finding**: Multiple independent auth checks with no coordination

**Details**:
- No centralized auth state management
- Each component (protected layout, signin page) independently checks localStorage
- Race conditions between component mount timing and auth checks
- Multiple loading states displayed sequentially

**Decision**: Implement centralized AuthProvider with React Context

---

### Q2: What are the critical bugs in current implementation?

**Finding**: Token key mismatch - stored as `auth_token`, retrieved as `token`

**Details**:
- Signin/Signup store token as `localStorage.setItem('auth_token', token)`
- Protected layout retrieves as `localStorage.getItem('token')` (WRONG KEY)
- useSignout removes `localStorage.removeItem('token')` (WRONG KEY)
- API client correctly uses `auth_token`

**Impact**: Authentication is completely broken - users can't access protected routes even when logged in

**Decision**: Standardize on `auth_token` everywhere (fix 2 files instead of 4)

---

### Q3: What is the best pattern for centralized auth state in Next.js App Router?

**Options Considered**:
1. React Context (chosen)
2. Global state library (Redux/Zustand)
3. Middleware-only solution
4. Server Components with cookies

**Decision**: React Context

**Rationale**:
- **React Context**: ✅ Built-in, no dependencies, perfect for global auth state
- **Redux/Zustand**: ❌ Overkill for simple auth state, adds dependency
- **Middleware**: ❌ Can't access localStorage (server-side), limited to cookie-based auth
- **Server Components**: ❌ Requires backend changes, out of scope

**Best Practices**:
- Create AuthProvider at app root
- Block rendering until auth state resolved
- Single auth check on mount
- Provide auth state via useAuth hook

---

### Q4: How to prevent race conditions between auth check and routing?

**Finding**: Current implementation has multiple race conditions

**Race Conditions Identified**:
1. Protected layout checks auth while API calls might be in flight
2. Signin page checks auth while form submission might be processing
3. No coordination between components

**Decision**: Block all rendering until auth state resolved

**Implementation**:
- AuthProvider shows loading screen while `isLoading === true`
- No routing decisions until `isLoading === false`
- Single source of truth for auth state
- All components consume same state via useAuth hook

---

### Q5: What is the optimal loading screen design?

**Requirements**:
- Theme-aware (light/dark mode)
- Professional appearance
- Clear feedback to user
- Fast to render

**Decision**: Minimal centered loading indicator with app branding

**Design**:
- App name/logo at top
- Animated dots (bouncing animation)
- "Checking authentication..." message
- Uses semantic color tokens (theme-aware)
- No external dependencies (Tailwind only)

---

### Q6: How to handle auth state updates after login/logout?

**Finding**: Current implementation doesn't update global state after auth changes

**Decision**: Add `refreshAuth()` function to AuthProvider

**Implementation**:
- SigninForm calls `refreshAuth()` after successful login
- SignupForm calls `refreshAuth()` after successful signup
- useSignout calls `refreshAuth()` after clearing token
- refreshAuth re-runs auth check and updates global state

**Benefit**: Keeps global auth state in sync with localStorage

---

### Q7: What timeout should be used for auth check?

**Requirements**:
- Fast enough for good UX (target: 500ms)
- Generous enough to handle slow networks
- Graceful fallback if timeout exceeded

**Decision**: 5 second timeout with fallback to unauthenticated

**Rationale**:
- localStorage read is instant (< 10ms)
- JWT decode is fast (< 50ms)
- 5 seconds handles even very slow devices
- Fallback to signin page is safe default
- Meets SC-002 requirement (500ms target, 5s max)

---

## Technology Decisions

### Chosen Technologies

**State Management**: React Context (built-in)
- No additional dependencies
- Perfect for global auth state
- Standard pattern in React ecosystem

**Token Storage**: localStorage (existing)
- Already in use
- Works for client-side auth
- No changes needed

**JWT Parsing**: jwt-decode (already installed)
- Already in use
- Lightweight and reliable
- No changes needed

**Loading Indicator**: Tailwind CSS (existing)
- Already in use
- Theme-aware via semantic tokens
- No additional dependencies

---

## Alternatives Considered

### Alternative 1: Fix bugs only, no architectural changes

**Rejected Because**:
- Fixes immediate bugs but doesn't solve root cause (race conditions)
- Flicker would still occur due to multiple independent auth checks
- Doesn't meet success criteria (zero flickers)

### Alternative 2: Use Next.js middleware for auth

**Rejected Because**:
- Middleware runs server-side, can't access localStorage
- Would require moving to cookie-based auth (out of scope)
- Doesn't solve client-side race conditions

### Alternative 3: Use global state library (Redux/Zustand)

**Rejected Because**:
- Overkill for simple auth state
- Adds external dependency
- React Context is sufficient and built-in

---

## Risk Analysis

### Risk 1: AuthProvider blocks entire app during auth check

**Mitigation**:
- Auth check is fast (< 100ms for localStorage read + JWT decode)
- 5 second timeout prevents infinite loading
- Loading screen provides clear feedback

**Acceptable**: Yes - brief loading is better than flicker

### Risk 2: Breaking existing auth flow

**Mitigation**:
- Reusing existing JWT utilities (isTokenExpired, getUserEmailFromToken)
- No changes to API client or backend
- Comprehensive verification steps

**Acceptable**: Yes - changes are additive, not destructive

### Risk 3: SSR/hydration issues with localStorage

**Mitigation**:
- AuthProvider is client-side only ('use client')
- Check for `typeof window !== 'undefined'` before localStorage access
- suppressHydrationWarning already in place from theme system

**Acceptable**: Yes - standard Next.js pattern

---

## Implementation Complexity

**Estimated Complexity**: Low to Medium

**Breakdown**:
- Bug fixes: 2 files, 2 lines each = **Trivial**
- New AuthProvider: 1 file, ~100 lines = **Medium**
- New AuthLoadingScreen: 1 file, ~20 lines = **Trivial**
- New useAuth hook: 1 file, ~10 lines = **Trivial**
- Type updates: 1 file, ~20 lines = **Trivial**
- Component simplifications: 5 files, removing code = **Easy**

**Total**: 3 new files, 9 modified files, mostly simplifications

---

## Success Criteria Validation

All 10 success criteria are achievable with this approach:

- **SC-001**: ✅ Zero flickers - AuthProvider blocks rendering until auth resolved
- **SC-002**: ✅ < 500ms - localStorage read + JWT decode is instant
- **SC-003**: ✅ Loading indicator visible - AuthLoadingScreen shown while loading
- **SC-004**: ✅ 100% refresh consistency - Single auth check, no race conditions
- **SC-005**: ✅ 100% direct URL handling - Auth check before any routing
- **SC-006**: ✅ Single auth check - useEffect runs once on AuthProvider mount
- **SC-007**: ✅ Graceful error handling - Try/catch with fallback to unauthenticated
- **SC-008**: ✅ Consistent routing - All components use same auth state
- **SC-009**: ✅ Clear visual feedback - "Checking authentication..." message
- **SC-010**: ✅ Zero race conditions - Single source of truth, coordinated checks
