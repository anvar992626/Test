import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.scenarioRun.count();
  if (existing > 0) {
    console.log(`Seed skipped: ScenarioRun already has ${existing} row(s). Use a fresh DB or truncate to re-seed.`);
    return;
  }

  const now = Date.now();
  await prisma.scenarioRun.createMany({
    data: [
      {
        scenario: 'success',
        outcome: 'success',
        durationMs: 1,
        errorMessage: null,
        createdAt: new Date(now - 3_600_000),
      },
      {
        scenario: 'slow_operation',
        outcome: 'success',
        durationMs: 612,
        errorMessage: null,
        createdAt: new Date(now - 2_400_000),
      },
      {
        scenario: 'business_event',
        outcome: 'success',
        durationMs: 0,
        errorMessage: null,
        createdAt: new Date(now - 1_800_000),
      },
      {
        scenario: 'validation_error',
        outcome: 'validation_error',
        durationMs: 0,
        errorMessage: 'Validation failed for validation_error scenario',
        createdAt: new Date(now - 900_000),
      },
      {
        scenario: 'system_error',
        outcome: 'error',
        durationMs: 1,
        errorMessage: 'Simulated system failure for observability demo',
        createdAt: new Date(now - 300_000),
      },
    ],
  });

  console.log('Seed finished: inserted 5 demo ScenarioRun rows.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
