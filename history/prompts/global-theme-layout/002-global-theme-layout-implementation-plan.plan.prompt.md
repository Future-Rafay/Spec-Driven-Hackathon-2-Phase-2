---
id: 002
title: global-theme-layout-implementation-plan
stage: plan
date: 2026-02-10
surface: agent
model: claude-sonnet-4-5
feature: global-theme-layout
branch: 007-global-theme-layout
user: user
command: /sp.plan
labels: ["planning", "architecture", "theme-system", "layout", "landing-page", "design-decisions"]
links:
  spec: specs/007-global-theme-layout/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/007-global-theme-layout/plan.md
  - specs/007-global-theme-layout/research.md
  - specs/007-global-theme-layout/quickstart.md
  - CLAUDE.md (updated with new technology context)
tests:
  - N/A (planning phase)
---

## Prompt

/sp.plan

Objective:
Introduce global layout system + theme toggle + strong SaaS-style landing UI.

Plan:

1. Global Layout Layer
   * Create public layout wrapper: Global header, Page content, Global footer
   * Apply to: Landing, Signin, Signup
   * Exclude dashboard (keeps its own layout)

2. Header Design
   * Left: ToDo brand typography
   * Right: Theme toggle (ShadCN), Profile/status icon
   * No auth buttons

3. Footer Design
   * Minimal, centered content
   * Copyright + credit line
   * Consistent spacing + colors

4. Theme System
   * Implement ShadCN theme provider
   * Add dark/light toggle component
   * Persist theme preference
   * Ensure contrast consistency across UI

5. Landing Page Redesign
   * SaaS-style structure: Hero section, Value proposition, Features grid, Visual preview sections
   * Make it visually strong for screenshots

6. Consistency Rules
   * Unified font system
   * Shared spacing scale
   * Color tokens used across components

Validation:
   * Theme switch updates all pages instantly
   * Public pages use global header/footer
   * Dashboard remains unaffected
   * Landing page looks modern, clean, and presentation-ready

## Response snapshot

Created comprehensive implementation plan for global theme switcher, shared header/footer, and landing page redesign.

**Planning Artifacts Generated**:

1. **plan.md** (558 lines):
   - Technical context and dependencies
   - Constitution compliance check (all gates passed)
   - 5 architecture decisions with rationale
   - 4 implementation phases
   - File modification plan (7 new files, 2 modified files)
   - Testing strategy with manual checklists
   - Risk mitigation strategies
   - Success metrics mapping

2. **research.md** (450+ lines):
   - Validated existing next-themes configuration
   - Documented ThemeToggle component (reusable)
   - Verified Tailwind CSS theme system
   - Analyzed Next.js layout composition patterns
   - Confirmed typography configuration (Inter, Montserrat)
   - Validated all technical prerequisites met
   - No blockers identified

3. **quickstart.md** (500+ lines):
   - Quick test checklist (~20 minutes)
   - Detailed testing instructions for 7 test categories
   - Theme switching tests (4 scenarios)
   - Layout consistency tests (3 scenarios)
   - Landing page tests (4 sections)
   - Responsive design tests (3 breakpoints)
   - Accessibility tests (3 areas)
   - Performance tests (2 metrics)
   - Cross-browser testing guide
   - Common issues and solutions

**Key Architecture Decisions**:

1. **Layout Composition**: Route-based using Next.js App Router (PublicLayout for public pages, existing protected layout unchanged)
2. **Theme System**: Reuse existing next-themes setup (no changes needed)
3. **Landing Page Structure**: Modular section components (HeroSection, FeaturesSection, DashboardPreview, TaskPreview)
4. **Typography**: Use existing Inter + Montserrat configuration (meets SC-008)
5. **Color System**: Tailwind CSS variables with dark: variants (WCAG AA compliant)

**Implementation Scope**:
- 7 new components to create
- 2 files to modify
- 5 files to preserve (no changes)
- 0 new dependencies required
- Frontend-only changes (no backend/API modifications)

**Constitution Compliance**: ✅ All gates passed
- Spec-driven development workflow followed
- No security implications (frontend UI only)
- Deterministic and reproducible patterns
- Clear separation of concerns
- Zero manual coding approach
- Production-oriented architecture

**Agent Context Updated**: Added TypeScript 5.x with Next.js 16+ App Router and localStorage theme persistence to CLAUDE.md

## Outcome

- ✅ Impact: Created complete implementation plan with 5 architecture decisions, 4 implementation phases, and comprehensive testing strategy
- 🧪 Tests: Manual testing checklist with 7 categories covering theme switching, layout consistency, landing page, responsive design, accessibility, performance, and cross-browser compatibility
- 📁 Files: Created plan.md (558 lines), research.md (450+ lines), quickstart.md (500+ lines), updated CLAUDE.md
- 🔁 Next prompts: /sp.tasks (generate implementation tasks), /sp.implement (execute tasks)
- 🧠 Reflection: Successfully validated all technical prerequisites. No blockers found. All required infrastructure (next-themes, Tailwind, Next.js layouts) already in place. Implementation can proceed directly to component creation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully with all prerequisites validated
- Graders run and results (PASS/FAIL): Constitution Check PASS (all gates), Research validation PASS (no blockers), Architecture decisions PASS (5 decisions documented with rationale)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-provided high-level plan
- Next experiment (smallest change to try): Proceed to /sp.tasks to generate atomic, testable implementation tasks based on this plan
