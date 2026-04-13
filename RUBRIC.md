# Signal Lab — rubric (template)

| Area | Weight | Criteria |
|------|--------|----------|
| **Stack fidelity** | 20% | Next + shadcn/TW/RHF/TanStack Query; Nest + Prisma/PG; no unapproved swaps. |
| **One-command infra** | 20% | `docker compose up -d` brings app + observability; documented ports. |
| **Observability depth** | 25% | Metrics move; logs reach Loki; Grafana dashboard provisioned; Sentry path documented. |
| **Cursor AI layer** | 20% | Rules + ≥3 skills (incl. observability) + ≥3 commands + ≥2 hooks + marketplace doc (≥6). |
| **Orchestrator** | 10% | Skill encodes decomposition, verification gates, context-saving behavior. |
| **Docs / demo script** | 5% | README + AI layer doc + 15-minute reviewer path. |

**Deductions**: missing migration, broken compose, fake metrics, hooks that error at load time, orchestrator that encourages stack drift.
