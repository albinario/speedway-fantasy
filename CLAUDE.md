# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install       # Install dependencies
bun dev           # Start dev server (localhost:3000)
bun build         # Production build
bun run lint      # Run ESLint
bun run db:types  # Regenerate Kysely types from Postgres schema → src/types/db.ts
```

No test suite exists in this project.

## Architecture

**Speedway Fantasy** is a Next.js 16 App Router full-stack app where users make picks for Speedway Grand Prix (SGP) races.

**Stack**: Next.js 16 · TypeScript · Kysely (Postgres/Neon) · Auth0 · Tailwind v4 · Bun · Vercel

### Data layer

- Database queries use **Kysely** (type-safe SQL builder) against a Neon serverless Postgres DB
- TypeScript types for DB tables are auto-generated via `bun run db:types` → `src/types/db.ts`
- All queries are wrapped in `dataFetch()` (`src/lib/data-fetch.ts`) which catches errors and returns typed fallbacks
- Each feature area has a co-located `data.ts` (e.g. `src/app/standings/data.ts`) exporting async functions called from server components
- React's `cache()` is used for request deduplication within a render

### Authentication

- Auth0 via `@auth0/nextjs-auth0` v4
- Auth0 client configured in `src/lib/auth/auth0.ts` with a session hook that syncs user records to the DB on login
- Roles extracted from Auth0 custom claims at key `https://betsgp.local/roles` — see `src/lib/auth/auth0-claims.ts`
- `getViewer()` (`src/lib/auth/get-viewer.ts`) is the server-side function to get the current user + their DB record

### Key domain concepts

- **GPs**: Grand Prix events identified by round number and year; have a `finished` flag
- **Picks**: Each user selects 3 riders per GP; stored in `user_picks`
- **Standings**: Aggregated season results in `users_standings`; year-scoped via URL search params
- **Year param**: Most pages accept a `year` search param; `src/lib/year.ts` and `src/lib/params.ts` handle defaults

### Structure

```
src/
  app/           # Next.js App Router — pages + API routes
    api/         # API route handlers (email, env, auth callbacks)
    standings/   # Feature pages, each with a data.ts for DB queries
    riders/
    gps/
    users/
    comments/
    admin/
    protected/
  components/    # Shared React components
    ui/          # shadcn/Radix UI primitives
  lib/           # Utilities and shared logic
    auth/        # Auth0 helpers
    db.ts        # Kysely client
    data-fetch.ts
    dates.ts / time-zone.ts / year.ts / params.ts
  config/        # Brand, nav, timezone config
  types/         # db.ts (auto-generated), other TS types
  enums/
```

### Environment variables

| Variable | Purpose |
|---|---|
| `APP_BASE_URL` | Base URL for Auth0 callbacks |
| `AUTH0_DOMAIN` | Auth0 tenant |
| `AUTH0_CLIENT_ID` | Auth0 app client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 app secret |
| `AUTH0_SECRET` | 32-byte hex for session encryption |
| `DATABASE_URL` | Neon Postgres connection string |
| `RESEND_API_KEY` | Resend transactional email |

Copy `.env.example` to `.env.local`.
