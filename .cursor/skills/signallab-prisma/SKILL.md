---
name: signallab-prisma
description: >-
  Safely change Prisma schema and migrations for Signal Lab's PostgreSQL database.
---

# Signal Lab — Prisma skill

## Files

- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/*`
- Runtime: `PrismaService` (`apps/api/src/prisma/prisma.service.ts`)

## Local (host) workflow

```bash
cd apps/api
npx prisma migrate dev --name <meaningful_name>
npx prisma generate
npm run build
```

## Seed

- `npx prisma db seed` — inserts demo `ScenarioRun` rows **only when the table is empty** (`prisma/seed.ts`).
- Configured in `package.json` under `"prisma": { "seed": "..." }`.

## Docker workflow

- API image runs `prisma migrate deploy` on start (`ENTRYPOINT` in `apps/api/Dockerfile`).
- After you add migrations, rebuild: `docker compose build api && docker compose up -d api`.

## Rules

- Never edit applied migration SQL retroactively; add a new migration instead.
- Keep `ScenarioRun` indexes purposeful (`createdAt`, `scenario`) — extend only when queries justify it.
- If you rename fields, update `scenario.service.ts` persistence and any UI types in `apps/web/src/app/page.tsx`.
