# Path to **100 / 100** (and bonus)

The rubric max is **100** points across five blocks. **+5 bonus** is separate (hidden scenario in the *employer’s* PRD — not in this repo unless you discover it there).

## What usually costs the last 1–7 points

| Block | Typical gap | How this repo closes it |
|-------|-------------|-------------------------|
| **App & stack (25)** | Subjective “code quality” | Clear modules, `AGENTS.md`, Swagger, health, seed, env examples |
| **Observability (25)** | Sentry not shown | Set **`SENTRY_DSN`**, run **`system_error`**, attach screenshot → `docs/SENTRY.md` |
| **Cursor layer (25)** | “Just files” | **`AGENTS.md`** + **`docs/AI_LAYER.md` (why)** + real hooks |
| **Orchestrator (15)** | Resume “on paper only” | Context **example + schema** + **`npm run verify:orchestration`** |
| **Docs & DX (10)** | No proof of walkthrough | **`npm run verify`** + optional screenshots list below |

## Automated checks (run after `docker compose up`)

From **repo root** (Node **20+**):

```bash
npm run verify
npm run verify:orchestration
```

- **`verify`** — `/health`, `/metrics` contains `signallab_`, Swagger UI, `/api/scenarios`.
- **`verify:orchestration`** — validates `.cursor/orchestration-context.json` if present, else the **example** file.

## Manual steps an interviewer still expects

1. **UI** — `http://localhost:3000`, run **two** scenarios.
2. **Grafana** — `http://localhost:3020`, dashboard **Signal Lab**, Loki panel with label **`scenario=`**.
3. **Prometheus** — `http://localhost:9090/targets` → **UP**.
4. **Sentry** — follow **`docs/SENTRY.md`** (required for a literal “errors in Sentry” reading).
5. **New Cursor chat** — `@AGENTS.md` or `/orchestrator-resume` with a filled context file.

## Optional: screenshots (DX bonus)

Add under `docs/screenshots/` (or your PDF):

1. Signal Lab UI + run history  
2. `/metrics` showing `signallab_*`  
3. Grafana dashboard (metrics + Loki)  
4. Swagger `/api/docs`  
5. Sentry issue (redacted) — if claiming full observability tier  

## Penalties — quick self-audit

- [ ] Stack not swapped  
- [ ] Observability walkthrough reproducible (README + this doc)  
- [ ] ≥1 custom skill, marketplace doc, hooks + commands  
- [ ] README enough to start stack  

## Bonus +5

Only if the **official** test pack’s PRD contains a named bonus scenario — implement and mention it in `SUBMISSION_CHECKLIST.md`.
