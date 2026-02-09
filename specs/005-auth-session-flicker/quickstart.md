# Quickstart: Auth Session Flicker Fix

**Feature**: Auth Session Flicker Fix
**Date**: 2026-02-08
**Prerequisites**: Frontend dev server running, backend API accessible

---

## Setup

### 1. Start Development Environment

```bash
# Terminal 1: Start backend (if not already running)
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload --port 8080

# Terminal 2: Start frontend
cd frontend
npm run dev
```

**Verify**:
- Backend: http://localhost:8080/docs (FastAPI docs)
- Frontend: http://localhost:3000

---

### 2. Create Test Users

```bash
# Create User A
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "SecurePass123!"}'

# Create User B
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@example.com", "password": "SecurePass123!"}'
```

---

## Testing Scenarios

### Scenario 1: Verify Token Key Bug Fixes (Phase 1)

**Purpose**: Ensure authentication works after fixing token key mismatch

**Steps**:
1. Open browser DevTools → Application → Local Storage
2. Clear all localStorage
3. Navigate to http://localhost:3000/signin
4. Sign in with `alice@example.com` / `SecurePass123!`
5. **Verify**: Redirected to dashboard and stay there (no redirect loop)
6. **Verify**: Local Storage shows `auth_token` key with JWT value
7. Refresh page (F5)
8. **Verify**: Stay on dashboard (no redirect to signin)
9. Click "Sign Out"
10. **Verify**: Redirected to signin
11. **Verify**: Local Storage `auth_token` is removed

**Expected Result**: ✅ Authentication works correctly, no infinite redirects

**If Failed**: Token key bugs not fixed properly

---

### Scenario 2: Cold Start - Unauthenticated User (User Story 1 - P1)

**Purpose**: Verify zero flicker when opening app without authentication

**Steps**:
1. Clear all localStorage
2. Close all browser tabs
3. Open new tab
4. Navigate to http://localhost:3000
5. **Observe**: Brief loading screen with "Checking authentication..."
6. **Observe**: Smooth transition to signin page
7. **Verify**: No flash of dashboard or other pages
8. **Verify**: No rapid page switching

**Expected Result**: ✅ Loading screen → signin page (smooth, no flicker)

**If Failed**: AuthProvider not blocking rendering properly

---

### Scenario 3: Cold Start - Authenticated User (User Story 1 - P1)

**Purpose**: Verify authenticated users go directly to dashboard without flicker

**Steps**:
1. Sign in with `alice@example.com`
2. Verify you're on dashboard
3. Close browser tab completely
4. Open new tab
5. Navigate to http://localhost:3000
6. **Observe**: Brief loading screen
7. **Observe**: Smooth transition to dashboard
8. **Verify**: No flash of signin page
9. **Verify**: Email "alice@example.com" visible in header

**Expected Result**: ✅ Loading screen → dashboard (smooth, no flicker)

**If Failed**: Auth check not recognizing valid token

---

### Scenario 4: Page Refresh on Protected Route (User Story 2 - P2)

**Purpose**: Verify no flicker when refreshing dashboard

**Steps**:
1. Sign in with `alice@example.com`
2. Navigate to dashboard
3. Press F5 or Ctrl+R to refresh
4. **Observe**: Brief loading screen (may be very quick)
5. **Observe**: Dashboard reloads smoothly
6. **Verify**: No flash of signin page
7. **Verify**: Email still visible in header
8. Repeat refresh 5 times
9. **Verify**: Consistent behavior every time

**Expected Result**: ✅ Dashboard reloads without flickering to signin

**If Failed**: Auth state not persisting across refreshes

---

### Scenario 5: Direct URL Access - Unauthenticated (User Story 3 - P3)

**Purpose**: Verify protected content doesn't flash when accessing URL directly

**Steps**:
1. Sign out (or clear localStorage)
2. Copy dashboard URL: http://localhost:3000/dashboard
3. Close browser tab
4. Open new tab
5. Paste dashboard URL in address bar and press Enter
6. **Observe**: Loading screen appears
7. **Observe**: Redirect to signin page
8. **Verify**: No flash of dashboard content
9. **Verify**: No task data visible at any point

**Expected Result**: ✅ Loading screen → signin (no protected content leak)

**If Failed**: Protected layout rendering before auth check completes

---

### Scenario 6: Direct URL Access - Authenticated (User Story 3 - P3)

**Purpose**: Verify authenticated users can access protected routes directly

**Steps**:
1. Sign in with `alice@example.com`
2. Navigate to signin page: http://localhost:3000/signin
3. **Observe**: Immediate redirect to dashboard
4. **Verify**: No signin form visible
5. Navigate to signup page: http://localhost:3000/signup
6. **Observe**: Immediate redirect to dashboard
7. **Verify**: No signup form visible

**Expected Result**: ✅ Authenticated users can't access auth pages

**If Failed**: Auth pages not checking authentication status

---

### Scenario 7: Login Flow (User Story 1 - P1)

**Purpose**: Verify smooth transition after successful login

**Steps**:
1. Sign out (if signed in)
2. Navigate to http://localhost:3000/signin
3. Fill in form: `alice@example.com` / `SecurePass123!`
4. Click "Sign In"
5. **Observe**: Form submission
6. **Observe**: Smooth transition to dashboard
7. **Verify**: No loading screen after form submission
8. **Verify**: Email "alice@example.com" visible in header
9. **Verify**: No flicker or rapid page switching

**Expected Result**: ✅ Signin form → dashboard (smooth transition)

**If Failed**: refreshAuth not being called after login

---

### Scenario 8: Logout Flow (User Story 1 - P1)

**Purpose**: Verify smooth transition after logout

**Steps**:
1. Sign in with `alice@example.com`
2. Navigate to dashboard
3. Click "Sign Out" button in header
4. **Observe**: Smooth transition to signin page
5. **Verify**: No flash of dashboard
6. **Verify**: Local Storage `auth_token` removed
7. Try navigating to http://localhost:3000/dashboard
8. **Observe**: Loading screen → redirect to signin
9. **Verify**: Can't access dashboard without signing in again

**Expected Result**: ✅ Dashboard → signin (smooth, auth state cleared)

**If Failed**: refreshAuth not being called after logout

---

### Scenario 9: Expired Token Handling (Edge Case)

**Purpose**: Verify graceful handling of expired tokens

**Steps**:
1. Sign in with `alice@example.com`
2. Open DevTools → Application → Local Storage
3. Find `auth_token` key
4. Copy the JWT value
5. Go to https://jwt.io
6. Paste token and manually change `exp` to past timestamp
7. Copy modified token back to localStorage
8. Refresh page
9. **Observe**: Loading screen
10. **Observe**: Redirect to signin
11. **Verify**: No errors in console

**Expected Result**: ✅ Expired token treated as unauthenticated

**If Failed**: Token expiration check not working

---

### Scenario 10: Malformed Token Handling (Edge Case)

**Purpose**: Verify graceful handling of corrupted tokens

**Steps**:
1. Sign in with `alice@example.com`
2. Open DevTools → Application → Local Storage
3. Find `auth_token` key
4. Change value to random string: `"invalid-token-12345"`
5. Refresh page
6. **Observe**: Loading screen
7. **Observe**: Redirect to signin
8. **Verify**: No errors in console (or only expected JWT decode error)
9. **Verify**: App doesn't crash

**Expected Result**: ✅ Malformed token handled gracefully

**If Failed**: Error handling in checkAuthStatus not working

---

### Scenario 11: Slow Network Simulation (Edge Case)

**Purpose**: Verify loading screen visible during slow auth check

**Steps**:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Clear localStorage
4. Navigate to http://localhost:3000
5. **Observe**: Loading screen visible for longer duration
6. **Observe**: Eventually transitions to signin page
7. **Verify**: No blank screens
8. **Verify**: No timeout errors
9. Reset throttling to "No throttling"

**Expected Result**: ✅ Loading screen visible, no timeout issues

**If Failed**: Timeout handling not working

---

### Scenario 12: Multi-User Session Isolation (Critical)

**Purpose**: Verify no data leakage between users

**Steps**:
1. Sign in as `alice@example.com`
2. Create 2-3 tasks
3. Note task titles
4. Click "Sign Out"
5. **Verify**: Loading screen → signin (smooth)
6. Sign in as `bob@example.com`
7. **Verify**: Dashboard shows empty task list (no Alice's tasks)
8. Create 1 task
9. Click "Sign Out"
10. Sign in as `alice@example.com` again
11. **Verify**: Dashboard shows only Alice's tasks (no Bob's task)

**Expected Result**: ✅ Complete data isolation between users

**If Failed**: React Query cache not being cleared properly

---

## Performance Validation

### Measure Auth Resolution Time (SC-002)

**Target**: < 500ms under normal network conditions

**Steps**:
1. Open DevTools → Performance tab
2. Click "Record" button
3. Navigate to http://localhost:3000
4. Wait for page to fully load
5. Stop recording
6. Find "Auth check" or "Loading" phase
7. Measure time from page start to first content render

**Expected**: < 500ms (typically < 100ms)

---

### Verify Single Auth Check (SC-006)

**Steps**:
1. Open `frontend/src/components/auth/AuthProvider.tsx`
2. Add `console.log('AUTH CHECK RUNNING')` at start of `checkAuthStatus()`
3. Save file
4. Open browser console
5. Navigate to http://localhost:3000
6. **Verify**: Console shows "AUTH CHECK RUNNING" exactly once
7. Refresh page
8. **Verify**: Console shows message exactly once again

**Expected**: One auth check per page load

---

## Success Criteria Checklist

Use this checklist to verify all success criteria are met:

- [ ] **SC-001**: Zero visible flickers (test scenarios 2, 3, 4, 5)
- [ ] **SC-002**: Auth resolution < 500ms (performance test)
- [ ] **SC-003**: Loading indicator visible (scenarios 2, 3, 11)
- [ ] **SC-004**: 100% refresh consistency (scenario 4)
- [ ] **SC-005**: 100% direct URL handling (scenarios 5, 6)
- [ ] **SC-006**: Single auth check (verification test)
- [ ] **SC-007**: Graceful error handling (scenarios 9, 10)
- [ ] **SC-008**: Consistent routing (all scenarios)
- [ ] **SC-009**: Clear visual feedback (all scenarios with loading screen)
- [ ] **SC-010**: Zero race condition errors (check console in all scenarios)

---

## Troubleshooting

### Issue: Infinite redirect loop

**Symptoms**: Page keeps redirecting between signin and dashboard

**Possible Causes**:
1. Token key mismatch not fixed
2. Token validation logic broken

**Debug Steps**:
1. Check DevTools → Application → Local Storage
2. Verify `auth_token` key exists (not `token`)
3. Check console for errors
4. Verify `isTokenExpired` function works correctly

---

### Issue: Loading screen never disappears

**Symptoms**: App stuck on "Checking authentication..." screen

**Possible Causes**:
1. Auth check throwing unhandled error
2. State not updating after check

**Debug Steps**:
1. Check console for errors
2. Add console.log in `checkAuthStatus` to see if it completes
3. Verify `setAuthState` is being called
4. Check if timeout is triggering (should happen after 5 seconds)

---

### Issue: Flash of wrong page still visible

**Symptoms**: Brief flash of signin page when authenticated (or vice versa)

**Possible Causes**:
1. AuthProvider not wrapping entire app
2. Components rendering before auth state resolved
3. Local auth checks still present in components

**Debug Steps**:
1. Verify AuthProvider is outermost in `providers.tsx`
2. Check if `isLoading` check is present in AuthProvider
3. Verify components use `useAuth()` hook, not local state
4. Check if any components have their own auth checks

---

### Issue: Auth state not updating after login/logout

**Symptoms**: Must refresh page to see auth state change

**Possible Causes**:
1. `refreshAuth()` not being called
2. `refreshAuth()` not working correctly

**Debug Steps**:
1. Check if SigninForm calls `refreshAuth()` after successful login
2. Check if useSignout calls `refreshAuth()` after clearing token
3. Add console.log in `refreshAuth` to verify it's being called
4. Verify `checkAuthStatus` is re-running

---

## Next Steps

After all scenarios pass:

1. ✅ Create PR with implementation
2. ✅ Request code review
3. ✅ Deploy to staging environment
4. ✅ Perform final validation in staging
5. ✅ Deploy to production
