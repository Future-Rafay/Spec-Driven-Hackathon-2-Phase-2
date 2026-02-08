---
description: "Implementation tasks for Todo Frontend Application & API Integration"
---

# Tasks: Todo Frontend Application & API Integration

**Input**: Design documents from `/specs/003-todo-frontend/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/`
- **Backend**: `backend/src/` (verification only, no modifications)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install Better Auth and JWT plugin dependencies in frontend/package.json
- [x] T002 Install @tanstack/react-query and devtools in frontend/package.json
- [x] T003 [P] Install date-fns for date formatting in frontend/package.json
- [x] T004 [P] Update frontend/.env.example with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET
- [x] T005 Verify backend/.env contains matching BETTER_AUTH_SECRET

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Better Auth Configuration

- [x] T006 Create Better Auth configuration with JWT plugin in frontend/src/lib/auth.ts
- [x] T007 Configure custom credential provider to call FastAPI endpoints in frontend/src/lib/auth.ts
- [ ] T008 Verify JWT token compatibility between Better Auth and FastAPI backend

### TypeScript Types

- [x] T009 [P] Create auth types (User, AuthCredentials, AuthResponse, AuthState) in frontend/src/types/auth.ts
- [x] T010 [P] Create task types (Task, TaskCreate, TaskUpdate) in frontend/src/types/task.ts
- [x] T011 [P] Create API error types (ApiError, ValidationError) in frontend/src/types/api.ts
- [x] T012 [P] Create UI types (ModalState, ToastState) in frontend/src/types/ui.ts

### API Client Infrastructure

- [x] T013 Update API client to inject Better Auth JWT token in frontend/src/lib/api-client.ts
- [x] T014 Create typed task API functions (list, get, create, update, delete, toggleComplete) in frontend/src/lib/api/tasks.ts
- [x] T015 Implement centralized error handling with user-friendly messages in frontend/src/lib/api-client.ts

### React Query Setup

- [x] T016 Create QueryClient with cache configuration in frontend/src/app/layout.tsx
- [x] T017 Add QueryClientProvider to root layout in frontend/src/app/layout.tsx
- [x] T018 Create useTasks hook with React Query in frontend/src/hooks/useTasks.ts
- [x] T019 Create useTaskMutations hook (create, update, delete, toggle) in frontend/src/hooks/useTaskMutations.ts

### Base UI Components

- [x] T020 [P] Create Button component with variants (primary, secondary, danger) in frontend/src/components/ui/Button.tsx
- [x] T021 [P] Create Input component with validation states in frontend/src/components/ui/Input.tsx
- [x] T022 [P] Create Spinner component for loading states in frontend/src/components/ui/Spinner.tsx
- [x] T023 [P] Create Modal component with overlay and close handling in frontend/src/components/ui/Modal.tsx

### Layout Components

- [x] T024 [P] Create Container component for responsive layouts in frontend/src/components/layout/Container.tsx
- [x] T025 Create Header component with user menu and logout in frontend/src/components/layout/Header.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication and Account Access (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, sign in securely, maintain authenticated sessions, and access protected areas

**Independent Test**: Create new account via signup form, sign in with credentials, verify session persists across page navigation, sign out, verify protected routes redirect unauthenticated users

### Authentication Forms

- [x] T026 [P] [US1] Update SigninForm to use Better Auth signin in frontend/src/components/auth/SigninForm.tsx
- [x] T027 [P] [US1] Update SignupForm to use Better Auth signup in frontend/src/components/auth/SignupForm.tsx
- [x] T028 [US1] Add form validation and error display to auth forms in frontend/src/components/auth/

### Route Protection

- [x] T029 [US1] Update middleware to check Better Auth session and redirect unauthenticated users in frontend/src/middleware.ts
- [x] T030 [US1] Create auth layout for signin/signup pages in frontend/src/app/(auth)/layout.tsx
- [x] T031 [US1] Create protected layout with auth check in frontend/src/app/(protected)/layout.tsx

### Authentication Pages

- [x] T032 [P] [US1] Update signin page to use Better Auth in frontend/src/app/(auth)/signin/page.tsx
- [x] T033 [P] [US1] Update signup page to use Better Auth in frontend/src/app/(auth)/signup/page.tsx
- [x] T034 [US1] Update landing page with navigation to signin/signup in frontend/src/app/page.tsx

### Session Management

- [x] T035 [US1] Implement logout functionality in Header component in frontend/src/components/layout/Header.tsx
- [x] T036 [US1] Add session persistence verification across page navigation
- [x] T037 [US1] Handle token expiration with redirect to signin

**Checkpoint**: At this point, User Story 1 should be fully functional - users can signup, signin, navigate protected routes, and logout

---

## Phase 4: User Story 2 - View and Manage Personal Tasks (Priority: P2)

**Goal**: Enable users to view their complete task list, create new tasks, update existing tasks, and delete tasks

**Independent Test**: Authenticate user (using US1), create multiple tasks with titles and descriptions, view task list, edit task details, delete tasks, verify all changes persist and only authenticated user's tasks are visible

### Task Display Components

- [x] T038 [P] [US2] Create TaskSkeleton component for loading state in frontend/src/components/tasks/TaskSkeleton.tsx
- [x] T039 [P] [US2] Create TaskEmptyState component for no tasks in frontend/src/components/tasks/TaskEmptyState.tsx
- [x] T040 [US2] Create TaskItem component to display individual task in frontend/src/components/tasks/TaskItem.tsx
- [x] T041 [US2] Create TaskList component as main container in frontend/src/components/tasks/TaskList.tsx

### Task Creation

- [x] T042 [US2] Create CreateTaskForm component with validation in frontend/src/components/tasks/CreateTaskForm.tsx
- [x] T043 [US2] Integrate CreateTaskForm into TaskList with optimistic updates
- [x] T044 [US2] Add success feedback for task creation

### Task Editing

- [x] T045 [US2] Create EditTaskModal component with pre-populated data in frontend/src/components/tasks/EditTaskModal.tsx
- [x] T046 [US2] Integrate EditTaskModal into TaskItem with optimistic updates
- [x] T047 [US2] Add success feedback for task updates

### Task Deletion

- [x] T048 [US2] Create DeleteConfirmDialog component in frontend/src/components/tasks/DeleteConfirmDialog.tsx
- [x] T049 [US2] Integrate DeleteConfirmDialog into TaskItem with optimistic updates
- [x] T050 [US2] Add success feedback for task deletion

### Dashboard Integration

- [x] T051 [US2] Update dashboard page to render TaskList in frontend/src/app/(protected)/dashboard/page.tsx
- [x] T052 [US2] Add error boundaries for task operations
- [x] T053 [US2] Verify data isolation (users only see their own tasks)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can manage their complete task list

---

## Phase 5: User Story 3 - Track Task Completion (Priority: P3)

**Goal**: Enable users to mark tasks as complete to track progress and distinguish between pending and finished work

**Independent Test**: Create task (using US2), toggle completion status via checkbox, verify visual state changes, confirm status persists across page refreshes

### Completion Toggle

- [x] T054 [US3] Add completion checkbox to TaskItem component in frontend/src/components/tasks/TaskItem.tsx
- [x] T055 [US3] Implement toggle completion with optimistic updates using useTaskMutations hook
- [x] T056 [US3] Add visual indicators for completed tasks (strikethrough, checkmark) in frontend/src/components/tasks/TaskItem.tsx

### Completion Display

- [x] T057 [US3] Display completion timestamp when task is completed in frontend/src/components/tasks/TaskItem.tsx
- [x] T058 [US3] Add visual differentiation between complete and incomplete tasks with Tailwind styles
- [x] T059 [US3] Add immediate visual feedback on completion toggle without page refresh

**Checkpoint**: All user stories (1, 2, 3) should now be independently functional - complete task management with authentication

---

## Phase 6: User Story 4 - Seamless Cross-Device Experience (Priority: P4)

**Goal**: Ensure application works smoothly on mobile devices and desktop computers with appropriate layouts and interactions

**Independent Test**: Access application on mobile (phone/tablet) and desktop devices, verify all features work correctly, layouts adapt appropriately, touch/click interactions are optimized

### Responsive Layouts

- [x] T060 [P] [US4] Add mobile breakpoints to all components using Tailwind responsive classes
- [x] T061 [P] [US4] Optimize Header component for mobile screens in frontend/src/components/layout/Header.tsx
- [x] T062 [P] [US4] Optimize TaskList layout for mobile screens in frontend/src/components/tasks/TaskList.tsx
- [x] T063 [P] [US4] Optimize TaskItem layout for mobile screens in frontend/src/components/tasks/TaskItem.tsx

### Touch Interactions

- [x] T064 [US4] Increase button sizes for touch-friendly interactions on mobile
- [x] T065 [US4] Optimize modal interactions for mobile devices in frontend/src/components/ui/Modal.tsx
- [x] T066 [US4] Optimize form inputs for mobile keyboards in frontend/src/components/ui/Input.tsx

### Mobile Testing

- [ ] T067 [US4] Test all features on iOS Safari (iPhone and iPad)
- [ ] T068 [US4] Test all features on Android Chrome (phone and tablet)
- [ ] T069 [US4] Verify no horizontal scrolling on mobile devices
- [ ] T070 [US4] Verify touch gestures work smoothly (tap, scroll, swipe)

**Checkpoint**: All user stories should work seamlessly across all device types and screen sizes

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

### Loading States

- [x] T071 [P] Add loading indicators for all async operations (signin, signup, task CRUD)
- [x] T072 [P] Add skeleton loaders for initial page loads in dashboard

### Error Handling

- [x] T073 [P] Add toast notifications for success messages across all operations
- [x] T074 [P] Add toast notifications for error messages across all operations
- [x] T075 Add error boundaries for graceful error handling in frontend/src/app/layout.tsx

### Accessibility

- [x] T076 [P] Add ARIA labels to all interactive elements
- [x] T077 [P] Add keyboard navigation support (Tab, Enter, Escape)
- [ ] T078 [P] Verify screen reader compatibility

### Performance

- [ ] T079 [P] Implement code splitting for route-based lazy loading
- [ ] T080 [P] Optimize images and assets for faster loading
- [x] T081 Verify 60fps UI interactions and smooth animations

### Validation

- [ ] T082 Run quickstart.md validation to verify all setup steps work
- [ ] T083 Verify all success criteria from spec.md are met
- [ ] T084 Test edge cases (long titles, many tasks, slow network, token expiration)

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 for authentication but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US2 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Enhances all stories but independently testable

### Within Each User Story

- Components before integration
- Forms before page integration
- Core functionality before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch authentication forms together:
Task T026: "Update SigninForm to use Better Auth signin"
Task T027: "Update SignupForm to use Better Auth signup"

# Launch authentication pages together:
Task T032: "Update signin page to use Better Auth"
Task T033: "Update signup page to use Better Auth"
```

---

## Parallel Example: User Story 2

```bash
# Launch task display components together:
Task T038: "Create TaskSkeleton component for loading state"
Task T039: "Create TaskEmptyState component for no tasks"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - Authentication!)
3. Add User Story 2 → Test independently → Deploy/Demo (Task Management!)
4. Add User Story 3 → Test independently → Deploy/Demo (Task Completion!)
5. Add User Story 4 → Test independently → Deploy/Demo (Responsive Design!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (Task Management) - can start in parallel
   - Developer C: User Story 3 (Task Completion) - can start in parallel
   - Developer D: User Story 4 (Responsive Design) - can start in parallel
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
- Better Auth and React Query are foundational dependencies that block all user stories
