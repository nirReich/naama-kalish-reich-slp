# Homepage Component Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Split the homepage into reusable, individually-foldered React components with local CSS Modules while preserving current appearance and behavior.

**Architecture:** `app/page.jsx` remains the client-side page composer and locale state owner. It passes `t`, the active language, and a language-change callback to focused child components; presentational sections receive `t`. Each component owns a folder and a CSS Module when it has styles. Vitest and React Testing Library cover the Header interactions and ServiceCard link behavior.

**Tech Stack:** Next.js App Router, React, MUI, i18next, CSS Modules, Vitest, React Testing Library, jsdom.

**Spec:** `docs/superpowers/specs/2026-10-18-homepage-component-refactor-design.md`

## Global Constraints

- Preserve the current Hebrew/English copy, translation keys, page sections, links, and responsive breakpoints.
- Keep locale persistence in `localStorage` and document `lang`/`dir` updates in the page composer.
- Keep service cards as accessible links to `#contact` with visible keyboard focus.
- Keep global CSS limited to resets, fonts, design tokens, and site-wide direction behavior.
- Keep component source, CSS Modules, and component tests together in each component folder.

## Review Focus

- Hebrew-to-English and English-to-Hebrew selection: Header requests the opposite locale through its callback.
- Mobile navigation open/close: Header exposes accurate `aria-expanded` state and closes after navigation.
- Service card destination: ServiceCard renders the supplied `href`, title, and description as one accessible link.
- Locale persistence and document direction: page restores stored locale and synchronizes the document language and direction.
- Narrow and wide layouts: extracted CSS Modules retain current responsive breakpoints and site-wide RTL/LTR behavior; the production build catches missing or invalid styles/imports.

---

### Task 1: Add unit-test tooling and write interaction tests first

**Files:**
- Modify: `nkr_slp_frontend/package.json`
- Create: `nkr_slp_frontend/vitest.config.js`
- Create: `nkr_slp_frontend/vitest.setup.js`
- Create: `nkr_slp_frontend/components/Header/Header.test.jsx`
- Create: `nkr_slp_frontend/components/ServiceCard/ServiceCard.test.jsx`
- Create: `nkr_slp_frontend/app/page.test.jsx`

**Interfaces:**
- Consumes: the approved component contracts below, which are not implemented yet.
- Produces: `npm test` runs Vitest in jsdom with React Testing Library and jest-dom matchers.

- [x] **Step 1: Add the test command and compatible test dependencies**

Add `"test": "vitest run"` and development dependencies for `vitest`, `jsdom`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom`. Create `vitest.config.js` with the React plugin, jsdom environment, and `vitest.setup.js`; import jest-dom matchers from the setup file.

- [x] **Step 2: Write Header interaction tests**

Create tests with a small deterministic `t(key) => key` translator. Assert that clicking the language control calls `onLanguageChange` with the opposite language and that the menu toggles `aria-expanded` and closes after selecting a nav link.

- [x] **Step 3: Write ServiceCard link test**

Assert that `ServiceCard` renders one link with the supplied `href`, visible title, and visible description. Include a decorative icon and assert it is hidden from the accessibility tree.

- [x] **Step 4: Write the page locale-restoration test**

Render the page with `site-language` set to `en`; assert English text, `document.documentElement.lang === 'en'`, and `dir === 'ltr'`. Clear storage and reset the document after each test.

- [x] **Step 5: Run the tests and confirm the expected red state**

Run: `npm test`
Expected: Vitest starts; Header and ServiceCard tests fail because their component modules do not exist yet. The page locale test may pass against current behavior.

### Task 2: Implement Header and ServiceCard with local styles

**Files:**
- Create: `nkr_slp_frontend/components/Header/Header.jsx`
- Create: `nkr_slp_frontend/components/Header/Header.module.css`
- Modify: `nkr_slp_frontend/components/Header/Header.test.jsx`
- Create: `nkr_slp_frontend/components/ServiceCard/ServiceCard.jsx`
- Create: `nkr_slp_frontend/components/ServiceCard/ServiceCard.module.css`
- Modify: `nkr_slp_frontend/components/ServiceCard/ServiceCard.test.jsx`

**Interfaces:**
- Consumes: the tests and Vitest setup from Task 1.
- Produces: `Header({ language, onLanguageChange, t })`; callback receives the next locale, `'he'` or `'en'`.
- Produces: `ServiceCard({ icon, title, description, href })`; renders a whole-card anchor.

- [x] **Step 1: Implement Header with the existing menu and language behavior**

Move the current AppBar/Toolbar/navigation markup and mobile menu state into `Header.jsx`. Preserve translated labels and navigation ids. Move header CSS and mobile navigation rules into `Header.module.css`. Keep the logo and nav grouped at language inline-start.

- [x] **Step 2: Implement ServiceCard**

Move the card markup into `ServiceCard.jsx`. Render the supplied icon as decorative content and the title/description inside the anchor. Move card layout, hover, focus, and responsive styles into `ServiceCard.module.css`.

- [x] **Step 3: Run the component tests**

Run: `npm test`
Expected: Header and ServiceCard tests pass; the page locale-restoration test passes.

### Task 3: Extract the remaining sections and compose the page

**Files:**
- Create: `nkr_slp_frontend/components/HeroSection/HeroSection.jsx`
- Create: `nkr_slp_frontend/components/HeroSection/HeroSection.module.css`
- Create: `nkr_slp_frontend/components/AboutSection/AboutSection.jsx`
- Create: `nkr_slp_frontend/components/AboutSection/AboutSection.module.css`
- Create: `nkr_slp_frontend/components/ServicesSection/ServicesSection.jsx`
- Create: `nkr_slp_frontend/components/ServicesSection/ServicesSection.module.css`
- Create: `nkr_slp_frontend/components/ApproachSection/ApproachSection.jsx`
- Create: `nkr_slp_frontend/components/ApproachSection/ApproachSection.module.css`
- Create: `nkr_slp_frontend/components/ContactSection/ContactSection.jsx`
- Create: `nkr_slp_frontend/components/ContactSection/ContactSection.module.css`
- Create: `nkr_slp_frontend/components/SiteFooter/SiteFooter.jsx`
- Create: `nkr_slp_frontend/components/SiteFooter/SiteFooter.module.css`
- Create: `nkr_slp_frontend/components/SectionKicker/SectionKicker.jsx`
- Create: `nkr_slp_frontend/components/SectionKicker/SectionKicker.module.css`
- Modify: `nkr_slp_frontend/app/page.jsx`
- Modify: `nkr_slp_frontend/app/globals.css`

**Interfaces:**
- Consumes: `Header` and `ServiceCard` from Task 2.
- Produces: `HeroSection({ t })`, `AboutSection({ t })`, `ServicesSection({ t })`, `ApproachSection({ t })`, `ContactSection({ t })`, `SiteFooter({ t })`, and `SectionKicker({ number, label, light })`.
- Produces: `app/page.jsx` composes the extracted components and owns locale state, `localStorage`, i18next change, and document direction.

- [x] **Step 1: Extract SectionKicker**

Move the current nested `SectionKicker` into its folder and preserve its number, label, and light-mode props. Move its styles into its CSS Module.

- [x] **Step 2: Extract the static content sections**

Move the existing hero, about, approach, and contact markup into their respective components. Each receives `t` and moves its section-specific rules and responsive overrides into its CSS Module. Do not edit translation JSON or visible copy.

- [x] **Step 3: Extract ServicesSection and connect ServiceCard**

Move the services heading, note, service definitions, and icon imports into `ServicesSection`. Map each service to `ServiceCard` using the existing translated title and description and `href="#contact"`. Move the section heading/grid styles into the ServicesSection CSS Module; keep card-specific rules in ServiceCard CSS Module.

- [x] **Step 4: Extract SiteFooter and reduce the page to composition/state**

Move footer markup/styles into `SiteFooter`. Replace inline section markup in `app/page.jsx` with imports and components. Keep language state and effects in the page; pass the translator and language callback to Header, and the translator to each section.

- [x] **Step 5: Reduce globals.css to shared rules**

Keep font loading, CSS variables, reset rules, body defaults, site wrapper, global RTL/LTR direction classes, and reduced-motion preference in `app/globals.css`. Remove rules now owned by component CSS Modules. Put language-specific overrides in the relevant component module using the shared `.ltr`/`.rtl` wrapper.

- [x] **Step 6: Run unit tests**

Run: `npm test`
Expected: all Header, ServiceCard, and page locale tests pass.

- [x] **Step 7: Build the production app**

Run: `npm run build`
Expected: Next.js completes an optimized build with the homepage prerendered.

## Self-Review

- **Spec coverage:** component folders, CSS Modules, page-owned locale state, behavior preservation, focused tests, and production build each have a task.
- **Step scan:** each step has one implementation or verification action with an expected result.
- **Interface consistency:** section components accept `t`; Header accepts `language`, `onLanguageChange`, and `t`; ServiceCard accepts `icon`, `title`, `description`, and `href`; SectionKicker accepts `number`, `label`, and `light`.
- **Review focus:** locale changes and menu behavior are tested in Header; accessible card link semantics and decorative icon hiding are tested in ServiceCard; stored locale and document direction are tested at page level; responsive CSS and imports are checked in the build.
- **Proportion:** three tasks cover test setup, interactive primitives, and section extraction without adding unrelated app behavior.
