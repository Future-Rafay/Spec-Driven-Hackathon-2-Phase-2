# Feature Specification: UI/UX Enhancement & Session Consistency Improvements

**Feature Branch**: `004-ui-ux-enhancement`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Introduce theme switcher (dark/light mode), upgrade header with dynamic authenticated user data, fix task isolation to ensure tasks belong only to current authenticated user without requiring refresh, and add footer with branding"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Session Consistency & Task Isolation (Priority: P1) 🎯 MVP

Users need to see only their own tasks immediately after authentication, without stale data from previous sessions appearing in their task list.

**Why this priority**: This is a critical data isolation bug. Users currently may see tasks from previously authenticated users until they manually refresh the page. This violates data privacy and creates confusion about task ownership.

**Independent Test**: Sign in as User A, create tasks, sign out. Sign in as User B - verify User B sees empty task list (or only their tasks) without manual refresh. Sign out and sign in as User A again - verify User A sees only their tasks without refresh.

**Acceptance Scenarios**:

1. **Given** User A is signed in with tasks, **When** User A signs out and User B signs in, **Then** User B sees only their own tasks (or empty list) without manual page refresh
2. **Given** User is on dashboard viewing tasks, **When** JWT token expires, **Then** user is redirected to signin page and upon re-authentication sees fresh task data
3. **Given** User signs in successfully, **When** dashboard loads, **Then** React Query cache is cleared and fresh tasks are fetched for the authenticated user
4. **Given** Multiple users use the same browser, **When** each user signs in, **Then** each user sees only their own tasks without cross-contamination

---

### User Story 2 - Dynamic Header with Authenticated User Data (Priority: P2)

Users want to see their actual email address in the header instead of a hardcoded placeholder, confirming their authenticated identity.

**Why this priority**: Currently the header shows hardcoded email "user@example.com" which doesn't reflect the actual authenticated user. This creates confusion about which account is logged in and looks unprofessional.

**Independent Test**: Sign in with email "alice@example.com", verify header displays "alice@example.com". Sign out, sign in with "bob@example.com", verify header displays "bob@example.com".

**Acceptance Scenarios**:

1. **Given** User signs in with email "alice@example.com", **When** dashboard loads, **Then** header displays "alice@example.com" in user menu
2. **Given** User is authenticated, **When** viewing any protected page, **Then** header consistently shows the authenticated user's email
3. **Given** User's session is active, **When** user navigates between pages, **Then** header continues to display correct user email without flickering
4. **Given** JWT token contains user email, **When** header component renders, **Then** email is extracted from token and displayed

---

### User Story 3 - Theme Switcher (Dark/Light Mode) (Priority: P3)

Users want to toggle between dark and light themes to match their preference and reduce eye strain in different lighting conditions.

**Why this priority**: Theme switching improves accessibility and user comfort. Many users prefer dark mode for reduced eye strain, especially during extended use or in low-light environments.

**Independent Test**: Click theme toggle button in header, verify entire application switches from light to dark mode (or vice versa). Refresh page, verify theme preference persists. Test all pages (signin, signup, dashboard) to ensure consistent theming.

**Acceptance Scenarios**:

1. **Given** User is on light mode, **When** user clicks theme toggle button, **Then** entire application switches to dark mode with appropriate color scheme
2. **Given** User has selected dark mode, **When** user refreshes the page, **Then** dark mode preference persists via localStorage
3. **Given** User is on any page (auth or protected), **When** theme is toggled, **Then** all components (header, forms, buttons, task cards) reflect the new theme
4. **Given** User switches theme, **When** navigating between pages, **Then** theme remains consistent across all routes
5. **Given** User has no theme preference set, **When** application loads, **Then** system defaults to light mode (or respects system preference)

---

### User Story 4 - Footer with Branding (Priority: P4)

Users see a professional footer with copyright information and creator attribution on all pages.

**Why this priority**: Footer adds professional polish and branding to the application. While not critical for functionality, it completes the UI and provides proper attribution.

**Independent Test**: Navigate to any page (signin, signup, dashboard), scroll to bottom, verify footer displays "© 2026 Todo App" and "Made with love by Abdul Rafay".

**Acceptance Scenarios**:

1. **Given** User is on any page, **When** user scrolls to bottom, **Then** footer displays copyright "© 2026 Todo App"
2. **Given** User is on any page, **When** viewing footer, **Then** footer displays "Made with love by Abdul Rafay"
3. **Given** User is on mobile device, **When** viewing footer, **Then** footer is responsive and properly formatted
4. **Given** User switches between light and dark themes, **When** viewing footer, **Then** footer colors adapt to current theme

---

### Edge Cases

- What happens when JWT token is malformed or missing user email? (Header should show fallback or "User")
- What happens when user toggles theme rapidly multiple times? (Should debounce or handle gracefully)
- What happens when localStorage is disabled/unavailable for theme persistence? (Should fall back to default theme)
- What happens when user signs out while on dashboard with tasks loaded? (Should clear React Query cache immediately)
- What happens when two browser tabs are open with different users? (Each tab should maintain independent session state)
- What happens when theme toggle is clicked during page transition? (Should queue theme change or apply immediately)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST clear React Query cache on user sign-out to prevent task data leakage between sessions
- **FR-002**: System MUST clear React Query cache on user sign-in to ensure fresh task data is fetched for the authenticated user
- **FR-003**: System MUST extract and display authenticated user's email from JWT token in header component
- **FR-004**: System MUST provide a theme toggle button accessible from the header on all pages
- **FR-005**: System MUST persist theme preference in browser localStorage
- **FR-006**: System MUST apply theme consistently across all pages (auth pages, protected pages, components)
- **FR-007**: System MUST display footer on all pages with copyright and creator attribution
- **FR-008**: System MUST ensure footer is responsive and adapts to mobile/desktop layouts
- **FR-009**: System MUST decode JWT token to extract user email without making additional API calls
- **FR-010**: System MUST handle theme switching without page reload or flickering
- **FR-011**: System MUST invalidate all cached queries when user authentication state changes
- **FR-012**: System MUST use shadcn/ui theming system for dark/light mode implementation

### Non-Functional Requirements

- **NFR-001**: Theme switching MUST complete within 100ms for smooth user experience
- **NFR-002**: Theme preference MUST persist across browser sessions via localStorage
- **NFR-003**: Header MUST display user email within 200ms of page load
- **NFR-004**: Cache invalidation MUST complete before redirecting user after sign-out
- **NFR-005**: All UI components MUST be accessible with proper ARIA labels for theme toggle
- **NFR-006**: Footer MUST be visible on all screen sizes without horizontal scrolling

### Key Entities *(include if feature involves data)*

- **Theme Preference**: User's selected theme (light/dark), stored in localStorage, applied globally
- **User Session**: JWT token containing user email and ID, decoded client-side for header display
- **Query Cache**: React Query cache containing task data, must be cleared on auth state changes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can sign out and sign in as different user without seeing previous user's tasks (0% cross-contamination)
- **SC-002**: Header displays correct authenticated user email within 200ms of page load on all protected pages
- **SC-003**: Theme toggle switches entire application theme within 100ms with no visual flickering
- **SC-004**: Theme preference persists across browser sessions (100% persistence rate)
- **SC-005**: Footer is visible and properly formatted on all pages (signin, signup, dashboard) on mobile and desktop
- **SC-006**: React Query cache is cleared on sign-out, verified by checking no stale tasks appear for next user
- **SC-007**: All shadcn/ui components (buttons, inputs, cards, dialogs) properly reflect current theme
- **SC-008**: Theme toggle button is accessible via keyboard navigation (Tab + Enter)
- **SC-009**: JWT token decoding for user email succeeds without additional API calls (0 extra requests)
- **SC-010**: Application defaults to light theme on first visit, then respects user's saved preference

### User Experience Goals

- Users feel confident their data is private and isolated from other users
- Users can immediately identify which account they're logged into
- Users can customize their visual experience with theme preferences
- Application feels polished and professional with consistent branding

## Technical Constraints

- **TC-001**: Must use existing JWT authentication system (no changes to backend)
- **TC-002**: Must use shadcn/ui theming system (next-themes provider)
- **TC-003**: Must use existing React Query setup for cache management
- **TC-004**: Must decode JWT client-side using jwt-decode library (no backend changes)
- **TC-005**: Must maintain backward compatibility with existing components
- **TC-006**: Must not introduce new external dependencies beyond jwt-decode and next-themes

## Out of Scope

- User profile page with editable user information
- Multiple theme options beyond light/dark (e.g., custom colors, high contrast)
- Server-side theme preference storage
- Theme preview before applying
- Animated theme transitions beyond basic fade
- Footer navigation links or social media icons
- User avatar/profile picture in header
- Backend API changes for user data retrieval

## Dependencies

- Existing JWT authentication system (feature 001-auth-layer)
- Existing React Query setup (feature 003-todo-frontend)
- Existing shadcn/ui component library (feature 003-todo-frontend)
- JWT token must contain user email in payload
- localStorage must be available in browser

## Risks & Mitigations

**Risk 1**: JWT token might not contain user email in expected format
- **Mitigation**: Decode token and verify structure, provide fallback display ("User") if email missing

**Risk 2**: React Query cache clearing might not work correctly, causing stale data
- **Mitigation**: Test cache invalidation thoroughly, use queryClient.clear() on sign-out

**Risk 3**: Theme switching might cause layout shift or flickering
- **Mitigation**: Use next-themes with suppressHydrationWarning, apply theme class to root element

**Risk 4**: localStorage might be disabled in some browsers (privacy mode)
- **Mitigation**: Wrap localStorage access in try-catch, fall back to session-only theme

## Open Questions

None - all requirements are clear and well-defined based on existing implementation.
