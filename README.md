# Anna Gromyko — AI Product Builder Portfolio

Production-ready bilingual portfolio built with React, TypeScript and Vite. It preserves the approved dark/light visual system, interactive four-mode hero, asymmetric case grid and real project assets.

## Local setup

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `VITE_CONTACT_ENDPOINT` — HTTPS endpoint accepting `POST` JSON with `name`, `contact`, `message`, and the honeypot `website` field.

No provider key belongs in the browser bundle. Until an endpoint is configured, the form intentionally shows an honest configuration message and links visitors to email and Telegram.

## Deployment to Vercel

Import `annkka3/presentation_landing`, use the Vite preset, and keep the included settings:

- Build command: `npm run build`
- Output directory: `dist`
- SPA routes: handled by `vercel.json`

Add `VITE_CONTACT_ENDPOINT` in Vercel Project Settings. Replace the temporary canonical hostname in `index.html`, `robots.txt`, and `sitemap.xml` after the final domain is known. Then set the portfolio project status to `Live` in `src/data/portfolio.ts`.

## Assets and naming

Approved assets live in `public/assets`. The final project names are centralized in `src/data/portfolio.ts` as `ЦветиМир` / `TsvetiMir` and `Eufashion Glasses`. Replace an asset only with a project-matched file and retain its current route, alt text and dimensions.

The supplied handoff did not include a resume PDF, so the header Resume control scrolls to the contact area instead of exposing a dead download. Add a real PDF under `public/` before turning it into a download link.
