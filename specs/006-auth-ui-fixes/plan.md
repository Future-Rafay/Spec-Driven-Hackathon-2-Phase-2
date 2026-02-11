# Implementation Plan: Auth Flow, Error Feedback & UI Corrections

**Branch**: `006-auth-ui-fixes` | **Date**: 2026-02-09 | **Spec**: [specs/006-auth-ui-fixes/spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-auth-ui-fixes/spec.md`

## Summary

This feature addresses critical UX issues in the authentication flow and task management UI. The primary focus is on eliminating authentication flicker/premature redirects, providing clear error feedback, displaying accurate task timestamps, fixing modal overflow issues, and adding visual differentiation between signin/signup pages. The implementation prioritizes user experience improvements without requiring backend changes.

**Technical Approach**: Frontend-only changes focusing on error handling enhancement in api-client.ts, timestamp formatting in TaskItem.tsx, modal layout fixes, and visual styling updates for auth pages. All changes maintain compatibility with existing FastAPI backend and Better Auth integration.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router)
**Primary Dependencies**: React 18+, Next.js 14+, TanStack Query, Better Auth, date-fns, Tailwind CSS
**Storage**: JWT tokens in localStorage, session state in React Context
**Testing**: Manual testing with browser DevTools, responsive testing across viewports
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) - desktop and mobile
**Project Type**: Web application (frontend + backend separation)
**Performance Goals**: < 50ms additional render time, < 500ms error display latency
**Constraints**: No backend API changes, maintain existing auth flow, no new dependencies
**Scale/Scope**: Single-page application with ~10 components affected, 4 user stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Alignment with Project Principles**:
- ✅ **User-Centric Design**: Addresses critical UX issues (auth flicker, unclear errors, inaccurate timestamps)
- ✅ **Minimal Viable Change**: Frontend-only changes, no backend modifications required
- ✅ **Type Safety**: All changes maintain TypeScript strict mode compliance
- ✅ **Error Handling**: Enhances error feedback with specific, actionable messages
- ✅ **Consistency**: Follows existing patterns (api-client error mapping, modal structure)
- ✅ **No New Complexity**: Uses existing libraries (date-fns already installed)

**Potential Concerns**:
- None identified - all changes align with existing architecture and patterns

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-ui-fixes/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── checklists/          # Generated checklists
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── signin/page.tsx          # Signin page - visual updates
│   │   │   └── signup/page.tsx          # Signup page - visual updates
│   │   └── (protected)/
│   │       └── dashboard/page.tsx       # Dashboard - no changes
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SigninForm.tsx           # Error handling improvements
│   │   │   ├── SignupForm.tsx           # Error handling improvements
│   │   │   └── AuthProvider.tsx         # Session management - review only
│   │   ├── tasks/
│   │   │   ├── TaskItem.tsx             # Timestamp formatting fixes
│   │   │   ├── TaskList.tsx             # Delete modal integration
│   │   │   └── EditTaskModal.tsx        # Reference for modal patterns
│   │   └── ui/
│   │       └── dialog.tsx               # Shadcn dialog component
│   ├── lib/
│   │   ├── api-client.ts                # Enhanced error mapping
│   │   └── auth.ts                      # Auth helpers - review only
│   ├── hooks/
│   │   └── useAuth.ts                   # Auth context hook - review only
│   └── types/
│       ├── auth.ts                      # Auth types - review only
│       └── task.ts                      # Task types - review only
└── tests/
    └── manual/                          # Manual test procedures
```

**Structure Decision**: This is a web application with frontend/backend separation. The frontend uses Next.js App Router with route groups for auth and protected pages. All changes are isolated to the frontend, maintaining the existing architecture. No new directories or major structural changes required.

## Complexity Tracking

> **No violations identified** - all changes follow existing patterns and maintain current complexity levels.

## Phase 0: Research & Discovery

### Current State Analysis

**Authentication Flow**:
- Uses JWT tokens stored in localStorage
- AuthProvider manages global auth state with loading screen
- SigninForm/SignupForm call api-client which handles token storage
- Current issue: Generic error messages, no specific feedback for different failure types
- Current issue: Potential race condition between token storage and redirect

**Task Timestamp Display**:
- TaskItem.tsx uses `formatDistanceToNow` from date-fns for relative timestamps
- Displays "Created X ago" and "Completed X ago"
- Issue: Spec requires absolute timestamps (e.g., "Jan 15, 2026 at 2:30 PM")
- Database provides: created_at, updated_at, completed_at in ISO 8601 format

**Modal Implementation**:
- EditTaskModal uses Shadcn Dialog component with DialogContent
- Current layout: No max-height constraints, no overflow handling
- Issue: Long content can overflow viewport on mobile/desktop
- Need to match EditTaskModal patterns for consistency

**Visual Differentiation**:
- Signin page: "Sign in to your account" heading, primary color
- Signup page: "Create your account" heading, primary color
- Issue: Both pages look nearly identical, no distinct visual identity

### Dependencies & Constraints

**Existing Dependencies**:
- `date-fns`: Already installed, provides formatting utilities
- `@tanstack/react-query`: Handles data fetching and caching
- `jwt-decode`: Decodes JWT tokens for user info
- `tailwindcss`: Styling framework with theme system

**Constraints**:
- Cannot modify backend API responses or error formats
- Must maintain existing auth flow (no Better Auth API changes)
- Must work with existing JWT token structure
- Performance impact must be minimal (< 50ms render time)
- No new npm dependencies allowed

### Risk Assessment

**High Risk**:
- None identified

**Medium Risk**:
- Error message mapping might not cover all backend error formats
  - Mitigation: Add fallback error messages, test with various error scenarios
- Timestamp formatting might have timezone issues
  - Mitigation: Use date-fns with proper locale/timezone handling

**Low Risk**:
- Modal overflow fixes might affect existing modal behavior
  - Mitigation: Test all modals (edit, delete) after changes
- Visual changes might not be distinct enough
  - Mitigation: Use contrasting colors and clear headings

## Phase 1: Design Decisions

### Architecture Decisions

**Decision 1: Error Handling Strategy**
- **Options Considered**:
  1. Centralized error mapping in api-client.ts (SELECTED)
  2. Component-level error handling in each form
  3. Global error boundary with toast notifications
- **Rationale**: Centralized approach in api-client.ts provides consistent error messages across all API calls, reduces duplication, and maintains single source of truth for error mapping
- **Trade-offs**: Requires updating api-client.ts for new error types, but provides better maintainability

**Decision 2: Timestamp Display Format**
- **Options Considered**:
  1. Absolute timestamps only (e.g., "Jan 15, 2026 at 2:30 PM") (SELECTED)
  2. Relative timestamps only (e.g., "5 hours ago")
  3. Hybrid approach (relative for recent, absolute for old)
- **Rationale**: Spec explicitly requires absolute timestamps for accuracy and task history tracking. Users need exact dates for planning and reference.
- **Trade-offs**: Less intuitive for recent tasks, but more accurate and consistent

**Decision 3: Modal Overflow Handling**
- **Options Considered**:
  1. max-h-[80vh] with overflow-y-auto on DialogContent (SELECTED)
  2. Fixed height with internal scrolling
  3. Dynamic height calculation with JavaScript
- **Rationale**: Tailwind utility classes provide responsive, performant solution without JavaScript overhead. 80vh ensures modal never exceeds viewport.
- **Trade-offs**: Might require scrolling for long content, but ensures accessibility

**Decision 4: Visual Differentiation Approach**
- **Options Considered**:
  1. Different accent colors + distinct headings (SELECTED)
  2. Different background images/illustrations
  3. Complete page redesign
- **Rationale**: Minimal changes using existing theme colors (primary vs secondary) with clear heading text provides immediate visual distinction without major redesign.
- **Trade-offs**: Subtle changes might not be dramatic enough, but maintains brand consistency

## Phase 2: Implementation Approach

### Implementation Strategy

**Execution Order** (dependency-based):
1. **Error Handling Enhancement** (P1 - Critical) - Update api-client.ts, SigninForm.tsx, SignupForm.tsx
2. **Timestamp Display Fixes** (P2 - High) - Update TaskItem.tsx with absolute timestamps
3. **Modal Overflow Fixes** (P3 - Medium) - Create DeleteTaskModal component
4. **Visual Differentiation** (P4 - Low) - Update signin/signup pages

### Critical Files for Implementation

**File 1: frontend/src/lib/api-client.ts** (P1 - Critical)
- Enhanced error mapping with context-aware messages
- Pass endpoint parameter to getErrorMessage() for context
- Handle validation errors, status codes, network errors

**File 2: frontend/src/components/auth/SigninForm.tsx** (P1 - Critical)
- Implement sequencing: store token → refreshAuth() → delay → redirect
- Prevent race conditions and flicker
- Display specific error messages

**File 3: frontend/src/components/auth/SignupForm.tsx** (P1 - Critical)
- Same sequencing as signin
- Enhanced error handling for duplicate email (409)

**File 4: frontend/src/components/tasks/TaskItem.tsx** (P2 - High)
- Replace formatDistanceToNow with format() from date-fns
- Format: "MMM d, yyyy 'at' h:mm a"
- Handle null timestamps gracefully

**File 5: frontend/src/components/tasks/DeleteTaskModal.tsx** (P3 - Medium) - NEW FILE
- Create modal with max-h-[80vh] and overflow-y-auto
- Match EditTaskModal pattern
- Handle long content with scrolling

**File 6: frontend/src/components/tasks/TaskList.tsx** (P3 - Medium)
- Integrate DeleteTaskModal component
- Add taskToDelete state

**File 7: frontend/src/app/(auth)/signin/page.tsx** (P4 - Low)
- Add "Welcome Back" heading
- Login icon with primary color accent

**File 8: frontend/src/app/(auth)/signup/page.tsx** (P4 - Low)
- Add "Create Your Account" heading
- User-add icon with secondary color accent

**File 9: frontend/src/components/ui/dialog.tsx** (Review Only)
- Verify className prop support for overflow handling

**File 10: frontend/src/components/auth/AuthProvider.tsx** (Review Only)
- Verify loading state management
- Ensure no premature rendering

## Phase 3: Verification Steps

### Test Suite 1: Authentication Error Feedback (P1)

- Test 1.1: Invalid password → "Invalid email or password", no redirect
- Test 1.2: Non-existent email → Same error message
- Test 1.3: Duplicate email on signup → "Account already exists" message
- Test 1.4: Successful signin → No flicker, redirect after auth confirmed
- Test 1.5: Network error → Connection error message
- Test 1.6: Session clearing → No previous user data visible

### Test Suite 2: Task Timestamps (P2)

- Test 2.1: Created timestamp displays in "MMM d, yyyy at h:mm a" format
- Test 2.2: Updated timestamp differs from created timestamp
- Test 2.3: Completed timestamp displays in green with checkmark
- Test 2.4: Null timestamps handled gracefully
- Test 2.5: Multiple tasks have consistent formatting
- Test 2.6: Timestamps display in user's local timezone

### Test Suite 3: Delete Modal Overflow (P3)

- Test 3.1: Long title (200+ chars) scrolls properly on desktop
- Test 3.2: Long description (500+ chars) scrolls with overflow-y-auto
- Test 3.3: Modal fits viewport on mobile (375px)
- Test 3.4: Modal displays properly on tablet (768px)
- Test 3.5: Consistent styling with EditTaskModal
- Test 3.6: Keyboard navigation works (Tab, Escape)

### Test Suite 4: Visual Differentiation (P4)

- Test 4.1: Signin page has "Welcome Back" heading and login icon
- Test 4.2: Signup page has "Create Your Account" heading and user-add icon
- Test 4.3: Pages are immediately distinguishable
- Test 4.4: Accessibility audit passes (Lighthouse)
- Test 4.5: Dark mode maintains visual distinction
- Test 4.6: Responsive visual identity on mobile

### Edge Case Testing

- Rapid page switching between signin/signup
- Multiple failed signin attempts
- Very long task title (1000+ characters)
- Null/invalid timestamps
- Multiple browser tabs with different auth states

## Next Steps

### Immediate Actions

1. **Review and Approval** - Confirm technical approach with stakeholders
2. **Create Task Breakdown** - Run `/sp.tasks` to generate detailed task list
3. **Set Up Environment** - Verify frontend server, dependencies, backend API access

### Implementation Workflow

- Phase 1: Error Handling (P1) - 3-4 hours
- Phase 2: Timestamp Display (P2) - 2-3 hours
- Phase 3: Modal Overflow (P3) - 2-3 hours
- Phase 4: Visual Differentiation (P4) - 1-2 hours

### Success Metrics

- ✅ 100% of failed signin attempts show clear error without dashboard flash
- ✅ 100% of task timestamps display accurate database values
- ✅ Delete modal stays within viewport on 100% of screen sizes
- ✅ Users can distinguish signin/signup pages within 2 seconds
- ✅ Zero hydration errors in browser console
- ✅ Error messages display within 500ms of failure

---

**Plan Status**: Complete and ready for task breakdown (`/sp.tasks`)

**Estimated Implementation Time**: 8-12 hours total

**Risk Level**: Low - All changes are frontend-only with clear patterns to follow
