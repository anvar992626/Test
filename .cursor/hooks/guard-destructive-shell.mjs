#!/usr/bin/env node
/**
 * Flags shell commands that commonly wipe data or break local stacks.
 * stdin: Cursor hook JSON with `.command` (string).
 */
import fs from 'node:fs';

const raw = fs.readFileSync(0, 'utf8');
let input = {};
try {
  input = JSON.parse(raw || '{}');
} catch {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

const cmd = String(input.command ?? '');
const patterns = [
  /docker\s+compose\s+down\b[^\n]*(?:\s-v\b|\s--volumes\b)/i,
  /docker\s+system\s+prune\b/i,
  /\brm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+|\s+)(\/|\.\.\/)/,
];

if (patterns.some((re) => re.test(cmd))) {
  process.stdout.write(
    JSON.stringify({
      permission: 'ask',
      user_message:
        'This command may delete Docker volumes or remove files aggressively. Confirm you really want to run it.',
      agent_message:
        'Hook matched a destructive pattern (compose down -v, docker system prune, or rm targeting / or parent paths).',
    }),
  );
  process.exit(0);
}

process.stdout.write(JSON.stringify({ permission: 'allow' }));
process.exit(0);
