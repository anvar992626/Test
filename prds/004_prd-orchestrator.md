# PRD 004 — Orchestrator skill (context economy)

## Goal

One **orchestrator** skill describes how to split work into **atomic tasks** so smaller models can execute steps with minimal shared context, with **machine-readable resume state**.

## Deliverables

1. **`.cursor/orchestration-context.example.json`** — committed template; **`.cursor/orchestration-context.json`** — local, gitignored, updated after each task.
2. **`.cursor/orchestration-context.schema.json`** — JSON Schema for validation / editor hints.
3. **Model selection** — every task has `model`: `fast` | `default` | `reasoning` plus **`modelReason`** (one sentence).
4. **Retry policy** — max **2** attempts per task; then `blocked` + minimal `lastError`.
5. **Resume** — documented prompt + **`/orchestrator-resume`** command.
6. **Final report** — markdown template when `phase: closed`.
7. **Links** — orchestrator references stack + **observability** + **Prisma** skills; **`AGENTS.md`** maps the system.

## Principles

1. **Plan once** — ≤7 tasks in context file; explicit `allowedFiles` per task.
2. **One concern per task** — API *or* UI *or* infra *or* verify.
3. **Verification gates** — `npm run build` in `apps/api` / `apps/web`; `docker compose config`; observability skill for full checks.
4. **Stop conditions** — two failures → blocked; human splits task or unblocks.
5. **No stack rewrites** — cite `.cursor/rules/signallab-stack.mdc` before dependency swaps.

## Acceptance

- New chat can resume from **only** context file + orchestrator skill + allow-listed paths.
- Commands **`/orchestrator-bootstrap`** and **`/orchestrator-resume`** exist under `.cursor/commands/`.
