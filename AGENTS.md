# Signal Lab — agent & reviewer map

This file gives **one-screen context** for Cursor, Codex, or humans. Details live under `docs/` and `.cursor/`.

## What this repo is

A **demo observability playground**: UI runs **scenarios** → NestJS API → **Postgres (Prisma)**, **Prometheus** metrics, **Loki** logs (via **Promtail**), optional **Sentry**, **Grafana** dashboards.

## Quick paths

| Need | Location |
|------|----------|
| Run everything | `docker compose up -d --build` — see `README.md` |
| Automated API smoke | Repo root: `npm run verify` (needs Node 18+) |
| Orchestration JSON OK | Repo root: `npm run verify:orchestration` |
| Max-score checklist | `docs/SCORE_100.md` |
| Sentry proof | `docs/SENTRY.md` |
| API health / docs | `GET /health`, Swagger `http://localhost:3001/api/docs` |
| Grafana | `http://localhost:3020` (not `:3000/grafana`) |
| Stack rules (always) | `.cursor/rules/signallab-stack.mdc` |
| Nest conventions | `.cursor/rules/nestjs-api-patterns.mdc` |
| Where to edit code | `.cursor/skills/signallab-stack/SKILL.md` |
| Verify metrics/logs | `.cursor/skills/signallab-observability/SKILL.md` |
| Prisma / seed | `.cursor/skills/signallab-prisma/SKILL.md` |
| Multi-step / new chat | `.cursor/skills/signallab-orchestrator/SKILL.md` + `.cursor/orchestration-context.example.json` |
| Cursor commands | `.cursor/commands/*.md` (e.g. `/stack-up`, `/observability-verify`) |
| Hooks | `.cursor/hooks.json` + `.cursor/hooks/*.mjs` |
| Marketplace skills (enable in Cursor UI) | `docs/CURSOR_MARKETPLACE.md` |
| AI layer narrative | `docs/AI_LAYER.md` |

## Orchestration system (not random `.cursor` files)

1. **Rules** — hard guardrails (stack, ports, layering).  
2. **Skills** — procedures: stack map, observability checks, Prisma, **orchestrator** (context JSON + model tiers + retries).  
3. **Commands** — slash prompts for bootstrap, resume, stack, verify, add-scenario.  
4. **Hooks** — deterministic checks (destructive shell, Prisma follow-up).  
5. **Context file** — `.cursor/orchestration-context.json` (local, gitignored) for **resume**; **example** committed.

## Do not

- Swap stack pieces without human sign-off (see rules).  
- Commit secrets or real `SENTRY_DSN` into the repo.  
- Rely on `http://localhost:3000/grafana` — use **`:3020`** for Grafana.
