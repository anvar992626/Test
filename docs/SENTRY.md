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

## Troubleshooting (no issues in Sentry)

1. **Confirm the container sees the DSN** (do not paste the value into chats):

   ```powershell
   docker compose exec api node -e "console.log(process.env.SENTRY_DSN ? 'SENTRY_DSN is set' : 'SENTRY_DSN MISSING')"
   ```

2. **Recreate `api` after editing `.env`:**

   ```powershell
   docker compose up -d --force-recreate api
   ```

3. **`.env` format** — one line, **no** surrounding quotes, no spaces around `=`:

   ```env
   SENTRY_DSN=https://....@....ingest....sentry.io/....
   ```

4. **Correct project in the UI** — open **Issues** for the same Sentry **project** as the DSN (EU vs US host in the URL is fine if it matches your org).

5. **Trigger the right scenario** — only **`system_error`** produces a 500-path capture; **`validation_error`** is intentionally excluded.

6. **Compose env file** — if `docker compose` reports that `.env` is missing, copy `.env.example` to `.env` in the repo root (same folder as `docker-compose.yml`).

7. **Why DSN was “missing” in the container** — setting `SENTRY_DSN: ${SENTRY_DSN:-}` under `environment:` makes Compose inject an **empty** value when host-side interpolation is empty, and that **overrides** variables from `env_file`. This stack uses **`env_file: .env` only** for Sentry (no duplicate `SENTRY_*` keys under `environment:`).

## Submission

- Redacted screenshot or issue ID in **`SUBMISSION_CHECKLIST.md`** under candidate notes.
