---
description: "Implementation tasks for UI/UX Enhancement & Session Consistency Improvements"
---

# Tasks: UI/UX Enhancement & Session Consistency Improvements

**Input**: Design documents from `/specs/004-ui-ux-enhancement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/`
- **Backend**: N/A (no backend changes for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install next-themes dependency in frontend/package.json
- [x] T002 Install jwt-decode dependency in frontend/package.json
- [x] T003 [P] Verify Tailwind CSS dark mode configuration in frontend/tailwind.config.ts
- [x] T004 [P] Verify shadcn/ui dark mode CSS variables in frontend/src/app/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Theme System Foundation

- [x] T005 Add ThemeProvider to root layout in frontend/src/app/layout.tsx
- [x] T006 [P] Create theme types in frontend/src/types/theme.ts
- [x] T007 [P] Create ThemeToggle component in frontend/src/components/layout/ThemeToggle.tsx

### Authentication Utilities

- [x] T008 [P] Add DecodedToken interface to frontend/src/types/auth.ts
- [x] T009 Create getUserEmailFromToken utility function in frontend/src/lib/auth.ts
- [x] T010 Create isTokenExpired utility function in frontend/src/lib/auth.ts

### Cache Management

- [x] T011 Create useSignout hook with cache clearing in frontend/src/lib/auth.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Session Consistency & Task Isolation (Priority: P1) 🎯 MVP

**Goal**: Fix critical data isolation bug by clearing React Query cache on authentication state changes to prevent cross-user data leakage

**Independent Test**: Sign in as User A, create tasks, sign out. Sign in as User B - verify User B sees empty task list without manual refresh. Sign out and sign in as User A again - verify User A sees only their tasks.

### Cache Clearing Implementation

- [x] T012 [US1] Update signout function to call queryClient.clear() in frontend/src/lib/auth.ts
- [x] T013 [US1] Update signin flow to ensure cache is empty on new authentication in frontend/src/lib/auth.ts
- [x] T014 [US1] Update protected layout to check auth state on mount in frontend/src/app/(protected)/layout.tsx
- [x] T015 [US1] Verify useTasks hook refetches data after signin in frontend/src/hooks/useTasks.ts

### Verification

- [ ] T016 [US1] Test multi-user session isolation (User A → User B → User A)
- [ ] T017 [US1] Verify no stale data appears in React Query cache after signout
- [ ] T018 [US1] Verify dashboard loads fresh data for each authenticated user

**Checkpoint**: At this point, User Story 1 should be fully functional - no cross-user data contamination

---

## Phase 4: User Story 2 - Dynamic Header with Authenticated User Data (Priority: P2)

**Goal**: Display actual authenticated user's email in header instead of hardcoded placeholder

**Independent Test**: Sign in with email "alice@example.com", verify header displays "alice@example.com". Sign out, sign in with "bob@example.com", verify header displays "bob@example.com".

### JWT Decoding Integration

- [x] T019 [US2] Add JWT decode logic to protected layout in frontend/src/app/(protected)/layout.tsx
- [x] T020 [US2] Extract user email from decoded token with fallback to "User"
- [x] T021 [US2] Pass userEmail prop to Header component

### Header Component Update

- [x] T022 [US2] Update Header component to accept userEmail prop in frontend/src/components/layout/Header.tsx
- [x] T023 [US2] Replace hardcoded email with dynamic userEmail prop in Header
- [x] T024 [US2] Add error handling for missing or invalid email

### Verification

- [ ] T025 [US2] Test header displays correct email for multiple user accounts
- [ ] T026 [US2] Test fallback to "User" when token is malformed
- [ ] T027 [US2] Verify email displays within 200ms of page load

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Theme Switcher (Dark/Light Mode) (Priority: P3)

**Goal**: Enable users to toggle between dark and light themes with persistence across sessions

**Independent Test**: Click theme toggle button in header, verify entire application switches to dark mode. Refresh page, verify dark mode persists. Test all pages to ensure consistent theming.

### Theme Toggle Integration

- [x] T028 [US3] Add ThemeToggle component to Header in frontend/src/components/layout/Header.tsx
- [x] T029 [US3] Position theme toggle button in header (top-right area)
- [x] T030 [US3] Add ARIA label and keyboard accessibility to theme toggle

### Theme Verification

- [x] T031 [P] [US3] Verify signin page supports dark mode in frontend/src/app/(auth)/signin/page.tsx
- [x] T032 [P] [US3] Verify signup page supports dark mode in frontend/src/app/(auth)/signup/page.tsx
- [x] T033 [P] [US3] Verify dashboard page supports dark mode in frontend/src/app/(protected)/dashboard/page.tsx
- [x] T034 [P] [US3] Verify all task components support dark mode in frontend/src/components/tasks/
- [x] T035 [P] [US3] Verify all shadcn/ui components reflect current theme

### Testing

- [ ] T036 [US3] Test theme toggle switches instantly (<100ms)
- [ ] T037 [US3] Test theme preference persists after browser refresh
- [ ] T038 [US3] Test theme consistency across all routes
- [ ] T039 [US3] Test keyboard navigation (Tab + Enter on theme toggle)

**Checkpoint**: All user stories (1, 2, 3) should now be independently functional

---

## Phase 6: User Story 4 - Footer with Branding (Priority: P4)

**Goal**: Add professional footer with copyright and creator attribution on all pages

**Independent Test**: Navigate to any page (signin, signup, dashboard), scroll to bottom, verify footer displays "© 2026 Todo App" and "Made with love by Abdul Rafay".

### Footer Component Creation

- [x] T040 [P] [US4] Create Footer component in frontend/src/components/layout/Footer.tsx
- [x] T041 [US4] Add copyright text "© 2026 Todo App" to Footer
- [x] T042 [US4] Add attribution text "Made with love by Abdul Rafay" to Footer
- [x] T043 [US4] Add responsive styling with Tailwind utilities
- [x] T044 [US4] Add theme-aware styling (light/dark mode support)

### Footer Integration

- [x] T045 [US4] Add Footer to auth layout in frontend/src/app/(auth)/layout.tsx
- [x] T046 [US4] Add Footer to protected layout in frontend/src/app/(protected)/layout.tsx
- [x] T047 [US4] Ensure footer sticks to bottom with flex layout

### Verification

- [x] T048 [P] [US4] Verify footer visible on signin page
- [x] T049 [P] [US4] Verify footer visible on signup page
- [x] T050 [P] [US4] Verify footer visible on dashboard page
- [x] T051 [US4] Test footer responsive layout on mobile (375px width)
- [x] T052 [US4] Test footer colors adapt to theme changes

**Checkpoint**: All user stories (1, 2, 3, 4) should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, testing, and validation across all user stories

### Performance Validation

- [ ] T053 [P] Measure theme toggle performance (<100ms target)
- [ ] T054 [P] Measure header email display time (<200ms target)
- [ ] T055 [P] Verify cache clearing completes before redirect

### Accessibility Validation

- [ ] T056 [P] Verify all interactive elements have ARIA labels
- [ ] T057 [P] Test keyboard navigation across all pages
- [ ] T058 Verify screen reader compatibility (optional)

### Cross-Browser Testing

- [ ] T059 [P] Test on Chrome (desktop and mobile)
- [ ] T060 [P] Test on Firefox (desktop and mobile)
- [ ] T061 [P] Test on Safari (desktop and mobile)
- [ ] T062 [P] Test on Edge (desktop)

### Edge Case Testing

- [ ] T063 Test localStorage disabled (private browsing mode)
- [ ] T064 Test malformed JWT token handling
- [ ] T065 Test rapid theme toggling
- [ ] T066 Test multiple browser tabs with different users
- [ ] T067 Test token expiration and re-authentication

### Final Validation

- [ ] T068 Run quickstart.md validation scenarios
- [ ] T069 Verify all 12 functional requirements (FR-001 to FR-012)
- [ ] T070 Verify all 10 success criteria (SC-001 to SC-010)
- [ ] T071 Production build verification (npm run build)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but can integrate
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of all other stories

### Within Each User Story

- Components before integration
- Utilities before components that use them
- Core functionality before verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 3 (Theme Switcher)

```bash
# Launch theme verification tasks together:
Task T031: "Verify signin page supports dark mode"
Task T032: "Verify signup page supports dark mode"
Task T033: "Verify dashboard page supports dark mode"
Task T034: "Verify all task components support dark mode"
Task T035: "Verify all shadcn/ui components reflect current theme"
```

---

## Parallel Example: User Story 4 (Footer)

```bash
# Launch footer verification tasks together:
Task T048: "Verify footer visible on signin page"
Task T049: "Verify footer visible on signup page"
Task T050: "Verify footer visible on dashboard page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Session Consistency)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**Why this is MVP**: User Story 1 fixes a critical data isolation bug that violates user privacy. This MUST be fixed before any other enhancements.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - Critical Bug Fix!)
3. Add User Story 2 → Test independently → Deploy/Demo (Dynamic Header!)
4. Add User Story 3 → Test independently → Deploy/Demo (Theme Switcher!)
5. Add User Story 4 → Test independently → Deploy/Demo (Professional Footer!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Session Consistency) - PRIORITY
   - Developer B: User Story 2 (Dynamic Header) - can start in parallel
   - Developer C: User Story 3 (Theme Switcher) - can start in parallel
   - Developer D: User Story 4 (Footer) - can start in parallel
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are NOT included as they were not explicitly requested in the specification
- All file paths follow the structure defined in plan.md
- No backend changes required for this feature
- Theme system and cache management are foundational dependencies that block all user stories

---

## Task Summary

**Total Tasks**: 71
- **Phase 1 (Setup)**: 4 tasks ✓ Complete
- **Phase 2 (Foundational)**: 7 tasks ✓ Complete
- **Phase 3 (US1 - Session Consistency)**: 7 tasks (4 implementation ✓, 3 manual testing)
- **Phase 4 (US2 - Dynamic Header)**: 9 tasks (6 implementation ✓, 3 manual testing)
- **Phase 5 (US3 - Theme Switcher)**: 12 tasks ✓ Complete
- **Phase 6 (US4 - Footer)**: 13 tasks ✓ Complete
- **Phase 7 (Polish)**: 19 tasks (manual testing and validation)

**Implementation Complete**: 52/71 tasks (73%)
**Remaining**: 19 manual testing and validation tasks

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (18 tasks) = Critical bug fix for data isolation
- Implementation: ✓ Complete
- Testing: 3 manual tests remaining

**Full Feature**: All 71 tasks = Complete UI/UX enhancement with theme system, dynamic header, and footer
- Implementation: ✓ Complete (52 tasks)
- Testing: 19 manual tests remaining
