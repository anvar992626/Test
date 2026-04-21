# PRD 002 — Observability demo

## Goal
Every scenario run produces **metrics**, **structured logs**, and (for `system_error`) a **Sentry** event when `SENTRY_DSN` is set.

## Instrumentation
- **Prometheus**: `GET /metrics` on API (`signallab_scenario_runs_total`, `signallab_scenario_duration_seconds`, `scenario_runs_total{type,status}`, `http_requests_total{method,path,status}`, process metrics).
- **Loki**: Docker log shipping via Promtail; logs include `signallab: true` in JSON fields for grep/Explore.
- **Grafana**: Provisioned datasource + dashboard folder `Signal Lab`.
- **Sentry**: `@sentry/node` init in API; 5xx and non-HTTP errors captured; 4xx validation path not spammed.

## API
- **Canonical run**: `POST /api/scenarios/run` with `{ "type": "<scenario>", "name"?: string, "metadata"?: object }`.
- **Legacy**: `POST /api/scenarios` with `{ "scenario": "<key>" }` (deprecated; still supported).
- **Easter egg**: `type: "teapot"` → **418** (no DB row).

## Scenarios
| Key | Behavior |
|-----|----------|
| `success` | 200, success counter |
| `slow_operation` | ~600ms delay, histogram |
| `slow_request` | **2–5s** random delay, histogram |
| `business_event` | structured info log |
| `validation_error` | 400 |
| `system_error` | 500 + Sentry |
| `teapot` | 418 I'm a teapot |

## Acceptance
- After a run, Prometheus target is UP; counters increase.
- Loki shows lines containing `signallab` for the API container.
- Grafana dashboard panels react within scrape/refresh windows.
