# Feature Specification: Auth Flow, Error Feedback & UI Corrections

**Feature Branch**: `006-auth-ui-fixes`
**Created**: 2026-02-09
**Status**: Draft
**Input**: User description: "Auth Flow, Hydration, Error Feedback & Task UI Corrections"

## User Scenarios & Testing

### User Story 1 - Authentication Error Feedback (Priority: P1) 🎯 MVP

When a user attempts to sign in with incorrect credentials, the system should display a clear, specific error message and remain on the signin page. The user should never see a flash of the dashboard or experience a premature redirect before authentication is confirmed.

**Why this priority**: This is a critical usability and security issue. Users currently experience confusing behavior where they might briefly see the dashboard before being redirected back to signin, or they don't receive clear feedback about why their signin failed. This creates a poor user experience and makes it difficult to troubleshoot authentication issues.

**Independent Test**: Attempt to sign in with an incorrect password. Verify that a clear error message appears (e.g., "Invalid email or password"), the user remains on the signin page, and no dashboard content is visible at any point.

**Acceptance Scenarios**:

1. **Given** user is on signin page, **When** user enters valid email but wrong password, **Then** error message "Invalid email or password" is displayed and user remains on signin page
2. **Given** user is on signin page, **When** user enters non-existent email, **Then** error message "Invalid email or password" is displayed (same message for security)
3. **Given** user is on signin page with invalid credentials, **When** signin fails, **Then** no dashboard content is visible at any point during the process
4. **Given** user successfully signs in, **When** authentication completes, **Then** redirect to dashboard only occurs after token/session is confirmed
5. **Given** user has stale session from previous user, **When** new user signs in, **Then** previous user's session data is completely cleared

---

### User Story 2 - Accurate Task Timestamps (Priority: P2)

When a user views their tasks, the system should display accurate timestamps from the database for when tasks were created, updated, and completed. Users should see exact formatted dates and times instead of hardcoded placeholder text.

**Why this priority**: Users need accurate temporal information to track their task history and understand when work was done. Hardcoded timestamps like "Created about 5 hours ago" are misleading and prevent users from understanding the actual timeline of their tasks.

**Independent Test**: Create a task, complete it, and view the task list. Verify that the displayed timestamps match the actual database values for created_at, updated_at, and completed_at fields, formatted in a readable way (e.g., "Jan 15, 2026 at 2:30 PM").

**Acceptance Scenarios**:

1. **Given** user creates a new task, **When** viewing the task, **Then** "Created" timestamp shows the actual database created_at value formatted as readable date/time
2. **Given** user updates a task, **When** viewing the task, **Then** "Updated" timestamp shows the actual database updated_at value
3. **Given** user completes a task, **When** viewing the task, **Then** "Completed" timestamp shows the actual database completed_at value
4. **Given** task has no completion date, **When** viewing the task, **Then** "Completed" field shows "Not completed" or is hidden
5. **Given** multiple tasks with different timestamps, **When** viewing task list, **Then** all timestamps are accurate and consistently formatted

---

### User Story 3 - Responsive Delete Modal (Priority: P3)

When a user attempts to delete a task, the delete confirmation modal should display properly on all screen sizes, with long task titles/descriptions scrolling within the modal without overflowing or breaking the layout.

**Why this priority**: The current delete modal has layout issues where long task content overflows on mobile and desktop, making it difficult or impossible to read the full task details or access the delete/cancel buttons. This creates a poor user experience and may lead to accidental deletions.

**Independent Test**: Create a task with a very long title (200+ characters) and long description. Attempt to delete it on both mobile and desktop viewports. Verify that the modal stays within the viewport, content scrolls properly, and all buttons remain accessible.

**Acceptance Scenarios**:

1. **Given** user attempts to delete task with long title, **When** delete modal opens, **Then** modal stays within viewport and title scrolls with overflow-y-auto
2. **Given** user attempts to delete task on mobile device, **When** delete modal opens, **Then** modal is fully visible and buttons are accessible
3. **Given** delete modal is open, **When** user scrolls within modal, **Then** content scrolls smoothly without breaking layout
4. **Given** delete modal layout, **When** compared to edit modal, **Then** both modals have consistent styling and layout patterns
5. **Given** user opens delete modal, **When** modal displays, **Then** modal height never exceeds viewport height

---

### User Story 4 - Signin/Signup Visual Differentiation (Priority: P4)

When a user navigates between signin and signup pages, each page should have distinct visual identity through different headings, accent colors, and visual elements. Users should immediately recognize which page they are on without reading the URL.

**Why this priority**: Users currently find it difficult to distinguish between signin and signup pages, leading to confusion and potential errors (e.g., trying to sign up when they meant to sign in). Clear visual differentiation improves usability and reduces user errors.

**Independent Test**: Navigate to signin page, then to signup page. Verify that each page has distinct visual elements (different heading text, different accent colors, different illustrations or icons) that make it immediately clear which page you're on.

**Acceptance Scenarios**:

1. **Given** user is on signin page, **When** viewing the page, **Then** heading clearly states "Sign In" or "Welcome Back" and uses primary accent color
2. **Given** user is on signup page, **When** viewing the page, **Then** heading clearly states "Sign Up" or "Create Account" and uses secondary accent color
3. **Given** user navigates between signin and signup, **When** switching pages, **Then** visual differences are immediately apparent
4. **Given** signin and signup pages, **When** comparing them, **Then** each has unique illustration or icon that reinforces page identity
5. **Given** user is on either page, **When** viewing at a glance, **Then** page identity is clear without reading URL or fine print

---

### Edge Cases

- What happens when user enters credentials while network is offline?
- How does system handle authentication timeout during signin process?
- What happens if user rapidly switches between signin and signup pages?
- How does system handle very long task titles (500+ characters) in delete modal?
- What happens if database timestamps are null or invalid?
- How does system handle hydration mismatch between server and client rendering?
- What happens if user has multiple browser tabs open with different auth states?
- How does system handle timezone differences in timestamp display?

## Requirements

### Functional Requirements

- **FR-001**: System MUST display specific error messages for failed signin attempts (wrong password, user not found)
- **FR-002**: System MUST NOT redirect user to dashboard until authentication token/session is fully confirmed
- **FR-003**: System MUST NOT display any dashboard content during failed authentication attempts
- **FR-004**: System MUST clear all previous user session data when new user signs in
- **FR-005**: System MUST display task timestamps using actual database values (created_at, updated_at, completed_at)
- **FR-006**: System MUST format timestamps in human-readable format (e.g., "Jan 15, 2026 at 2:30 PM")
- **FR-007**: Delete confirmation modal MUST stay within viewport boundaries on all screen sizes
- **FR-008**: Delete confirmation modal MUST use overflow-y-auto for scrollable content
- **FR-009**: Delete confirmation modal MUST match edit modal layout and styling patterns
- **FR-010**: Signin page MUST have distinct visual identity (heading, accent color, illustration)
- **FR-011**: Signup page MUST have distinct visual identity different from signin page
- **FR-012**: System MUST prevent SSR/client hydration mismatches in auth-dependent UI components
- **FR-013**: System MUST NOT render auth-dependent content before client session is resolved
- **FR-014**: Error messages MUST be user-friendly and actionable (no technical jargon)
- **FR-015**: System MUST handle null or missing timestamp values gracefully

### Key Entities

- **Authentication Error**: Represents failed signin attempt with specific error type (wrong password, user not found, network error)
- **Task Timestamp**: Represents temporal data for task lifecycle (created_at, updated_at, completed_at)
- **Modal State**: Represents delete confirmation modal display state and content overflow handling
- **Page Identity**: Represents visual differentiation elements for signin vs signup pages

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of failed signin attempts display clear error message without dashboard flash
- **SC-002**: 100% of successful signins redirect to dashboard only after token/session confirmed
- **SC-003**: All task timestamps display actual database values with 100% accuracy
- **SC-004**: Delete modal remains within viewport on 100% of screen sizes (mobile, tablet, desktop)
- **SC-005**: Users can distinguish between signin and signup pages within 2 seconds without reading URL
- **SC-006**: Zero hydration mismatch errors in browser console during auth flows
- **SC-007**: Previous user session data is cleared in 100% of new signin scenarios
- **SC-008**: Delete modal content scrolls properly for tasks with 500+ character titles
- **SC-009**: Timestamp formatting is consistent across all task views (list, detail, modal)
- **SC-010**: Error messages are displayed within 500ms of failed signin attempt

## Assumptions

- Users expect immediate feedback when authentication fails
- Timestamp display should use user's local timezone
- Delete modal should follow same design patterns as edit modal for consistency
- Visual differentiation between signin/signup improves usability more than subtle differences
- Hydration errors are primarily caused by auth-dependent rendering before client session resolves
- Database timestamps are stored in UTC format
- Users prefer absolute timestamps (e.g., "Jan 15, 2026") over relative timestamps (e.g., "5 hours ago") for task history
- Modal overflow issues are primarily caused by long task titles/descriptions, not other content

## Constraints

- Solution must work within existing authentication system (no backend auth changes)
- Timestamp formatting must work across all major browsers
- Modal fixes must not break existing modal functionality
- Visual differentiation must maintain existing brand guidelines and color palette
- Changes must not introduce new hydration errors
- Performance impact must be minimal (< 50ms additional render time)

## Out of Scope

- Complete redesign of signin/signup pages
- Adding new authentication methods (OAuth, SSO, etc.)
- Changing timestamp storage format in database
- Adding relative timestamp display (e.g., "5 hours ago")
- Implementing toast notifications for errors
- Adding password strength indicator
- Implementing "remember me" functionality
- Adding email verification flow
- Implementing rate limiting for failed signin attempts
- Adding CAPTCHA for security
- Implementing session timeout warnings
- Adding multi-factor authentication
