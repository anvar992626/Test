---
description: Resume Signal Lab work from .cursor/orchestration-context.json in a new chat
---

Read `.cursor/orchestration-context.json` (if missing, tell the user to run `/orchestrator-bootstrap` or copy the example). Read `.cursor/skills/signallab-orchestrator/SKILL.md`. Apply `@.cursor/rules/signallab-stack.mdc`.

1. Find the first task with `status` **pending** or **in_progress** (skip **done** / **skipped**; **blocked** only if the user says to continue).
2. Execute **only** files in that task’s `allowedFiles`. Respect **`model`** / **`modelReason`** when choosing depth (fast = minimal diff).
3. Run that task’s **acceptance** checks; on success set `status: "done"`, increment flow; on failure increment `attempts`, set `lastError` to `file:line: message`. If `attempts >= 2`, set `status: "blocked"` and stop.
4. Update `updatedAt`, `phase` (`execution` → `verification` when only verify tasks left → `closed` when all done).
5. If all tasks **done**, output the **Final report** block from the orchestrator skill.

Do not edit files outside **allowedFiles** for the current task.
