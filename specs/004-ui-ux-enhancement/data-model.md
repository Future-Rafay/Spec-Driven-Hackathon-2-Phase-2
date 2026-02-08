# Data Model: UI/UX Enhancement & Session Consistency Improvements

**Feature**: 004-ui-ux-enhancement
**Date**: 2026-02-08
**Status**: Complete

## Overview

This feature does not introduce new database entities or backend data models. All data structures are client-side only, stored in browser localStorage or managed in-memory by React state and React Query cache.

## Client-Side Data Structures

### 1. Theme Preference (localStorage)

**Storage Location**: `localStorage` with key `"todo-theme"`
**Managed By**: next-themes library
**Lifecycle**: Persists across browser sessions

**Structure**:
```typescript
// Stored as plain string in localStorage
type ThemeValue = "light" | "dark" | "system"

// Example localStorage entry:
// Key: "todo-theme"
// Value: "dark"
```

**Operations**:
- **Read**: Automatic on app initialization by next-themes
- **Write**: Automatic when user toggles theme via `setTheme()`
- **Delete**: Manual via `localStorage.removeItem('todo-theme')`

**Validation**:
- Must be one of: "light", "dark", "system"
- Invalid values fall back to default theme ("light")

**Fallback Strategy**:
- If localStorage unavailable: Use default theme (no persistence)
- If value invalid: Use default theme ("light")

---

### 2. JWT Token (localStorage)

**Storage Location**: `localStorage` with key `"token"`
**Managed By**: Auth functions in `lib/auth.ts`
**Lifecycle**: Persists until sign-out or token expiration

**Structure**:
```typescript
// Stored as JWT string in localStorage
type JWTToken = string

// Example localStorage entry:
// Key: "token"
// Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Decoded Structure** (in-memory only):
```typescript
interface DecodedToken {
  user_id: string      // UUID of authenticated user
  email: string        // User's email address
  exp: number          // Expiration timestamp (Unix epoch)
  iat: number          // Issued at timestamp (Unix epoch)
}
```

**Operations**:
- **Read**: `localStorage.getItem('token')`
- **Write**: `localStorage.setItem('token', jwtString)` (on signin)
- **Delete**: `localStorage.removeItem('token')` (on signout)
- **Decode**: `jwtDecode<DecodedToken>(token)` (for display only)

**Validation**:
- Token format validated by jwt-decode library
- Signature verification performed by backend (not client)
- Expiration checked by backend on each API request

**Fallback Strategy**:
- If token missing: Redirect to signin
- If token malformed: Display "User" as fallback email
- If localStorage unavailable: Show error, cannot authenticate

---

### 3. React Query Cache (in-memory)

**Storage Location**: In-memory cache managed by React Query
**Managed By**: `@tanstack/react-query` QueryClient
**Lifecycle**: Cleared on sign-out, persists during session

**Structure**:
```typescript
// Cache organized by query keys
type QueryCache = {
  ['tasks']: Task[]                    // List of all user's tasks
  ['task', string]: Task               // Individual task by ID
}

interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}
```

**Operations**:
- **Read**: Automatic via `useQuery()` hooks
- **Write**: Automatic via `useMutation()` hooks
- **Clear All**: `queryClient.clear()` (on sign-out)
- **Invalidate**: `queryClient.invalidateQueries({ queryKey: ['tasks'] })`

**Cache Keys**:
```typescript
// Task list query
['tasks']

// Individual task query
['task', taskId]
```

**Lifecycle Events**:
- **On Sign-in**: Cache is empty (fresh start)
- **On Data Fetch**: Cache populated with user's tasks
- **On Mutation**: Cache updated optimistically
- **On Sign-out**: Cache cleared completely (`queryClient.clear()`)

**Critical Behavior**:
- Cache MUST be cleared on sign-out to prevent data leakage
- Cache MUST NOT contain data from previous user sessions
- Cache invalidation triggers automatic refetch

---

### 4. Theme Context (in-memory)

**Storage Location**: React Context managed by next-themes
**Managed By**: ThemeProvider component
**Lifecycle**: Exists during component lifecycle, synced with localStorage

**Structure**:
```typescript
interface ThemeContextValue {
  theme: "light" | "dark" | "system" | undefined
  setTheme: (theme: "light" | "dark" | "system") => void
  systemTheme: "light" | "dark" | undefined
  themes: string[]
  forcedTheme?: string
  resolvedTheme?: "light" | "dark"
}
```

**Operations**:
- **Read**: `const { theme } = useTheme()`
- **Write**: `setTheme('dark')`
- **Subscribe**: Automatic re-render on theme change

**State Transitions**:
```
Initial State (undefined)
  ↓
Hydrated from localStorage
  ↓
Active Theme ("light" | "dark" | "system")
  ↓
User toggles theme
  ↓
New theme applied + saved to localStorage
```

---

## Data Flow Diagrams

### Theme Switching Flow

```
User clicks theme toggle
  ↓
setTheme('dark') called
  ↓
next-themes updates context
  ↓
├─→ Apply 'dark' class to <html>
├─→ Save 'dark' to localStorage
└─→ Trigger component re-renders
  ↓
All components use dark theme tokens
```

### Session Consistency Flow

```
User signs out
  ↓
signout() function called
  ↓
├─→ queryClient.clear() - Clear ALL cache
├─→ localStorage.removeItem('token') - Remove JWT
└─→ router.push('/signin') - Redirect
  ↓
User signs in as different user
  ↓
signin() function called
  ↓
├─→ localStorage.setItem('token', newToken) - Store new JWT
└─→ router.push('/dashboard') - Redirect
  ↓
Dashboard mounts
  ↓
useTasks() hook executes
  ↓
Fetch fresh tasks from API (cache is empty)
  ↓
Only new user's tasks displayed
```

### Dynamic Header Flow

```
Protected layout mounts
  ↓
Read token from localStorage
  ↓
Decode token with jwt-decode
  ↓
Extract email from decoded token
  ↓
Pass email to Header component as prop
  ↓
Header displays actual user email
```

---

## Data Validation Rules

### Theme Preference
- **Valid Values**: "light", "dark", "system"
- **Default**: "light"
- **Validation**: Handled by next-themes library
- **Error Handling**: Invalid values fall back to default

### JWT Token
- **Format**: Standard JWT (header.payload.signature)
- **Validation**: jwt-decode checks format, backend verifies signature
- **Required Fields**: user_id, email, exp, iat
- **Error Handling**: Malformed tokens display "User" as fallback

### React Query Cache
- **Structure**: Defined by Task interface
- **Validation**: Handled by API responses and TypeScript types
- **Consistency**: Guaranteed by clearing cache on auth changes

---

## Storage Constraints

### localStorage Limits
- **Capacity**: ~5-10MB per origin (browser-dependent)
- **Usage**: Minimal (theme preference + JWT token < 5KB)
- **Quota**: Not a concern for this feature

### React Query Cache Limits
- **Default**: No hard limit (memory-based)
- **Garbage Collection**: Automatic for unused queries
- **Configuration**: Default settings sufficient

---

## Data Privacy & Security

### Theme Preference
- **Privacy**: Non-sensitive, user preference only
- **Security**: No security implications
- **Exposure**: Safe to expose in client-side code

### JWT Token
- **Privacy**: Contains user_id and email (PII)
- **Security**: CRITICAL - must be protected
- **Storage**: localStorage (accessible to JavaScript)
- **Transmission**: HTTPS only, Authorization header
- **Validation**: Backend verifies signature on every request
- **Client-Side Usage**: Display only (never for authorization)

### React Query Cache
- **Privacy**: Contains user's task data (PII)
- **Security**: CRITICAL - must be cleared on sign-out
- **Isolation**: Cache MUST NOT contain other users' data
- **Clearing**: `queryClient.clear()` on sign-out

---

## Data Migration

**Not Applicable** - This feature does not involve database migrations or schema changes.

---

## Backward Compatibility

### Existing Data
- **JWT Tokens**: No changes to token structure or format
- **Task Data**: No changes to task schema or API contracts
- **localStorage Keys**: New key "todo-theme" added (no conflicts)

### Breaking Changes
- **None** - All changes are additive and backward compatible

---

## Testing Considerations

### Data Isolation Testing
1. Sign in as User A, create tasks
2. Verify tasks stored in React Query cache
3. Sign out
4. Verify cache cleared (`queryClient.getQueryData(['tasks'])` returns undefined)
5. Sign in as User B
6. Verify User B sees empty task list (no User A data)

### Theme Persistence Testing
1. Set theme to "dark"
2. Verify localStorage contains "todo-theme": "dark"
3. Refresh page
4. Verify theme remains "dark"
5. Clear localStorage
6. Verify theme falls back to "light"

### JWT Decoding Testing
1. Sign in with valid credentials
2. Verify token stored in localStorage
3. Verify decoded email matches signin email
4. Manually corrupt token in localStorage
5. Verify fallback to "User" display

---

## Summary

This feature introduces **zero database changes** and **zero backend changes**. All data structures are client-side only:

1. **Theme Preference**: Managed by next-themes, stored in localStorage
2. **JWT Token**: Existing auth system, decoded client-side for display
3. **React Query Cache**: Existing cache, cleared on auth changes
4. **Theme Context**: In-memory React context, synced with localStorage

**Critical Data Isolation**: React Query cache MUST be cleared on sign-out to prevent cross-user data leakage.
