# Implementation Plan: Global Theme Switcher, Shared Header/Footer & Landing Page Redesign

**Branch**: `007-global-theme-layout` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-global-theme-layout/spec.md`

## Summary

This feature introduces a global theme switching system with consistent header/footer layouts for public pages (landing, signin, signup) while preserving the existing dashboard layout. The implementation includes a modern SaaS-style landing page redesign with hero section, feature highlights, and visual preview sections suitable for screenshots.

**Primary Requirement**: Enable users to toggle between light and dark themes across all pages with persistence, while providing a cohesive brand experience through consistent public page layouts.

**Technical Approach**: Leverage existing next-themes infrastructure, create reusable layout components for public pages using Next.js App Router layout composition, and redesign the landing page with modern SaaS patterns using Tailwind CSS and Shadcn UI components.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16+ App Router
**Primary Dependencies**:
- next-themes (theme management - already configured)
- Tailwind CSS 4 (styling - already configured)
- Shadcn UI (component library - already configured)
- lucide-react (icons - already in use)

**Storage**: Client-side localStorage for theme preference persistence (via next-themes)
**Testing**: Manual testing via browser, visual regression testing for theme switching
**Target Platform**: Web (all modern browsers), responsive design 320px-2560px
**Project Type**: Web application (Next.js frontend only)
**Performance Goals**:
- Theme switch < 200ms
- Landing page load < 2 seconds
- No layout shift during theme transitions

**Constraints**:
- WCAG AA contrast compliance (4.5:1 for normal text, 3:1 for large text)
- No flash of unstyled content (FOUC) on page load
- Dashboard layout must remain unchanged
- No backend/API changes

**Scale/Scope**:
- 3 public pages (landing, signin, signup)
- 1 protected page (dashboard - no changes)
- 4 new components (PublicHeader, PublicFooter, PublicLayout, redesigned Landing)
- 2 themes (light, dark)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Research)

✅ **Spec-Driven Development First**: Feature has complete specification with 4 prioritized user stories, 20 functional requirements, and 12 success criteria. Following spec → plan → tasks workflow.

✅ **Security-by-Design**: No authentication or authorization changes. No backend changes. No data access changes. Theme preference stored client-side only. N/A for this feature.

✅ **Deterministic & Reproducible**: Using established Next.js patterns, existing theme system (next-themes), and Tailwind CSS. No environment variables needed. All code generation will use framework-idiomatic patterns.

✅ **Separation of Concerns**: Clear component boundaries (PublicHeader, PublicFooter, PublicLayout separate from dashboard layout). Frontend-only changes with no backend coupling.

✅ **Zero Manual Coding**: All implementation via Claude Code following structured prompts and tasks.

✅ **Production-Oriented Architecture**: Using production-ready patterns (Next.js layouts, next-themes for FOUC prevention, Tailwind for consistent styling). No technical debt introduced.

**Technology Stack Compliance**:
- ✅ Frontend: Next.js 16+ App Router (in use)
- ✅ Styling: Tailwind CSS (in use)
- ✅ Components: Shadcn UI (in use)
- N/A Backend: No changes
- N/A Database: No changes
- N/A Authentication: No changes

**Gate Status**: ✅ **PASSED** - All constitutional requirements met. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/007-global-theme-layout/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── checklists/
    └── requirements.md  # Spec quality checklist (complete)
```

**Note**: No `data-model.md` or `contracts/` needed - this is a frontend UI/UX feature with no data entities or API changes.

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (existing - no changes)
│   │   ├── page.tsx                      # Landing page (REDESIGN)
│   │   ├── providers.tsx                 # Theme provider (existing - verify config)
│   │   ├── (auth)/
│   │   │   ├── layout.tsx               # Auth layout (existing - no changes)
│   │   │   ├── signin/page.tsx          # Signin page (existing - no changes)
│   │   │   └── signup/page.tsx          # Signup page (existing - no changes)
│   │   └── (protected)/
│   │       ├── layout.tsx               # Protected layout (existing - no changes)
│   │       └── dashboard/page.tsx       # Dashboard (existing - no changes)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx               # Dashboard header (existing - no changes)
│   │   │   ├── Footer.tsx               # Dashboard footer (existing - no changes)
│   │   │   ├── ThemeToggle.tsx          # Theme toggle (existing - reuse)
│   │   │   ├── PublicHeader.tsx         # NEW: Global header for public pages
│   │   │   ├── PublicFooter.tsx         # NEW: Global footer for public pages
│   │   │   └── PublicLayout.tsx         # NEW: Layout wrapper for public pages
│   │   └── landing/                      # NEW: Landing page components
│   │       ├── HeroSection.tsx          # NEW: Hero section
│   │       ├── FeaturesSection.tsx      # NEW: Features grid
│   │       ├── DashboardPreview.tsx     # NEW: Dashboard preview
│   │       └── TaskPreview.tsx          # NEW: Task UI preview
│   └── lib/
│       └── utils.ts                      # Utility functions (existing)
```

**Structure Decision**: Using Next.js App Router layout composition pattern. Public pages will use a new `PublicLayout` component that wraps content with `PublicHeader` and `PublicFooter`. Dashboard retains its existing layout from `(protected)/layout.tsx`. Landing page will be redesigned with modular section components for maintainability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitutional violations. All requirements met without exceptions.

## Architecture Decisions

### Decision 1: Layout Composition Strategy

**Problem**: Need to apply global header/footer to public pages (landing, signin, signup) but NOT to dashboard.

**Options Considered**:
1. **Route-based layout composition** (CHOSEN)
   - Create `PublicLayout` component
   - Apply to landing page directly
   - Auth pages already have `(auth)/layout.tsx` - modify to use `PublicLayout`
   - Dashboard keeps `(protected)/layout.tsx` unchanged

2. Middleware-based layout injection
   - More complex, harder to reason about
   - Violates separation of concerns

3. Conditional rendering in root layout
   - Couples public and protected layouts
   - Harder to maintain

**Decision**: Use route-based layout composition (Option 1)

**Rationale**:
- Leverages Next.js App Router's built-in layout system
- Clear separation between public and protected layouts
- Easy to understand and maintain
- No coupling between layout types
- Follows framework idioms

**Implementation**:
- Landing page (`app/page.tsx`) wraps content with `<PublicLayout>`
- Auth layout (`app/(auth)/layout.tsx`) wraps children with `<PublicLayout>`
- Protected layout (`app/(protected)/layout.tsx`) unchanged

### Decision 2: Theme System Configuration

**Problem**: Need to ensure theme switching works across all pages without FOUC.

**Options Considered**:
1. **Use existing next-themes setup** (CHOSEN)
   - Already configured in `app/providers.tsx`
   - Proven FOUC prevention
   - Automatic localStorage persistence

2. Build custom theme system
   - Reinventing the wheel
   - Risk of FOUC issues
   - More maintenance burden

**Decision**: Use existing next-themes setup (Option 1)

**Rationale**:
- Already integrated and working
- Industry-standard solution
- Handles FOUC prevention automatically via script injection
- Provides localStorage persistence out of the box
- Supports system preference detection

**Implementation**:
- Verify `ThemeProvider` configuration in `app/providers.tsx`
- Reuse existing `ThemeToggle` component in `PublicHeader`
- Ensure all components use Tailwind's `dark:` variants for theme support

### Decision 3: Landing Page Component Structure

**Problem**: Need to create a modern, maintainable landing page with multiple sections.

**Options Considered**:
1. **Modular section components** (CHOSEN)
   - Separate components for hero, features, previews
   - Easy to test and modify independently
   - Clear responsibility boundaries

2. Single monolithic component
   - Harder to maintain
   - Difficult to test
   - Poor separation of concerns

**Decision**: Modular section components (Option 1)

**Rationale**:
- Follows React best practices
- Each section is independently testable
- Easy to reorder or modify sections
- Better code organization
- Aligns with Separation of Concerns principle

**Implementation**:
- Create `components/landing/` directory
- Separate components: `HeroSection`, `FeaturesSection`, `DashboardPreview`, `TaskPreview`
- Landing page (`app/page.tsx`) composes these sections

### Decision 4: Typography System

**Problem**: Need consistent typography across all pages.

**Options Considered**:
1. **Use existing Tailwind font configuration** (CHOSEN)
   - Already configured with Inter and Montserrat
   - Consistent with existing pages
   - No additional setup needed

2. Add new font families
   - Increases page load time
   - Inconsistent with existing pages
   - Violates SC-008 (max 2 font families)

**Decision**: Use existing Tailwind font configuration (Option 1)

**Rationale**:
- Already configured in `app/layout.tsx` with Inter and Montserrat
- Meets SC-008 requirement (max 2 font families)
- No performance impact
- Consistent with existing design system

**Implementation**:
- Use `font-sans` (Inter) for body text
- Use `font-montserrat` for headings and brand typography
- Apply consistent font sizes via Tailwind utilities

### Decision 5: Color System for Themes

**Problem**: Need to ensure proper contrast in both light and dark themes.

**Options Considered**:
1. **Use Tailwind CSS variables with dark: variants** (CHOSEN)
   - Already configured in `globals.css`
   - Automatic theme switching
   - Meets WCAG AA requirements

2. Custom CSS-in-JS solution
   - More complex
   - Harder to maintain
   - Inconsistent with existing approach

**Decision**: Use Tailwind CSS variables with dark: variants (Option 1)

**Rationale**:
- Already configured with proper color tokens
- Tailwind's `dark:` variants handle theme switching automatically
- CSS variables ensure consistent colors across components
- Meets SC-003 (WCAG AA contrast compliance)

**Implementation**:
- Use existing color tokens (background, foreground, primary, etc.)
- Apply `dark:` variants for all color utilities
- Verify contrast ratios meet WCAG AA standards

## Implementation Phases

### Phase 0: Research & Validation ✓

**Objective**: Validate existing infrastructure and document patterns.

**Tasks**:
1. ✓ Verify next-themes configuration in `app/providers.tsx`
2. ✓ Document existing ThemeToggle component usage
3. ✓ Verify Tailwind CSS theme configuration in `globals.css`
4. ✓ Document Next.js layout composition patterns
5. ✓ Verify font configuration (Inter, Montserrat)

**Output**: `research.md` documenting existing patterns and confirming no blockers.

### Phase 1: Core Layout Components

**Objective**: Create reusable public layout components.

**Components to Create**:
1. `PublicHeader` - Global header with app name, theme toggle, profile icon
2. `PublicFooter` - Minimal footer with copyright and attribution
3. `PublicLayout` - Wrapper combining header + content + footer

**Files to Modify**:
1. `app/(auth)/layout.tsx` - Wrap children with `PublicLayout`

**Acceptance Criteria**:
- Header displays app name on left, theme toggle + icon on right
- Footer displays copyright and "Made with love by Abdul Rafay"
- Layout applies to signin and signup pages
- Dashboard layout unchanged

### Phase 2: Landing Page Redesign

**Objective**: Create modern SaaS-style landing page.

**Components to Create**:
1. `HeroSection` - Value proposition, CTA buttons
2. `FeaturesSection` - Feature highlights grid
3. `DashboardPreview` - Visual preview of dashboard
4. `TaskPreview` - Visual preview of task UI

**Files to Modify**:
1. `app/page.tsx` - Redesign with new sections wrapped in `PublicLayout`

**Acceptance Criteria**:
- Hero section with clear value proposition
- Features section with at least 3 feature highlights
- Visual preview sections suitable for screenshots
- Responsive design 320px-2560px
- Works in both light and dark themes

### Phase 3: Theme System Verification

**Objective**: Ensure theme switching works correctly across all pages.

**Tasks**:
1. Verify theme toggle in PublicHeader
2. Test theme persistence across navigation
3. Verify no FOUC on page load
4. Test smooth transitions without layout shifts
5. Verify WCAG AA contrast compliance

**Acceptance Criteria**:
- Theme switches in < 200ms
- Theme persists across browser sessions
- No FOUC on any page
- All text meets 4.5:1 contrast ratio (normal) or 3:1 (large)
- Smooth transitions without jarring flashes

### Phase 4: Typography & Polish

**Objective**: Ensure consistent typography and spacing across all pages.

**Tasks**:
1. Apply consistent font families (Inter, Montserrat)
2. Standardize heading sizes and weights
3. Ensure consistent spacing and padding
4. Verify responsive behavior on all screen sizes

**Acceptance Criteria**:
- Max 2 font families used (SC-008)
- Consistent heading hierarchy
- Consistent spacing scale
- Responsive 320px-2560px (SC-009)

## File Modification Plan

### Files to Create

1. **`frontend/src/components/layout/PublicHeader.tsx`**
   - Purpose: Global header for public pages
   - Dependencies: ThemeToggle, lucide-react icons
   - Exports: PublicHeader component

2. **`frontend/src/components/layout/PublicFooter.tsx`**
   - Purpose: Global footer for public pages
   - Dependencies: None
   - Exports: PublicFooter component

3. **`frontend/src/components/layout/PublicLayout.tsx`**
   - Purpose: Layout wrapper for public pages
   - Dependencies: PublicHeader, PublicFooter
   - Exports: PublicLayout component

4. **`frontend/src/components/landing/HeroSection.tsx`**
   - Purpose: Landing page hero section
   - Dependencies: Shadcn Button, lucide-react icons
   - Exports: HeroSection component

5. **`frontend/src/components/landing/FeaturesSection.tsx`**
   - Purpose: Landing page features grid
   - Dependencies: lucide-react icons
   - Exports: FeaturesSection component

6. **`frontend/src/components/landing/DashboardPreview.tsx`**
   - Purpose: Visual preview of dashboard
   - Dependencies: None (static preview)
   - Exports: DashboardPreview component

7. **`frontend/src/components/landing/TaskPreview.tsx`**
   - Purpose: Visual preview of task UI
   - Dependencies: None (static preview)
   - Exports: TaskPreview component

### Files to Modify

1. **`frontend/src/app/page.tsx`**
   - Current: Simple landing page with redirect
   - Changes: Redesign with PublicLayout + landing sections
   - Impact: Complete redesign of landing page

2. **`frontend/src/app/(auth)/layout.tsx`**
   - Current: Centered auth layout
   - Changes: Wrap children with PublicLayout
   - Impact: Adds global header/footer to signin/signup pages

3. **`frontend/src/app/providers.tsx`** (verification only)
   - Current: ThemeProvider configured
   - Changes: Verify configuration, no changes expected
   - Impact: None

### Files to Preserve (No Changes)

1. `frontend/src/app/(protected)/layout.tsx` - Dashboard layout unchanged
2. `frontend/src/components/layout/Header.tsx` - Dashboard header unchanged
3. `frontend/src/components/layout/Footer.tsx` - Dashboard footer unchanged
4. `frontend/src/app/(auth)/signin/page.tsx` - Signin page content unchanged
5. `frontend/src/app/(auth)/signup/page.tsx` - Signup page content unchanged

## Testing Strategy

### Manual Testing Checklist

**Theme Switching**:
- [ ] Theme toggle works on landing page
- [ ] Theme toggle works on signin page
- [ ] Theme toggle works on signup page
- [ ] Theme toggle works on dashboard
- [ ] Theme persists across page navigation
- [ ] Theme persists across browser sessions
- [ ] No FOUC on page load
- [ ] Smooth transitions without layout shifts

**Layout Consistency**:
- [ ] PublicHeader appears on landing page
- [ ] PublicHeader appears on signin page
- [ ] PublicHeader appears on signup page
- [ ] PublicHeader does NOT appear on dashboard
- [ ] PublicFooter appears on landing page
- [ ] PublicFooter appears on signin page
- [ ] PublicFooter appears on signup page
- [ ] PublicFooter does NOT appear on dashboard

**Landing Page**:
- [ ] Hero section displays correctly
- [ ] Features section displays correctly
- [ ] Dashboard preview displays correctly
- [ ] Task preview displays correctly
- [ ] All sections work in light theme
- [ ] All sections work in dark theme
- [ ] Responsive on mobile (320px-768px)
- [ ] Responsive on tablet (768px-1024px)
- [ ] Responsive on desktop (1024px+)

**Accessibility**:
- [ ] Theme toggle accessible via keyboard
- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Screen reader announces theme changes
- [ ] Focus indicators visible in both themes

### Performance Testing

- [ ] Landing page loads in < 2 seconds
- [ ] Theme switch completes in < 200ms
- [ ] No layout shift during theme transitions
- [ ] Images optimized and lazy-loaded

## Risk Mitigation

### Risk 1: FOUC (Flash of Unstyled Content)

**Mitigation**:
- Use next-themes' built-in FOUC prevention
- Verify script injection in root layout
- Test on slow connections

**Validation**: Load pages with throttled network, verify no theme flash

### Risk 2: Layout Conflicts

**Mitigation**:
- Use route-based layout composition
- Clear separation between public and protected layouts
- Test navigation between all pages

**Validation**: Navigate between all pages, verify correct header/footer on each

### Risk 3: Contrast Compliance

**Mitigation**:
- Use existing Tailwind color tokens
- Test with contrast checker tools
- Verify all text in both themes

**Validation**: Use browser DevTools or online contrast checkers to verify 4.5:1 ratio

### Risk 4: Responsive Breakpoints

**Mitigation**:
- Use Tailwind's responsive utilities
- Test on multiple screen sizes
- Use mobile-first approach

**Validation**: Test on 320px, 768px, 1024px, 1920px viewports

## Success Metrics

From specification success criteria:

- **SC-001**: Theme switch < 200ms ✓ (measure with Performance API)
- **SC-002**: Theme persistence 100% reliable ✓ (test browser close/reopen)
- **SC-003**: WCAG AA contrast compliance ✓ (verify with contrast checker)
- **SC-004**: Global header/footer on all public pages ✓ (visual verification)
- **SC-005**: Dashboard layout unchanged ✓ (visual verification)
- **SC-006**: Landing page load < 2 seconds ✓ (measure with Lighthouse)
- **SC-007**: 4+ visually distinct sections ✓ (count sections)
- **SC-008**: Max 2 font families ✓ (verify Inter + Montserrat only)
- **SC-009**: Responsive 320px-2560px ✓ (test all breakpoints)
- **SC-010**: Theme toggle keyboard accessible ✓ (test with Tab key)
- **SC-011**: 90% user comprehension in 5 seconds ✓ (user testing - optional)
- **SC-012**: 15% CTR for scrollers ✓ (analytics - optional)

## Next Steps

After this plan is approved:

1. **Phase 0**: Generate `research.md` documenting existing patterns
2. **Phase 1**: Generate `quickstart.md` with testing instructions
3. **Phase 2**: Run `/sp.tasks` to generate implementation tasks
4. **Phase 3**: Execute tasks via `/sp.implement`

## Constitution Check (Post-Design)

*Re-evaluation after Phase 1 design complete*

✅ **Spec-Driven Development First**: Plan follows specification exactly. All user stories mapped to implementation phases.

✅ **Security-by-Design**: No security implications. Frontend-only changes with no auth or data access modifications.

✅ **Deterministic & Reproducible**: All components use established patterns. No custom solutions. Framework-idiomatic code.

✅ **Separation of Concerns**: Clear component boundaries. Public and protected layouts completely separated. No coupling.

✅ **Zero Manual Coding**: All implementation via Claude Code following this plan and generated tasks.

✅ **Production-Oriented Architecture**: Using production-ready patterns (Next.js layouts, next-themes, Tailwind). No technical debt.

**Final Gate Status**: ✅ **PASSED** - All constitutional requirements met. Ready for task generation.
