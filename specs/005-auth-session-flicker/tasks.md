---
description: "Implementation tasks for Auth Session Flicker Fix"
---

# Tasks: Auth Session Flicker Fix

**Input**: Design documents from `/specs/005-auth-session-flicker/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Manual testing only (no automated tests in scope)

**Organization**: Tasks are grouped by implementation phase. All three user stories (US1, US2, US3) are solved by the same AuthProvider implementation, but each story has independent test criteria.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for all frontend code
- All paths are relative to repository root

---

## Phase 1: Foundational (Critical Bug Fixes)

**Purpose**: Fix critical token key bugs that block authentication

**⚠️ CRITICAL**: These bugs must be fixed first - authentication is completely broken without these fixes

- [x] T001 Fix token key in protected layout from 'token' to 'auth_token' in frontend/src/app/(protected)/layout.tsx line 27
- [x] T002 Fix token key in useSignout hook from 'token' to 'auth_token' in frontend/src/lib/auth.ts

**Checkpoint**: After these fixes, authentication should work (no infinite redirects). Users can sign in and stay signed in.

---

## Phase 2: User Story 1 - Stable Initial Load Without Flicker (Priority: P1) 🎯 MVP

**Goal**: Implement centralized AuthProvider that blocks UI rendering until auth state is resolved, eliminating flicker on cold start

**Independent Test**: Open application in new browser tab (cold start). Observe loading indicator, then smooth transition to correct page (signin or dashboard) with zero flickers.

**Note**: This implementation also solves User Stories 2 and 3 simultaneously, but they have separate verification tasks below.

### Create AuthProvider Infrastructure

- [x] T003 [P] [US1] Add AuthState and AuthContextValue interfaces to frontend/src/types/auth.ts
- [x] T004 [P] [US1] Create AuthProvider component in frontend/src/components/auth/AuthProvider.tsx with state management and checkAuthStatus logic
- [x] T005 [P] [US1] Create AuthLoadingScreen component in frontend/src/components/auth/AuthLoadingScreen.tsx with theme-aware loading indicator
- [x] T006 [P] [US1] Create useAuth hook in frontend/src/hooks/useAuth.ts to consume AuthContext

### Integrate AuthProvider into Application

- [x] T007 [US1] Add AuthProvider to providers wrapper in frontend/src/app/providers.tsx (inside QueryClientProvider, wrapping ThemeProvider)

### Update Protected Layout

- [x] T008 [US1] Remove local auth state and checks from protected layout in frontend/src/app/(protected)/layout.tsx, replace with useAuth hook

### Update Auth Pages

- [x] T009 [US1] Remove local auth check from signin page in frontend/src/app/(auth)/signin/page.tsx, replace with useAuth hook
- [x] T010 [US1] Add refreshAuth call after successful signin in frontend/src/components/auth/SigninForm.tsx
- [x] T011 [US1] Add refreshAuth call after successful signup in frontend/src/components/auth/SignupForm.tsx

### Update Signout Logic

- [x] T012 [US1] Update useSignout hook to call refreshAuth after clearing token in frontend/src/lib/auth.ts

**Checkpoint**: User Story 1 complete. Test cold start scenarios (authenticated and unauthenticated) - should see loading screen then correct page with zero flickers.

---

## Phase 3: User Story 2 - Consistent Behavior on Page Refresh (Priority: P2)

**Goal**: Verify that page refresh maintains correct routing without flickering

**Independent Test**: Sign in, navigate to dashboard, press F5. Observe smooth reload without flickering to signin page.

**Note**: No new implementation needed - AuthProvider handles this automatically. This phase is verification only.

### Verification Tasks

- [ ] T013 [US2] Verify authenticated user refresh on dashboard stays on dashboard without flicker
- [ ] T014 [US2] Verify authenticated user with expired session redirects to signin on refresh
- [ ] T015 [US2] Verify unauthenticated user refresh on signin page stays on signin without flicker

**Checkpoint**: User Story 2 verified. Page refresh works correctly in all scenarios.

---

## Phase 4: User Story 3 - Direct URL Access Handling (Priority: P3)

**Goal**: Verify that direct URL access shows loading state before redirecting

**Independent Test**: Copy dashboard URL, sign out, paste URL in browser. Observe loading indicator then redirect to signin without dashboard flash.

**Note**: No new implementation needed - AuthProvider handles this automatically. This phase is verification only.

### Verification Tasks

- [ ] T016 [US3] Verify unauthenticated user accessing protected URL sees loading then redirects to signin without content flash
- [ ] T017 [US3] Verify authenticated user accessing protected URL sees loading then displays protected content
- [ ] T018 [US3] Verify authenticated user accessing public URL (signin/signup) sees loading then redirects to dashboard

**Checkpoint**: User Story 3 verified. Direct URL access works correctly in all scenarios.

---

## Phase 5: Polish & Validation

**Purpose**: Final validation and documentation

- [ ] T019 [P] Verify all 10 success criteria from spec.md (SC-001 through SC-010)
- [ ] T020 [P] Test edge cases: slow network, corrupted token, expired token, no token
- [ ] T021 [P] Verify auth check runs exactly once per app load (check console logs)
- [ ] T022 [P] Verify no race condition errors in browser console
- [ ] T023 Run full quickstart.md validation scenarios

**Checkpoint**: All user stories validated. Feature complete and ready for PR.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies - MUST complete first (blocks everything)
- **User Story 1 (Phase 2)**: Depends on Phase 1 completion
- **User Story 2 (Phase 3)**: Depends on Phase 2 completion (verification only)
- **User Story 3 (Phase 4)**: Depends on Phase 2 completion (verification only)
- **Polish (Phase 5)**: Depends on Phases 2, 3, 4 completion

### Task Dependencies Within Phases

**Phase 1 (Foundational)**:
- T001 and T002 can run in parallel (different files)

**Phase 2 (User Story 1)**:
- T003, T004, T005, T006 can run in parallel (different files, no dependencies)
- T007 depends on T004 completion (needs AuthProvider to exist)
- T008, T009, T010, T011, T012 depend on T007 completion (need AuthProvider integrated)
- T008, T009, T010, T011, T012 can run in parallel after T007 (different files)

**Phase 3 (User Story 2)**:
- T013, T014, T015 are verification tasks (can run in any order)

**Phase 4 (User Story 3)**:
- T016, T017, T018 are verification tasks (can run in any order)

**Phase 5 (Polish)**:
- T019, T020, T021, T022 can run in parallel (independent verification)
- T023 should run last (comprehensive validation)

### Critical Path

```
T001, T002 (parallel)
    ↓
T003, T004, T005, T006 (parallel)
    ↓
T007
    ↓
T008, T009, T010, T011, T012 (parallel)
    ↓
T013, T014, T015 (verification)
    ↓
T016, T017, T018 (verification)
    ↓
T019, T020, T021, T022 (parallel)
    ↓
T023
```

### Parallel Opportunities

**Phase 1**: 2 tasks in parallel
```bash
Task: "Fix token key in protected layout"
Task: "Fix token key in useSignout hook"
```

**Phase 2 - Infrastructure**: 4 tasks in parallel
```bash
Task: "Add AuthState and AuthContextValue interfaces"
Task: "Create AuthProvider component"
Task: "Create AuthLoadingScreen component"
Task: "Create useAuth hook"
```

**Phase 2 - Integration**: 5 tasks in parallel (after T007)
```bash
Task: "Remove local auth state from protected layout"
Task: "Remove local auth check from signin page"
Task: "Add refreshAuth to SigninForm"
Task: "Add refreshAuth to SignupForm"
Task: "Update useSignout hook"
```

**Phase 5**: 4 tasks in parallel
```bash
Task: "Verify all success criteria"
Task: "Test edge cases"
Task: "Verify single auth check"
Task: "Verify no race conditions"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (bug fixes)
2. Complete Phase 2: User Story 1 (AuthProvider implementation)
3. **STOP and VALIDATE**: Test cold start scenarios
4. Verify SC-001, SC-002, SC-003, SC-006 from spec.md
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Phase 1 → Authentication unblocked
2. Complete Phase 2 → User Story 1 working (MVP!)
3. Verify Phase 3 → User Story 2 confirmed
4. Verify Phase 4 → User Story 3 confirmed
5. Complete Phase 5 → Full validation and polish

### Sequential Strategy (Single Developer)

1. Fix bugs (T001, T002) - 10 minutes
2. Create infrastructure (T003-T006) - 30 minutes
3. Integrate AuthProvider (T007) - 5 minutes
4. Update components (T008-T012) - 20 minutes
5. Verify all stories (T013-T018) - 15 minutes
6. Final validation (T019-T023) - 20 minutes

**Total Estimated Effort**: ~2 hours

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- All three user stories share the same implementation (AuthProvider)
- Each user story has independent test criteria despite shared implementation
- Manual testing only (no automated tests in scope)
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
- Token key bugs (Phase 1) MUST be fixed first - authentication is broken without these fixes

---

## Success Criteria Mapping

**User Story 1 (Cold Start)**:
- SC-001: Zero visible flickers
- SC-002: Auth resolution < 500ms
- SC-003: Loading indicator visible
- SC-006: Single auth check per load
- SC-009: Clear visual feedback

**User Story 2 (Page Refresh)**:
- SC-004: 100% refresh consistency
- SC-008: Consistent routing
- SC-010: Zero race conditions

**User Story 3 (Direct URL Access)**:
- SC-005: 100% direct URL handling
- SC-007: Graceful error handling
- SC-008: Consistent routing

**All Stories**:
- SC-010: Zero race condition errors
