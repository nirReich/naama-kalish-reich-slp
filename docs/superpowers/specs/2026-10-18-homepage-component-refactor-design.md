# Homepage Component Refactor Design

## Goal

Refactor the current one-file homepage into reusable React components, each in its own folder, while preserving the current Hebrew/English content, responsive layout, navigation, service cards, and contact behavior.

## Current State

- `frontend/app/page.jsx` is a client component that owns language selection, local-storage persistence, document `lang`/`dir`, and all page markup.
- `frontend/app/globals.css` contains global resets, design tokens, and styles for every page section.
- There is no project unit-test setup.

## Component Structure

`app/page.jsx` remains the page composer and owner of language state. It continues to initialize i18next, restore the saved language, update document direction, and pass the translation function and language callback to child components.

Create focused component folders under `frontend/components/`:

- `Header` owns the responsive navigation menu and language switch. It receives `language`, `onLanguageChange`, and `t`; menu open/close state remains local to the header.
- `HeroSection` renders the introductory hero and portrait.
- `AboutSection` renders the practice introduction.
- `ServicesSection` renders the services heading, note, and card collection.
- `ServiceCard` is a presentational, reusable link card receiving an icon, title, description, and destination.
- `ApproachSection` renders the practice approach and therapy photo.
- `ContactSection` renders phone, location, and map link.
- `SiteFooter` renders the footer.
- `SectionKicker` is the shared numbered section label used by the section components.

Each component lives in its own directory with a React source file. Components with layout or responsive styling also receive a `.module.css` file. Keep global resets, fonts, color/type tokens, and site-wide RTL/LTR direction rules in `frontend/app/globals.css`.

## Behavior and Accessibility

- Keep the visible text, translated keys, navigation destinations, imagery, visual styling, and responsive breakpoints unchanged.
- Keep the language switch persistent through `localStorage`; preserve current behavior for setting the document language and direction.
- Preserve semantic headings and links. Keep the entire service card as a link to `#contact` and retain keyboard focus visibility.
- Keep decorative icons hidden from assistive technology.

## Tests

Add Vitest and React Testing Library as development dependencies. Add focused tests for:

- `Header`: menu open/close behavior and language-change callback.
- `ServiceCard`: accessible link destination and rendered title/description.

Do not add repetitive unit tests for sections that only render static translated content. Verify the production build after the refactor.

## Non-Goals

- No copy, translation, design, URL, or service-content changes.
- No locale context/provider; locale state remains in the page composer.
- No backend, appointment, or account functionality.
- No attempt to change shared global styling outside what is needed to move component styles into CSS Modules.

## Acceptance Criteria

1. `app/page.jsx` is a compact composition of the extracted components and retains language persistence and direction behavior.
2. Each listed component has its own folder and source file; style-bearing components own a CSS Module.
3. The rendered Hebrew and English pages preserve the existing page sections, service-card links, and responsive behavior.
4. Focused unit tests cover the Header interactions and ServiceCard link semantics.
5. The production build succeeds.
