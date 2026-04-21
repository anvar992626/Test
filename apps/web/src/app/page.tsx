'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, ExternalLink, FlaskConical, History } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiFetch } from '@/lib/api';

const scenarios = [
  { value: 'success', label: 'success — happy path + logs' },
  { value: 'slow_operation', label: 'slow_operation — ~600ms delay' },
  { value: 'slow_request', label: 'slow_request — 2–5s delay (histogram)' },
  { value: 'business_event', label: 'business_event — structured domain log' },
  { value: 'validation_error', label: 'validation_error — 400 (no Sentry)' },
  { value: 'system_error', label: 'system_error — 500 + Sentry' },
  { value: 'teapot', label: 'teapot — Signal 42 (418)' },
] as const;

const schema = z.object({
  scenario: z.enum([
    'success',
    'slow_operation',
    'slow_request',
    'business_event',
    'validation_error',
    'system_error',
    'teapot',
  ]),
});

type FormValues = z.infer<typeof schema>;

type ScenarioRun = {
  id: string;
  scenario: string;
  outcome: string;
  durationMs: number;
  errorMessage: string | null;
  name?: string | null;
  metadata?: unknown;
  createdAt: string;
};

export default function HomePage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { scenario: 'system_error' },
  });

  const history = useQuery({
    queryKey: ['scenarios', 'history'],
    queryFn: () => apiFetch<ScenarioRun[]>('/api/scenarios?limit=30'),
  });

  const run = useMutation({
    mutationFn: (scenario: FormValues['scenario']) =>
      apiFetch<{ ok: boolean; scenario: string }>('/api/scenarios/run', {
        method: 'POST',
        body: JSON.stringify({ type: scenario }),
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['scenarios', 'history'] });
      toast({
        title: 'Scenario finished',
        description: `OK — ran ${data.scenario}. Metrics and logs updated.`,
      });
    },
    onError: (err: Error) => {
      toast({
        variant: 'destructive',
        title: 'Run failed',
        description: err.message,
      });
    },
  });

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-12">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <FlaskConical className="h-8 w-8" aria-hidden />
          <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Observability playground
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Signal Lab</h1>
        <p className="max-w-2xl text-muted-foreground">
          Run a scenario against the NestJS API. Metrics go to Prometheus, JSON logs to Loki via Promtail,
          and unhandled failures are reported to Sentry when <code className="rounded bg-secondary px-1 py-0.5 text-xs">SENTRY_DSN</code> is set.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Run scenario
            </CardTitle>
            <CardDescription>React Hook Form + zod + TanStack Query</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((v) => {
                run.reset();
                run.mutate(v.scenario);
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="scenario">Scenario</Label>
                <Controller
                  control={form.control}
                  name="scenario"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        run.reset();
                        field.onChange(v);
                      }}
                    >
                      <SelectTrigger id="scenario" aria-label="Scenario type">
                        <SelectValue placeholder="Pick a scenario" />
                      </SelectTrigger>
                      <SelectContent>
                        {scenarios.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.scenario && (
                  <p className="text-sm text-destructive">{form.formState.errors.scenario.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={run.isPending}>
                {run.isPending ? 'Running…' : 'Run scenario'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Uses <code className="rounded bg-secondary px-1">POST /api/scenarios/run</code> with{' '}
                <code className="rounded bg-secondary px-1">{`{ type }`}</code>.
              </p>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Run history
            </CardTitle>
            <CardDescription>Last runs from PostgreSQL (Prisma)</CardDescription>
          </CardHeader>
          <CardContent>
            {history.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {history.isError && (
              <p className="text-sm text-destructive">{(history.error as Error).message}</p>
            )}
            {history.data && history.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No runs yet.</p>
            )}
            <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
              {history.data?.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col rounded-lg border border-border/80 bg-secondary/30 px-3 py-2"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(row.createdAt).toLocaleString()}
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <strong>{row.scenario}</strong>
                    <OutcomeBadge outcome={row.outcome} />
                    <span className="text-muted-foreground">· {row.durationMs}ms</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Observability links
            </CardTitle>
            <CardDescription>Quick paths for the demo script</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ObsLink
              href="http://localhost:3020"
              label="Grafana"
              hint="Dashboards → Signal Lab (admin / admin)"
            />
            <ObsLink href="http://localhost:3001/metrics" label="Prometheus metrics scrape target" />
            <ObsLink href="http://localhost:9090" label="Prometheus UI" />
            <ObsLink href="http://localhost:3100/metrics" label="Loki metrics" />
            <p className="pt-2 text-xs text-muted-foreground">
              Set <code className="rounded bg-secondary px-1">SENTRY_DSN</code> in the environment before{' '}
              <code className="rounded bg-secondary px-1">docker compose up</code> to capture{' '}
              <strong>system_error</strong> in Sentry.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  if (outcome === 'success') {
    return (
      <Badge variant="outline" className="border-emerald-500/50 font-mono text-xs text-emerald-400">
        {outcome}
      </Badge>
    );
  }
  if (outcome === 'validation_error') {
    return (
      <Badge variant="secondary" className="font-mono text-xs text-amber-400">
        {outcome}
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="font-mono text-xs">
      {outcome}
    </Badge>
  );
}

function ObsLink({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col rounded-lg border border-border px-3 py-2 transition-colors hover:bg-secondary/50"
    >
      <span className="flex items-center gap-1 font-medium text-primary">
        {label}
        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <span className="truncate font-mono text-xs text-muted-foreground">{href}</span>
    </a>
  );
}
