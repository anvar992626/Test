# Signal Lab

Observability playground: run **scenarios** from a Next.js UI, execute them in a NestJS API, and watch **Prometheus**, **Loki**, **Grafana**, and optional **Sentry** react.

**Cursor / AI:** start with **`AGENTS.md`**, then **`docs/AI_LAYER.md`**. Multi-step work: copy `.cursor/orchestration-context.example.json` → `.cursor/orchestration-context.json`, use slash commands **`/orchestrator-bootstrap`** and **`/orchestrator-resume`**.

## Prerequisites

- Docker Desktop (Windows/macOS) or Docker Engine + Compose v2
- (Optional) Node.js 22+ if you develop without containers

## One-command start

```bash
docker compose up -d --build
```

Copy `.env.example` to `.env` at the repo root if you want to inject variables into Compose. To capture `system_error` events in Sentry, set `SENTRY_DSN` **before** the first API container start (or recreate the API service after setting it):

```bash
# PowerShell example
$env:SENTRY_DSN="https://examplePublicKey@o0.ingest.sentry.io/0"
docker compose up -d --build
```

### Ports

| Service | URL |
|---------|-----|
| Web UI | http://localhost:3000 |
| Nest API | http://localhost:3001 |
| Health | http://localhost:3001/health |
| OpenAPI (Swagger UI) | http://localhost:3001/api/docs |
| Prometheus scrape (`/metrics`) | http://localhost:3001/metrics |
| Prometheus UI | http://localhost:9090 |
| Loki | http://localhost:3100 |
| Grafana | http://localhost:3020 — default **admin / admin** |

## Stop / reset

```bash
docker compose down
# destructive (removes DB volume):
# docker compose down -v
```

## Automated smoke (optional, Node 18+)

From the **repo root** (after `docker compose up` and at least one scenario run so metrics exist):

```bash
npm run verify
npm run verify:orchestration
```

See **`docs/SCORE_100.md`** for how this maps to a **100/100** rubric pass and **`docs/SENTRY.md`** to prove Sentry end-to-end.

## Manual verification script (~15 min)

1. Open http://localhost:3000 — you should see **Signal Lab** with three cards.
2. Choose **system_error** → **Run scenario**. Expect an error banner (500) — that is intentional.
3. Open http://localhost:3001/metrics — search for `signallab_scenario_runs_total` and confirm totals increased (`outcome="error"` for the failed run).
4. Open **http://localhost:3020** → Explore → Loki. Examples (Promtail adds **`scenario`** and **`level`** labels from Pino JSON on the `api` service):
   - `{job="docker", compose_service="api"} |= "signallab"`
   - `{job="docker", compose_service="api", scenario="system_error"}`
   - `{job="docker", compose_service="api", scenario="success"}`  
   Lines should appear within ~1 minute of ingestion. After changing Promtail config: `docker compose up -d --force-recreate promtail`.
5. Open **Dashboards → Signal Lab → Signal Lab — Metrics & Logs** — **4 panels** (metrics + two Loki views, including label filter demo).
6. If `SENTRY_DSN` is set, open your Sentry project and confirm a new error for the simulated failure.

## Local development (without Docker for apps)

Docker images run **production** builds (no hot reload). For **hot reload** during coding, run Node locally:

```bash
# Terminal A — database only
docker compose up -d postgres

# Terminal B — API
cd apps/api
cp .env.example .env   # adjust DATABASE_URL to localhost:5432
npx prisma migrate dev
npm run start:dev

# Terminal C — Web
cd apps/web
cp .env.example .env.local   # or set NEXT_PUBLIC_API_URL
npm run dev
```

- **API**: `http://localhost:3001/health`, **Swagger**: `http://localhost:3001/api/docs`  
- Set `SWAGGER_ENABLED=false` in `apps/api/.env` if you want to hide OpenAPI in a given environment.

### Database seed (demo history)

- **Local:** from `apps/api` with `DATABASE_URL` set: `npx prisma db seed` (or `npm run prisma:seed`).
- **Docker:** runs automatically after migrations on API container start **only if** `ScenarioRun` is empty (so it does not wipe your data).
- To re-seed: truncate `ScenarioRun` (or `docker compose down -v` for a fresh volume), then restart `api`.

## Cursor AI layer

- **`AGENTS.md`** — one-page map (rules, skills, commands, hooks, orchestration).
- **`docs/AI_LAYER.md`** — why the layer exists + layout.
- **Orchestrator:** `.cursor/skills/signallab-orchestrator/SKILL.md`, context template **`.cursor/orchestration-context.example.json`** (working copy **`.cursor/orchestration-context.json`** is gitignored).
- **Commands:** `/stack-up`, `/observability-verify`, `/add-scenario`, `/orchestrator-bootstrap`, `/orchestrator-resume`.
- PRDs: **`prds/`**. Rubric: **`RUBRIC.md`**, **`SUBMISSION_CHECKLIST.md`**.

## Repository layout

```
AGENTS.md       Cursor / human map of the AI layer
apps/web        Next.js UI
apps/api        NestJS + Prisma
infra/          Prometheus, Grafana provisioning, Promtail
.cursor/        Rules, skills, commands, hooks, orchestration example + schema
```

## License

MIT (adjust for your employer if needed).
