#!/usr/bin/env node
/**
 * Smoke verification after `docker compose up` (no extra npm deps).
 * Usage: node scripts/verify-signallab.mjs
 * Env:   API_BASE (default http://localhost:3001)
 */
const base = process.env.API_BASE ?? 'http://localhost:3001';

async function must(name, fn) {
  try {
    await fn();
    console.log(`OK  ${name}`);
  } catch (e) {
    console.error(`FAIL ${name}:`, e.message ?? e);
    process.exitCode = 1;
  }
}

async function main() {
  await must(`GET ${base}/health`, async () => {
    const r = await fetch(`${base}/health`);
    const j = await r.json();
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (j.status !== 'ok' || j.database !== 'up') throw new Error(JSON.stringify(j));
  });

  await must(`GET ${base}/metrics contains signallab_`, async () => {
    const r = await fetch(`${base}/metrics`);
    const t = await r.text();
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!t.includes('signallab_scenario_runs_total')) {
      throw new Error('missing signallab_scenario_runs_total (run a scenario once)');
    }
  });

  await must(`GET ${base}/api/docs (Swagger UI)`, async () => {
    const r = await fetch(`${base}/api/docs`);
    const t = await r.text();
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!t.includes('swagger') && !t.includes('Swagger')) {
      throw new Error('response does not look like Swagger UI');
    }
  });

  await must(`GET ${base}/api/scenarios`, async () => {
    const r = await fetch(`${base}/api/scenarios?limit=1`);
    if (!r.ok) throw new Error(`status ${r.status}`);
    const j = await r.json();
    if (!Array.isArray(j)) throw new Error('expected JSON array');
  });

  await must(`POST ${base}/api/scenarios/run (success)`, async () => {
    const r = await fetch(`${base}/api/scenarios/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'success' }),
    });
    if (!r.ok) throw new Error(`status ${r.status}`);
    const j = await r.json();
    if (!j.ok || j.scenario !== 'success') throw new Error(JSON.stringify(j));
  });

  await must(`GET ${base}/metrics contains PRD counters`, async () => {
    const r = await fetch(`${base}/metrics`);
    const t = await r.text();
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!t.includes('scenario_runs_total')) throw new Error('missing scenario_runs_total');
    if (!t.includes('http_requests_total')) throw new Error('missing http_requests_total');
  });

  if (process.exitCode) {
    console.error('\nVerification failed. Is the API up? docker compose ps');
    process.exit(1);
  }
  console.log('\nAll automated API checks passed.');
}

main();
