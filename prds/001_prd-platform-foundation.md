# PRD 001 — Platform foundation

## Goal
Monorepo skeleton: Next.js UI, NestJS API, PostgreSQL via Prisma, single-command Docker Compose.

## Scope
- `apps/web`: Next.js App Router, Tailwind, shadcn-style UI primitives.
- `apps/api`: NestJS modules, Prisma client, health of DB connectivity via scenario persistence.
- `docker-compose.yml`: `postgres`, `api`, `web` with sane defaults.

## Non-goals
- Auth, multi-tenancy, production hardening beyond baseline secrets handling.

## Acceptance
- `docker compose up -d` starts Postgres, API (3001), Web (3000).
- API applies Prisma migrations on container start.
- UI loads and can call API with CORS enabled.
