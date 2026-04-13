#!/usr/bin/env node
/**
 * After file writes, nudge when Prisma schema changes (context injection).
 */
import fs from 'node:fs';

const raw = fs.readFileSync(0, 'utf8');
let input = {};
try {
  input = JSON.parse(raw || '{}');
} catch {
  process.exit(0);
}

const blob = JSON.stringify(input);
if (!blob.includes('schema.prisma')) {
  process.exit(0);
}

process.stdout.write(
  JSON.stringify({
    additional_context:
      'Prisma schema may have changed. Regenerate client: `cd apps/api && npx prisma generate`. For local DB: `npx prisma migrate dev`. Docker: rebuild the `api` image or re-run `docker compose up --build`.',
  }),
);
process.exit(0);
