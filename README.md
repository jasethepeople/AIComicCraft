# AIComicCraft

An AI-powered comic and anime creation platform: users generate comic panels, characters, and anime frames with OpenAI image generation, and buy credits or subscriptions via Stripe.

## Features

From the actual server routes (`server/routes.ts`) and client code:

- **User accounts** — registration, login, logout, session auth (`/api/auth/*`), with an onboarding wizard.
- **Comic creation** — create comics and multi-panel layouts (`/api/comics`, `/api/panels`).
- **AI generation** — panel, character, anime, and anime-frame generation backed by OpenAI (`server/openai.ts`), with fallback story generation (`/api/generate/*`).
- **Art styles** — browsable art-style catalog with recommendations, trends, user preferences, and ratings (`/api/art-styles`, `/api/styles/*`).
- **Monetization** — credit balances and transactions, subscription plans and purchases, Stripe checkout webhooks (`/api/credits/*`, `/api/subscription/*`, `/api/webhooks/stripe`).
- **React client** (`client/`) — Vite + shadcn/Radix UI, React Query, Stripe Elements; includes a style-morphing preview page (per `replit.md`).

## Tech stack

Node.js, TypeScript, Express 4, React 18 (Vite), Tailwind CSS, Radix/shadcn UI, Drizzle ORM + PostgreSQL (Neon), OpenAI API, Stripe, `express-session`, esbuild. Build: `vite build` + esbuild server bundle.

## Getting started

From `package.json`:

```bash
npm install
npm run dev        # NODE_ENV=development tsx server/index.ts
npm run build      # client bundle + server bundle
npm start          # production
npm run db:push    # drizzle-kit push
```

Needs `DATABASE_URL`, an OpenAI API key, and Stripe keys (per `server/openai.ts`, `server/routes.ts`).

## Project structure

```
├── client/        # React app (Vite, Tailwind, shadcn UI)
├── server/        # Express API: routes.ts, openai.ts, storage.ts, db.ts
├── shared/        # shared schema (schema.ts)
└── attached_assets/  # screenshots and exported project zips
```

## Status

Real, working full-stack app exported from [Replit](https://replit.com/@undertheclearbl/AIComicCraft). Note: the repo root is littered with session/test cookie and log `.txt` files (e.g., `admin_cookies.txt`, `test_session*.txt`) left over from manual testing — cosmetic clutter, not code. Per `replit.md`, the platform was declared production-ready by its author in July 2025.
