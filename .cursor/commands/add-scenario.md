---
description: Add a new scenario type end-to-end (API + UI + observability notes)
---

Plan using `.cursor/skills/signallab-orchestrator/SKILL.md` task boundaries. Implement a **new** `scenario` key end-to-end: extend `SCENARIO_TYPES` in `apps/api/src/scenario/dto/run-scenario.dto.ts`, add behavior in `apps/api/src/scenario/scenario.service.ts` (with structured logs including `{ signallab: true, ... }`), expose it in `apps/web/src/app/page.tsx`, and update `prds/002_prd-observability-demo.md` with one row describing signals (metrics/logs/Sentry). Do not rename existing scenarios. Finish with `npm run build` in both `apps/api` and `apps/web`.
