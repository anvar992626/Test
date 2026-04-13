# Cursor marketplace skills (recommended)

Enable these from **Cursor Settings → Rules for AI → Skills → Marketplace** (names may vary slightly by Cursor version). Each one reduces guesswork for this repo.

1. **Next.js (App Router)** — routing and server/client boundaries for `apps/web`.
2. **React 19 / modern hooks** — keeps client components (`'use client'`) and TanStack Query usage idiomatic.
3. **Tailwind CSS** — matches shadcn-style tokens in `apps/web/src/app/globals.css` and `tailwind.config.ts`.
4. **Prisma** — migrations, `schema.prisma`, and the API’s `prisma migrate deploy` container entrypoint.
5. **NestJS** — module layout, validation pipe, filters, and Prometheus `/metrics` alongside REST controllers.
6. **Docker / Compose** — multi-service networking (`api`, `web`, `grafana`, `promtail` + host socket), rebuild flows.

These are **not** vendored into the repo; they complement the **local** skills under `.cursor/skills/` which encode Signal Lab–specific guardrails and demo verification.
