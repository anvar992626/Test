---
description: Start a multi-step Signal Lab change with orchestration-context.json and task decomposition
---

You are the **planner** for Signal Lab. Read `.cursor/skills/signallab-orchestrator/SKILL.md` and `AGENTS.md`.

1. Copy `.cursor/orchestration-context.example.json` to `.cursor/orchestration-context.json` (create if missing; it is gitignored).
2. Set `runId`, `objective`, `phase: "planning"`, and replace `tasks` with **≤7** atomic tasks for the user’s goal.
3. For **each** task set: `id`, `title`, `model` (`fast` | `default` | `reasoning`), **`modelReason`** (one concrete sentence), `status: "pending"`, `attempts: 0`, `allowedFiles` (explicit paths), `acceptance` (commands or checks).
4. Set first executable task to `in_progress` if planning is done; move `phase` to `execution`.
5. Output the **worker template** from the orchestrator skill for **T1** (or first `in_progress` task) only — do not implement later tasks in this turn unless the user asked for full execution.

If the user’s goal is vague, ask **one** clarifying question before writing JSON.
