# Sentry — prove the full observability tier

Some rubrics require **errors in Sentry**, not only SDK wiring.

## Steps

1. Create a **free** Sentry project (Node / Express or generic Node).
2. Copy the **DSN** (starts with `https://…@…ingest.sentry.io/…`).
3. **Before** starting the API with Compose, set the variable (PowerShell):

   ```powershell
   $env:SENTRY_DSN="https://YOUR_DSN"
   docker compose up -d --build api
   ```

   Or put `SENTRY_DSN=...` in a repo-root `.env` (do **not** commit real DSNs).

4. Open the UI → run **`system_error`** once.
5. In Sentry → **Issues** — confirm a new error (message contains *Simulated system failure* or similar).

## Notes

- **`validation_error`** (400) is **not** sent to Sentry by design.
- If DSN is missing, the API still runs; only the Sentry **demonstration** is skipped.

## Submission

- Redacted screenshot or issue ID in **`SUBMISSION_CHECKLIST.md`** under candidate notes.
