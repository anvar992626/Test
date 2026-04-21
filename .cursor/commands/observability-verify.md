---
description: Run the observability smoke checks (metrics, Loki, Grafana, optional Sentry)
---

Follow `.cursor/skills/signallab-observability/SKILL.md` exactly. Use the UI or `curl` to POST `{"type":"success"}` and `{"type":"system_error"}` to `http://localhost:3001/api/scenarios/run` (legacy `POST /api/scenarios` with `{"scenario":...}` still works). Report: (1) relevant `signallab_*` series from `/metrics`, (2) a Loki query and whether lines appear, (3) whether Grafana dashboard `signal-lab-main` shows activity, (4) whether Sentry received anything **only if** `SENTRY_DSN` is configured—otherwise state “skipped”. Keep output compact; paste raw errors only when a step fails.
