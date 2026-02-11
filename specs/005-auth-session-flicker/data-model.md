# Data Model: Auth Session Flicker Fix

**Feature**: Auth Session Flicker Fix
**Date**: 2026-02-08

## Overview

This feature introduces centralized authentication state management to eliminate UI flicker during session detection. The data model defines the structure of authentication state and the contracts for auth-related operations.

---

## Authentication State

### AuthState Interface

Represents the current authentication status of the application.

```typescript
interface AuthState {
  // Whether the user is authenticated
  isAuthenticated: boolean

  // Whether auth check is in progress
  isLoading: boolean

  // User's email from JWT token (null if not authenticated)
  userEmail: string | null

  // Error message if auth check failed (null if no error)
  error: string | null
}
```

**State Transitions**:

```
Initial State:
{ isAuthenticated: false, isLoading: true, userEmail: null, error: null }

After Successful Auth Check (Authenticated):
{ isAuthenticated: true, isLoading: false, userEmail: "user@example.com", error: null }

After Successful Auth Check (Unauthenticated):
{ isAuthenticated: false, isLoading: false, userEmail: null, error: null }

After Failed Auth Check:
{ isAuthenticated: false, isLoading: false, userEmail: null, error: "Auth check failed" }
```

**Invariants**:
- `isLoading` and `isAuthenticated` cannot both be true
- `userEmail` is non-null only when `isAuthenticated === true`
- `error` is non-null only when auth check fails (rare)

---

### AuthContextValue Interface

Extends AuthState with action functions for auth operations.

```typescript
interface AuthContextValue extends AuthState {
  // Sign out the current user
  signout: () => Promise<void>

  // Refresh auth state from localStorage
  refreshAuth: () => Promise<void>
}
```

**Methods**:

**`signout()`**:
- Clears React Query cache
- Removes token from localStorage
- Updates auth state to unauthenticated
- Navigates to signin page

**`refreshAuth()`**:
- Re-reads token from localStorage
- Validates token expiration
- Updates auth state accordingly
- Called after login/logout to sync state

---

## JWT Token Structure

### DecodedToken Interface (Existing)

Represents the decoded JWT token payload.

```typescript
interface DecodedToken {
  // User's unique identifier
  user_id: string

  // User's email address
  email: string

  // Token expiration timestamp (Unix epoch)
  exp: number

  // Token issued at timestamp (Unix epoch)
  iat: number
}
```

**Storage**:
- Key: `'auth_token'` (localStorage)
- Format: JWT string (e.g., `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`)
- Lifetime: Determined by `exp` claim (typically 7 days)

**Validation**:
- Check token exists in localStorage
- Decode JWT using jwt-decode library
- Compare `exp` with current time
- Valid if `exp > Date.now() / 1000`

---

## Route Protection Status

### Route Types

**Protected Routes**:
- Require authentication (`isAuthenticated === true`)
- Examples: `/dashboard`, `/profile`, `/settings`
- Redirect to `/signin` if unauthenticated

**Public-Only Routes**:
- Require no authentication (`isAuthenticated === false`)
- Examples: `/signin`, `/signup`
- Redirect to `/dashboard` if authenticated

**Public-Accessible Routes**:
- Accessible regardless of auth state
- Examples: `/` (landing page), `/about`, `/terms`
- No redirects

**Implementation**:
```typescript
// Protected route check (in protected layout)
const { isAuthenticated } = useAuth()
if (!isAuthenticated) {
  redirect('/signin')
}

// Public-only route check (in signin/signup pages)
const { isAuthenticated } = useAuth()
if (isAuthenticated) {
  redirect('/dashboard')
}
```

---

## Auth Provider State Machine

### States

1. **INITIALIZING** (`isLoading: true`)
   - App just started
   - Auth check in progress
   - UI blocked with loading screen

2. **AUTHENTICATED** (`isLoading: false, isAuthenticated: true`)
   - Valid token found
   - User can access protected routes
   - Email extracted from token

3. **UNAUTHENTICATED** (`isLoading: false, isAuthenticated: false`)
   - No token or expired token
   - User must sign in
   - Redirected to signin page from protected routes

4. **ERROR** (`isLoading: false, isAuthenticated: false, error: string`)
   - Auth check failed (rare)
   - Treated as unauthenticated
   - Error logged for debugging

### Transitions

```
INITIALIZING
  ├─ [Valid token found] → AUTHENTICATED
  ├─ [No token or expired] → UNAUTHENTICATED
  └─ [Check failed] → ERROR

AUTHENTICATED
  ├─ [User signs out] → UNAUTHENTICATED
  ├─ [Token expires] → UNAUTHENTICATED (on next check)
  └─ [refreshAuth() called] → INITIALIZING → AUTHENTICATED/UNAUTHENTICATED

UNAUTHENTICATED
  ├─ [User signs in] → AUTHENTICATED (via refreshAuth)
  └─ [refreshAuth() called] → INITIALIZING → AUTHENTICATED/UNAUTHENTICATED

ERROR
  └─ [refreshAuth() called] → INITIALIZING → AUTHENTICATED/UNAUTHENTICATED
```

---

## Data Flow

### App Initialization Flow

```
1. App starts
   └─ AuthProvider mounts
      └─ State: { isLoading: true, isAuthenticated: false, userEmail: null, error: null }
      └─ Renders: <AuthLoadingScreen />

2. useEffect runs
   └─ checkAuthStatus() called
      └─ Reads localStorage.getItem('auth_token')
      └─ If token exists:
         └─ Decodes JWT
         └─ Checks expiration
         └─ If valid:
            └─ State: { isLoading: false, isAuthenticated: true, userEmail: "...", error: null }
         └─ If expired:
            └─ State: { isLoading: false, isAuthenticated: false, userEmail: null, error: null }
      └─ If no token:
         └─ State: { isLoading: false, isAuthenticated: false, userEmail: null, error: null }

3. AuthProvider re-renders
   └─ isLoading === false
   └─ Renders: children (app content)

4. Routing decisions made
   └─ Protected routes check isAuthenticated
   └─ Public-only routes check isAuthenticated
   └─ Redirects happen if needed
```

### Login Flow

```
1. User submits signin form
   └─ API call to /auth/signin
   └─ Receives JWT token

2. Token stored
   └─ localStorage.setItem('auth_token', token)

3. Auth state refreshed
   └─ refreshAuth() called
   └─ checkAuthStatus() runs
   └─ State updated: { isAuthenticated: true, userEmail: "...", ... }

4. Navigation
   └─ router.push('/dashboard')
   └─ Protected layout checks isAuthenticated
   └─ User sees dashboard (no flicker)
```

### Logout Flow

```
1. User clicks "Sign Out"
   └─ signout() called

2. Cache cleared
   └─ queryClient.clear()

3. Token removed
   └─ localStorage.removeItem('auth_token')

4. Auth state refreshed
   └─ refreshAuth() called
   └─ checkAuthStatus() runs
   └─ State updated: { isAuthenticated: false, userEmail: null, ... }

5. Navigation
   └─ router.push('/signin')
   └─ Signin page checks isAuthenticated
   └─ User sees signin form (no flicker)
```

---

## Validation Rules

### Token Validation

1. **Existence Check**: Token must exist in localStorage
2. **Format Check**: Token must be valid JWT format (3 parts separated by dots)
3. **Decode Check**: Token must be decodable by jwt-decode library
4. **Expiration Check**: `decoded.exp > Date.now() / 1000`
5. **Email Check**: `decoded.email` must be present and non-empty

**Failure Handling**: Any validation failure → treat as unauthenticated

### State Validation

1. **Loading State**: `isLoading` must be boolean
2. **Auth State**: `isAuthenticated` must be boolean
3. **Email State**: `userEmail` must be string or null
4. **Error State**: `error` must be string or null
5. **Consistency**: If `isAuthenticated === true`, then `userEmail !== null`

---

## Performance Considerations

### Auth Check Performance

**Target**: < 500ms for auth state resolution

**Breakdown**:
- localStorage read: < 10ms
- JWT decode: < 50ms
- State update: < 10ms
- Total: < 100ms (well under target)

**Timeout**: 5 seconds (generous for slow devices)

### Memory Usage

**AuthProvider State**: ~100 bytes
- isAuthenticated: 1 byte
- isLoading: 1 byte
- userEmail: ~50 bytes (average email length)
- error: ~50 bytes (if present)

**JWT Token**: ~500-1000 bytes (stored in localStorage)

**Total**: Negligible memory impact

---

## Security Considerations

### Token Storage

**Current**: localStorage (client-side)
- ✅ Simple and works for SPA
- ⚠️ Vulnerable to XSS attacks
- ✅ Not vulnerable to CSRF (no cookies)

**Mitigation**:
- Backend validates JWT signature
- Token has expiration
- HTTPS only in production

### State Exposure

**AuthContext**: Exposes auth state to all components
- ✅ Read-only access (components can't modify state directly)
- ✅ Actions (signout, refreshAuth) are controlled
- ✅ No sensitive data exposed (only email, not password)

---

## Testing Considerations

### State Transitions to Test

1. INITIALIZING → AUTHENTICATED (valid token)
2. INITIALIZING → UNAUTHENTICATED (no token)
3. INITIALIZING → UNAUTHENTICATED (expired token)
4. INITIALIZING → ERROR (malformed token)
5. AUTHENTICATED → UNAUTHENTICATED (signout)
6. UNAUTHENTICATED → AUTHENTICATED (signin)

### Edge Cases

1. Token expires during session
2. Token is manually corrupted in localStorage
3. localStorage is disabled (private browsing)
4. Multiple tabs with different auth states
5. Rapid signin/signout cycles
