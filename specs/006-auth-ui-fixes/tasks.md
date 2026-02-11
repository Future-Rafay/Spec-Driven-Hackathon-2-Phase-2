# Tasks: Auth Flow, Error Feedback & UI Corrections

**Input**: Design documents from `/specs/006-auth-ui-fixes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Manual testing only - no automated test tasks included per specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for all frontend code
- All paths are absolute from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies

- [x] T001 Verify Next.js project structure matches plan.md expectations
- [x] T002 Verify date-fns dependency is installed in frontend/package.json
- [x] T003 Verify frontend development server can start successfully

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Review existing code to understand current implementation before making changes

**⚠️ CRITICAL**: Complete these review tasks before ANY user story implementation

- [x] T004 [P] Review frontend/src/lib/api-client.ts to understand current error handling
- [x] T005 [P] Review frontend/src/components/auth/AuthProvider.tsx to understand session management
- [x] T006 [P] Review frontend/src/components/auth/SigninForm.tsx to understand current signin flow
- [x] T007 [P] Review frontend/src/components/auth/SignupForm.tsx to understand current signup flow
- [x] T008 [P] Review frontend/src/components/tasks/TaskItem.tsx to understand current timestamp display
- [x] T009 [P] Review frontend/src/components/tasks/TaskList.tsx to understand current delete flow
- [x] T010 [P] Review frontend/src/components/tasks/EditTaskModal.tsx to understand modal patterns
- [x] T011 [P] Review frontend/src/components/ui/dialog.tsx to verify className prop support

**Checkpoint**: Foundation reviewed - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication Error Feedback (Priority: P1) 🎯 MVP

**Goal**: Display clear, specific error messages for failed signin attempts and prevent dashboard flicker during authentication

**Independent Test**: Attempt to sign in with incorrect password. Verify that a clear error message appears (e.g., "Invalid email or password"), the user remains on the signin page, and no dashboard content is visible at any point.

### Implementation for User Story 1

- [x] T012 [P] [US1] Enhance getErrorMessage() function in frontend/src/lib/api-client.ts with context-aware error mapping for status codes 400, 401, 403, 404, 409, 422, 500, 503
- [x] T013 [P] [US1] Update apiCall() function in frontend/src/lib/api-client.ts to pass endpoint parameter to getErrorMessage() for context-aware messages
- [x] T014 [P] [US1] Add network error handling in apiCall() function in frontend/src/lib/api-client.ts for "Failed to fetch" errors
- [x] T015 [US1] Update handleSubmit() in frontend/src/components/auth/SigninForm.tsx to implement sequenced redirect: store token → refreshAuth() → delay → redirect
- [x] T016 [US1] Update error handling in handleSubmit() in frontend/src/components/auth/SigninForm.tsx to keep loading false and display specific error messages
- [x] T017 [US1] Update handleSubmit() in frontend/src/components/auth/SignupForm.tsx to implement same sequenced redirect as signin
- [x] T018 [US1] Update error handling in handleSubmit() in frontend/src/components/auth/SignupForm.tsx to detect duplicate email errors (409) and display helpful message
- [ ] T019 [US1] Manual test: Verify invalid password shows "Invalid email or password" without dashboard flash
- [ ] T020 [US1] Manual test: Verify non-existent email shows same error message
- [ ] T021 [US1] Manual test: Verify successful signin redirects only after auth confirmed with no flicker
- [ ] T022 [US1] Manual test: Verify network error shows "Connection error" message
- [ ] T023 [US1] Manual test: Verify session clearing when new user signs in

**Checkpoint**: At this point, User Story 1 should be fully functional - authentication errors display clearly without dashboard flicker

---

## Phase 4: User Story 2 - Accurate Task Timestamps (Priority: P2)

**Goal**: Display accurate absolute timestamps from database for task created, updated, and completed dates

**Independent Test**: Create a task, complete it, and view the task list. Verify that the displayed timestamps match the actual database values for created_at, updated_at, and completed_at fields, formatted in a readable way (e.g., "Jan 15, 2026 at 2:30 PM").

### Implementation for User Story 2

- [x] T024 [US2] Import format function from date-fns in frontend/src/components/tasks/TaskItem.tsx
- [x] T025 [US2] Create formatTimestamp() helper function in frontend/src/components/tasks/TaskItem.tsx to convert ISO 8601 strings to "MMM d, yyyy 'at' h:mm a" format
- [x] T026 [US2] Add null/undefined handling in formatTimestamp() to return "Not available" for missing timestamps
- [x] T027 [US2] Replace formatDistanceToNow with format() for created_at timestamp display in frontend/src/components/tasks/TaskItem.tsx
- [x] T028 [US2] Update updated_at timestamp display to use formatTimestamp() in frontend/src/components/tasks/TaskItem.tsx
- [x] T029 [US2] Update completed_at timestamp display to use formatTimestamp() with green styling in frontend/src/components/tasks/TaskItem.tsx
- [ ] T030 [US2] Manual test: Verify created timestamp displays in "MMM d, yyyy at h:mm a" format
- [ ] T031 [US2] Manual test: Verify updated timestamp differs from created timestamp after edit
- [ ] T032 [US2] Manual test: Verify completed timestamp displays in green with checkmark
- [ ] T033 [US2] Manual test: Verify null timestamps handled gracefully without errors
- [ ] T034 [US2] Manual test: Verify multiple tasks have consistent timestamp formatting

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - auth errors clear and timestamps accurate

---

## Phase 5: User Story 3 - Responsive Delete Modal (Priority: P3)

**Goal**: Create delete confirmation modal that stays within viewport and handles long content with scrolling

**Independent Test**: Create a task with a very long title (200+ characters) and long description. Attempt to delete it on both mobile and desktop viewports. Verify that the modal stays within the viewport, content scrolls properly, and all buttons remain accessible.

### Implementation for User Story 3

- [x] T035 [US3] Create new file frontend/src/components/tasks/DeleteTaskModal.tsx with DeleteTaskModal component
- [x] T036 [US3] Import Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter from ui/dialog in frontend/src/components/tasks/DeleteTaskModal.tsx
- [x] T037 [US3] Implement DeleteTaskModal component with max-h-[80vh] and flex flex-col layout in frontend/src/components/tasks/DeleteTaskModal.tsx
- [x] T038 [US3] Add scrollable content area with overflow-y-auto for task title and description in frontend/src/components/tasks/DeleteTaskModal.tsx
- [x] T039 [US3] Add break-words styling to prevent text overflow in frontend/src/components/tasks/DeleteTaskModal.tsx
- [x] T040 [US3] Add DialogFooter with Cancel and Delete buttons in frontend/src/components/tasks/DeleteTaskModal.tsx
- [x] T041 [US3] Import DeleteTaskModal component in frontend/src/components/tasks/TaskList.tsx
- [x] T042 [US3] Add taskToDelete state to track task to delete in frontend/src/components/tasks/TaskList.tsx
- [x] T043 [US3] Update handleDelete function to set taskToDelete state in frontend/src/components/tasks/TaskList.tsx
- [x] T044 [US3] Create confirmDelete function to handle actual deletion in frontend/src/components/tasks/TaskList.tsx
- [x] T045 [US3] Render DeleteTaskModal conditionally when taskToDelete is not null in frontend/src/components/tasks/TaskList.tsx
- [ ] T046 [US3] Manual test: Verify long title (200+ chars) scrolls properly on desktop
- [ ] T047 [US3] Manual test: Verify long description (500+ chars) scrolls with overflow-y-auto
- [ ] T048 [US3] Manual test: Verify modal fits viewport on mobile (375px width)
- [ ] T049 [US3] Manual test: Verify modal displays properly on tablet (768px width)
- [ ] T050 [US3] Manual test: Verify consistent styling with EditTaskModal
- [ ] T051 [US3] Manual test: Verify keyboard navigation works (Tab, Escape)

**Checkpoint**: All user stories 1-3 should now be independently functional - auth, timestamps, and modal all working

---

## Phase 6: User Story 4 - Signin/Signup Visual Differentiation (Priority: P4)

**Goal**: Add distinct visual identity to signin and signup pages through different headings, icons, and accent colors

**Independent Test**: Navigate to signin page, then to signup page. Verify that each page has distinct visual elements (different heading text, different accent colors, different illustrations or icons) that make it immediately clear which page you're on.

### Implementation for User Story 4

- [x] T052 [P] [US4] Update signin page in frontend/src/app/(auth)/signin/page.tsx to add "Welcome Back" heading with icon container
- [x] T053 [P] [US4] Add login/arrow SVG icon with bg-primary/10 background and text-primary color in frontend/src/app/(auth)/signin/page.tsx
- [x] T054 [P] [US4] Update link to signup to use primary color in frontend/src/app/(auth)/signin/page.tsx
- [x] T055 [P] [US4] Update signup page in frontend/src/app/(auth)/signup/page.tsx to add "Create Your Account" heading with icon container
- [x] T056 [P] [US4] Add user-add SVG icon with bg-secondary/10 background and text-secondary color in frontend/src/app/(auth)/signup/page.tsx
- [x] T057 [P] [US4] Update link to signin to use secondary color in frontend/src/app/(auth)/signup/page.tsx
- [ ] T058 [US4] Manual test: Verify signin page has "Welcome Back" heading and login icon with primary color
- [ ] T059 [US4] Manual test: Verify signup page has "Create Your Account" heading and user-add icon with secondary color
- [ ] T060 [US4] Manual test: Verify pages are immediately distinguishable when switching between them
- [ ] T061 [US4] Manual test: Run Lighthouse accessibility audit on both pages
- [ ] T062 [US4] Manual test: Verify dark mode maintains visual distinction
- [ ] T063 [US4] Manual test: Verify responsive visual identity on mobile (375px width)

**Checkpoint**: All 4 user stories complete - full feature implemented and independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and edge case testing across all user stories

- [ ] T064 [P] Edge case test: Rapid page switching between signin and signup
- [ ] T065 [P] Edge case test: Multiple failed signin attempts (5+ times)
- [ ] T066 [P] Edge case test: Very long task title (1000+ characters) in delete modal
- [ ] T067 [P] Edge case test: Null/invalid timestamps in task display
- [ ] T068 [P] Edge case test: Multiple browser tabs with different auth states
- [ ] T069 Verify zero hydration errors in browser console across all flows
- [ ] T070 Verify error messages display within 500ms of failed signin
- [ ] T071 Verify performance impact is < 50ms additional render time
- [ ] T072 Cross-browser testing: Chrome, Firefox, Safari, Edge
- [ ] T073 Responsive testing: Mobile (375px), Tablet (768px), Desktop (1920px)
- [ ] T074 Update documentation if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1 and US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of all other stories

### Within Each User Story

- **User Story 1**: api-client.ts changes can be done in parallel (T012, T013, T014), then form updates (T015-T018), then manual tests
- **User Story 2**: All implementation tasks are sequential (T024-T029), then manual tests
- **User Story 3**: DeleteTaskModal creation (T035-T040) before TaskList integration (T041-T045), then manual tests
- **User Story 4**: Signin and signup page updates can be done in parallel (T052-T054 and T055-T057), then manual tests

### Parallel Opportunities

- **Phase 2**: All review tasks (T004-T011) can run in parallel
- **User Story 1**: Tasks T012, T013, T014 can run in parallel (different parts of api-client.ts)
- **User Story 4**: Tasks T052-T054 (signin page) and T055-T057 (signup page) can run in parallel
- **Phase 7**: All edge case tests (T064-T068) can run in parallel
- **Between Stories**: All 4 user stories can be worked on in parallel by different team members after Phase 2

---

## Parallel Example: User Story 1

```bash
# Launch api-client.ts enhancements together:
Task T012: "Enhance getErrorMessage() function in frontend/src/lib/api-client.ts"
Task T013: "Update apiCall() function in frontend/src/lib/api-client.ts"
Task T014: "Add network error handling in apiCall() function"

# Then sequentially:
Task T015: "Update handleSubmit() in SigninForm.tsx"
Task T016: "Update error handling in SigninForm.tsx"
Task T017: "Update handleSubmit() in SignupForm.tsx"
Task T018: "Update error handling in SignupForm.tsx"
```

## Parallel Example: User Story 4

```bash
# Launch signin and signup page updates together:
Task T052: "Update signin page heading"
Task T053: "Add login icon to signin page"
Task T054: "Update signin link color"

# In parallel:
Task T055: "Update signup page heading"
Task T056: "Add user-add icon to signup page"
Task T057: "Update signup link color"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T011) - CRITICAL
3. Complete Phase 3: User Story 1 (T012-T023)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - authentication error feedback working

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! - Auth errors clear)
3. Add User Story 2 → Test independently → Deploy/Demo (Timestamps accurate)
4. Add User Story 3 → Test independently → Deploy/Demo (Modal responsive)
5. Add User Story 4 → Test independently → Deploy/Demo (Visual differentiation)
6. Complete Phase 7 → Final validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T011)
2. Once Foundational is done:
   - Developer A: User Story 1 (T012-T023) - Auth error feedback
   - Developer B: User Story 2 (T024-T034) - Timestamps
   - Developer C: User Story 3 (T035-T051) - Delete modal
   - Developer D: User Story 4 (T052-T063) - Visual differentiation
3. Stories complete and integrate independently
4. Team completes Phase 7 together (T064-T074)

---

## Task Summary

**Total Tasks**: 74
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (User Story 1 - P1): 12 tasks (3 implementation + 9 manual tests)
- Phase 4 (User Story 2 - P2): 11 tasks (6 implementation + 5 manual tests)
- Phase 5 (User Story 3 - P3): 17 tasks (11 implementation + 6 manual tests)
- Phase 6 (User Story 4 - P4): 12 tasks (6 implementation + 6 manual tests)
- Phase 7 (Polish): 11 tasks

**Parallel Opportunities**: 23 tasks marked with [P] can run in parallel
**Independent Stories**: All 4 user stories can be implemented and tested independently

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 23 tasks

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing approach per specification (no automated tests)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All changes are frontend-only, no backend modifications required
- No new dependencies needed (date-fns already installed)
