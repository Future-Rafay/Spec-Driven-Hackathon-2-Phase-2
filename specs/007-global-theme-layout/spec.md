# Feature Specification: Global Theme Switcher, Shared Header/Footer & Landing Page Redesign

**Feature Branch**: `007-global-theme-layout`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Global Theme Switcher, Shared Header/Footer & Landing Page Redesign - Add dark/light mode toggle across entire app, introduce global header + footer for public pages, keep dashboard header/footer separate, redesign landing page to feel like modern SaaS product"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Global Theme Switching (Priority: P1)

As a user visiting any page of the application, I want to toggle between dark and light themes so that I can use the app comfortably in different lighting conditions and according to my personal preference.

**Why this priority**: Theme switching is the foundation for all visual improvements. It affects every page and must work consistently before other UI changes can be properly evaluated. This is the most critical user-facing feature that impacts accessibility and user comfort.

**Independent Test**: Can be fully tested by clicking the theme toggle on any page (landing, signin, signup, dashboard) and verifying that the theme changes immediately, persists across page navigation, and maintains good contrast and readability in both modes.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** I click the theme toggle in the header, **Then** the entire page switches to dark mode (or light mode if already dark) with proper color contrast
2. **Given** I have selected dark mode, **When** I navigate to the signin page, **Then** the dark theme persists and the page displays correctly in dark mode
3. **Given** I am signed in and viewing the dashboard, **When** I toggle the theme, **Then** the dashboard and all task components switch themes without losing any functionality
4. **Given** I have set my theme preference, **When** I close the browser and return later, **Then** my theme preference is remembered and applied automatically
5. **Given** I am on any page, **When** I toggle the theme, **Then** the transition is smooth without jarring flashes or layout shifts

---

### User Story 2 - Consistent Public Page Layout (Priority: P2)

As a visitor exploring the application before signing up, I want to see a consistent header and footer across all public pages (landing, signin, signup) so that I have a cohesive brand experience and can easily navigate between pages.

**Why this priority**: After theme switching works, consistent navigation and branding across public pages is essential for professional appearance and user trust. This creates the foundation for the landing page redesign.

**Independent Test**: Can be fully tested by navigating between landing, signin, and signup pages and verifying that the same header (with app name and theme toggle) and footer (with copyright and attribution) appear consistently on all three pages, while the dashboard retains its own separate header/footer.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** I view the header, **Then** I see the ToDo app name on the left and a theme toggle with profile/status icon on the right, with no signin/signup buttons
2. **Given** I am on the signin page, **When** I view the header and footer, **Then** they match the landing page header and footer exactly in layout and styling
3. **Given** I am on the signup page, **When** I view the header and footer, **Then** they match the landing and signin page header and footer
4. **Given** I am signed in and viewing the dashboard, **When** I view the header and footer, **Then** they are different from the public pages and retain the existing dashboard layout with user menu and logout functionality
5. **Given** I am on any public page, **When** I view the footer, **Then** I see clean, minimal branding with copyright notice and "Made with love by Abdul Rafay" attribution

---

### User Story 3 - Modern Landing Page Experience (Priority: P3)

As a potential user visiting the landing page, I want to see an attractive, modern SaaS-style design with clear feature highlights so that I understand the value of the application and feel motivated to sign up.

**Why this priority**: Once theme and layout consistency are established, the landing page redesign provides the marketing and first-impression value. This is important for user acquisition but depends on the foundational work from P1 and P2.

**Independent Test**: Can be fully tested by visiting the landing page and verifying that it displays a compelling hero section, clear feature highlights, and visually polished sections that are suitable for screenshots and marketing materials.

**Acceptance Scenarios**:

1. **Given** I visit the landing page for the first time, **When** the page loads, **Then** I see a catchy hero section with a clear value proposition and call-to-action
2. **Given** I am viewing the landing page, **When** I scroll down, **Then** I see feature highlights that explain the key benefits of the task management application
3. **Given** I am on the landing page, **When** I view the page in both light and dark modes, **Then** both themes look polished and professional with good visual hierarchy
4. **Given** I am evaluating the application, **When** I view the landing page sections, **Then** I see visually distinct areas suitable for screenshots: hero section, feature highlights, dashboard preview, and task UI preview
5. **Given** I am on the landing page, **When** I interact with call-to-action buttons, **Then** they navigate me to the appropriate signup or signin pages

---

### User Story 4 - Typography and Brand Consistency (Priority: P4)

As a user navigating through the application, I want to see consistent typography, spacing, and branding across all pages so that the application feels cohesive and professionally designed.

**Why this priority**: This is a polish layer that enhances the overall experience after the core functionality (theme, layout, landing page) is in place. It's important for brand perception but not blocking for basic functionality.

**Independent Test**: Can be fully tested by navigating through all pages (landing, signin, signup, dashboard) and verifying that font families, sizes, weights, spacing, and color usage follow a consistent design system.

**Acceptance Scenarios**:

1. **Given** I am viewing any page in the application, **When** I examine the typography, **Then** I see consistent font families and sizes for headings, body text, and UI elements
2. **Given** I am on the landing page, **When** I view the app name in the header, **Then** it uses strong, distinctive typography that establishes brand identity
3. **Given** I navigate between public pages and the dashboard, **When** I compare spacing and layout, **Then** I see consistent padding, margins, and grid alignment
4. **Given** I am using the application in either theme, **When** I view text and UI elements, **Then** color usage follows a consistent system with proper contrast ratios for accessibility

---

### Edge Cases

- What happens when a user has their browser set to prefer dark mode but hasn't explicitly chosen a theme in the app? (Default to browser preference on first visit)
- How does the theme toggle behave during page transitions or loading states? (Theme should be applied immediately without flash of wrong theme)
- What happens if the user's theme preference in localStorage becomes corrupted or invalid? (Fall back to light mode as default)
- How does the landing page display on very small mobile screens (< 375px width)? (Responsive design should maintain readability and usability)
- What happens when the app name is very long or localized to a different language? (Header should handle text overflow gracefully)
- How does the footer display when page content is shorter than viewport height? (Footer should stick to bottom of viewport)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a theme toggle control that switches between dark and light modes
- **FR-002**: System MUST persist the user's theme preference across browser sessions
- **FR-003**: System MUST apply the selected theme consistently across all pages (landing, signin, signup, dashboard)
- **FR-004**: System MUST display a global header on public pages (landing, signin, signup) containing the app name and theme toggle
- **FR-005**: System MUST display a global footer on public pages (landing, signin, signup) with copyright and attribution text
- **FR-006**: System MUST maintain the existing separate header and footer for the dashboard page
- **FR-007**: System MUST NOT display signin/signup buttons in the global header
- **FR-008**: System MUST display the app name with distinctive typography in the global header
- **FR-009**: System MUST include a profile/status icon in the global header alongside the theme toggle
- **FR-010**: Landing page MUST display a hero section with value proposition and call-to-action
- **FR-011**: Landing page MUST display feature highlights explaining key benefits
- **FR-012**: Landing page MUST include visually distinct sections suitable for screenshots (hero, features, dashboard preview, task UI preview)
- **FR-013**: System MUST use consistent typography (font families, sizes, weights) across all pages
- **FR-014**: System MUST use consistent spacing and layout grid across all pages
- **FR-015**: System MUST ensure proper color contrast ratios in both light and dark themes for accessibility
- **FR-016**: System MUST apply theme changes immediately without requiring page reload
- **FR-017**: System MUST handle theme transitions smoothly without layout shifts or flashing
- **FR-018**: Footer MUST display "Made with love by Abdul Rafay" attribution text
- **FR-019**: System MUST be responsive and display correctly on mobile, tablet, and desktop screen sizes
- **FR-020**: System MUST default to light theme if no preference is stored

### Key Entities

This feature primarily involves UI/UX changes and does not introduce new data entities. It works with existing entities:

- **Theme Preference**: User's selected theme (light/dark), persisted in client-side storage
- **Layout Context**: Determines which header/footer to display (public vs dashboard), derived from current route

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle between light and dark themes on any page with the change taking effect in under 200 milliseconds
- **SC-002**: Theme preference persists across browser sessions with 100% reliability (verified by closing and reopening browser)
- **SC-003**: All text maintains a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text in both themes (WCAG AA compliance)
- **SC-004**: Global header and footer appear consistently on all three public pages (landing, signin, signup) with identical layout and styling
- **SC-005**: Dashboard header and footer remain unchanged and distinct from public page layouts
- **SC-006**: Landing page loads and displays hero section within 2 seconds on standard broadband connection
- **SC-007**: Landing page includes at least 4 visually distinct sections suitable for marketing screenshots
- **SC-008**: Typography uses no more than 2 font families across the entire application for consistency
- **SC-009**: All pages are fully responsive and usable on screen widths from 320px to 2560px
- **SC-010**: Theme toggle is accessible via keyboard navigation and screen readers
- **SC-011**: 90% of users can identify the app's primary value proposition within 5 seconds of viewing the landing page
- **SC-012**: Landing page call-to-action buttons have a click-through rate of at least 15% for visitors who scroll past the hero section

## Assumptions

- The existing theme system (next-themes with ThemeProvider) is already configured and working
- The existing ThemeToggle component can be reused or adapted for the global header
- The dashboard's current header includes user menu and logout functionality that should be preserved
- The app name is "ToDo" or similar short name that fits comfortably in the header
- Users expect standard SaaS landing page patterns (hero, features, social proof, CTA)
- The application already has a color system defined in Tailwind CSS configuration
- Mobile-first responsive design is the standard approach
- The footer should be minimal and not include extensive navigation links
- "Profile/status icon" in the header refers to a visual indicator, not a functional user profile menu (which exists in dashboard)
- Screenshots will be used for marketing materials, documentation, or portfolio purposes

## Out of Scope

- User authentication changes (signin/signup functionality remains unchanged)
- Dashboard functionality or task management features
- Multi-language support or internationalization
- Custom theme creation (only light and dark modes)
- Theme scheduling (automatic switching based on time of day)
- Advanced landing page features (animations, video backgrounds, interactive demos)
- A/B testing or analytics integration for landing page performance
- SEO optimization or meta tags (can be added later)
- Email capture or newsletter signup forms
- Pricing page or feature comparison tables
- Blog or content marketing sections

## Dependencies

- Existing next-themes package and ThemeProvider configuration
- Existing Tailwind CSS configuration and color system
- Existing routing structure (public vs protected routes)
- Existing dashboard header/footer components
- Existing authentication flow (for determining public vs authenticated state)

## Risks

- **Risk**: Theme switching may cause brief flash of unstyled content (FOUC) on page load
  - **Mitigation**: Use next-themes' built-in FOUC prevention with proper script injection

- **Risk**: Inconsistent color usage across components may become more visible with theme switching
  - **Mitigation**: Audit all components to use CSS variables or Tailwind theme colors consistently

- **Risk**: Landing page redesign may increase initial page load time
  - **Mitigation**: Optimize images, use lazy loading, and measure performance with Lighthouse

- **Risk**: Global header/footer may conflict with existing layout components
  - **Mitigation**: Use route-based layout composition to cleanly separate public and dashboard layouts

- **Risk**: Typography changes may break existing UI component layouts
  - **Mitigation**: Test all pages thoroughly after typography updates, adjust spacing as needed
