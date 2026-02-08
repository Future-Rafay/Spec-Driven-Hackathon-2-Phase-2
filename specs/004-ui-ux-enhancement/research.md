# Research: UI/UX Enhancement & Session Consistency Improvements

**Feature**: 004-ui-ux-enhancement
**Date**: 2026-02-08
**Status**: Complete

## Overview

This document captures research findings for implementing theme switching, session consistency fixes, dynamic header updates, and footer branding in the Todo frontend application. All research focuses on frontend-only solutions using existing infrastructure.

## Research Topics

### 1. next-themes Integration with Next.js App Router

**Question**: How to integrate next-themes with Next.js 16 App Router for seamless theme switching?

**Research Findings**:

**Library**: `next-themes@^0.2.1`
- Official theme provider for Next.js applications
- Built-in support for App Router
- Automatic localStorage persistence
- SSR-safe with hydration handling
- Zero-config dark mode support

**Integration Pattern**:
```typescript
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="todo-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Key Configuration Options**:
- `attribute="class"`: Applies theme as class on html element (works with Tailwind)
- `defaultTheme="light"`: Default theme on first visit
- `enableSystem={false}`: Disable system preference detection (optional)
- `storageKey`: Custom localStorage key for theme preference

**Usage in Components**:
```typescript
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

**Decision**: Use next-themes with `attribute="class"` for Tailwind compatibility

---

### 2. jwt-decode Library Usage and Error Handling

**Question**: How to safely decode JWT tokens client-side to extract user email?

**Research Findings**:

**Library**: `jwt-decode@^4.0.0`
- Lightweight JWT decoder (no verification, client-side only)
- TypeScript support with generic types
- No dependencies
- Does NOT verify signatures (backend responsibility)

**Usage Pattern**:
```typescript
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  user_id: string
  email: string
  exp: number
  iat: number
}

function getUserEmail(): string {
  try {
    const token = localStorage.getItem('token')
    if (!token) return 'User'

    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.email || 'User'
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return 'User'
  }
}
```

**Error Handling**:
- Wrap in try-catch for malformed tokens
- Provide fallback display ("User") if decode fails
- Log errors for debugging
- Never expose token contents to user

**Security Considerations**:
- jwt-decode does NOT verify signatures (client-side decoding only)
- Backend MUST verify JWT signatures on all protected endpoints
- Client-side decoding is safe for display purposes only
- Never trust decoded data for authorization decisions

**Decision**: Use jwt-decode with try-catch and fallback to "User" on errors

---

### 3. React Query Cache Clearing Strategies

**Question**: What's the safest way to clear React Query cache on authentication state changes?

**Research Findings**:

**Available Methods**:

1. **`queryClient.clear()`** - Clears ALL cache (RECOMMENDED)
   ```typescript
   queryClient.clear()
   ```
   - Pros: Guarantees no stale data, simple, deterministic
   - Cons: Clears everything (including non-user-specific data)
   - Use case: Sign-out, user switch

2. **`queryClient.invalidateQueries()`** - Marks queries as stale
   ```typescript
   queryClient.invalidateQueries({ queryKey: ['tasks'] })
   ```
   - Pros: Selective invalidation, triggers refetch
   - Cons: Requires knowing all query keys, might miss some
   - Use case: Data mutations, partial updates

3. **`queryClient.removeQueries()`** - Removes specific queries
   ```typescript
   queryClient.removeQueries({ queryKey: ['tasks'] })
   ```
   - Pros: Selective removal, no refetch
   - Cons: Requires knowing all query keys, might miss some
   - Use case: Cleanup of specific data

4. **`queryClient.resetQueries()`** - Resets to initial state
   ```typescript
   queryClient.resetQueries({ queryKey: ['tasks'] })
   ```
   - Pros: Resets to initial state, triggers refetch
   - Cons: Requires knowing all query keys
   - Use case: Refresh specific data

**Comparison for Session Isolation**:

| Method | Guarantees No Stale Data | Simple | Deterministic | Recommended |
|--------|-------------------------|--------|---------------|-------------|
| `clear()` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ **YES** |
| `invalidateQueries()` | ⚠️ If all keys known | ⚠️ Moderate | ⚠️ If all keys known | ❌ No |
| `removeQueries()` | ⚠️ If all keys known | ⚠️ Moderate | ⚠️ If all keys known | ❌ No |
| `resetQueries()` | ⚠️ If all keys known | ⚠️ Moderate | ⚠️ If all keys known | ❌ No |

**Implementation Pattern**:
```typescript
// lib/auth.ts
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useSignout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return async () => {
    // 1. Clear ALL React Query cache
    queryClient.clear()

    // 2. Remove JWT token
    localStorage.removeItem('token')

    // 3. Redirect to signin
    router.push('/signin')
  }
}
```

**Decision**: Use `queryClient.clear()` on sign-out for guaranteed data isolation

---

### 4. shadcn/ui Dark Mode Configuration

**Question**: How to configure shadcn/ui components for dark mode support?

**Research Findings**:

**shadcn/ui Theme System**:
- Uses CSS variables for theming
- Automatically supports dark mode via Tailwind's `dark:` prefix
- Theme tokens defined in `globals.css`
- No component changes required

**Tailwind Configuration**:
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // Enable class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // shadcn/ui theme tokens (already configured)
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

**CSS Variables** (already in globals.css):
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other light mode variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark mode variables */
  }
}
```

**Component Usage** (no changes needed):
```typescript
// Components automatically use theme tokens
<Button className="bg-background text-foreground">
  Click me
</Button>
```

**Verification**:
- All shadcn/ui components use CSS variables
- Dark mode works automatically when `dark` class applied to html
- No component modifications required

**Decision**: Use existing shadcn/ui theme configuration with Tailwind `darkMode: ['class']`

---

### 5. localStorage Fallback Strategies

**Question**: How to handle localStorage unavailability (private browsing, disabled storage)?

**Research Findings**:

**localStorage Availability Issues**:
- Private/Incognito mode: localStorage may throw errors
- Browser settings: User may disable storage
- Storage quota: May be full (rare)
- Cross-origin restrictions: May not be accessible

**Detection Pattern**:
```typescript
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}
```

**Safe Access Pattern**:
```typescript
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn('localStorage not available:', error)
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn('localStorage not available:', error)
    return false
  }
}
```

**Fallback Strategies**:

1. **For Theme Preference**:
   - Fall back to default theme (light)
   - Theme persists only for current session
   - User can still toggle theme (just not persisted)

2. **For JWT Token**:
   - Critical - must work for authentication
   - If localStorage fails, authentication won't work
   - Show error message to user
   - Suggest disabling private browsing

**next-themes Handling**:
- next-themes automatically handles localStorage errors
- Falls back to default theme if storage unavailable
- No additional error handling needed

**Implementation**:
```typescript
// JWT token access (critical)
function getToken(): string | null {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('Cannot access localStorage. Please disable private browsing.')
    return null
  }
}

// Theme preference (non-critical, handled by next-themes)
// No additional handling needed
```

**Decision**:
- Rely on next-themes for theme storage fallback
- Add try-catch for JWT token access with user-facing error message

---

## Summary of Decisions

### Technology Choices

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Theme Provider | next-themes | ^0.2.1 | Standard Next.js solution, SSR-safe |
| JWT Decoder | jwt-decode | ^4.0.0 | Lightweight, TypeScript support |
| Cache Strategy | React Query clear() | Existing | Guarantees data isolation |
| Dark Mode | Tailwind + shadcn/ui | Existing | Already configured |
| Storage | localStorage | Browser API | Standard web storage |

### Implementation Patterns

1. **Theme System**: next-themes provider in root layout with `attribute="class"`
2. **Cache Clearing**: `queryClient.clear()` on sign-out
3. **JWT Decoding**: Decode in protected layout, pass email as prop to Header
4. **Error Handling**: Try-catch with fallbacks for all localStorage access
5. **Dark Mode**: Use existing shadcn/ui CSS variables (no changes needed)

### Risk Mitigations

1. **JWT Decode Errors**: Try-catch with fallback to "User"
2. **localStorage Unavailable**: next-themes handles theme, show error for JWT
3. **Cache Clearing Failures**: Use most reliable method (`clear()`)
4. **Theme Flickering**: Use `suppressHydrationWarning` on html element

## References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [jwt-decode Documentation](https://github.com/auth0/jwt-decode)
- [React Query Cache Management](https://tanstack.com/query/latest/docs/react/guides/query-invalidation)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)

## Open Questions

**None** - All research topics resolved with clear decisions and implementation patterns.
