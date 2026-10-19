# Naama Kalish Reich — website

Hebrew and English informative website built with Next.js App Router, Material UI, and i18next.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Hebrew is the default language. Use the `EN` / `עב` control to switch languages; the selection is saved in the browser and the page direction changes with it.

## Content

- Translation copy lives in `messages/he.json` and `messages/en.json` and is rendered with `t()` from `react-i18next`.
- The supplied logo and photos are served from `public/assets/`.
- Phone, clinic address, and service descriptions are draft details and should be confirmed before publishing.
