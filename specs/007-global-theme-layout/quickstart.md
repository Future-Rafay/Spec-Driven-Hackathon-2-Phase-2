# Quickstart Guide: Global Theme Switcher & Layout System

**Feature**: 007-global-theme-layout
**Date**: 2026-02-10
**Purpose**: Testing and validation instructions for theme system and layout changes

## Overview

This guide provides step-by-step instructions for testing the global theme switcher, public page layouts, and landing page redesign after implementation.

## Prerequisites

- Frontend development server running (`npm run dev` in `frontend/` directory)
- Browser with DevTools (Chrome, Firefox, or Edge recommended)
- Multiple browser windows/tabs for testing persistence

## Quick Test Checklist

Use this checklist for rapid validation after implementation:

### Theme Switching (5 minutes)
- [ ] Toggle theme on landing page - switches instantly
- [ ] Navigate to signin - theme persists
- [ ] Navigate to signup - theme persists
- [ ] Sign in and go to dashboard - theme persists
- [ ] Close browser, reopen - theme preference remembered

### Layout Consistency (3 minutes)
- [ ] Landing page has PublicHeader and PublicFooter
- [ ] Signin page has PublicHeader and PublicFooter
- [ ] Signup page has PublicHeader and PublicFooter
- [ ] Dashboard has its own Header and Footer (different from public)

### Landing Page (5 minutes)
- [ ] Hero section displays with clear value proposition
- [ ] Features section shows at least 3 features
- [ ] Dashboard preview section visible
- [ ] Task preview section visible
- [ ] All sections work in both light and dark themes

### Responsive Design (5 minutes)
- [ ] Mobile (375px) - all content readable and accessible
- [ ] Tablet (768px) - layout adapts appropriately
- [ ] Desktop (1920px) - content well-spaced and centered

**Total Time**: ~20 minutes for complete validation

## Detailed Testing Instructions

### 1. Theme Switching Tests

#### Test 1.1: Theme Toggle Functionality

**Objective**: Verify theme toggle works on all pages

**Steps**:
1. Start on landing page (`http://localhost:3000`)
2. Locate theme toggle in header (Sun/Moon icon)
3. Click the toggle
4. **Expected**: Page switches to dark mode (or light if already dark)
5. **Verify**: All colors change appropriately, no white flashes

**Success Criteria**:
- Theme switches in < 200ms (should feel instant)
- No layout shift during transition
- All text remains readable

#### Test 1.2: Theme Persistence Across Navigation

**Objective**: Verify theme persists when navigating between pages

**Steps**:
1. Set theme to dark mode on landing page
2. Navigate to signin page (`/signin`)
3. **Expected**: Page loads in dark mode
4. Navigate to signup page (`/signup`)
5. **Expected**: Page loads in dark mode
6. Sign in and navigate to dashboard
7. **Expected**: Dashboard loads in dark mode

**Success Criteria**:
- Theme persists across all page navigations
- No flash of light theme during navigation

#### Test 1.3: Theme Persistence Across Browser Sessions

**Objective**: Verify theme preference is remembered after closing browser

**Steps**:
1. Set theme to dark mode
2. Close the browser completely (not just the tab)
3. Reopen browser and navigate to `http://localhost:3000`
4. **Expected**: Page loads in dark mode

**Success Criteria**:
- Theme preference persists after browser restart
- No flash of light theme on initial load

#### Test 1.4: FOUC (Flash of Unstyled Content) Test

**Objective**: Verify no flash of wrong theme on page load

**Steps**:
1. Set theme to dark mode
2. Open DevTools → Network tab
3. Set throttling to "Slow 3G"
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
5. **Expected**: Page loads directly in dark mode, no flash of light theme

**Success Criteria**:
- No visible flash of light theme
- Theme applied before first paint

### 2. Layout Consistency Tests

#### Test 2.1: Public Header Verification

**Objective**: Verify PublicHeader appears on all public pages

**Steps**:
1. Navigate to landing page (`/`)
2. **Verify**: Header contains:
   - App name "ToDo" on the left (distinctive typography)
   - Theme toggle on the right
   - Profile/status icon on the right
   - NO signin/signup buttons
3. Navigate to signin page (`/signin`)
4. **Verify**: Same header appears
5. Navigate to signup page (`/signup`)
6. **Verify**: Same header appears

**Success Criteria**:
- Header layout identical on all three pages
- All elements properly aligned
- Header responsive on mobile

#### Test 2.2: Public Footer Verification

**Objective**: Verify PublicFooter appears on all public pages

**Steps**:
1. Navigate to landing page (`/`)
2. Scroll to bottom
3. **Verify**: Footer contains:
   - Copyright notice
   - "Made with love by Abdul Rafay" attribution
   - Minimal, centered design
4. Navigate to signin page (`/signin`)
5. **Verify**: Same footer appears
6. Navigate to signup page (`/signup`)
7. **Verify**: Same footer appears

**Success Criteria**:
- Footer layout identical on all three pages
- Footer sticks to bottom if content is short
- Footer responsive on mobile

#### Test 2.3: Dashboard Layout Preservation

**Objective**: Verify dashboard retains its own header/footer

**Steps**:
1. Sign in to the application
2. Navigate to dashboard (`/dashboard`)
3. **Verify**: Header contains:
   - User menu (different from public header)
   - Logout button
   - Theme toggle
   - NO "ToDo" branding (different from public header)
4. **Verify**: Footer is different from public footer

**Success Criteria**:
- Dashboard header/footer distinct from public pages
- All dashboard functionality preserved
- No visual regressions

### 3. Landing Page Tests

#### Test 3.1: Hero Section

**Objective**: Verify hero section displays correctly

**Steps**:
1. Navigate to landing page (`/`)
2. **Verify**: Hero section contains:
   - Clear value proposition (headline)
   - Subheading explaining the app
   - Call-to-action buttons (e.g., "Get Started", "Sign In")
   - Visually prominent (large text, good spacing)

**Success Criteria**:
- Value proposition clear and readable
- CTA buttons functional (navigate to signup/signin)
- Section works in both light and dark themes

#### Test 3.2: Features Section

**Objective**: Verify features section displays correctly

**Steps**:
1. Scroll down to features section
2. **Verify**: Section contains:
   - At least 3 feature highlights
   - Icons for each feature
   - Brief descriptions
   - Grid or card layout

**Success Criteria**:
- Features clearly presented
- Icons visible and appropriate
- Layout responsive (stacks on mobile)

#### Test 3.3: Dashboard Preview Section

**Objective**: Verify dashboard preview displays correctly

**Steps**:
1. Scroll down to dashboard preview section
2. **Verify**: Section contains:
   - Visual representation of dashboard
   - Screenshot-quality presentation
   - Clear labeling

**Success Criteria**:
- Preview visually appealing
- Suitable for screenshots/marketing
- Works in both themes

#### Test 3.4: Task Preview Section

**Objective**: Verify task preview displays correctly

**Steps**:
1. Scroll down to task preview section
2. **Verify**: Section contains:
   - Visual representation of task UI
   - Shows task creation/management
   - Screenshot-quality presentation

**Success Criteria**:
- Preview visually appealing
- Suitable for screenshots/marketing
- Works in both themes

### 4. Responsive Design Tests

#### Test 4.1: Mobile (320px - 768px)

**Objective**: Verify layout works on mobile devices

**Steps**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Set viewport to 375px width (iPhone SE)
4. Navigate through all pages (landing, signin, signup, dashboard)
5. **Verify**:
   - All text readable (no overflow)
   - Buttons accessible (not cut off)
   - Images/sections stack vertically
   - Header/footer responsive

**Test Viewports**:
- 320px (iPhone SE portrait)
- 375px (iPhone 12/13 portrait)
- 414px (iPhone 12 Pro Max portrait)

**Success Criteria**:
- No horizontal scrolling
- All content accessible
- Touch targets at least 44x44px

#### Test 4.2: Tablet (768px - 1024px)

**Objective**: Verify layout works on tablets

**Steps**:
1. Set viewport to 768px width (iPad portrait)
2. Navigate through all pages
3. **Verify**:
   - Layout adapts to wider screen
   - Content well-spaced
   - Multi-column layouts where appropriate

**Test Viewports**:
- 768px (iPad portrait)
- 1024px (iPad landscape)

**Success Criteria**:
- Efficient use of space
- Readable without zooming
- Smooth transitions between breakpoints

#### Test 4.3: Desktop (1024px+)

**Objective**: Verify layout works on desktop screens

**Steps**:
1. Set viewport to 1920px width (Full HD)
2. Navigate through all pages
3. **Verify**:
   - Content centered and well-spaced
   - Max-width constraints applied
   - No excessive whitespace

**Test Viewports**:
- 1280px (HD)
- 1920px (Full HD)
- 2560px (2K)

**Success Criteria**:
- Content doesn't stretch too wide
- Comfortable reading width
- Balanced layout

### 5. Accessibility Tests

#### Test 5.1: Keyboard Navigation

**Objective**: Verify all interactive elements accessible via keyboard

**Steps**:
1. Navigate to landing page
2. Press Tab repeatedly
3. **Verify**:
   - Theme toggle receives focus (visible outline)
   - All buttons/links receive focus
   - Focus order logical (top to bottom, left to right)
4. Press Enter/Space on theme toggle
5. **Verify**: Theme switches

**Success Criteria**:
- All interactive elements keyboard accessible
- Focus indicators visible in both themes
- Logical tab order

#### Test 5.2: Contrast Ratios

**Objective**: Verify WCAG AA contrast compliance

**Steps**:
1. Open DevTools → Elements tab
2. Select text elements
3. Check contrast ratio in DevTools (or use WebAIM Contrast Checker)
4. **Verify**:
   - Normal text: at least 4.5:1 contrast
   - Large text (18pt+): at least 3:1 contrast
5. Switch to dark theme and repeat

**Tools**:
- Chrome DevTools (built-in contrast checker)
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Success Criteria**:
- All text meets WCAG AA standards
- Both light and dark themes compliant

#### Test 5.3: Screen Reader Test (Optional)

**Objective**: Verify screen reader compatibility

**Steps**:
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate through landing page
3. **Verify**:
   - Theme toggle announces "Toggle theme" button
   - Headings announced correctly
   - Links/buttons have descriptive labels

**Success Criteria**:
- All interactive elements have accessible names
- Semantic HTML used correctly
- No unlabeled buttons/links

### 6. Performance Tests

#### Test 6.1: Theme Switch Performance

**Objective**: Verify theme switches in < 200ms

**Steps**:
1. Open DevTools → Console
2. Run this code:
   ```javascript
   const start = performance.now();
   document.documentElement.classList.toggle('dark');
   const end = performance.now();
   console.log(`Theme switch took ${end - start}ms`);
   ```
3. **Expected**: < 200ms (likely < 50ms)

**Success Criteria**:
- Theme switch completes in < 200ms
- Feels instant to user

#### Test 6.2: Landing Page Load Performance

**Objective**: Verify landing page loads in < 2 seconds

**Steps**:
1. Open DevTools → Network tab
2. Hard refresh landing page (Ctrl+Shift+R)
3. Check "Load" time in Network tab
4. **Expected**: < 2 seconds

**Alternative**: Use Lighthouse
1. Open DevTools → Lighthouse tab
2. Run audit for "Performance"
3. **Expected**: Score > 90

**Success Criteria**:
- Landing page loads in < 2 seconds
- Lighthouse performance score > 90

### 7. Cross-Browser Tests

#### Test 7.1: Chrome/Edge

**Steps**:
1. Open application in Chrome or Edge
2. Run all tests above
3. **Verify**: All functionality works

#### Test 7.2: Firefox

**Steps**:
1. Open application in Firefox
2. Run all tests above
3. **Verify**: All functionality works

#### Test 7.3: Safari (if available)

**Steps**:
1. Open application in Safari
2. Run all tests above
3. **Verify**: All functionality works

**Success Criteria**:
- Consistent behavior across all browsers
- No browser-specific bugs

## Common Issues and Solutions

### Issue 1: Theme Flashes on Page Load

**Symptom**: Brief flash of light theme when loading in dark mode

**Solution**:
- Verify next-themes script is injected in root layout
- Check `suppressHydrationWarning` on html/body tags
- Ensure ThemeProvider is in client component

### Issue 2: Layout Shift During Theme Switch

**Symptom**: Content jumps or shifts when toggling theme

**Solution**:
- Ensure all elements use CSS variables for colors
- Avoid inline styles that don't respect theme
- Use Tailwind's `dark:` variants consistently

### Issue 3: Header/Footer Not Appearing

**Symptom**: Public header/footer missing on some pages

**Solution**:
- Verify PublicLayout is applied to the page
- Check import paths are correct
- Ensure layout composition is correct

### Issue 4: Responsive Breakpoints Not Working

**Symptom**: Layout doesn't adapt to screen size

**Solution**:
- Verify Tailwind responsive utilities used correctly
- Check viewport meta tag in root layout
- Test with actual devices, not just DevTools

### Issue 5: Contrast Ratio Failures

**Symptom**: Text hard to read in one or both themes

**Solution**:
- Use Tailwind color tokens (background, foreground, etc.)
- Avoid custom colors without testing contrast
- Verify both themes with contrast checker

## Reporting Issues

If you encounter issues during testing:

1. **Document the issue**:
   - What you were doing
   - What you expected
   - What actually happened
   - Screenshots if applicable

2. **Check browser console** for errors

3. **Verify environment**:
   - Node version
   - Browser version
   - Operating system

4. **Create a bug report** with:
   - Issue title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

## Success Criteria Summary

After completing all tests, verify:

- ✅ Theme switching works on all pages (< 200ms)
- ✅ Theme persists across navigation and browser sessions
- ✅ No FOUC on page load
- ✅ PublicHeader/Footer on landing, signin, signup
- ✅ Dashboard layout unchanged
- ✅ Landing page has 4+ distinct sections
- ✅ All sections work in both themes
- ✅ Responsive 320px-2560px
- ✅ WCAG AA contrast compliance
- ✅ Keyboard accessible
- ✅ Landing page loads in < 2 seconds

**If all criteria met**: Feature is ready for production ✅

## Next Steps

After successful testing:

1. Create screenshots of landing page sections (light and dark themes)
2. Document any edge cases discovered
3. Update this guide with any additional findings
4. Proceed to PR creation and code review
