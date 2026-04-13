---
name: signallab-stack
description: >-
  Navigate the Signal Lab monorepo (Next.js web, NestJS api, Prisma, Docker).
  Use for feature work, file placement, and stack-safe edits.
---

# Signal Lab — stack skill

## Quick map

- **UI**: `apps/web/src/app/page.tsx` (main screen), `apps/web/src/components/ui/*` (shadcn-style primitives), `apps/web/src/lib/api.ts` (fetch helper).
- **API**: `apps/api/src/scenario/*`, `apps/api/src/health/*`, `apps/api/src/metrics/*`, `apps/api/src/prisma/*`, `apps/api/prisma/schema.prisma`. Swagger UI: `/api/docs`.
- **Compose**: root `docker-compose.yml`; observability configs in `infra/`.

## Change patterns

- **New scenario type**: extend `SCENARIO_TYPES` in `run-scenario.dto.ts`, implement branch in `scenario.service.ts`, add UI option in `apps/web/src/app/page.tsx`, update `prds/002_prd-observability-demo.md` if behavior is user-visible.
- **New metric**: extend `MetricsService` and document the PromQL in `infra/grafana/provisioning/dashboards/json/signal-lab.json`.
- **Env vars**: document in root `README.md` and `apps/api/.env.example`.

## Build checks

- API: `cd apps/api && npm run build`
- Web: `cd apps/web && npm run build`

Always match existing naming (camelCase TS, Nest module boundaries, shadcn class patterns).
