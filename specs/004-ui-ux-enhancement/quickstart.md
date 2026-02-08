# Quickstart Guide: UI/UX Enhancement & Session Consistency Improvements

**Feature**: 004-ui-ux-enhancement
**Date**: 2026-02-08
**Branch**: `004-ui-ux-enhancement`

## Overview

This guide provides step-by-step instructions for setting up, implementing, testing, and validating the UI/UX Enhancement feature. Follow these steps to add theme switching, fix session consistency, implement dynamic header, and add footer branding.

---

## Prerequisites

### Required Software
- Node.js 18+ and npm/yarn
- Git
- Code editor (VS Code recommended)

### Existing Features
- ✅ Feature 001 (auth-layer): JWT authentication system
- ✅ Feature 003 (todo-frontend): React Query, shadcn/ui, Next.js App Router

### Knowledge Requirements
- TypeScript basics
- React hooks (useState, useEffect, useContext)
- Next.js App Router
- React Query fundamentals

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd frontend

# Install next-themes for theme management
npm install next-themes@^0.2.1

# Install jwt-decode for token parsing
npm install jwt-decode@^4.0.0

# Verify installation
npm list next-themes jwt-decode
```

**Expected Output**:
```
├── next-themes@0.2.1
└── jwt-decode@4.0.0
```

### Step 2: Configure Tailwind for Dark Mode

**File**: `frontend/tailwind.config.ts`

Verify or add dark mode configuration:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // ← Ensure this line exists
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // shadcn/ui theme configuration (already present)
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

**Validation**:
```bash
# Check if darkMode is set to 'class'
grep -n "darkMode" frontend/tailwind.config.ts
```

### Step 3: Verify shadcn/ui Theme Configuration

**File**: `frontend/src/app/globals.css`

Ensure CSS variables for dark mode exist:

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

**Validation**:
```bash
# Check if .dark class exists
grep -n "\.dark" frontend/src/app/globals.css
```

---

## Implementation Steps

### Phase 1: Theme System Setup

#### 1.1 Add ThemeProvider to Root Layout

**File**: `frontend/src/app/layout.tsx`

```typescript
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

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
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Test**:
```bash
npm run dev
# Open browser console
localStorage.setItem('todo-theme', 'dark')
# Refresh page - should apply dark theme
```

#### 1.2 Create ThemeToggle Component

**File**: `frontend/src/components/layout/ThemeToggle.tsx`

```typescript
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
```

**Test**:
```bash
# Import and render ThemeToggle in Header
# Click button - theme should toggle instantly
```

### Phase 2: Session Consistency Fix

#### 2.1 Update Auth Functions with Cache Clearing

**File**: `frontend/src/lib/auth.ts`

Add cache clearing to signout:

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useSignout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return async () => {
    // CRITICAL: Clear ALL cache to prevent data leakage
    queryClient.clear()

    // Remove JWT token
    localStorage.removeItem('token')

    // Redirect to signin
    router.push('/signin')
  }
}
```

**Test**:
```bash
# 1. Sign in as user A, create tasks
# 2. Open browser console: queryClient.getQueryData(['tasks'])
# 3. Sign out
# 4. Check console: queryClient.getQueryData(['tasks']) should be undefined
```

### Phase 3: Dynamic Header Implementation

#### 3.1 Add JWT Decode Utility

**File**: `frontend/src/lib/auth.ts`

```typescript
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  user_id: string
  email: string
  exp: number
  iat: number
}

export function getUserEmailFromToken(token: string | null): string {
  if (!token) return 'User'

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.email || 'User'
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return 'User'
  }
}
```

**Test**:
```bash
# In browser console after signin:
const token = localStorage.getItem('token')
console.log(getUserEmailFromToken(token))
# Should output: "user@example.com"
```

#### 3.2 Update Protected Layout

**File**: `frontend/src/app/(protected)/layout.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getUserEmailFromToken } from '@/lib/auth'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('User')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    const email = getUserEmailFromToken(token)
    setUserEmail(email)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header userEmail={userEmail} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

**Test**:
```bash
# Sign in with email "test@example.com"
# Check header - should display "test@example.com"
```

#### 3.3 Update Header Component

**File**: `frontend/src/components/layout/Header.tsx`

```typescript
'use client'

import { ThemeToggle } from './ThemeToggle'
import { useSignout } from '@/lib/auth'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  userEmail: string
}

export function Header({ userEmail }: HeaderProps) {
  const signout = useSignout()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todo App</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {userEmail}
          </span>
          <ThemeToggle />
          <Button variant="outline" onClick={signout}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
```

**Test**:
```bash
# Verify header shows actual user email
# Verify theme toggle works
# Verify sign out clears cache and redirects
```

### Phase 4: Footer Implementation

#### 4.1 Create Footer Component

**File**: `frontend/src/components/layout/Footer.tsx`

```typescript
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

**Test**:
```bash
# Navigate to any page
# Scroll to bottom - footer should be visible
# Toggle theme - footer colors should adapt
```

#### 4.2 Add Footer to Auth Layout

**File**: `frontend/src/app/(auth)/layout.tsx`

```typescript
import { Footer } from '@/components/layout/Footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

---

## Testing Scenarios

### Test 1: Session Consistency (P1 - Critical)

**Objective**: Verify no cross-user data leakage

**Steps**:
1. Sign in as `alice@example.com`, password: `password123`
2. Create 3 tasks: "Alice Task 1", "Alice Task 2", "Alice Task 3"
3. Verify tasks appear in dashboard
4. Open browser console: `queryClient.getQueryData(['tasks'])`
5. Verify 3 tasks in cache
6. Click "Sign Out"
7. Verify redirect to signin page
8. In console: `queryClient.getQueryData(['tasks'])`
9. **Expected**: `undefined` (cache cleared)
10. Sign in as `bob@example.com`, password: `password123`
11. Navigate to dashboard
12. **Expected**: Empty task list (no Alice tasks visible)
13. Create 1 task: "Bob Task 1"
14. Verify only Bob's task visible
15. Sign out and sign in as Alice again
16. **Expected**: See only Alice's 3 tasks (no Bob tasks)

**Success Criteria**: ✅ 0% cross-contamination between users

### Test 2: Dynamic Header (P2)

**Objective**: Verify header displays actual user email

**Steps**:
1. Sign in as `alice@example.com`
2. Check header - should display "alice@example.com"
3. Sign out
4. Sign in as `bob@example.com`
5. Check header - should display "bob@example.com"
6. Manually corrupt token in localStorage: `localStorage.setItem('token', 'invalid')`
7. Refresh page
8. **Expected**: Header displays "User" (fallback)

**Success Criteria**: ✅ Correct email displayed, fallback works

### Test 3: Theme Switcher (P3)

**Objective**: Verify theme switching and persistence

**Steps**:
1. Open application (default light theme)
2. Click theme toggle button in header
3. **Expected**: Entire app switches to dark mode instantly (<100ms)
4. Verify all components use dark theme:
   - Header background
   - Task cards
   - Buttons
   - Input fields
   - Modals
5. Check localStorage: `localStorage.getItem('todo-theme')`
6. **Expected**: `"dark"`
7. Refresh page
8. **Expected**: Dark theme persists
9. Navigate to signin page
10. **Expected**: Dark theme consistent
11. Toggle back to light theme
12. **Expected**: All components switch to light theme

**Success Criteria**: ✅ Theme switches instantly, persists across sessions

### Test 4: Footer (P4)

**Objective**: Verify footer visibility and styling

**Steps**:
1. Navigate to signin page
2. Scroll to bottom
3. **Expected**: Footer visible with copyright and attribution
4. Navigate to dashboard
5. Scroll to bottom
6. **Expected**: Footer visible
7. Toggle theme to dark
8. **Expected**: Footer text color adapts to dark theme
9. Resize browser to mobile width (375px)
10. **Expected**: Footer remains readable and properly formatted

**Success Criteria**: ✅ Footer visible on all pages, responsive, theme-aware

### Test 5: Keyboard Accessibility

**Objective**: Verify keyboard navigation works

**Steps**:
1. Open dashboard
2. Press `Tab` repeatedly
3. **Expected**: Focus moves through interactive elements
4. Focus on theme toggle button
5. Press `Enter`
6. **Expected**: Theme toggles
7. Press `Tab` to sign out button
8. Press `Enter`
9. **Expected**: Sign out and redirect

**Success Criteria**: ✅ All interactive elements keyboard accessible

---

## Validation Checklist

### Functional Requirements

- [ ] **FR-001**: React Query cache cleared on sign-out
- [ ] **FR-002**: React Query cache cleared on sign-in
- [ ] **FR-003**: User email extracted from JWT and displayed in header
- [ ] **FR-004**: Theme toggle button accessible from header
- [ ] **FR-005**: Theme preference persists in localStorage
- [ ] **FR-006**: Theme applied consistently across all pages
- [ ] **FR-007**: Footer displayed on all pages
- [ ] **FR-008**: Footer responsive on mobile/desktop
- [ ] **FR-009**: JWT decoded client-side (no extra API calls)
- [ ] **FR-010**: Theme switching without page reload
- [ ] **FR-011**: Cached queries invalidated on auth state change
- [ ] **FR-012**: shadcn/ui theming system used

### Success Criteria

- [ ] **SC-001**: 0% cross-contamination between user sessions
- [ ] **SC-002**: Header displays email within 200ms
- [ ] **SC-003**: Theme toggle completes within 100ms
- [ ] **SC-004**: Theme persists after browser restart
- [ ] **SC-005**: Footer visible on all pages (mobile/desktop)
- [ ] **SC-006**: Cache cleared on sign-out (verified in console)
- [ ] **SC-007**: All shadcn/ui components reflect current theme
- [ ] **SC-008**: Theme toggle accessible via keyboard (Tab + Enter)
- [ ] **SC-009**: 0 extra API calls for user email (check Network tab)
- [ ] **SC-010**: Application defaults to light theme on first visit

---

## Troubleshooting

### Issue: Theme not persisting after refresh

**Cause**: localStorage not accessible or next-themes not configured correctly

**Solution**:
```bash
# Check localStorage in browser console
localStorage.getItem('todo-theme')

# Verify ThemeProvider configuration
# Ensure storageKey="todo-theme" is set
# Ensure suppressHydrationWarning on <html> element
```

### Issue: Header shows "User" instead of email

**Cause**: JWT token malformed or missing email field

**Solution**:
```bash
# Check token in console
const token = localStorage.getItem('token')
console.log(token)

# Try decoding manually
import { jwtDecode } from 'jwt-decode'
console.log(jwtDecode(token))

# Verify backend includes email in JWT payload
```

### Issue: Tasks from previous user still visible

**Cause**: React Query cache not cleared on sign-out

**Solution**:
```bash
# Verify cache clearing in signout function
# Add console.log to confirm execution
queryClient.clear()
console.log('Cache cleared')

# Check cache after signout
queryClient.getQueryData(['tasks']) // Should be undefined
```

### Issue: Theme flickering on page load

**Cause**: Missing suppressHydrationWarning or SSR mismatch

**Solution**:
```typescript
// Ensure suppressHydrationWarning on html element
<html lang="en" suppressHydrationWarning>

// Verify ThemeProvider wraps entire app
<ThemeProvider attribute="class" defaultTheme="light">
  {children}
</ThemeProvider>
```

---

## Performance Validation

### Theme Switching Performance

```bash
# Measure theme toggle time in browser console
console.time('theme-toggle')
setTheme('dark')
console.timeEnd('theme-toggle')
# Expected: < 100ms
```

### Header Email Display Performance

```bash
# Measure time from page load to email display
# Use browser DevTools Performance tab
# Expected: < 200ms
```

### Cache Clearing Performance

```bash
# Measure cache clear time
console.time('cache-clear')
queryClient.clear()
console.timeEnd('cache-clear')
# Expected: < 50ms
```

---

## Deployment Checklist

- [ ] All dependencies installed (`next-themes`, `jwt-decode`)
- [ ] Tailwind configured for dark mode (`darkMode: ['class']`)
- [ ] ThemeProvider added to root layout
- [ ] Cache clearing added to signout function
- [ ] JWT decoding utility created
- [ ] Header updated with dynamic email and theme toggle
- [ ] Footer created and added to layouts
- [ ] All tests passed (session isolation, theme switching, etc.)
- [ ] Manual testing completed on multiple browsers
- [ ] Mobile responsive testing completed
- [ ] Accessibility testing completed (keyboard navigation)
- [ ] Production build successful (`npm run build`)

---

## Next Steps

After completing this quickstart:

1. ✅ Verify all tests pass
2. ✅ Complete validation checklist
3. ⏳ Run `/sp.tasks` to generate implementation tasks
4. ⏳ Run `/sp.implement` to execute tasks
5. ⏳ Create PR for review
6. ⏳ Deploy to production

---

## Support

For issues or questions:
- Review specification: `specs/004-ui-ux-enhancement/spec.md`
- Review plan: `specs/004-ui-ux-enhancement/plan.md`
- Review contracts: `specs/004-ui-ux-enhancement/contracts/`
- Check troubleshooting section above
