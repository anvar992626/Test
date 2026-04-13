#!/usr/bin/env node
/**
 * Validates orchestration context JSON shape (no Ajv dependency).
 * Usage:
 *   node scripts/validate-orchestration-context.mjs
 *   node scripts/validate-orchestration-context.mjs path/to/context.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const PHASES = new Set(['planning', 'execution', 'verification', 'closed']);
const MODELS = new Set(['fast', 'default', 'reasoning']);
const STATUSES = new Set(['pending', 'in_progress', 'done', 'blocked', 'skipped']);

function fail(msg) {
  throw new Error(msg);
}

function validateTask(t, i) {
  const p = `tasks[${i}]`;
  if (!t || typeof t !== 'object') fail(`${p}: must be object`);
  for (const k of ['id', 'title', 'model', 'modelReason', 'status', 'attempts', 'allowedFiles', 'acceptance']) {
    if (!(k in t)) fail(`${p}: missing "${k}"`);
  }
  if (!MODELS.has(t.model)) fail(`${p}.model invalid`);
  if (!STATUSES.has(t.status)) fail(`${p}.status invalid`);
  if (typeof t.attempts !== 'number' || t.attempts < 0) fail(`${p}.attempts must be >= 0`);
  if (!Array.isArray(t.allowedFiles)) fail(`${p}.allowedFiles must be array`);
  if (!Array.isArray(t.acceptance)) fail(`${p}.acceptance must be array`);
  if (typeof t.modelReason !== 'string' || !t.modelReason.trim()) fail(`${p}.modelReason required`);
}

function validateDoc(doc, label) {
  if (!doc.runId) fail(`${label}: runId required`);
  if (!doc.objective) fail(`${label}: objective required`);
  if (!PHASES.has(doc.phase)) fail(`${label}: invalid phase`);
  if (!doc.updatedAt) fail(`${label}: updatedAt required`);
  if (!Array.isArray(doc.tasks) || doc.tasks.length === 0) fail(`${label}: tasks must be non-empty array`);
  if (doc.tasks.length > 7) fail(`${label}: max 7 tasks`);
  doc.tasks.forEach((t, i) => validateTask(t, i));
}

const target =
  process.argv[2] ??
  (fs.existsSync(path.join(root, '.cursor', 'orchestration-context.json'))
    ? path.join(root, '.cursor', 'orchestration-context.json')
    : path.join(root, '.cursor', 'orchestration-context.example.json'));

const raw = fs.readFileSync(target, 'utf8');
let doc;
try {
  doc = JSON.parse(raw);
} catch (e) {
  console.error('Invalid JSON:', target, e.message);
  process.exit(1);
}

try {
  validateDoc(doc, path.basename(target));
} catch (e) {
  console.error('Schema validation failed:', e.message);
  process.exit(1);
}

console.log('OK orchestration context:', target);
console.log(`   ${doc.tasks.length} task(s), phase=${doc.phase}`);
