# Signal Lab — Cursor AI layer

## Why this exists (not only what)

Interviewers and future chats should **reuse the same playbook** without you retyping stack rules, observability URLs, or decomposition steps. The AI layer turns the repo into a **small operating system**: guardrails (rules), procedures (skills), one-shot prompts (commands), automation (hooks), and **resumable** multi-step work (orchestrator + context file).

## System map

| Piece | Why it matters |
|-------|----------------|
| **Rules** | Prevent stack drift and wrong layers; always-on + scoped API rule. |
| **Skills** | Scoped “how to” with **When to use** — smaller models can follow a single skill. |
| **Commands** | Repeatable workflows without hunting prompts. |
| **Hooks** | Catch **real** mistakes (destructive Docker/shell, Prisma schema edits). |
| **Orchestrator + context JSON** | **Resume** across chats; **model tier per task** with reasons; **retry limits**; **final report**. |
| **Marketplace doc** | Six skills to enable in Cursor UI — each justified in `docs/CURSOR_MARKETPLACE.md`. |

**Single entry for humans:** root **`AGENTS.md`** (table of links + “do not” list).

## Layout

| Path | Purpose |
|------|---------|
| `AGENTS.md` | One-page map: where everything lives and why. |
| `.cursor/rules/signallab-stack.mdc` | Non-negotiable stack + ports + API routes. Always applied. |
| `.cursor/rules/nestjs-api-patterns.mdc` | NestJS layering for `apps/api` (scoped). |
| `.cursor/skills/signallab-stack/SKILL.md` | File map + change patterns + builds. |
| `.cursor/skills/signallab-observability/SKILL.md` | Metrics, Loki labels, Grafana, Sentry. |
| `.cursor/skills/signallab-prisma/SKILL.md` | Migrations + seed. |
| `.cursor/skills/signallab-orchestrator/SKILL.md` | Context file, model tiers, retries, resume, final report. |
| `.cursor/orchestration-context.example.json` | Copy to `orchestration-context.json` (gitignored). |
| `.cursor/orchestration-context.schema.json` | JSON Schema for the context file. |
| `.cursor/commands/*.md` | `stack-up`, `observability-verify`, `add-scenario`, `orchestrator-bootstrap`, `orchestrator-resume`. |
| `.cursor/hooks.json` | Shell guard + Prisma follow-up (Node scripts). |
| `docs/CURSOR_MARKETPLACE.md` | Six marketplace skills + rationale. |

## Using a new chat effectively

1. Open **`AGENTS.md`** or `@` **`signallab-orchestrator`**.
2. For multi-step work: **`/orchestrator-bootstrap`** → edit **`.cursor/orchestration-context.json`** → later **`/orchestrator-resume`**.
3. For demo checks: **`/observability-verify`** or `@signallab-observability`.
4. Prisma edits: expect **`postToolUse`** hook context about migrate/generate.

## Rubric / “100 points”

- **`docs/SCORE_100.md`** — what interviewers deduct for, and how this repo answers it.
- **`docs/SENTRY.md`** — proving the Sentry leg without committing secrets.
- Repo root **`npm run verify`** / **`npm run verify:orchestration`** — quick automated checks.

## Hooks (deterministic, cross-platform)

- **`beforeShellExecution` → `guard-destructive-shell.mjs`**: flags `docker compose down -v`, `docker system prune`, dangerous `rm`.
- **`postToolUse` (Write) → `prisma-followup.mjs`**: injects migrate/generate hints when `schema.prisma` appears in the payload.

Both use **Node** (no `jq`) so Windows/macOS/Linux behave the same.
