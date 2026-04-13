---
name: signallab-orchestrator
description: >-
  Multi-step executor for Signal Lab: context.json for resume, per-task model tier
  (fast/default/reasoning), atomic tasks, retries, final report. Use for features
  that span API, web, infra, or observability.
---

# Signal Lab — orchestrator (max context economy)

## When to use

- Any change touching **2+** of: `apps/api`, `apps/web`, `infra/`, `docker-compose.yml`, `.cursor/`.
- You need a **new Cursor chat** to continue without re-explaining the repo.
- You want a **small model** to execute bounded tasks with **explicit file allow-lists**.

## Linked artifacts (load these, not the whole repo)

| Artifact | Role |
|----------|------|
| `.cursor/rules/signallab-stack.mdc` | Stack law + ports |
| `.cursor/skills/signallab-stack/SKILL.md` | Where files live |
| `.cursor/skills/signallab-observability/SKILL.md` | Metrics / Loki / Grafana / Sentry checks |
| `.cursor/skills/signallab-prisma/SKILL.md` | Migrations + seed |
| `AGENTS.md` | One-page map for humans + agents |
| `.cursor/orchestration-context.example.json` | Copy → `orchestration-context.json` |
| `.cursor/orchestration-context.schema.json` | Shape of the context file |

## Context file (resume contract)

1. **Copy** `.cursor/orchestration-context.example.json` → **`.cursor/orchestration-context.json`** (gitignored).
2. Fill **`runId`**, **`objective`**, and **`tasks`** (max **7** tasks per run).
3. After **each** task completes or fails, update **`updatedAt`**, **`phase`**, task **`status`**, **`attempts`**, **`lastError`** (minimal: `file:line: message`).
4. A **new chat** resumes by reading **only** `orchestration-context.json` + this skill + allow-listed files for the active task.

**Phases:** `planning` → `execution` → `verification` → `closed`

## Model selection (required per task)

Pick **`model`** and **`modelReason`** for every task. This is not decorative — it tells humans and Cursor which tier to use.

| Value | Use when | Typical task |
|-------|----------|----------------|
| **`fast`** | Single module, pattern exists, diff &lt; ~80 lines, mechanical edit | DTO enum, Grafana panel tweak, copy scenario branch |
| **`default`** | Cross-module reasoning, API + contract, or ambiguous requirements | Planning, refactor touching 2 services, observability verification |
| **`reasoning`** | Architecture / trade-offs / security — **rare**; prefer splitting into smaller **default** tasks | Only if you cannot decompose further |

**Rules**

- Default bias: **prefer `fast`** once the plan is frozen; use **`default`** for the **first** planning task and for **verification**.
- Never assign **`reasoning`** to “edit one file” work — split instead.

## Retry / resume

1. **Per task:** max **2** attempts (`attempts` 1–2). Same task, tighter scope (fewer files, smaller objective).
2. After **2** failures: set **`status`: `blocked`**, write **`lastError`**, stop. Human unblocks or splits task.
3. **Resume prompt** (paste in new chat):

```text
Resume Signal Lab orchestration.
Read .cursor/orchestration-context.json (and .cursor/skills/signallab-orchestrator/SKILL.md).
Rules: @.cursor/rules/signallab-stack.mdc
Pick the first task where status is pending or in_progress (or blocked if human cleared it).
Execute only allowedFiles for that task. Update the JSON when done.
```

## Worker template (single task execution)

```text
Worker — Signal Lab
Rules: @.cursor/rules/signallab-stack.mdc
Observability: @.cursor/skills/signallab-observability/SKILL.md (if touching logs/metrics/infra)

Context: task id <T#> from .cursor/orchestration-context.json
Model tier intended: <fast|default|reasoning> — <one-line why>

Objective (one sentence): ...
Allowed files (ONLY these): ...
Out of scope: ...
Acceptance (must all pass): ...

Output:
1. Diff summary (files + intent)
2. Commands run + exit codes
3. If failed: lastError as file:line: message only
```

## Verification gates (after edits)

| Area | Command |
|------|---------|
| API | `cd apps/api && npm run build` |
| Web | `cd apps/web && npm run build` |
| Compose | `docker compose config` |
| Full observability | follow `.cursor/skills/signallab-observability/SKILL.md` |

## Final report (paste when `phase` = `closed`)

```markdown
## Orchestration report — Signal Lab
- **Run ID**:
- **Objective**:
- **Tasks**: done ___ / total ___ (list ids: T1 ✓, T2 ✓, …)
- **Verification**: (metrics / Loki label / Grafana / Sentry if applicable)
- **Open risks / follow-ups**:
- **Context file**: path `.cursor/orchestration-context.json` archived or deleted locally
```

## Example flow (new scenario)

| Step | Task focus | Model |
|------|------------|-------|
| 1 | Plan + write `orchestration-context.json` from example | default |
| 2 | API DTO + service branch | fast |
| 3 | Metrics + dashboard if needed | fast |
| 4 | Web RHF options | fast |
| 5 | README / PRD row | fast |
| 6 | Observability skill checklist | default |

## Context budget

- Do **not** paste full `node_modules`, entire Grafana JSON, or full compose unless the task allow-list requires it.
- Pass **only** `lastError` + **`allowedFiles`** between steps.
