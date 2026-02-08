---
id: 002
title: Create UI/UX Enhancement Implementation Plan
stage: plan
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5
feature: 004-ui-ux-enhancement
branch: 004-ui-ux-enhancement
user: system
command: /sp.plan
labels: ["planning", "architecture", "ui-ux", "theme-system", "session-consistency", "design"]
links:
  spec: specs/004-ui-ux-enhancement/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-ui-ux-enhancement/plan.md
  - specs/004-ui-ux-enhancement/research.md
  - specs/004-ui-ux-enhancement/data-model.md
  - specs/004-ui-ux-enhancement/contracts/theme-system-contracts.md
  - specs/004-ui-ux-enhancement/quickstart.md
tests:
  - None (planning phase)
---

## Prompt

User executed `/sp.plan` command with detailed implementation planning objectives:

**Objective**: Upgrade the existing Todo frontend to a polished, consistent, theme-enabled interface while fixing session-driven task isolation and removing hard-coded identity data.

**Implementation Planning Tasks**:
1. Theme System - Integrate ShadCN theme provider, implement dark/light toggle, ensure persistence
2. Header Redesign - Replace hard-coded email with session-driven value from Better Auth state
3. Session-Aware Data Refresh - Ensure tasks fetch after login, clear on logout, prevent stale data
4. UI Visual Upgrade - Improve color palette, create modern appearance, standardize typography
5. Footer Implementation - Global footer with copyright and "Made with love by Abdul Rafay"

**Agent Execution Strategy**: UI redesign → Frontend Builder, Theme system → ShadCN + UI skills, Header auth binding → Better Auth integration, Session/task refresh → Next.js + state management

**Architecture Adjustments**: Global layout controls (theme provider, header, footer), central session listener (reacts to login/logout, triggers task refetch), shared design tokens via Tailwind config

**Validation Checklist**: Theme toggle works instantly, theme persists after refresh, header email updates based on logged-in user, logout clears tasks, login loads correct tasks automatically, no stale UI data, footer visible on all screens, UI consistency maintained

## Response snapshot

Successfully completed comprehensive implementation plan for **UI/UX Enhancement & Session Consistency Improvements** feature (004-ui-ux-enhancement):

### Planning Artifacts Generated

**1. Implementation Plan (plan.md)**:
- Complete technical context (TypeScript 5.x, Next.js 16, React Query, shadcn/ui)
- Constitution check with all 6 principles validated (100% pass rate)
- Project structure with 15-20 component modifications
- 5 critical design decisions documented with rationale
- 6 implementation phases defined
- Verification strategy with manual test scenarios
- Risk mitigation for 4 identified risks

**2. Research Documentation (research.md)**:
- 5 research topics investigated and resolved
- Technology choices: next-themes (^0.2.1), jwt-decode (^4.0.0)
- Implementation patterns for theme system, cache clearing, JWT decoding
- Comparison of cache clearing strategies (clear() vs invalidateQueries)
- localStorage fallback strategies
- All decisions documented with rationale

**3. Data Model (data-model.md)**:
- 4 client-side data structures defined
- Theme preference (localStorage)
- JWT token (localStorage + decoded in-memory)
- React Query cache (in-memory)
- Theme context (React Context)
- Data flow diagrams for theme switching, session consistency, dynamic header
- Validation rules and privacy/security considerations

**4. API Contracts (contracts/theme-system-contracts.md)**:
- 8 client-side interface contracts defined
- ThemeProvider configuration
- useTheme hook interface
- JWT decode utility functions
- Cache management interfaces
- Header/Footer/ThemeToggle component props
- useAuth custom hook
- All contracts type-safe with error handling

**5. Quickstart Guide (quickstart.md)**:
- Complete setup instructions (dependencies, Tailwind config)
- Step-by-step implementation guide (4 phases)
- 5 comprehensive test scenarios
- Validation checklist (12 FRs, 10 SCs)
- Troubleshooting section
- Performance validation methods
- Deployment checklist

### Key Design Decisions

**Decision 1: Theme System** - next-themes provider with shadcn/ui integration
- Rationale: Standard Next.js solution, SSR-safe, automatic persistence
- Alternative rejected: Custom theme context (reinventing wheel)

**Decision 2: Cache Clearing** - `queryClient.clear()` on sign-out
- Rationale: Guarantees no stale data, simple, deterministic
- Alternative rejected: Selective invalidation (complex, error-prone)

**Decision 3: JWT Decoding** - Decode in protected layout, pass email as prop
- Rationale: Centralized logic, Header remains presentational
- Alternative rejected: Decode in Header (couples to auth logic)

**Decision 4: Theme Toggle Placement** - In Header component (top-right)
- Rationale: Accessible from all pages, standard UI pattern
- Alternative rejected: Settings page (requires navigation)

**Decision 5: Footer Implementation** - Global component in both layouts
- Rationale: Consistent branding, simple, theme-aware
- Alternative rejected: Per-page footers (inconsistent)

### Architecture Overview

**System Context**:
- Browser Environment → Next.js App Router → Root Layout (ThemeProvider + QueryClientProvider) → Protected Layout (Header + Footer + Auth check) → Dashboard (TaskList)
- Client-Side Storage: localStorage (theme + JWT), React Query cache (tasks)
- Backend: FastAPI (no changes)

**Component Interaction Flows**:
1. Theme Switching: User clicks → setTheme() → Apply class → Save to localStorage
2. Session Consistency: Sign out → clear cache → remove token → redirect → Sign in → store token → fetch fresh data
3. Dynamic Header: Layout mounts → Read token → Decode → Extract email → Display

### Constitution Check Results

**Pre-Design Evaluation**: ✅ PASS (6/6 principles)
**Post-Design Re-evaluation**: ✅ PASS (6/6 principles confirmed)

- ✅ Spec-Driven Development First: Complete spec → plan → tasks workflow
- ✅ Security-by-Design: Cache clearing prevents data leakage, JWT decoding safe
- ✅ Deterministic & Reproducible: All patterns documented, reproducible from artifacts
- ✅ Separation of Concerns: Clear component boundaries, utility functions isolated
- ✅ Zero Manual Coding: Ready for automated implementation
- ✅ Production-Oriented: Error handling, performance targets, accessibility, fallbacks

### Technical Specifications

**Dependencies**:
- New: next-themes@^0.2.1, jwt-decode@^4.0.0
- Existing: Next.js 16, React 19, React Query, shadcn/ui, Tailwind CSS 4

**Performance Goals**:
- Theme switching: <100ms
- Header email display: <200ms
- Cache invalidation: Complete before redirect
- No visual flickering

**Constraints**:
- No backend modifications
- No additional API calls for user data
- Maintain backward compatibility
- Use shadcn/ui theming system
- Decode JWT client-side only

**Files to Modify**: 15-20 files
- app/layout.tsx, app/providers.tsx
- app/(protected)/layout.tsx
- components/layout/Header.tsx (modify)
- components/layout/Footer.tsx (create)
- components/layout/ThemeToggle.tsx (create)
- lib/auth.ts (add JWT decode + cache clearing)
- hooks/useAuth.ts (create)
- types/auth.ts, types/theme.ts
- package.json, tailwind.config.ts

## Outcome

- ✅ Impact: Complete implementation plan with 5 design artifacts (plan, research, data-model, contracts, quickstart), 5 critical design decisions, 6 implementation phases, comprehensive testing strategy
- 🧪 Tests: Planning phase - defined 5 manual test scenarios, validation checklist with 12 FRs and 10 SCs
- 📁 Files: Created 5 files in specs/004-ui-ux-enhancement/ (plan.md, research.md, data-model.md, contracts/theme-system-contracts.md, quickstart.md)
- 🔁 Next prompts: Run `/sp.tasks` to generate actionable implementation tasks, then `/sp.implement` to execute
- 🧠 Reflection: Planning phase complete with comprehensive design. All constitutional principles validated. Critical P1 (session consistency) addresses data isolation bug. Implementation patterns clearly defined. Ready for task generation.

## Evaluation notes (flywheel)

- Failure modes observed: Bash script for PHR creation not available (resolved by manual PHR creation)
- Graders run and results (PASS/FAIL): Constitution Check PASS (6/6 principles pre-design, 6/6 post-design), Agent context update PASS
- Prompt variant (if applicable): Standard /sp.plan workflow with detailed user objectives
- Next experiment (smallest change to try): Generate tasks with `/sp.tasks` focusing on P1 (session consistency) as MVP, then proceed to implementation
