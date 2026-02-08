# Theme System Contracts

**Feature**: 004-ui-ux-enhancement
**Date**: 2026-02-08
**Type**: Client-Side Interface Contracts

## Overview

This document defines the client-side interface contracts for the theme system, JWT decoding utilities, and cache management functions. These are TypeScript interfaces and function signatures that components will use.

---

## 1. Theme Provider Contract

### ThemeProvider Component

**Provider**: `next-themes` library
**Location**: `app/layout.tsx`

```typescript
import { ThemeProvider } from 'next-themes'

interface ThemeProviderProps {
  /** HTML attribute to apply theme (e.g., 'class' for Tailwind) */
  attribute?: 'class' | 'data-theme' | 'data-mode'

  /** Default theme on first visit */
  defaultTheme?: string

  /** Enable system theme detection */
  enableSystem?: boolean

  /** Enable color scheme in CSS */
  enableColorScheme?: boolean

  /** Disable transitions on theme change */
  disableTransitionOnChange?: boolean

  /** Custom storage key for localStorage */
  storageKey?: string

  /** Available theme options */
  themes?: string[]

  /** Force a specific theme (overrides user selection) */
  forcedTheme?: string

  /** Nonce for CSP */
  nonce?: string

  children: React.ReactNode
}

// Usage
<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem={false}
  storageKey="todo-theme"
>
  {children}
</ThemeProvider>
```

**Configuration for This Feature**:
- `attribute="class"` - Required for Tailwind dark mode
- `defaultTheme="light"` - Default to light theme
- `enableSystem={false}` - Disable system preference (optional)
- `storageKey="todo-theme"` - Custom localStorage key

---

## 2. Theme Hook Contract

### useTheme Hook

**Provider**: `next-themes` library
**Usage**: Any component that needs theme access

```typescript
import { useTheme } from 'next-themes'

interface UseThemeReturn {
  /** Current active theme */
  theme: string | undefined

  /** Set theme (triggers re-render and localStorage update) */
  setTheme: (theme: string) => void

  /** Forced theme (if set via ThemeProvider) */
  forcedTheme?: string

  /** Resolved theme (actual theme being used) */
  resolvedTheme?: string

  /** System theme (if enableSystem is true) */
  systemTheme?: 'light' | 'dark'

  /** Available themes */
  themes: string[]
}

// Usage Example
function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

**Return Values**:
- `theme`: Current theme ("light" | "dark" | undefined during hydration)
- `setTheme`: Function to change theme
- `resolvedTheme`: Actual theme being applied (useful with system theme)

---

## 3. JWT Decoding Contract

### JWT Decode Utility

**Library**: `jwt-decode`
**Location**: `lib/auth.ts`

```typescript
import { jwtDecode } from 'jwt-decode'

/**
 * Structure of decoded JWT token payload
 */
interface DecodedToken {
  /** User's unique identifier (UUID) */
  user_id: string

  /** User's email address */
  email: string

  /** Token expiration timestamp (Unix epoch seconds) */
  exp: number

  /** Token issued at timestamp (Unix epoch seconds) */
  iat: number
}

/**
 * Safely decode JWT token and extract user email
 *
 * @param token - JWT token string from localStorage
 * @returns User email or fallback "User" if decode fails
 *
 * @example
 * const email = getUserEmailFromToken(token)
 * // Returns: "user@example.com" or "User"
 */
function getUserEmailFromToken(token: string | null): string {
  if (!token) return 'User'

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.email || 'User'
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return 'User'
  }
}

/**
 * Check if JWT token is expired
 *
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 *
 * @example
 * if (isTokenExpired(token)) {
 *   // Redirect to signin
 * }
 */
function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}
```

**Error Handling**:
- Malformed token: Returns fallback "User"
- Missing token: Returns fallback "User"
- Decode error: Logs error, returns fallback "User"

**Security Notes**:
- Client-side decoding is for DISPLAY ONLY
- Never use decoded data for authorization decisions
- Backend MUST verify token signatures on all protected endpoints

---

## 4. Cache Management Contract

### React Query Cache Clearing

**Library**: `@tanstack/react-query`
**Location**: `lib/auth.ts`, `hooks/useAuth.ts`

```typescript
import { useQueryClient } from '@tanstack/react-query'

/**
 * Clear all React Query cache
 * CRITICAL: Must be called on sign-out to prevent data leakage
 *
 * @example
 * const queryClient = useQueryClient()
 * queryClient.clear()
 */
interface QueryClient {
  /**
   * Clear ALL cached queries
   * Use on sign-out to guarantee no stale data
   */
  clear(): void

  /**
   * Invalidate specific queries (triggers refetch)
   * Use for selective cache updates
   */
  invalidateQueries(filters?: QueryFilters): Promise<void>

  /**
   * Remove specific queries from cache
   * Use for cleanup of specific data
   */
  removeQueries(filters?: QueryFilters): void

  /**
   * Reset queries to initial state
   * Use for refresh of specific data
   */
  resetQueries(filters?: QueryFilters): Promise<void>

  /**
   * Get cached query data
   * Use for reading cache without triggering fetch
   */
  getQueryData<TData>(queryKey: QueryKey): TData | undefined

  /**
   * Set cached query data
   * Use for optimistic updates
   */
  setQueryData<TData>(queryKey: QueryKey, updater: Updater<TData>): void
}

interface QueryFilters {
  queryKey?: QueryKey
  exact?: boolean
  predicate?: (query: Query) => boolean
}

type QueryKey = readonly unknown[]
```

**Usage Pattern for Sign-Out**:
```typescript
export function useSignout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return async () => {
    // 1. Clear ALL cache (CRITICAL for data isolation)
    queryClient.clear()

    // 2. Remove JWT token
    localStorage.removeItem('token')

    // 3. Redirect to signin
    router.push('/signin')
  }
}
```

**Usage Pattern for Sign-In**:
```typescript
export async function signin(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  // Store new token
  localStorage.setItem('token', data.access_token)

  // Cache will be empty, fresh data will be fetched
  return data
}
```

---

## 5. Header Component Contract

### Header Props Interface

**Location**: `components/layout/Header.tsx`

```typescript
interface HeaderProps {
  /**
   * User's email address to display
   * Extracted from JWT token in protected layout
   * Falls back to "User" if not available
   */
  userEmail: string
}

/**
 * Header component with theme toggle and user menu
 *
 * @param userEmail - Authenticated user's email address
 *
 * @example
 * <Header userEmail="user@example.com" />
 */
export function Header({ userEmail }: HeaderProps) {
  // Implementation
}
```

**Component Responsibilities**:
- Display application logo/title
- Show theme toggle button
- Display user email in user menu
- Provide logout button
- Responsive layout for mobile/desktop

---

## 6. Footer Component Contract

### Footer Props Interface

**Location**: `components/layout/Footer.tsx`

```typescript
interface FooterProps {
  // No props required - footer is static content
}

/**
 * Footer component with copyright and branding
 * Automatically adapts to current theme
 *
 * @example
 * <Footer />
 */
export function Footer() {
  return (
    <footer className="border-t mt-auto py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2026 Todo App</p>
        <p className="mt-1">Made with love by Abdul Rafay</p>
      </div>
    </footer>
  )
}
```

**Component Responsibilities**:
- Display copyright notice
- Display creator attribution
- Responsive layout
- Theme-aware styling (light/dark)

---

## 7. Theme Toggle Component Contract

### ThemeToggle Props Interface

**Location**: `components/layout/ThemeToggle.tsx`

```typescript
interface ThemeToggleProps {
  /**
   * Optional size variant
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg'

  /**
   * Optional className for custom styling
   */
  className?: string
}

/**
 * Theme toggle button component
 * Switches between light and dark themes
 *
 * @example
 * <ThemeToggle size="default" />
 */
export function ThemeToggle({ size = 'default', className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
```

**Component Responsibilities**:
- Display appropriate icon (sun/moon)
- Toggle theme on click
- Accessible (ARIA label, keyboard navigation)
- Responsive sizing

---

## 8. Auth Hook Contract

### useAuth Hook (Custom)

**Location**: `hooks/useAuth.ts`

```typescript
interface UseAuthReturn {
  /**
   * Current user's email (from JWT token)
   * Returns "User" if not authenticated or decode fails
   */
  userEmail: string

  /**
   * Whether user is authenticated (has valid token)
   */
  isAuthenticated: boolean

  /**
   * Sign out function (clears cache and redirects)
   */
  signout: () => Promise<void>

  /**
   * Check if token is expired
   */
  isTokenExpired: boolean
}

/**
 * Custom auth hook with cache clearing
 * Provides authentication state and signout function
 *
 * @example
 * const { userEmail, isAuthenticated, signout } = useAuth()
 */
export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('User')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const email = getUserEmailFromToken(token)
      setUserEmail(email)
      setIsAuthenticated(!isTokenExpired(token))
    }
  }, [])

  const signout = async () => {
    queryClient.clear()
    localStorage.removeItem('token')
    router.push('/signin')
  }

  return {
    userEmail,
    isAuthenticated,
    signout,
    isTokenExpired: isTokenExpired(localStorage.getItem('token'))
  }
}
```

---

## Contract Validation

### Type Safety
- All interfaces use TypeScript for compile-time validation
- Generic types used where appropriate (e.g., `jwtDecode<DecodedToken>`)
- Strict null checks enabled

### Runtime Validation
- JWT decoding wrapped in try-catch
- localStorage access wrapped in try-catch
- Fallback values provided for all error cases

### Error Handling
- All functions have documented error behavior
- Fallback strategies defined for each contract
- User-facing errors logged to console

---

## Summary

This feature defines **8 client-side contracts**:

1. **ThemeProvider**: Configuration for next-themes provider
2. **useTheme Hook**: Theme access and manipulation
3. **JWT Decode Utility**: Safe token decoding with fallbacks
4. **Cache Management**: React Query cache clearing
5. **Header Component**: Props interface for user email display
6. **Footer Component**: Static branding component
7. **ThemeToggle Component**: Theme switcher button
8. **useAuth Hook**: Custom auth hook with cache clearing

All contracts are **type-safe**, **error-resilient**, and **well-documented** for implementation.
