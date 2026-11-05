# Venuza

Discover. Connect. Experience.

Phase 1 is the foundation: a pnpm workspace, the Next.js web app, the Android-first Expo app, the Hono API, and the identity database schema. Later product phases are not in this tree.

## Requirements

- Node.js 26.13.0 (Active LTS)
- pnpm 10.33.4

## Setup

```sh
pnpm install
cp .env.example .env
```

`.env.example` lists names only. `.env` is gitignored. Leave values empty until the accounts exist. The API still boots.

The root `.env` is read by `apps/api` and by the database migration command. Web and mobile do not receive server-only variables. `pnpm dev:web` and `pnpm dev:mobile` copy only `NEXT_PUBLIC_` or `EXPO_PUBLIC_` values into those processes.

## Scripts

- `pnpm typecheck` — TypeScript strict across the workspace
- `pnpm test:api` — API health and bearer-token checks that do not need credentials
- `pnpm check:client-secrets` — fails if client source contains server secret names
- `pnpm dev:web` — Next.js proof screen on port 3000
- `pnpm dev:api` — API on port 3001
- `pnpm dev:mobile` — Expo
- `pnpm --filter @venuza/database generate` — create a migration from the schema
- `pnpm --filter @venuza/database migrate` — apply migrations with `DATABASE_URL_UNPOOLED`

## Phase 1 behaviour

- `GET /health` reads server environment from `apps/api/src/env.ts`. When `DATABASE_URL` is set it runs a database round-trip. When it is unset the response is HTTP 200 with `status: "degraded"` and a database check of `skipped`. A failed round-trip is HTTP 503 and does not crash the process.
- `GET /auth/verify` expects `Authorization: Bearer <Firebase ID token>`. A missing token is rejected. When Firebase Admin credentials are unset, a presented token is not treated as verified. A valid token returns the Firebase UID.
- Web and mobile each render one Glass Glow screen from `@venuza/design-tokens` and initialise the Firebase client from the public config names only.
- `packages/database` contains the first Drizzle migration: `users` keyed by Firebase UID, and `user_roles`. Applying it needs a Neon database. This repository does not apply it by itself.

## Sign-off still needs

Tawanda still has to supply a Firebase project (Email/Password, web and Android public config, and an Admin service account) and a Neon database (pooled `DATABASE_URL` and direct `DATABASE_URL_UNPOOLED`) before Phase 1 can be signed off. R2, Brevo, Paynow, and push are not required for this phase.
