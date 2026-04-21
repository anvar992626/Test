import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry: client.Registry;
  private readonly runs: client.Counter<string>;
  private readonly duration: client.Histogram<string>;
  private readonly prdRuns: client.Counter<string>;
  private readonly httpRequests: client.Counter<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });

    this.runs = new client.Counter({
      name: 'signallab_scenario_runs_total',
      help: 'Total scenario executions',
      labelNames: ['scenario', 'outcome'],
      registers: [this.registry],
    });

    this.duration = new client.Histogram({
      name: 'signallab_scenario_duration_seconds',
      help: 'Scenario execution wall time',
      labelNames: ['scenario'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.prdRuns = new client.Counter({
      name: 'scenario_runs_total',
      help: 'Scenario runs (type × status, PRD naming)',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.httpRequests = new client.Counter({
      name: 'http_requests_total',
      help: 'HTTP requests',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry],
    });
  }

  recordRun(scenario: string, outcome: string, seconds: number) {
    this.runs.inc({ scenario, outcome });
    this.duration.observe({ scenario }, seconds);
    this.prdRuns.inc({ type: scenario, status: outcome });
  }

  recordHttpRequest(method: string, path: string, status: string) {
    this.httpRequests.inc({ method, path, status });
  }
}
