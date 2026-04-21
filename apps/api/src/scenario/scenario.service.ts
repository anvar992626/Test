import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { MetricsService } from '../metrics/metrics.service';
import { PrismaService } from '../prisma/prisma.service';
import { RunScenarioRunDto } from './dto/run-scenario-run.dto';
import { ScenarioType } from './dto/run-scenario.dto';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Injectable()
export class ScenarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ScenarioService.name);
  }

  async listRecent(limit = 50) {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  executeRun(body: RunScenarioRunDto) {
    if (body.type === 'teapot') {
      throw new HttpException(
        { statusCode: 418, error: "I'm a teapot", message: 'Signal 42' },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    return this.execute(body.type as ScenarioType, {
      name: body.name,
      metadata: body.metadata,
    });
  }

  async execute(
    scenario: ScenarioType,
    opts?: { name?: string; metadata?: Record<string, unknown> },
  ) {
    const t0 = Date.now();
    let outcome: 'success' | 'validation_error' | 'error' = 'success';
    let errorMessage: string | null = null;

    try {
      await this.runScenario(scenario);
    } catch (e) {
      outcome = scenario === 'validation_error' ? 'validation_error' : 'error';
      errorMessage = e instanceof Error ? e.message : String(e);
      await this.finishRun(scenario, outcome, errorMessage, t0, opts);
      throw e;
    }

    await this.finishRun(scenario, outcome, errorMessage, t0, opts);
    return { ok: true as const, scenario };
  }

  private async finishRun(
    scenario: ScenarioType,
    outcome: string,
    errorMessage: string | null,
    t0: number,
    opts?: { name?: string; metadata?: Record<string, unknown> },
  ) {
    const durationMs = Date.now() - t0;
    const seconds = durationMs / 1000;
    this.metrics.recordRun(scenario, outcome, seconds);

    await this.prisma.scenarioRun.create({
      data: {
        scenario,
        outcome,
        durationMs,
        errorMessage,
        name: opts?.name,
        metadata:
          opts?.metadata !== undefined
            ? (opts.metadata as Prisma.InputJsonValue)
            : undefined,
      },
    });

    this.logger.info(
      {
        signallab: true,
        scenario,
        outcome,
        durationMs,
        msg: 'scenario_run_recorded',
      },
      'scenario_run_recorded',
    );
  }

  private async runScenario(scenario: ScenarioType) {
    this.logger.info(
      { signallab: true, scenario, msg: 'scenario_started' },
      'scenario_started',
    );

    switch (scenario) {
      case 'success':
        this.logger.info(
          { signallab: true, scenario, msg: 'scenario_ok' },
          'scenario_ok',
        );
        return;

      case 'slow_operation':
        await sleep(600);
        this.logger.info(
          { signallab: true, scenario, msg: 'scenario_slow_done' },
          'scenario_slow_done',
        );
        return;

      case 'slow_request': {
        const ms = 2000 + Math.floor(Math.random() * 3001);
        await sleep(ms);
        this.logger.info(
          { signallab: true, scenario, msg: 'scenario_slow_request_done', delayMs: ms },
          'scenario_slow_request_done',
        );
        return;
      }

      case 'business_event':
        this.logger.info(
          {
            signallab: true,
            scenario,
            event: 'invoice_paid',
            amount: 42,
            msg: 'business_event',
          },
          'business_event',
        );
        return;

      case 'validation_error':
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed for validation_error scenario',
          error: 'Bad Request',
        });

      case 'system_error':
        this.logger.warn(
          { signallab: true, scenario, msg: 'scenario_about_to_fail' },
          'scenario_about_to_fail',
        );
        throw new Error('Simulated system failure for observability demo');

      default: {
        const _exhaustive: never = scenario;
        return _exhaustive;
      }
    }
  }
}
