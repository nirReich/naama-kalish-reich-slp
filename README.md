# Naama Kalish Reich — Speech-Language Therapy

A bilingual Hebrew and English information website for Naama Kalish Reich’s speech-language therapy practice. Built with Next.js, Material UI, and i18next.

## Features

- Hebrew and English content with right-to-left and left-to-right layouts.
- Responsive sections for the practice, areas of care, approach, and contact details.
- Reusable React components styled with CSS Modules.
- Accessible navigation and service links.

## Run locally

Requirements: Node.js and npm.

```sh
cd frontend
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Hebrew is the default language. Use the language control to switch languages; the selection is saved in local storage.

## Useful commands

Run the unit tests:

```sh
cd frontend
npm test
```

Create a production build:

```sh
cd frontend
npm run build
```

## Project structure

- `frontend/app/` — Next.js App Router pages, layout, and shared styles.
- `frontend/components/` — reusable page sections and UI components.
- `frontend/messages/` — Hebrew and English translations.
- `frontend/public/assets/` — images and logo served by the website.
- `backend/` — reserved for future backend work.
- `ROADMAP.md` — phased website roadmap.

Translation copy is managed in `frontend/messages/he.json` and `frontend/messages/en.json` and rendered through the `t()` function from `react-i18next`.

## License and repository visibility

This project is proprietary; see [LICENSE](LICENSE). The GitHub repository is public, so GitHub’s Terms of Service still allow others to view and fork it through GitHub. Make the repository private if you want to restrict access through GitHub.
