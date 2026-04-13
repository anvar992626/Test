---
description: Run repo-root npm verify scripts (API health, metrics, Swagger, scenarios JSON + orchestration context shape)
---

From the **repository root** (not `apps/api`), with the stack up and API on port 3001:

1. Run `npm run verify` — must print `All automated API checks passed.` Fix any FAIL (usually API down or no scenario has run yet so metrics lack `signallab_`).
2. Run `npm run verify:orchestration` — validates `.cursor/orchestration-context.example.json` or local `.cursor/orchestration-context.json`.

If `verify` fails on metrics, trigger **one scenario** from the UI, then rerun `npm run verify`.

Summarize results in one short paragraph for the user.
