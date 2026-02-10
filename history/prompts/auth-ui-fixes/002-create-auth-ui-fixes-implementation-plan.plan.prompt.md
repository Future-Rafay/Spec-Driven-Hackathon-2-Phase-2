---
id: 002
title: Create Auth UI Fixes Implementation Plan
stage: plan
date: 2026-02-09
surface: agent
model: claude-sonnet-4-5
feature: auth-ui-fixes
branch: 006-auth-ui-fixes
user: Abdul Rafay
command: /sp.plan
labels: ["planning", "auth", "ui-fixes", "error-feedback", "timestamps", "modal", "visual-differentiation"]
links:
  spec: specs/006-auth-ui-fixes/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/006-auth-ui-fixes/plan.md
tests:
 - None (planning phase)
---

## Prompt

(Continuation from previous session)

User requested to continue generating the implementation plan for feature 006-auth-ui-fixes. The plan generation was started using a Plan subagent but output was truncated multiple times. User provided empty messages indicating to continue the work until completion.

## Response snapshot

Successfully completed comprehensive implementation plan for Auth Flow, Error Feedback & UI Corrections feature.

### Plan Overview

**Branch**: 006-auth-ui-fixes
**Scope**: Frontend-only changes addressing 4 user stories (P1-P4)
**Estimated Time**: 8-12 hours total implementation

### Technical Context Established

- **Stack**: TypeScript 5.x, Next.js 14+, React 18+, TanStack Query, date-fns, Tailwind CSS
- **Constraints**: No backend changes, no new dependencies, < 50ms performance impact
- **Architecture**: Web application with frontend/backend separation using App Router

### Constitution Check: All Passed

- ✅ User-Centric Design: Addresses critical UX issues
- ✅ Minimal Viable Change: Frontend-only, no backend modifications
- ✅ Type Safety: Maintains TypeScript strict mode
- ✅ Error Handling: Enhanced with specific messages
- ✅ Consistency: Follows existing patterns
- ✅ No New Complexity: Uses existing libraries

### Phase 0: Research & Discovery

**Current State Analysis**:
- Authentication Flow: JWT tokens in localStorage, AuthProvider manages state, generic error messages
- Task Timestamps: Uses relative timestamps (formatDistanceToNow), needs absolute format
- Modal Implementation: No max-height constraints, overflow issues on mobile
- Visual Differentiation: Signin/signup pages look nearly identical

**Dependencies**: date-fns, @tanstack/react-query, jwt-decode, tailwindcss (all already installed)

**Risk Assessment**: Low overall risk, medium risk for error mapping coverage and timezone handling

### Phase 1: Design Decisions

**Decision 1: Error Handling Strategy**
- Selected: Centralized error mapping in api-client.ts
- Rationale: Consistent messages, single source of truth, reduces duplication
- Trade-off: Requires updating for new error types, but better maintainability

**Decision 2: Timestamp Display Format**
- Selected: Absolute timestamps only ("Jan 15, 2026 at 2:30 PM")
- Rationale: Spec requirement for accuracy and task history tracking
- Trade-off: Less intuitive for recent tasks, but more accurate

**Decision 3: Modal Overflow Handling**
- Selected: max-h-[80vh] with overflow-y-auto on DialogContent
- Rationale: Tailwind utilities provide performant solution without JavaScript
- Trade-off: Requires scrolling for long content, but ensures accessibility

**Decision 4: Visual Differentiation**
- Selected: Different accent colors + distinct headings
- Rationale: Minimal changes using existing theme colors (primary vs secondary)
- Trade-off: Subtle changes, but maintains brand consistency

### Phase 2: Implementation Approach

**Execution Order** (dependency-based):
1. Error Handling Enhancement (P1 - Critical) - 3-4 hours
2. Timestamp Display Fixes (P2 - High) - 2-3 hours
3. Modal Overflow Fixes (P3 - Medium) - 2-3 hours
4. Visual Differentiation (P4 - Low) - 1-2 hours

**Critical Files Identified** (10 files):
1. `frontend/src/lib/api-client.ts` - Enhanced error mapping with context-aware messages
2. `frontend/src/components/auth/SigninForm.tsx` - Sequenced redirect to prevent flicker
3. `frontend/src/components/auth/SignupForm.tsx` - Enhanced error handling for duplicate email
4. `frontend/src/components/tasks/TaskItem.tsx` - Absolute timestamp formatting
5. `frontend/src/components/tasks/DeleteTaskModal.tsx` - NEW FILE with overflow handling
6. `frontend/src/components/tasks/TaskList.tsx` - Integrate DeleteTaskModal
7. `frontend/src/app/(auth)/signin/page.tsx` - "Welcome Back" heading, primary color
8. `frontend/src/app/(auth)/signup/page.tsx` - "Create Your Account" heading, secondary color
9. `frontend/src/components/ui/dialog.tsx` - Review className prop support
10. `frontend/src/components/auth/AuthProvider.tsx` - Review loading state management

### Phase 3: Verification Steps

**Test Suite 1: Authentication Error Feedback (P1)**
- 6 test scenarios covering invalid password, non-existent email, duplicate email, successful signin, network error, session clearing

**Test Suite 2: Task Timestamps (P2)**
- 6 test scenarios covering created/updated/completed timestamps, null handling, consistency, timezone

**Test Suite 3: Delete Modal Overflow (P3)**
- 6 test scenarios covering long title/description on desktop/mobile/tablet, consistency with EditModal, keyboard navigation

**Test Suite 4: Visual Differentiation (P4)**
- 6 test scenarios covering signin/signup identity, visual distinction, accessibility, dark mode, responsive

**Edge Case Testing**:
- Rapid page switching, multiple failed attempts, very long titles, null timestamps, multiple browser tabs

### Next Steps Defined

1. **Review and Approval** - Confirm technical approach with stakeholders
2. **Create Task Breakdown** - Run `/sp.tasks` to generate detailed task list in tasks.md
3. **Set Up Environment** - Verify frontend server, dependencies, backend API access
4. **Implementation Workflow** - Execute in priority order (P1 → P2 → P3 → P4)

### Success Metrics

- ✅ 100% of failed signin attempts show clear error without dashboard flash
- ✅ 100% of task timestamps display accurate database values
- ✅ Delete modal stays within viewport on 100% of screen sizes
- ✅ Users can distinguish signin/signup pages within 2 seconds
- ✅ Zero hydration errors in browser console
- ✅ Error messages display within 500ms of failure

## Outcome

- ✅ Impact: Created comprehensive implementation plan for Auth UI Fixes with detailed technical decisions, file-by-file changes, and verification procedures
- 🧪 Tests: Planning phase (no tests yet) - 24 test scenarios defined across 4 test suites plus edge cases
- 📁 Files: Created 1 file (plan.md with 319 lines)
- 🔁 Next prompts: Run /sp.tasks to create task breakdown, then /sp.implement to execute implementation
- 🧠 Reflection: Plan is complete and comprehensive. All sections filled with specific technical details. Design decisions documented with rationale and trade-offs. 10 critical files identified with clear implementation guidance. Verification procedures cover all user stories and edge cases. Ready for task breakdown phase.

## Evaluation notes (flywheel)

- Failure modes observed: Plan generation output was truncated multiple times due to response length limits. Resolved by resuming Plan subagent with resume parameter to continue from where it left off.
- Graders run and results (PASS/FAIL): Constitution Check PASS (6/6 principles aligned), Risk Assessment PASS (low overall risk), Design Decisions PASS (4 decisions documented with rationale)
- Prompt variant (if applicable): Standard /sp.plan workflow with Plan subagent, used resume functionality to handle truncated output
- Next experiment (smallest change to try): Run /sp.tasks to generate task breakdown with specific acceptance criteria and dependencies for each file change
