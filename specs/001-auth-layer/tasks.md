---

description: "Task list for Authentication & Identity Layer implementation"
---

# Tasks: Authentication & Identity Layer

**Input**: Design documents from `/specs/001-auth-layer/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below follow web application structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend project directories
- [x] T002 Create frontend project directories
- [x] T003 [P] Initialize backend Python project with requirements.txt containing fastapi, sqlmodel, python-jose, passlib, psycopg2-binary, uvicorn
- [x] T004 [P] Initialize Next.js project with cmd `npx create-next-app@latest typescript --tailwind --eslint --src-dir --import-alias "@/*" .` in frontend directory
- [x] T005 [P] Create root .env.example file with BETTER_AUTH_SECRET and DATABASE_URL
- [x] T006 [P] Create backend/.env.example file with environment variable templates
- [x] T007 [P] Create frontend/.env.local.example file with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET templates
- [x] T008 [P] Add .env to .gitignore to prevent secret exposure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create database migration script backend/migrations/001_create_users_table.sql with users table, indexes, and triggers
- [x] T010 [P] Implement environment configuration loader in backend/src/core/config.py to load BETTER_AUTH_SECRET and DATABASE_URL
- [x] T011 [P] Implement password hashing utilities in backend/src/core/security.py using passlib with bcrypt
- [x] T012 [P] Implement JWT token creation function in backend/src/auth/jwt_handler.py with 7-day expiry
- [x] T013 [P] Implement JWT token verification function in backend/src/auth/jwt_handler.py with signature validation
- [x] T014 [P] Implement user extraction from JWT in backend/src/auth/jwt_handler.py to decode and return user_id
- [x] T015 Implement get_current_user dependency in backend/src/auth/dependencies.py using FastAPI Depends and HTTPBearer
- [x] T016 [P] Create database connection setup in backend/src/core/database.py with SQLModel engine and session management
- [x] T017 [P] Create FastAPI application instance in backend/src/main.py with CORS configuration

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel
- [ ] T011 [P] Implement password hashing utilities in backend/src/core/security.py using passlib with bcrypt
- [ ] T012 [P] Implement JWT token creation function in backend/src/auth/jwt_handler.py with 7-day expiry
- [ ] T013 [P] Implement JWT token verification function in backend/src/auth/jwt_handler.py with signature validation
- [ ] T014 [P] Implement user extraction from JWT in backend/src/auth/jwt_handler.py to decode and return user_id
- [ ] T015 Implement get_current_user dependency in backend/src/auth/dependencies.py using FastAPI Depends and HTTPBearer
- [ ] T016 [P] Create database connection setup in backend/src/core/database.py with SQLModel engine and session management
- [ ] T017 [P] Create FastAPI application instance in backend/src/main.py with CORS configuration

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Sign Up (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts with email and password validation

**Independent Test**: Visit signup page, enter valid credentials, verify account created and user authenticated

### Implementation for User Story 1

- [x] T018 [P] [US1] Create User model in backend/src/models/user.py with UUID id, email, hashed_password, timestamps
- [x] T019 [P] [US1] Create UserCreate schema in backend/src/models/user.py with email and password validation
- [x] T020 [P] [US1] Create UserResponse schema in backend/src/models/user.py without password field
- [x] T021 [US1] Implement signup endpoint POST /auth/signup in backend/src/api/auth.py with email validation
- [x] T022 [US1] Add duplicate email check in signup endpoint backend/src/api/auth.py before user creation
- [x] T023 [US1] Add password strength validation in signup endpoint backend/src/api/auth.py (min 8 chars, complexity)
- [x] T024 [US1] Add password hashing in signup endpoint backend/src/api/auth.py using security utilities
- [x] T025 [US1] Add user creation in signup endpoint backend/src/api/auth.py with database session
- [x] T026 [US1] Add JWT token generation in signup endpoint backend/src/api/auth.py after successful creation
- [x] T027 [US1] Add error handling in signup endpoint backend/src/api/auth.py for duplicate email (400) and validation errors (422)
- [x] T028 [P] [US1] Configure Better Auth client in frontend/src/lib/auth.ts with JWT strategy and 7-day expiry
- [x] T029 [P] [US1] Create API client utility in frontend/src/lib/api-client.ts with automatic token injection
- [x] T030 [P] [US1] Create SignupForm component in frontend/src/components/auth/SignupForm.tsx with email and password inputs
- [x] T031 [US1] Add client-side email validation in SignupForm component frontend/src/components/auth/SignupForm.tsx
- [x] T032 [US1] Add client-side password strength validation in SignupForm component frontend/src/components/auth/SignupForm.tsx
- [x] T033 [US1] Add signup API call in SignupForm component frontend/src/components/auth/SignupForm.tsx using api-client
- [x] T034 [US1] Add token storage in SignupForm component frontend/src/components/auth/SignupForm.tsx to localStorage
- [x] T035 [US1] Add error display in SignupForm component frontend/src/components/auth/SignupForm.tsx for duplicate email and validation errors
- [x] T036 [US1] Create signup page in frontend/src/app/(auth)/signup/page.tsx using SignupForm component
- [x] T037 [US1] Add redirect to dashboard after successful signup in frontend/src/app/(auth)/signup/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Sign In (Priority: P2)

**Goal**: Enable returning users to authenticate with their credentials

**Independent Test**: Use previously created credentials to sign in, verify user gains access to account

### Implementation for User Story 2

- [x] T038 [P] [US2] Create UserSignIn schema in backend/src/models/user.py with email and password fields
- [x] T039 [US2] Implement signin endpoint POST /auth/signin in backend/src/api/auth.py with credential lookup
- [x] T040 [US2] Add email normalization in signin endpoint backend/src/api/auth.py (convert to lowercase)
- [x] T041 [US2] Add user lookup by email in signin endpoint backend/src/api/auth.py using database session
- [x] T042 [US2] Add password verification in signin endpoint backend/src/api/auth.py using security utilities
- [x] T043 [US2] Add JWT token generation in signin endpoint backend/src/api/auth.py after successful verification
- [x] T044 [US2] Add error handling in signin endpoint backend/src/api/auth.py with generic "Invalid credentials" message (401)
- [x] T045 [P] [US2] Create SigninForm component in frontend/src/components/auth/SigninForm.tsx with email and password inputs
- [x] T046 [US2] Add signin API call in SigninForm component frontend/src/components/auth/SigninForm.tsx using api-client
- [x] T047 [US2] Add token storage in SigninForm component frontend/src/components/auth/SigninForm.tsx to localStorage
- [x] T048 [US2] Add error display in SigninForm component frontend/src/components/auth/SigninForm.tsx for invalid credentials
- [x] T049 [US2] Create signin page in frontend/src/app/(auth)/signin/page.tsx using SigninForm component
- [x] T050 [US2] Add redirect to dashboard after successful signin in frontend/src/app/(auth)/signin/page.tsx
- [x] T051 [US2] Add redirect to dashboard if already authenticated in frontend/src/app/(auth)/signin/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

### Implementation for User Story 2

- [ ] T038 [P] [US2] Create UserSignIn schema in backend/src/models/user.py with email and password fields
- [ ] T039 [US2] Implement signin endpoint POST /auth/signin in backend/src/api/auth.py with credential lookup
- [ ] T040 [US2] Add email normalization in signin endpoint backend/src/api/auth.py (convert to lowercase)
- [ ] T041 [US2] Add user lookup by email in signin endpoint backend/src/api/auth.py using database session
- [ ] T042 [US2] Add password verification in signin endpoint backend/src/api/auth.py using security utilities
- [ ] T043 [US2] Add JWT token generation in signin endpoint backend/src/api/auth.py after successful verification
- [ ] T044 [US2] Add error handling in signin endpoint backend/src/api/auth.py with generic "Invalid credentials" message (401)
- [ ] T045 [P] [US2] Create SigninForm component in frontend/src/components/auth/SigninForm.tsx with email and password inputs
- [ ] T046 [US2] Add signin API call in SigninForm component frontend/src/components/auth/SigninForm.tsx using api-client
- [ ] T047 [US2] Add token storage in SigninForm component frontend/src/components/auth/SigninForm.tsx to localStorage
- [ ] T048 [US2] Add error display in SigninForm component frontend/src/components/auth/SigninForm.tsx for invalid credentials
- [ ] T049 [US2] Create signin page in frontend/src/app/(auth)/signin/page.tsx using SigninForm component
- [ ] T050 [US2] Add redirect to dashboard after successful signin in frontend/src/app/(auth)/signin/page.tsx
- [ ] T051 [US2] Add redirect to dashboard if already authenticated in frontend/src/app/(auth)/signin/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Protected API Access (Priority: P3)

**Goal**: Enforce authentication on all API operations and ensure data isolation

**Independent Test**: Make API requests with/without tokens, verify only authenticated requests succeed and users can only access own data

### Implementation for User Story 3

- [x] T052 [US3] Implement GET /auth/me endpoint in backend/src/api/auth.py with get_current_user dependency
- [x] T053 [US3] Add user lookup by ID in /auth/me endpoint backend/src/api/auth.py using extracted user_id from token
- [x] T054 [US3] Add error handling in /auth/me endpoint backend/src/api/auth.py for user not found (401)
- [x] T055 [P] [US3] Create example protected endpoint GET /api/example in backend/src/api/protected.py with get_current_user dependency
- [x] T056 [US3] Add query filtering by user_id in protected endpoint backend/src/api/protected.py to demonstrate data isolation
- [x] T057 [P] [US3] Add 401 error handling in API client frontend/src/lib/api-client.ts to detect expired tokens
- [x] T058 [US3] Add token removal in API client frontend/src/lib/api-client.ts when 401 detected
- [x] T059 [US3] Add redirect to signin in API client frontend/src/lib/api-client.ts when 401 detected
- [x] T060 [P] [US3] Create Next.js middleware in frontend/src/middleware.ts to check authentication on protected routes
- [x] T061 [US3] Add redirect to signin in Next.js middleware frontend/src/middleware.ts for unauthenticated users
- [x] T062 [US3] Register auth router in FastAPI application backend/src/main.py with /auth prefix
- [x] T063 [US3] Register protected router in FastAPI application backend/src/main.py with /api prefix

**Checkpoint**: All user stories should now be independently functional

### Implementation for User Story 3

- [ ] T052 [US3] Implement GET /auth/me endpoint in backend/src/api/auth.py with get_current_user dependency
- [ ] T053 [US3] Add user lookup by ID in /auth/me endpoint backend/src/api/auth.py using extracted user_id from token
- [ ] T054 [US3] Add error handling in /auth/me endpoint backend/src/api/auth.py for user not found (401)
- [ ] T055 [P] [US3] Create example protected endpoint GET /api/example in backend/src/api/protected.py with get_current_user dependency
- [ ] T056 [US3] Add query filtering by user_id in protected endpoint backend/src/api/protected.py to demonstrate data isolation
- [ ] T057 [P] [US3] Add 401 error handling in API client frontend/src/lib/api-client.ts to detect expired tokens
- [ ] T058 [US3] Add token removal in API client frontend/src/lib/api-client.ts when 401 detected
- [ ] T059 [US3] Add redirect to signin in API client frontend/src/lib/api-client.ts when 401 detected
- [ ] T060 [P] [US3] Create Next.js middleware in frontend/src/middleware.ts to check authentication on protected routes
- [ ] T061 [US3] Add redirect to signin in Next.js middleware frontend/src/middleware.ts for unauthenticated users
- [ ] T062 [US3] Register auth router in FastAPI application backend/src/main.py with /auth prefix
- [ ] T063 [US3] Register protected router in FastAPI application backend/src/main.py with /api prefix

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T064 [P] Create root layout in frontend/src/app/layout.tsx with Better Auth provider
- [x] T065 [P] Add global error boundary in frontend/src/app/layout.tsx for authentication errors
- [x] T066 [P] Add API documentation generation in backend/src/main.py using FastAPI automatic docs
- [x] T067 [P] Create README.md with setup instructions referencing quickstart.md
- [x] T068 [P] Verify all environment variables loaded correctly in backend/src/core/config.py with validation
- [x] T069 [P] Verify shared secret matches between frontend and backend configurations
- [x] T070 Run quickstart.md validation checklist to verify all success criteria

- [ ] T064 [P] Create root layout in frontend/src/app/layout.tsx with Better Auth provider
- [ ] T065 [P] Add global error boundary in frontend/src/app/layout.tsx for authentication errors
- [ ] T066 [P] Add API documentation generation in backend/src/main.py using FastAPI automatic docs
- [ ] T067 [P] Create README.md with setup instructions referencing quickstart.md
- [ ] T068 [P] Verify all environment variables loaded correctly in backend/src/core/config.py with validation
- [ ] T069 [P] Verify shared secret matches between frontend and backend configurations
- [ ] T070 Run quickstart.md validation checklist to verify all success criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Create User model in backend/src/models/user.py"
Task: "Create UserCreate schema in backend/src/models/user.py"
Task: "Create UserResponse schema in backend/src/models/user.py"

# Launch frontend components in parallel:
Task: "Configure Better Auth client in frontend/src/lib/auth.ts"
Task: "Create API client utility in frontend/src/lib/api-client.ts"
Task: "Create SignupForm component in frontend/src/components/auth/SignupForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T018-T037)
   - Developer B: User Story 2 (T038-T051)
   - Developer C: User Story 3 (T052-T063)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 70
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKS all user stories)
- **Phase 3 (User Story 1 - Sign Up)**: 20 tasks
- **Phase 4 (User Story 2 - Sign In)**: 14 tasks
- **Phase 5 (User Story 3 - Protected Access)**: 12 tasks
- **Phase 6 (Polish)**: 7 tasks

**Parallel Opportunities**: 31 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- **US1**: Visit signup page → enter credentials → verify account created
- **US2**: Use existing credentials → sign in → verify access granted
- **US3**: Make API requests with/without tokens → verify authentication enforced

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 37 tasks

**Format Validation**: ✅ All 70 tasks follow checklist format with checkbox, ID, optional [P] and [Story] labels, and file paths
