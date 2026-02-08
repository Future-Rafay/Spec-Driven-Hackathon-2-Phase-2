# Implementation Plan: UI/UX Enhancement & Session Consistency Improvements

**Branch**: `004-ui-ux-enhancement` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-ui-ux-enhancement/spec.md`

## Summary

Upgrade the existing Todo frontend application with a comprehensive UI/UX enhancement that addresses critical session consistency issues, implements dark/light theme switching, displays dynamic authenticated user data in the header, and adds professional branding with a footer. The primary requirement is fixing the data isolation bug (P1) where tasks from previous user sessions persist in React Query cache, causing privacy violations. Secondary enhancements include theme system integration using next-themes and shadcn/ui, JWT token decoding for dynamic header display, and a responsive footer component.

**Technical Approach**: Frontend-only changes leveraging existing Next.js 16 App Router, React Query, and shadcn/ui infrastructure. No backend modifications required. Implementation focuses on React Query cache management, JWT client-side decoding, next-themes provider integration, and global layout component updates.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16 (App Router)
**Primary Dependencies**:
- Existing: React 19, React Query (@tanstack/react-query), shadcn/ui components, Tailwind CSS 4
- New: next-themes (theme provider), jwt-decode (token parsing)

**Storage**:
- localStorage for theme preference persistence
- React Query cache for task data (requires clearing on auth state changes)
- JWT tokens in localStorage (existing auth system)

**Testing**: Manual testing across multiple user sessions, theme switching, and responsive layouts
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) - Desktop and Mobile
**Project Type**: Web application (frontend only - no backend changes)

**Performance Goals**:
- Theme switching: <100ms for instant visual feedback
- Header user email display: <200ms after page load
- Cache invalidation: Complete before redirect on sign-out
- No visual flickering during theme transitions

**Constraints**:
- MUST NOT modify backend API or authentication system
- MUST use existing JWT authentication (no additional API calls for user data)
- MUST maintain backward compatibility with existing components
- MUST use shadcn/ui theming system (next-themes provider)
- MUST decode JWT client-side only
- MUST clear React Query cache on auth state changes

**Scale/Scope**:
- Single frontend application with ~10 pages/routes
- 4 user stories (P1-P4) with independent implementation paths
- ~15-20 component modifications/additions
- Global layout changes affecting all routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Spec-Driven Development First
- **Status**: PASS
- **Evidence**: Complete specification exists at `specs/004-ui-ux-enhancement/spec.md` with 4 prioritized user stories, 12 functional requirements, 10 success criteria
- **Compliance**: Following strict workflow: spec → plan → tasks → implementation

### ✅ II. Security-by-Design
- **Status**: PASS
- **Evidence**:
  - P1 (Session Consistency) explicitly addresses data isolation bug
  - JWT token decoding client-side maintains existing security model
  - No changes to backend authentication or authorization
  - React Query cache clearing prevents cross-user data leakage
- **Compliance**: Enhances security by fixing data isolation issue; no security regressions

### ✅ III. Deterministic & Reproducible
- **Status**: PASS
- **Evidence**:
  - Theme preference stored in localStorage (deterministic)
  - JWT decoding uses standard jwt-decode library (deterministic)
  - React Query cache management follows documented patterns
  - No hardcoded secrets or configuration
- **Compliance**: All changes are reproducible from specification and plan

### ✅ IV. Separation of Concerns
- **Status**: PASS
- **Evidence**:
  - Frontend-only changes; no backend modifications
  - Clear separation: Theme provider (global), Header (layout), Footer (layout), Cache management (hooks)
  - JWT decoding isolated to utility functions
  - Theme system uses standard next-themes provider pattern
- **Compliance**: Maintains clear boundaries between concerns

### ✅ V. Zero Manual Coding
- **Status**: PASS
- **Evidence**: All implementation will be generated through structured prompts following this plan
- **Compliance**: No manual coding outside Claude Code and Spec-Kit Plus

### ✅ VI. Production-Oriented Architecture
- **Status**: PASS
- **Evidence**:
  - Theme persistence via localStorage (production-ready)
  - Comprehensive error handling for JWT decoding failures
  - Fallback strategies for disabled localStorage
  - Multi-user session isolation enforced
  - Accessibility considerations (ARIA labels, keyboard navigation)
- **Compliance**: Production-grade patterns from the start

### Technology Stack Compliance

- **Frontend**: ✅ Next.js 16 App Router (existing)
- **Backend**: ✅ N/A (no backend changes)
- **ORM**: ✅ N/A (no database changes)
- **Database**: ✅ N/A (no database changes)
- **Authentication**: ✅ JWT-based (existing, no changes)
- **Spec Tooling**: ✅ Claude Code + Spec-Kit Plus

**Overall Gate Status**: ✅ PASS - All constitutional principles satisfied

---

## Constitution Check (Post-Design Re-evaluation)

*Re-evaluated after Phase 1 design completion*

### ✅ I. Spec-Driven Development First
- **Status**: PASS (Confirmed)
- **Post-Design Evidence**: Complete design artifacts generated (research.md, data-model.md, contracts/, quickstart.md)
- **Compliance**: All design decisions documented and traceable to specification

### ✅ II. Security-by-Design
- **Status**: PASS (Confirmed)
- **Post-Design Evidence**:
  - Cache clearing strategy documented and validated
  - JWT decoding with proper error handling and fallbacks
  - No security regressions introduced
  - Data isolation enforced through cache management
- **Compliance**: Security enhanced through systematic cache clearing

### ✅ III. Deterministic & Reproducible
- **Status**: PASS (Confirmed)
- **Post-Design Evidence**:
  - All implementation patterns documented in contracts
  - Clear interfaces and function signatures defined
  - Error handling strategies specified
  - Quickstart guide provides reproducible setup steps
- **Compliance**: Implementation fully reproducible from design artifacts

### ✅ IV. Separation of Concerns
- **Status**: PASS (Confirmed)
- **Post-Design Evidence**:
  - Clear component boundaries (ThemeProvider, Header, Footer, ThemeToggle)
  - Utility functions isolated (JWT decode, cache management)
  - Layout components separated from business logic
  - Theme system decoupled via provider pattern
- **Compliance**: Clean separation maintained throughout design

### ✅ V. Zero Manual Coding
- **Status**: PASS (Confirmed)
- **Post-Design Evidence**: All artifacts generated through structured workflow
- **Compliance**: Ready for automated implementation via `/sp.tasks` and `/sp.implement`

### ✅ VI. Production-Oriented Architecture
- **Status**: PASS (Confirmed)
- **Post-Design Evidence**:
  - Comprehensive error handling documented
  - Performance targets specified (<100ms theme switch, <200ms email display)
  - Accessibility requirements included (ARIA labels, keyboard navigation)
  - Fallback strategies for all failure modes
  - Testing scenarios defined in quickstart
- **Compliance**: Production-ready design with quality gates

**Post-Design Gate Status**: ✅ PASS - All constitutional principles validated after design phase

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-ux-enhancement/
├── spec.md              # Feature specification (complete)
├── spec-checklist.md    # Quality validation (complete)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (to be generated)
│   └── theme-api.md     # Theme system interface documentation
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # [MODIFY] Add ThemeProvider wrapper
│   │   ├── providers.tsx                 # [MODIFY] Add theme provider to existing providers
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                # [MODIFY] Add Footer component
│   │   │   ├── signin/page.tsx           # [VERIFY] Theme compatibility
│   │   │   └── signup/page.tsx           # [VERIFY] Theme compatibility
│   │   └── (protected)/
│   │       ├── layout.tsx                # [MODIFY] Update Header with dynamic user data, add Footer
│   │       └── dashboard/page.tsx        # [VERIFY] Theme compatibility, cache clearing
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                # [MODIFY] Add theme toggle, dynamic user email
│   │   │   ├── Footer.tsx                # [CREATE] New footer component
│   │   │   └── ThemeToggle.tsx           # [CREATE] Theme switcher button
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx              # [VERIFY] Theme compatibility
│   │   │   ├── TaskItem.tsx              # [VERIFY] Theme compatibility
│   │   │   └── [other task components]   # [VERIFY] Theme compatibility
│   │   └── ui/
│   │       └── [shadcn components]       # [VERIFY] Theme token usage
│   ├── lib/
│   │   ├── auth.ts                       # [MODIFY] Add JWT decode utility
│   │   └── theme.ts                      # [CREATE] Theme utilities and types
│   ├── hooks/
│   │   ├── useTasks.ts                   # [MODIFY] Add cache clearing on auth change
│   │   ├── useTaskMutations.ts           # [VERIFY] Cache invalidation logic
│   │   ├── useAuth.ts                    # [CREATE] Auth state hook with cache clearing
│   │   └── useTheme.ts                   # [CREATE] Theme hook wrapper (if needed)
│   └── types/
│       ├── auth.ts                       # [MODIFY] Add decoded token types
│       └── theme.ts                      # [CREATE] Theme-related types
├── package.json                          # [MODIFY] Add next-themes, jwt-decode
├── tailwind.config.ts                    # [MODIFY] Add dark mode configuration
└── components.json                       # [VERIFY] shadcn/ui theme configuration

tests/
└── manual/
    └── session-isolation-test.md         # [CREATE] Manual test scenarios for P1
```

**Structure Decision**: Web application structure (Option 2) with frontend-only modifications. No backend changes required. All modifications are within the existing `frontend/` directory, focusing on global layout components, theme system integration, and React Query cache management.

## Complexity Tracking

> **No constitutional violations - this section is not applicable**

All constitutional principles are satisfied. No complexity justification required.

## Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Environment                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js App Router                        │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Root Layout (app/layout.tsx)                    │ │ │
│  │  │  - ThemeProvider (next-themes)                   │ │ │
│  │  │  - QueryClientProvider (React Query)             │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Protected Layout ((protected)/layout.tsx)       │ │ │
│  │  │  - Header (with theme toggle + dynamic email)    │ │ │
│  │  │  - Footer (branding)                             │ │ │
│  │  │  - Auth check + cache clearing                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Dashboard Page                                  │ │ │
│  │  │  - TaskList (theme-aware)                        │ │ │
│  │  │  - Fresh data fetch on mount                     │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Client-Side Storage                       │ │
│  │  - localStorage: theme preference, JWT token          │ │
│  │  - React Query cache: task data (cleared on auth)     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP + JWT
                            ▼
                ┌───────────────────────┐
                │   FastAPI Backend     │
                │   (No changes)        │
                └───────────────────────┘
```

### Component Interaction Flow

**Theme Switching Flow**:
1. User clicks theme toggle button in Header
2. next-themes updates theme context
3. Theme class applied to root `<html>` element
4. All components re-render with new theme tokens
5. Theme preference saved to localStorage

**Session Consistency Flow**:
1. User signs out → `signout()` function called
2. Clear React Query cache: `queryClient.clear()`
3. Remove JWT token from localStorage
4. Redirect to signin page
5. User signs in as different user → JWT token stored
6. Protected layout mounts → checks auth
7. Dashboard mounts → `useTasks()` fetches fresh data
8. Only new user's tasks displayed (no stale cache)

**Dynamic Header Flow**:
1. Protected layout mounts
2. Read JWT token from localStorage
3. Decode token using jwt-decode library
4. Extract user email from token payload
5. Pass email to Header component
6. Header displays actual user email (not hardcoded)

## Critical Design Decisions

### Decision 1: Theme System Implementation

**Chosen Approach**: next-themes provider with shadcn/ui integration

**Rationale**:
- next-themes is the standard solution for Next.js App Router
- Seamless integration with shadcn/ui components
- Automatic localStorage persistence
- SSR-safe with suppressHydrationWarning
- Minimal configuration required

**Alternatives Considered**:
- Custom theme context: More code, reinventing the wheel
- CSS variables only: No persistence, manual state management
- Tailwind dark mode class: No provider, manual localStorage handling

**Implementation Pattern**:
```typescript
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Decision 2: Cache Clearing Strategy

**Chosen Approach**: Clear entire React Query cache on sign-out, invalidate on sign-in

**Rationale**:
- Guarantees no stale data from previous user
- Simple and deterministic
- Prevents all edge cases of partial cache clearing
- React Query will refetch fresh data automatically

**Alternatives Considered**:
- Selective cache invalidation: Complex, error-prone, might miss keys
- Cache key prefixing with user ID: Requires refactoring all queries
- No cache clearing: Unacceptable - violates data isolation

**Implementation Pattern**:
```typescript
// lib/auth.ts
export async function signout() {
  const queryClient = useQueryClient()

  // Clear ALL cached data
  queryClient.clear()

  // Remove JWT token
  localStorage.removeItem('token')

  // Redirect to signin
  router.push('/signin')
}
```

### Decision 3: JWT Decoding Location

**Chosen Approach**: Decode JWT in protected layout, pass email to Header as prop

**Rationale**:
- Centralized decoding logic (single source of truth)
- Header remains presentational component
- Easy to test and maintain
- No redundant decoding on every render

**Alternatives Considered**:
- Decode in Header component: Couples Header to auth logic
- Decode in custom hook: Adds unnecessary abstraction
- Fetch user data from API: Violates constraint (no backend changes)

**Implementation Pattern**:
```typescript
// app/(protected)/layout.tsx
import { jwtDecode } from 'jwt-decode'

export default function ProtectedLayout({ children }) {
  const token = localStorage.getItem('token')
  const decoded = token ? jwtDecode<{ email: string }>(token) : null
  const userEmail = decoded?.email || 'User'

  return (
    <>
      <Header userEmail={userEmail} />
      {children}
      <Footer />
    </>
  )
}
```

### Decision 4: Theme Toggle Placement

**Chosen Approach**: Theme toggle button in Header component (top-right)

**Rationale**:
- Accessible from all pages (Header is global)
- Standard UI pattern (users expect theme toggle in header)
- Visible without scrolling
- Consistent with modern web applications

**Alternatives Considered**:
- Settings page: Requires navigation, less discoverable
- Footer: Requires scrolling, less accessible
- Floating button: Intrusive, blocks content

### Decision 5: Footer Implementation

**Chosen Approach**: Global Footer component in both auth and protected layouts

**Rationale**:
- Consistent branding across all pages
- Simple implementation (no complex logic)
- Responsive design with Tailwind utilities
- Theme-aware styling

**Implementation Pattern**:
```typescript
// components/layout/Footer.tsx
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

## Data Model

**Note**: This feature does not introduce new database entities. All data structures are client-side only.

### Client-Side Data Structures

**Theme Preference** (localStorage):
```typescript
{
  "theme": "light" | "dark" | "system"
}
```

**Decoded JWT Token** (in-memory):
```typescript
interface DecodedToken {
  user_id: string
  email: string
  exp: number
  iat: number
}
```

**React Query Cache Keys** (existing, no changes):
```typescript
['tasks']           // List of all tasks for authenticated user
['task', taskId]    // Individual task by ID
```

## API Contracts

**Note**: This feature does not introduce new API endpoints. All interactions use existing backend APIs.

### Existing APIs Used

**Authentication APIs** (no changes):
- POST `/auth/signup` - Create new user account
- POST `/auth/signin` - Authenticate user, receive JWT token

**Task APIs** (no changes):
- GET `/api/tasks` - List tasks for authenticated user
- POST `/api/tasks` - Create new task
- GET `/api/tasks/{id}` - Get task by ID
- PUT `/api/tasks/{id}` - Update task
- DELETE `/api/tasks/{id}` - Delete task
- PATCH `/api/tasks/{id}/complete` - Toggle task completion

### Client-Side Interfaces

**Theme Provider Interface**:
```typescript
interface ThemeProviderProps {
  attribute?: 'class' | 'data-theme'
  defaultTheme?: 'light' | 'dark' | 'system'
  enableSystem?: boolean
  children: React.ReactNode
}
```

**Theme Hook Interface**:
```typescript
interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system' | undefined
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  systemTheme: 'light' | 'dark' | undefined
}
```

## Implementation Phases

### Phase 0: Research (Completed in this plan)

**Research Topics**:
1. ✅ next-themes integration with Next.js App Router
2. ✅ jwt-decode library usage and error handling
3. ✅ React Query cache clearing strategies
4. ✅ shadcn/ui dark mode configuration
5. ✅ localStorage fallback strategies

**Key Findings**:
- next-themes is the standard solution for Next.js theme management
- jwt-decode is lightweight and well-maintained
- React Query `queryClient.clear()` is the safest cache clearing method
- shadcn/ui components automatically support dark mode via CSS variables
- localStorage access should be wrapped in try-catch for privacy mode browsers

### Phase 1: Foundation Setup

**Tasks**:
1. Install dependencies (next-themes, jwt-decode)
2. Configure Tailwind for dark mode
3. Create theme utility types
4. Create JWT decode utility function
5. Create useAuth hook with cache clearing

**Deliverables**:
- Updated package.json
- Updated tailwind.config.ts
- New types/theme.ts
- New lib/theme.ts
- New hooks/useAuth.ts

### Phase 2: Theme System Implementation

**Tasks**:
1. Add ThemeProvider to root layout
2. Create ThemeToggle component
3. Update Header with theme toggle
4. Verify all shadcn/ui components support dark mode
5. Test theme persistence across page reloads

**Deliverables**:
- Updated app/layout.tsx
- New components/layout/ThemeToggle.tsx
- Updated components/layout/Header.tsx
- Theme system fully functional

### Phase 3: Session Consistency Fix

**Tasks**:
1. Update signout function to clear React Query cache
2. Update signin flow to invalidate cache
3. Update protected layout to check auth state
4. Test multi-user session isolation
5. Verify no stale data appears

**Deliverables**:
- Updated lib/auth.ts
- Updated app/(protected)/layout.tsx
- Session isolation bug fixed

### Phase 4: Dynamic Header Implementation

**Tasks**:
1. Add JWT decode logic to protected layout
2. Update Header component to accept userEmail prop
3. Add fallback for missing/invalid email
4. Test with multiple user accounts
5. Verify email displays correctly

**Deliverables**:
- Updated app/(protected)/layout.tsx
- Updated components/layout/Header.tsx
- Dynamic user email working

### Phase 5: Footer Implementation

**Tasks**:
1. Create Footer component
2. Add Footer to auth layout
3. Add Footer to protected layout
4. Ensure responsive styling
5. Verify theme compatibility

**Deliverables**:
- New components/layout/Footer.tsx
- Updated app/(auth)/layout.tsx
- Updated app/(protected)/layout.tsx
- Footer visible on all pages

### Phase 6: Visual Polish & Testing

**Tasks**:
1. Review all components for theme compatibility
2. Test theme switching on all pages
3. Test session isolation with multiple users
4. Test responsive layouts on mobile
5. Verify accessibility (keyboard navigation, ARIA labels)

**Deliverables**:
- All components theme-compatible
- Manual test results documented
- Accessibility verified

## Verification Strategy

### Manual Test Scenarios

**P1: Session Consistency**
1. Sign in as User A, create tasks
2. Sign out (verify cache cleared)
3. Sign in as User B
4. Verify User B sees empty task list (no User A tasks)
5. Sign out and sign in as User A again
6. Verify User A sees only their tasks

**P2: Dynamic Header**
1. Sign in with email "alice@example.com"
2. Verify header displays "alice@example.com"
3. Sign out and sign in with "bob@example.com"
4. Verify header displays "bob@example.com"

**P3: Theme Switcher**
1. Click theme toggle in header
2. Verify entire app switches to dark mode
3. Refresh page
4. Verify dark mode persists
5. Navigate to different pages
6. Verify theme remains consistent

**P4: Footer**
1. Navigate to signin page
2. Scroll to bottom, verify footer visible
3. Navigate to dashboard
4. Scroll to bottom, verify footer visible
5. Toggle theme
6. Verify footer colors adapt

### Success Criteria Validation

- **SC-001**: Multi-user session test (0% cross-contamination)
- **SC-002**: Measure header email display time (<200ms)
- **SC-003**: Measure theme toggle time (<100ms)
- **SC-004**: Verify theme persistence after browser restart
- **SC-005**: Visual inspection of footer on all pages
- **SC-006**: Verify React Query cache cleared on sign-out
- **SC-007**: Visual inspection of all shadcn/ui components in both themes
- **SC-008**: Keyboard navigation test (Tab + Enter on theme toggle)
- **SC-009**: Network tab inspection (0 extra API calls for user email)
- **SC-010**: First visit test (defaults to light theme)

## Risk Mitigation

### Risk 1: JWT Token Format Issues

**Mitigation**:
- Wrap jwt-decode in try-catch block
- Provide fallback display ("User") if email missing
- Log decode errors for debugging
- Test with actual backend JWT tokens

### Risk 2: Cache Clearing Failures

**Mitigation**:
- Use `queryClient.clear()` (most reliable method)
- Test thoroughly with multiple user sessions
- Add logging to verify cache clearing
- Consider adding cache clear on mount as backup

### Risk 3: Theme Flickering

**Mitigation**:
- Use `suppressHydrationWarning` on html element
- Apply theme class to root element
- Use next-themes built-in SSR handling
- Test on slow connections

### Risk 4: localStorage Unavailable

**Mitigation**:
- Wrap localStorage access in try-catch
- Fall back to session-only theme (no persistence)
- Provide user feedback if persistence fails
- Test in private browsing mode

## Dependencies

### External Dependencies

**New Dependencies**:
- `next-themes@^0.2.1` - Theme provider for Next.js
- `jwt-decode@^4.0.0` - JWT token decoding library

**Existing Dependencies** (no changes):
- `next@^16.0.0` - Next.js framework
- `react@^19.0.0` - React library
- `@tanstack/react-query@^5.0.0` - Server state management
- `tailwindcss@^4.0.0` - Utility-first CSS framework
- `shadcn/ui` - UI component library

### Internal Dependencies

**Depends On**:
- Feature 001 (auth-layer): JWT authentication system
- Feature 003 (todo-frontend): React Query setup, shadcn/ui components, existing layouts

**Blocks**:
- None - this is an enhancement feature

## Open Questions

**None** - All technical decisions have been made and documented in this plan.

## Next Steps

1. ✅ Complete this implementation plan
2. ⏳ Generate research.md (Phase 0)
3. ⏳ Generate data-model.md (Phase 1)
4. ⏳ Generate contracts/ documentation (Phase 1)
5. ⏳ Generate quickstart.md (Phase 1)
6. ⏳ Update agent context
7. ⏳ Run `/sp.tasks` to generate actionable tasks
8. ⏳ Run `/sp.implement` to execute implementation

---

**Plan Status**: ✅ COMPLETE - Ready for Phase 0 (Research)
