# Tasks: Global Theme Switcher, Shared Header/Footer & Landing Page Redesign

**Input**: Design documents from `/specs/007-global-theme-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Manual testing only - no automated test tasks included (per specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for all frontend code
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure and create component directories

- [X] T001 Verify next-themes configuration in frontend/src/app/providers.tsx
- [X] T002 Verify ThemeToggle component exists and works in frontend/src/components/layout/ThemeToggle.tsx
- [X] T003 [P] Create landing components directory at frontend/src/components/landing/
- [X] T004 [P] Verify Tailwind CSS theme configuration in frontend/src/app/globals.css
- [X] T005 [P] Verify font configuration (Inter, Montserrat) in frontend/src/app/layout.tsx

**Checkpoint**: Infrastructure validated - all prerequisites confirmed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Note**: All foundational infrastructure already exists (next-themes, Tailwind, fonts). No blocking tasks needed.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Global Theme Switching (Priority: P1) 🎯 MVP

**Goal**: Enable users to toggle between light and dark themes on all pages with persistence and smooth transitions

**Independent Test**: Click theme toggle on any page (landing, signin, signup, dashboard) and verify theme changes immediately, persists across navigation, and maintains good contrast in both modes

**Why MVP**: Theme switching is the foundation for all visual improvements and must work consistently before other UI changes can be evaluated

### Implementation for User Story 1

- [X] T006 [US1] Verify theme toggle appears in dashboard header at frontend/src/components/layout/Header.tsx
- [X] T007 [US1] Test theme switching on dashboard page - verify all task components support dark mode
- [X] T008 [US1] Test theme persistence across browser sessions using localStorage key 'todo-theme'
- [X] T009 [US1] Verify no FOUC (flash of unstyled content) on page load in both themes
- [X] T010 [US1] Test smooth theme transitions without layout shifts on all existing pages

**Checkpoint**: Theme switching works on all existing pages (dashboard, signin, signup). Ready to add public layout.

---

## Phase 4: User Story 2 - Consistent Public Page Layout (Priority: P2)

**Goal**: Provide consistent header and footer across all public pages (landing, signin, signup) while preserving dashboard layout

**Independent Test**: Navigate between landing, signin, and signup pages and verify same header (app name + theme toggle) and footer (copyright + attribution) appear consistently, while dashboard retains its own layout

**Why This Priority**: After theme switching works, consistent navigation and branding across public pages is essential for professional appearance

### Implementation for User Story 2

- [X] T011 [P] [US2] Create PublicHeader component in frontend/src/components/layout/PublicHeader.tsx
- [X] T012 [P] [US2] Create PublicFooter component in frontend/src/components/layout/PublicFooter.tsx
- [X] T013 [US2] Create PublicLayout component in frontend/src/components/layout/PublicLayout.tsx (depends on T011, T012)
- [X] T014 [US2] Update auth layout to use PublicLayout in frontend/src/app/(auth)/layout.tsx
- [X] T015 [US2] Test PublicHeader appears on signin page with app name, theme toggle, and profile icon
- [X] T016 [US2] Test PublicFooter appears on signin page with copyright and "Made with love by Abdul Rafay"
- [X] T017 [US2] Test PublicHeader appears on signup page matching signin layout exactly
- [X] T018 [US2] Test PublicFooter appears on signup page matching signin layout exactly
- [X] T019 [US2] Verify dashboard header and footer remain unchanged (different from public pages)

**Checkpoint**: Public pages (signin, signup) now have consistent header/footer. Dashboard layout preserved. Ready for landing page redesign.

---

## Phase 5: User Story 3 - Modern Landing Page Experience (Priority: P3)

**Goal**: Create attractive, modern SaaS-style landing page with hero section, feature highlights, and visual preview sections suitable for screenshots

**Independent Test**: Visit landing page and verify compelling hero section, clear feature highlights, and visually polished sections work in both light and dark themes

**Why This Priority**: Once theme and layout consistency are established, landing page redesign provides marketing and first-impression value

### Implementation for User Story 3

- [X] T020 [P] [US3] Create HeroSection component in frontend/src/components/landing/HeroSection.tsx
- [X] T021 [P] [US3] Create FeaturesSection component in frontend/src/components/landing/FeaturesSection.tsx
- [X] T022 [P] [US3] Create DashboardPreview component in frontend/src/components/landing/DashboardPreview.tsx
- [X] T023 [P] [US3] Create TaskPreview component in frontend/src/components/landing/TaskPreview.tsx
- [X] T024 [US3] Redesign landing page in frontend/src/app/page.tsx using PublicLayout and landing sections (depends on T020, T021, T022, T023)
- [X] T025 [US3] Test hero section displays with clear value proposition and CTA buttons
- [X] T026 [US3] Test features section shows at least 3 feature highlights with icons
- [X] T027 [US3] Test dashboard preview section displays correctly
- [X] T028 [US3] Test task preview section displays correctly
- [X] T029 [US3] Verify all landing sections work in both light and dark themes
- [X] T030 [US3] Test CTA buttons navigate to signup and signin pages correctly
- [X] T031 [US3] Verify landing page is responsive on mobile (375px), tablet (768px), and desktop (1920px)

**Checkpoint**: Landing page redesigned with modern SaaS style. All sections work in both themes. Ready for typography polish.

---

## Phase 6: User Story 4 - Typography and Brand Consistency (Priority: P4)

**Goal**: Ensure consistent typography, spacing, and branding across all pages for cohesive, professional appearance

**Independent Test**: Navigate through all pages (landing, signin, signup, dashboard) and verify font families, sizes, weights, spacing, and color usage follow consistent design system

**Why This Priority**: Polish layer that enhances overall experience after core functionality is in place

### Implementation for User Story 4

- [X] T032 [P] [US4] Apply consistent font families (Inter for body, Montserrat for headings) across PublicHeader
- [X] T033 [P] [US4] Apply consistent font families across all landing page sections
- [X] T034 [P] [US4] Verify consistent heading hierarchy (h1, h2, h3) across all pages
- [X] T035 [P] [US4] Apply consistent spacing scale (padding, margins) to PublicLayout components
- [X] T036 [P] [US4] Verify color usage follows Tailwind theme tokens (background, foreground, primary, etc.)
- [X] T037 [US4] Test WCAG AA contrast compliance (4.5:1 for normal text, 3:1 for large text) in both themes
- [X] T038 [US4] Verify app name in PublicHeader uses distinctive Montserrat typography
- [X] T039 [US4] Test consistent spacing between all landing page sections
- [X] T040 [US4] Verify max 2 font families used across entire application (Inter + Montserrat)

**Checkpoint**: Typography and spacing consistent across all pages. Brand identity established. Feature complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements that affect multiple user stories

- [X] T041 [P] Run quickstart.md validation checklist for theme switching (8 tests)
- [X] T042 [P] Run quickstart.md validation checklist for layout consistency (8 tests)
- [X] T043 [P] Run quickstart.md validation checklist for landing page (9 tests)
- [X] T044 [P] Run quickstart.md validation checklist for responsive design (3 breakpoints)
- [X] T045 [P] Run quickstart.md validation checklist for accessibility (3 tests)
- [X] T046 [P] Run quickstart.md validation checklist for performance (2 tests)
- [X] T047 Test theme switch performance < 200ms using browser DevTools Performance API
- [X] T048 Test landing page load time < 2 seconds using Lighthouse
- [X] T049 Verify all 12 success criteria from spec.md are met
- [X] T050 Take screenshots of landing page sections in both light and dark themes

**Checkpoint**: All validation complete. Feature ready for production.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - No blocking tasks (infrastructure exists)
- **User Story 1 (Phase 3)**: Can start after Setup - Validates existing theme system
- **User Story 2 (Phase 4)**: Depends on US1 completion - Needs theme system working
- **User Story 3 (Phase 5)**: Depends on US2 completion - Needs PublicLayout for landing page
- **User Story 4 (Phase 6)**: Depends on US3 completion - Polishes all pages including landing
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 - Needs theme system validated before adding public layout
- **User Story 3 (P3)**: Depends on US2 - Needs PublicLayout before redesigning landing page
- **User Story 4 (P4)**: Depends on US3 - Polishes all pages including new landing page

### Within Each User Story

- **US1**: Sequential validation tasks (theme system already exists)
- **US2**: Parallel component creation (T011, T012), then PublicLayout (T013), then integration (T014), then testing
- **US3**: Parallel section creation (T020-T023), then landing page redesign (T024), then testing
- **US4**: Parallel typography application across components, then validation

### Parallel Opportunities

**Phase 1 (Setup)**:
- T003, T004, T005 can run in parallel (different files)

**Phase 4 (US2)**:
- T011 (PublicHeader) and T012 (PublicFooter) can run in parallel (different files)

**Phase 5 (US3)**:
- T020 (HeroSection), T021 (FeaturesSection), T022 (DashboardPreview), T023 (TaskPreview) can all run in parallel (different files)

**Phase 6 (US4)**:
- T032, T033, T034, T035, T036 can run in parallel (different components)

**Phase 7 (Polish)**:
- T041, T042, T043, T044, T045, T046 can run in parallel (independent test categories)

---

## Parallel Example: User Story 3 (Landing Page)

```bash
# Launch all landing section components together:
Task: "Create HeroSection component in frontend/src/components/landing/HeroSection.tsx"
Task: "Create FeaturesSection component in frontend/src/components/landing/FeaturesSection.tsx"
Task: "Create DashboardPreview component in frontend/src/components/landing/DashboardPreview.tsx"
Task: "Create TaskPreview component in frontend/src/components/landing/TaskPreview.tsx"

# Then integrate them:
Task: "Redesign landing page in frontend/src/app/page.tsx using PublicLayout and landing sections"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify infrastructure)
2. Complete Phase 3: User Story 1 (validate theme system)
3. **STOP and VALIDATE**: Test theme switching on all existing pages
4. Deploy/demo if ready

**MVP Delivers**: Working theme switcher on all pages with persistence

### Incremental Delivery

1. Complete Setup → Infrastructure validated
2. Add User Story 1 → Test theme switching → Deploy/Demo (MVP!)
3. Add User Story 2 → Test public layout → Deploy/Demo
4. Add User Story 3 → Test landing page → Deploy/Demo
5. Add User Story 4 → Test typography → Deploy/Demo
6. Each story adds value without breaking previous stories

### Sequential Strategy (Recommended)

Since user stories have dependencies:

1. Complete Setup (Phase 1)
2. Complete US1 (Phase 3) → Validate theme system
3. Complete US2 (Phase 4) → Add public layout
4. Complete US3 (Phase 5) → Redesign landing page
5. Complete US4 (Phase 6) → Polish typography
6. Complete Polish (Phase 7) → Final validation

**Rationale**: US2 needs US1 (theme system), US3 needs US2 (PublicLayout), US4 needs US3 (landing page to polish)

---

## Task Summary

**Total Tasks**: 50

**Tasks by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 0 tasks (infrastructure exists)
- Phase 3 (US1 - Theme Switching): 5 tasks
- Phase 4 (US2 - Public Layout): 9 tasks
- Phase 5 (US3 - Landing Page): 12 tasks
- Phase 6 (US4 - Typography): 9 tasks
- Phase 7 (Polish): 10 tasks

**Tasks by User Story**:
- US1: 5 tasks (validation of existing theme system)
- US2: 9 tasks (3 components + integration + 5 tests)
- US3: 12 tasks (4 components + integration + 7 tests)
- US4: 9 tasks (typography application + validation)

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel within their phases

**Files to Create**: 7 new components
- PublicHeader.tsx
- PublicFooter.tsx
- PublicLayout.tsx
- HeroSection.tsx
- FeaturesSection.tsx
- DashboardPreview.tsx
- TaskPreview.tsx

**Files to Modify**: 2 existing files
- frontend/src/app/page.tsx (landing page redesign)
- frontend/src/app/(auth)/layout.tsx (wrap with PublicLayout)

**MVP Scope**: User Story 1 only (5 tasks) - validates theme system works on all pages

**Full Feature Scope**: All 4 user stories (35 implementation tasks + 5 setup + 10 polish = 50 total)

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story builds on previous stories (sequential dependencies)
- No automated tests - manual testing per quickstart.md
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All paths are absolute from repository root
- Frontend-only changes (no backend/API modifications)
