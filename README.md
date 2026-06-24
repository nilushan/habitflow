# HabitFlow

[![CI](https://github.com/nilushan/habitflow/actions/workflows/ci.yml/badge.svg)](https://github.com/nilushan/habitflow/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?logo=postgresql&logoColor=white)
![Tests](https://img.shields.io/badge/tests-Vitest_%2B_Playwright-6E9F18?logo=vitest&logoColor=white)

A minimalist, **AI-powered, privacy-first habit tracker** for developers and productivity enthusiasts. HabitFlow pairs a clean, keyboard-friendly interface with intelligent coaching and insights — without the feature bloat or invasive analytics of typical habit apps.

> Built as a full-stack showcase: typed end-to-end, test-covered, and shipped through a multi-stage CI pipeline.

<!-- TODO(nilushan): add a screenshot or short GIF of the habits dashboard here — it dramatically lifts a project README. Drop it in /public and reference it, e.g. ![HabitFlow dashboard](public/screenshot.png) -->

## Features

- **Habit tracking** — create, categorise, and order habits with flexible daily/weekly frequencies
- **Daily logging & streaks** — one-tap completion logging with per-day notes
- **Auto-journaling** — quick daily reflections, stored with AI-extracted metadata
- **AI coach** — context-aware motivation and accountability via the Anthropic API
- **Insights** — weekly, monthly, and predictive analysis of trends and correlations
- **Privacy-first** — anonymised AI calls and user-controlled data sharing, no PII tracking

## Tech stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Route Groups) · React 19 · TypeScript |
| **UI** | Tailwind CSS · Radix UI primitives (shadcn/ui-style components) |
| **Data fetching** | TanStack React Query · React Hook Form + Zod validation |
| **Database** | PostgreSQL · Drizzle ORM (typed schema + migrations) |
| **Auth** | Clerk |
| **AI** | Anthropic API (coach & insight generation) |
| **Testing** | Vitest + Testing Library (unit) · Playwright (E2E) |
| **CI/CD** | GitHub Actions — lint, type-check, unit tests, build, E2E |

## Architecture

A clean, layered structure that keeps UI, data access, and business logic separated:

```
app/
  (dashboard)/        Route group: habits · journal · insights · coach
  api/habits/         REST route handlers (CRUD)
components/
  habits/             Feature components (card, form, list)
  ui/                 Reusable primitives (button, dialog, select…)
  providers/          React Query provider
hooks/                use-habits — React Query data hooks
lib/
  db/schema.ts        Drizzle schema: users, habits, habit_logs,
                      journal_entries, insights, coach_messages
  db/index.ts         DB client
  services/           Business logic (habit-service)
types/                Shared domain types
```

The data model is fully relational with cascading deletes and indexed access paths (per-user habits, habit/date logs, user/date journal entries).

## Getting started

**Prerequisites:** Node.js 20+, pnpm 9, Docker (for local Postgres).

```bash
# 1. Install dependencies
pnpm install

# 2. Start a local PostgreSQL instance
docker compose up -d

# 3. Configure environment
cp .env.example .env.local
# For local dev you only need DATABASE_URL — set it to match docker-compose.yml:
#   DATABASE_URL="postgresql://habitflow:habitflow_dev_password@localhost:5432/habitflow"
# The Clerk and Anthropic keys in .env.example are placeholders for later phases
# and are NOT required yet (see "Auth & seeding" below).

# 4. Apply the database schema
pnpm db:push

# 5. Seed the local dev user (required — see below)
docker compose exec -T postgres psql -U habitflow -d habitflow -c \
  "INSERT INTO users (id, clerk_id, email) VALUES ('00000000-0000-0000-0000-000000000001','dev','dev@habitflow.local') ON CONFLICT DO NOTHING;"

# 6. Run the dev server
pnpm dev                     # http://localhost:3000
```

### Auth & seeding

Authentication is **not wired up yet** — Clerk is on the roadmap but the app
currently identifies the user via a hardcoded `x-user-id` header
(`00000000-0000-0000-0000-000000000001`). Because `habits.user_id` is a foreign
key into `users`, **habit creation fails until that user row exists**, so the
seed step above is mandatory on a fresh database. You do not need Clerk or
Anthropic keys to run, log habits, or browse the UI.

> **Port already in use?** If `5432` (Postgres) or `3000` (Next.js) is taken,
> remap Postgres in `docker-compose.yml` (and `DATABASE_URL`); Next.js will
> auto-pick the next free port and print it on startup.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm test:unit` | Unit tests only (Vitest, no server needed) |
| `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` | Full Vitest run — includes integration tests that require a dev server on `localhost:3000` |
| `pnpm test:integration` | Integration tests (needs `pnpm dev` running) |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | End-to-end tests (Playwright) |
| `pnpm type-check` | TypeScript type checking |
| `pnpm lint` | ESLint |
| `pnpm db:push` / `db:generate` / `db:migrate` / `db:studio` | Drizzle schema & migration tooling |

## Testing & CI

Every push and pull request runs a four-stage GitHub Actions pipeline: **lint + type-check → unit tests → production build → E2E tests** (with Playwright reports uploaded on failure). Specs and tests are written alongside features rather than after the fact.

---

*A portfolio project by [Nilushan Silva](https://github.com/nilushan) — see [docs/](docs) for the full PRD and architecture notes.*
