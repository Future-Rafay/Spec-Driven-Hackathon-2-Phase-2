# Manual Testing Guide - UI/UX Enhancement Feature

**Status**: Implementation Complete (52/71 tasks) - Ready for Manual Testing
**Development Server**: http://localhost:3000
**Date**: 2026-02-08

---

## Prerequisites

1. Backend server running on http://localhost:8080
2. Frontend dev server running on http://localhost:3000
3. Two test user accounts:
   - User A: `alice@example.com` / `SecurePass123!`
   - User B: `bob@example.com` / `SecurePass123!`

---

## Phase 3: User Story 1 - Session Consistency & Task Isolation (P1 - MVP)

**Goal**: Verify that React Query cache is cleared on authentication state changes to prevent cross-user data leakage.

### T016: Test multi-user session isolation (User A → User B → User A)

**Steps**:
1. Open http://localhost:3000/signin
2. Sign in as User A (`alice@example.com`)
3. Create 2-3 tasks with distinct titles (e.g., "Alice Task 1", "Alice Task 2")
4. Click "Sign Out" button
5. Sign in as User B (`bob@example.com`)
6. **VERIFY**: Dashboard shows empty task list (no Alice tasks visible)
7. Create 1-2 tasks with distinct titles (e.g., "Bob Task 1")
8. Click "Sign Out" button
9. Sign in as User A again
10. **VERIFY**: Dashboard shows only Alice's tasks (no Bob tasks visible)

**Expected Result**: ✅ Each user sees only their own tasks without manual refresh

**Failure Indicators**:
- ❌ User B sees Alice's tasks after signin
- ❌ User A sees Bob's tasks after re-signin
- ❌ Tasks from previous session persist in UI

### T017: Verify no stale data appears in React Query cache after signout

**Steps**:
1. Sign in as User A
2. Create 3 tasks
3. Open browser DevTools → Application → Local Storage
4. Note the `auth_token` value
5. Click "Sign Out"
6. **VERIFY**: Redirected to /signin immediately
7. Check Local Storage → `auth_token` should be removed
8. Open DevTools → Console
9. Type: `window.localStorage.getItem('auth_token')`
10. **VERIFY**: Returns `null`

**Expected Result**: ✅ Token removed, no stale data in cache

### T018: Verify dashboard loads fresh data for each authenticated user

**Steps**:
1. Sign in as User A
2. Create task "Test Task A"
3. Open DevTools → Network tab
4. Click "Sign Out"
5. Sign in as User B
6. **VERIFY**: Network tab shows GET /api/tasks request
7. **VERIFY**: Response contains empty array or only User B's tasks
8. Create task "Test Task B"
9. Click "Sign Out"
10. Sign in as User A
11. **VERIFY**: Network tab shows GET /api/tasks request
12. **VERIFY**: Response contains only User A's tasks

**Expected Result**: ✅ Fresh API call on each signin, correct data isolation

---

## Phase 4: User Story 2 - Dynamic Header with Authenticated User Data (P2)

**Goal**: Verify that the header displays the actual authenticated user's email from JWT token.

### T025: Test header displays correct email for multiple user accounts

**Steps**:
1. Sign in as `alice@example.com`
2. **VERIFY**: Header displays "alice@example.com" (visible on desktop, hidden on mobile)
3. Click "Sign Out"
4. Sign in as `bob@example.com`
5. **VERIFY**: Header displays "bob@example.com"
6. Click "Sign Out"
7. Create new account `charlie@example.com` / `SecurePass123!`
8. **VERIFY**: Header displays "charlie@example.com" immediately after signup

**Expected Result**: ✅ Header shows correct email for each user

### T026: Test fallback to "User" when token is malformed

**Steps**:
1. Sign in as any user
2. Open DevTools → Application → Local Storage
3. Find `token` key
4. Change value to invalid string: `invalid.jwt.token`
5. Refresh page
6. **VERIFY**: Redirected to /signin (token expired check)
7. Sign in again
8. Open DevTools → Console
9. Manually corrupt token: `localStorage.setItem('token', 'malformed')`
10. Refresh page
11. **VERIFY**: Either redirected to /signin OR header shows "User" as fallback

**Expected Result**: ✅ Graceful handling of malformed tokens

### T027: Verify email displays within 200ms of page load

**Steps**:
1. Sign in as any user
2. Open DevTools → Network tab → Throttling → Fast 3G
3. Navigate to /dashboard
4. **VERIFY**: Email appears in header quickly (no long delay)
5. Open DevTools → Performance tab
6. Record page load
7. Stop recording
8. **VERIFY**: Email render happens within 200ms of page load

**Expected Result**: ✅ Email displays quickly without noticeable delay

---

## Phase 5: User Story 3 - Theme Switcher (Dark/Light Mode) (P3)

**Goal**: Verify theme toggle works instantly and persists across sessions.

### T036: Test theme toggle switches instantly (<100ms)

**Steps**:
1. Navigate to any page (signin, signup, or dashboard)
2. Observe current theme (light mode by default)
3. Click theme toggle button (sun/moon icon in header)
4. **VERIFY**: Entire page switches to dark mode instantly
5. **VERIFY**: All colors invert appropriately:
   - Background: white → dark
   - Text: dark → light
   - Cards: white → dark gray
   - Borders: light gray → dark gray
6. Click theme toggle again
7. **VERIFY**: Switches back to light mode instantly

**Expected Result**: ✅ Theme switches in <100ms with no flicker

### T037: Test theme preference persists after browser refresh

**Steps**:
1. Start in light mode
2. Click theme toggle to switch to dark mode
3. Refresh page (F5 or Ctrl+R)
4. **VERIFY**: Page loads in dark mode
5. Navigate to different page (e.g., /signin → /dashboard)
6. **VERIFY**: Dark mode persists across navigation
7. Close browser tab completely
8. Open new tab → http://localhost:3000
9. **VERIFY**: Dark mode still active

**Expected Result**: ✅ Theme preference stored in localStorage and persists

### T038: Test theme consistency across all routes

**Steps**:
1. Switch to dark mode
2. Navigate to /signin
3. **VERIFY**: Dark mode active on signin page
4. Navigate to /signup
5. **VERIFY**: Dark mode active on signup page
6. Sign in and navigate to /dashboard
7. **VERIFY**: Dark mode active on dashboard
8. Create a task (open modal)
9. **VERIFY**: Modal uses dark mode colors
10. Edit a task (open modal)
11. **VERIFY**: Edit modal uses dark mode colors

**Expected Result**: ✅ Consistent theming across all pages and modals

### T039: Test keyboard navigation (Tab + Enter on theme toggle)

**Steps**:
1. Navigate to /dashboard
2. Press Tab repeatedly until theme toggle button is focused
3. **VERIFY**: Button has visible focus ring
4. Press Enter key
5. **VERIFY**: Theme switches
6. Press Enter again
7. **VERIFY**: Theme switches back

**Expected Result**: ✅ Theme toggle is keyboard accessible

---

## Phase 7: Polish & Cross-Cutting Concerns

### Performance Validation (T053-T055)

**T053**: Measure theme toggle performance
- Use DevTools Performance tab
- Record theme toggle action
- Verify transition completes in <100ms

**T054**: Measure header email display time
- Use Performance tab
- Record page load
- Verify email appears in <200ms

**T055**: Verify cache clearing completes before redirect
- Add console.log in useSignout hook
- Verify queryClient.clear() executes before router.push()

### Accessibility Validation (T056-T058)

**T056**: Verify all interactive elements have ARIA labels
- Inspect theme toggle button → should have `aria-label="Toggle theme"`
- Inspect all buttons for proper labels

**T057**: Test keyboard navigation across all pages
- Tab through all interactive elements
- Verify focus indicators visible
- Verify logical tab order

**T058**: Screen reader compatibility (optional)
- Test with NVDA or JAWS
- Verify all content is announced correctly

### Cross-Browser Testing (T059-T062)

Test on:
- Chrome (desktop and mobile)
- Firefox (desktop and mobile)
- Safari (desktop and mobile)
- Edge (desktop)

Verify:
- Theme toggle works
- Email displays correctly
- Footer visible
- All colors render correctly

### Edge Case Testing (T063-T067)

**T063**: localStorage disabled (private browsing)
- Open incognito/private window
- Verify app still works (theme may not persist)

**T064**: Malformed JWT token
- Manually corrupt token in localStorage
- Verify graceful error handling

**T065**: Rapid theme toggling
- Click theme toggle 10 times rapidly
- Verify no UI glitches or errors

**T066**: Multiple browser tabs with different users
- Tab 1: Sign in as User A
- Tab 2: Sign in as User B
- Verify each tab maintains correct user context

**T067**: Token expiration and re-authentication
- Wait for token to expire (or manually set expired token)
- Verify redirect to /signin
- Sign in again
- Verify fresh data loads

### Final Validation (T068-T071)

**T068**: Run quickstart.md validation scenarios
- Follow quickstart.md step by step
- Verify all features work as documented

**T069**: Verify all 12 functional requirements (FR-001 to FR-012)
- Check spec.md for requirements list
- Test each requirement

**T070**: Verify all 10 success criteria (SC-001 to SC-010)
- Check spec.md for success criteria
- Validate each criterion

**T071**: Production build verification
- Run `npm run build` in frontend
- Verify no errors
- Test production build locally

---

## Testing Checklist Summary

### Critical Path (MVP - User Story 1)
- [ ] T016: Multi-user session isolation
- [ ] T017: No stale data after signout
- [ ] T018: Fresh data on each signin

### User Story 2 (Dynamic Header)
- [ ] T025: Correct email for multiple users
- [ ] T026: Fallback for malformed token
- [ ] T027: Email displays quickly

### User Story 3 (Theme Switcher)
- [ ] T036: Instant theme toggle
- [ ] T037: Theme persistence
- [ ] T038: Theme consistency
- [ ] T039: Keyboard navigation

### Phase 7 (Polish)
- [ ] T053-T055: Performance validation
- [ ] T056-T058: Accessibility validation
- [ ] T059-T062: Cross-browser testing
- [ ] T063-T067: Edge case testing
- [ ] T068-T071: Final validation

---

## Bug Reporting Template

If you encounter issues during testing:

```
**Task ID**: T0XX
**User Story**: US1/US2/US3/US4
**Severity**: Critical/High/Medium/Low

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:


**Actual Result**:


**Screenshots/Logs**:


**Browser/Environment**:

```

---

## Notes

- All implementation tasks (T001-T052) are complete
- Development server must be running for testing
- Backend API must be accessible
- Create test user accounts before starting
- Use browser DevTools for detailed inspection
- Document any issues found during testing
