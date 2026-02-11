# Auth Provider Contract

**Feature**: Auth Session Flicker Fix
**Component**: AuthProvider
**Date**: 2026-02-08

---

## Overview

The AuthProvider is a React Context provider that manages global authentication state for the entire application. It performs a single authentication check on mount and provides auth state and actions to all child components.

---

## Public API

### AuthProvider Component

**Purpose**: Wraps the application and provides authentication context

**Props**:
```typescript
interface AuthProviderProps {
  children: React.ReactNode
}
```

**Usage**:
```typescript
import { AuthProvider } from '@/components/auth/AuthProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* Rest of app */}
      {children}
    </AuthProvider>
  )
}
```

**Behavior**:
- Mounts with `isLoading: true`
- Performs auth check in `useEffect` (runs once)
- Blocks rendering with `<AuthLoadingScreen />` while `isLoading === true`
- Renders children once `isLoading === false`
- Provides auth state and actions via `AuthContext`

---

### useAuth Hook

**Purpose**: Consume authentication context in any component

**Signature**:
```typescript
function useAuth(): AuthContextValue
```

**Returns**:
```typescript
interface AuthContextValue {
  // Current auth state
  isAuthenticated: boolean
  isLoading: boolean
  userEmail: string | null
  error: string | null

  // Actions
  signout: () => Promise<void>
  refreshAuth: () => Promise<void>
}
```

**Usage**:
```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { isAuthenticated, userEmail, signout } = useAuth()

  if (!isAuthenticated) {
    redirect('/signin')
  }

  return <div>Welcome, {userEmail}!</div>
}
```

**Error Handling**:
- Throws error if used outside `<AuthProvider>`
- Error message: "useAuth must be used within AuthProvider"

---

## State Contract

### Initial State

When AuthProvider mounts:

```typescript
{
  isAuthenticated: false,
  isLoading: true,
  userEmail: null,
  error: null
}
```

**Guarantees**:
- `isLoading` is always `true` initially
- Children are not rendered until auth check completes

---

### Authenticated State

After successful auth check with valid token:

```typescript
{
  isAuthenticated: true,
  isLoading: false,
  userEmail: "user@example.com",
  error: null
}
```

**Guarantees**:
- `isAuthenticated` is `true`
- `userEmail` is non-null string (extracted from JWT)
- `error` is `null`
- Children are rendered

---

### Unauthenticated State

After auth check with no token or expired token:

```typescript
{
  isAuthenticated: false,
  isLoading: false,
  userEmail: null,
  error: null
}
```

**Guarantees**:
- `isAuthenticated` is `false`
- `userEmail` is `null`
- `error` is `null` (expired token is not an error)
- Children are rendered

---

### Error State

After auth check failure (rare):

```typescript
{
  isAuthenticated: false,
  isLoading: false,
  userEmail: null,
  error: "Auth check failed"
}
```

**Guarantees**:
- `isAuthenticated` is `false` (fail-safe default)
- `userEmail` is `null`
- `error` contains error message
- Children are rendered (app doesn't crash)

---

## Action Contracts

### signout()

**Purpose**: Sign out the current user

**Signature**:
```typescript
signout: () => Promise<void>
```

**Behavior**:
1. Clears React Query cache (`queryClient.clear()`)
2. Removes token from localStorage (`localStorage.removeItem('auth_token')`)
3. Calls `refreshAuth()` to update state
4. Navigates to `/signin`

**Guarantees**:
- Auth state becomes unauthenticated after completion
- All cached data is cleared
- Token is removed from storage
- User is redirected to signin page

**Usage**:
```typescript
const { signout } = useAuth()

async function handleSignout() {
  await signout()
  // User is now on signin page
}
```

---

### refreshAuth()

**Purpose**: Re-check authentication status from localStorage

**Signature**:
```typescript
refreshAuth: () => Promise<void>
```

**Behavior**:
1. Re-reads token from localStorage
2. Validates token (existence, format, expiration)
3. Updates auth state based on validation result
4. Does NOT navigate or show loading screen

**Guarantees**:
- Auth state reflects current localStorage state after completion
- No side effects (no navigation, no cache clearing)
- Safe to call multiple times

**Usage**:
```typescript
const { refreshAuth } = useAuth()

async function handleSignin(token: string) {
  localStorage.setItem('auth_token', token)
  await refreshAuth()  // Update global auth state
  router.push('/dashboard')
}
```

**When to Call**:
- After successful signin (to update state)
- After successful signup (to update state)
- After signout (to update state)
- When token is manually modified (rare)

---

## Timing Guarantees

### Auth Check Duration

**Target**: < 500ms under normal conditions

**Breakdown**:
- localStorage read: < 10ms
- JWT decode: < 50ms
- State update: < 10ms
- **Total**: < 100ms (typical)

**Maximum**: 5 seconds (timeout)

**Behavior on Timeout**:
- Defaults to unauthenticated state
- Sets error: "Auth check timeout"
- Renders children (app doesn't hang)

---

### Loading Screen Duration

**Minimum**: 0ms (if auth check completes instantly)
**Maximum**: 5 seconds (timeout)
**Typical**: 50-200ms

**User Experience**:
- Brief flash of loading screen
- Smooth transition to correct page
- No blank screens or flicker

---

## Error Handling Contract

### Token Validation Errors

**Scenarios**:
1. No token in localStorage
2. Token is not valid JWT format
3. Token is expired
4. Token decode fails

**Behavior**: Treat as unauthenticated (not an error)

**State**:
```typescript
{
  isAuthenticated: false,
  isLoading: false,
  userEmail: null,
  error: null  // Not an error, just no valid token
}
```

---

### Auth Check Errors

**Scenarios**:
1. localStorage access fails
2. Unexpected exception during check
3. Timeout exceeded

**Behavior**: Fail-safe to unauthenticated

**State**:
```typescript
{
  isAuthenticated: false,
  isLoading: false,
  userEmail: null,
  error: "Auth check failed"  // Error logged
}
```

**Guarantees**:
- App never crashes due to auth errors
- User can always access signin page
- Errors are logged to console for debugging

---

## Integration Contract

### With Protected Routes

**Protected Layout Responsibility**:
```typescript
const { isAuthenticated } = useAuth()

if (!isAuthenticated) {
  redirect('/signin')
}
```

**Guarantees**:
- `isAuthenticated` is always accurate when checked
- No race conditions (auth check completes before routing)
- No flicker (loading screen blocks rendering)

---

### With Auth Pages

**Signin/Signup Page Responsibility**:
```typescript
const { isAuthenticated } = useAuth()

if (isAuthenticated) {
  redirect('/dashboard')
}
```

**Guarantees**:
- Authenticated users can't access auth pages
- Redirect happens before form renders
- No flicker

---

### With API Client

**API Client Responsibility**:
- Read token from localStorage independently
- Add token to Authorization header
- Handle 401 responses

**AuthProvider Responsibility**:
- Keep token in localStorage up-to-date
- Provide auth state for UI decisions

**No Direct Integration**: API client and AuthProvider are independent

---

## Performance Contract

### Memory Usage

**AuthProvider State**: ~100 bytes
**Context Overhead**: ~50 bytes
**Total**: Negligible

**Guarantees**:
- No memory leaks
- State is garbage collected when app unmounts

---

### Re-render Behavior

**When AuthProvider Re-renders**:
1. On mount (initial render)
2. When auth state changes (after check completes)
3. When `refreshAuth()` is called

**When Consumers Re-render**:
- Only when auth state values they use change
- React Context optimization applies

**Guarantees**:
- Minimal re-renders
- No unnecessary re-renders of entire app

---

## Testing Contract

### Unit Testing

**Mock AuthProvider**:
```typescript
const mockAuthContext = {
  isAuthenticated: true,
  isLoading: false,
  userEmail: 'test@example.com',
  error: null,
  signout: jest.fn(),
  refreshAuth: jest.fn(),
}

<AuthContext.Provider value={mockAuthContext}>
  <ComponentUnderTest />
</AuthContext.Provider>
```

---

### Integration Testing

**Test Scenarios**:
1. Mount with no token → unauthenticated state
2. Mount with valid token → authenticated state
3. Mount with expired token → unauthenticated state
4. Call signout → state updates correctly
5. Call refreshAuth → state updates correctly

---

## Backwards Compatibility

**Breaking Changes**: None

**Migration Path**: N/A (new feature)

**Deprecations**: None

---

## Future Considerations

**Potential Enhancements** (out of scope for this feature):
1. Automatic token refresh before expiration
2. Cross-tab session synchronization
3. Remember me functionality
4. Session timeout warnings
5. Biometric authentication support

**Extension Points**:
- `AuthContextValue` can be extended with new fields
- `checkAuthStatus` can be enhanced with additional checks
- New actions can be added to context
