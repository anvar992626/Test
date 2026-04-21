---
name: signallab-observability
description: >-
  Verify Prometheus, Loki, Grafana, and optional Sentry for Signal Lab scenarios.
  Use after infra or API logging/metrics changes and for demo rehearsal.
---

# Signal Lab — observability skill

## Happy-path verification (local compose)

1. **Run a scenario** from the UI (`system_error` is best for Sentry; `success` for quiet checks).
2. **Metrics**: open `http://localhost:3001/metrics` and confirm counters:
   - `signallab_scenario_runs_total{scenario="...",outcome="..."}`
   - `scenario_runs_total{type="...",status="..."}`
   - `http_requests_total{method="...",path="...",status="..."}`
   - `signallab_scenario_duration_seconds_bucket{...}`
3. **Prometheus targets**: `http://localhost:9090/targets` → job `signallab-api` should be **UP**.
4. **Logs → Loki**: Promtail (`infra/promtail/config.yml`) decodes Docker logs and, for **`compose_service="api"`**, extracts **`scenario`** and **`level`** from Pino JSON into **Loki labels** (regex-based so non-JSON lines are not dropped). Explore examples:
   - `{job="docker", compose_service="api"} |= "signallab"`
   - `{job="docker", compose_service="api", scenario="system_error"}`
5. **Dashboard**: Grafana folder **Signal Lab** → **Signal Lab — Metrics & Logs** (uid `signal-lab-main`) — includes a **scenario label** filter demo panel.
6. **Sentry** (optional): ensure `SENTRY_DSN` was present when API container started; trigger `system_error`; confirm issue appears in the correct project/environment.

## Common failure modes

- **No docker logs in Loki**: Promtail needs Docker socket access; confirm Promtail container is running and not crash-looping.
- **Flat metrics**: Prometheus cannot scrape `api:3001` from its network — check `infra/prometheus/prometheus.yml` target.
- **Grafana `ERR_TOO_MANY_REDIRECTS`**: `GF_SERVER_ROOT_URL` in `docker-compose.yml` must match the URL you use in the browser (`http://localhost:3020`). Clear cookies for that host after changing it, or use a private window.

## Code touchpoints

- Metrics registration: `apps/api/src/metrics/metrics.service.ts`
- Log fields: `apps/api/src/scenario/scenario.service.ts` (`signallab: true`)
- Sentry: `apps/api/src/main.ts`, `apps/api/src/common/sentry-exception.filter.ts`
