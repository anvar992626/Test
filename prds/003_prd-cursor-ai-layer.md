# PRD 003 — Cursor AI layer

## Goal
Repository carries **rules**, **skills**, **commands**, **hooks**, and documented **marketplace** skills so a new chat + smaller model can work predictably.

## Deliverables
- `AGENTS.md` — one-screen map linking rules, skills, commands, hooks, orchestration.
- `.cursor/rules/*` — stack boundaries, file conventions, observability URLs.
- `.cursor/skills/*` — ≥3 project skills including one observability skill + orchestrator with **context file** + model tiers.
- `.cursor/commands/*` — ≥3 repeatable workflows (includes `orchestrator-bootstrap` / `orchestrator-resume`).
- `.cursor/hooks.json` + scripts — ≥2 hooks with concrete triggers.
- `docs/CURSOR_MARKETPLACE.md` — ≥6 marketplace skills, each with **why** it matters for Signal Lab.
- `docs/AI_LAYER.md` — **why** the layer exists, not only file paths.

## Acceptance
- Reviewer can open `AGENTS.md` + `.cursor/` and see a **system**, not a loose folder dump.
- Hooks run with Node (cross-platform) and return valid JSON for supported events.
- Orchestration can **resume** from `.cursor/orchestration-context.json` (example + schema committed).
