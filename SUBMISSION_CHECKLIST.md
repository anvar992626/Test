# Signal Lab — Submission Checklist


---

## Репозиторий

- **URL**: `https://github.com/anvar992626/Test`
- **Ветка**: `main`
- **Время работы** (приблизительно): `1` часов *(таймбокс из ТЗ; укажи свой факт, если отличается)*

---

## Запуск

```bash
# Команда запуска:
docker compose up -d --build

# Команда проверки (автоматика, из корня репо, Node 18+):
npm run verify
npm run verify:orchestration

# Команда остановки:
docker compose down
# полный сброс тома БД (опасно): docker compose down -v
```

**Предусловия**:

- **Docker Desktop** (Windows/macOS) или Docker Engine + Compose v2; WSL2 при необходимости.
- **Node.js 18+** — только для `npm run verify` / локальной разработки (образы в Compose уже содержат Node).
- Опционально **Sentry DSN** в окружении до старта `api` — см. `docs/SENTRY.md` и корневой `.env.example`.

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:-------------:|----------------|
| Next.js (App Router) | ☑ | `apps/web/src/app/` |
| shadcn/ui | ☑ | `apps/web/components.json`, `apps/web/src/components/ui/*` |
| Tailwind CSS | ☑ | `apps/web/tailwind.config.ts`, `apps/web/src/app/globals.css` |
| TanStack Query | ☑ | `apps/web/src/app/providers.tsx`, `page.tsx` (`useQuery` / `useMutation`) |
| React Hook Form | ☑ | `apps/web/src/app/page.tsx` + zod, `Controller` + `Select` |
| NestJS | ☑ | `apps/api/src/**/*.ts` |
| PostgreSQL | ☑ | `docker-compose.yml` → `postgres`; Prisma `DATABASE_URL` |
| Prisma | ☑ | `apps/api/prisma/schema.prisma`, миграции, `PrismaService` |
| Sentry | ☑ | `apps/api/src/main.ts`, `sentry-exception.filter.ts` (нужен `SENTRY_DSN`) |
| Prometheus | ☑ | `infra/prometheus/prometheus.yml` → scrape `api:3001/metrics` |
| Grafana | ☑ | `http://localhost:3020`, провижининг в `infra/grafana/provisioning/` |
| Loki | ☑ | сервис `loki` в Compose; логи через Promtail |

---

## Observability Verification

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|--------------------------|
| Prometheus metric | UI → запустить любой сценарий (например **success** или **system_error**) | `http://localhost:3001/metrics` → строки `signallab_scenario_runs_total`, `signallab_scenario_duration_seconds_*`; также `http://localhost:9090/targets` → job **signallab-api** UP |
| Grafana dashboard | После нескольких запусков сценариев открыть дашборд | `http://localhost:3020` → **Dashboards → Signal Lab → Signal Lab — Metrics & Logs** (uid `signal-lab-main`) |
| Loki log | Запустить сценарий с полем `scenario` в логах (любой из списка) | Grafana → **Explore** → Loki: `{job="docker", compose_service="api"} \|= "signallab"` или с меткой `{..., scenario="system_error"}` (Promtail выставляет `scenario` / `level`) |
| Sentry exception | Задать `SENTRY_DSN`, пересоздать `api`, UI → **system_error** | Проект в Sentry → новый issue; инструкция `docs/SENTRY.md` |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `signallab-stack` | Карта репо, куда править UI/API/infra, билды |
| 2 | `signallab-observability` | Проверка метрик, Loki (в т.ч. по label `scenario`), Grafana, Sentry |
| 3 | `signallab-prisma` | Миграции, seed, Docker vs локально |
| 4 | `signallab-orchestrator` | Декомпозиция задач, context JSON, fast/default/reasoning, resume, отчёт |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/stack-up` | Compose up, порты, что смотреть при ошибках |
| 2 | `/observability-verify` | Смоук по skill observability |
| 3 | `/add-scenario` | End-to-end добавление сценария (API+UI+PRD) |
| 4 | `/orchestrator-bootstrap` | Создать/заполнить `orchestration-context.json` из примера |
| 5 | `/orchestrator-resume` | Продолжить с первой незавершённой задачи в context |
| 6 | `/verify-automated` | Запуск `npm run verify` + `verify:orchestration` |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `beforeShellExecution` → `guard-destructive-shell.mjs` | Спрашивает подтверждение перед `docker compose down -v`, `docker system prune`, опасным `rm` |
| 2 | `postToolUse` (Write) → `prisma-followup.mjs` | Подсказка migrate/generate после правок `schema.prisma` |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `.cursor/rules/signallab-stack.mdc` | Обязательный стек, порты, маршруты API, Grafana 3020, ссылка на `AGENTS.md` |
| 2 | `.cursor/rules/nestjs-api-patterns.mdc` | Тонкие контроллеры, логика в сервисах, Prisma/метрики/логи |
| 3 | — | Третьего отдельного rule-файла нет; границы покрыты двумя выше + `AGENTS.md` |

### Marketplace Skills

Подключить в Cursor UI; обоснование в `docs/CURSOR_MARKETPLACE.md`.

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | Next.js (App Router) | Роутинг, границы server/client в `apps/web` |
| 2 | React 19 / modern hooks | Клиентские компоненты и TanStack Query |
| 3 | Tailwind CSS | Токены shadcn/TW в `globals.css` / `tailwind.config.ts` |
| 4 | Prisma | Схема, миграции, `migrate deploy` в контейнере |
| 5 | NestJS | Модули, pipes, фильтры, `/metrics` |
| 6 | Docker / Compose | Сеть сервисов, Promtail + socket, rebuild |

**Что закрывают custom skills, чего нет в marketplace:**

- Жёсткие **правила стека** и **порты Signal Lab** (Grafana `:3020`, не субпуть на 3000).
- **Пошаговая проверка observability** под этот репозиторий (Loki label `scenario`, дашборд uid).
- **Orchestration** с **JSON context**, **modelReason**, лимит попыток, **resume** и связка с observability/prisma skills.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signallab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.cursor/orchestration-context.example.json` (рабочая копия `.cursor/orchestration-context.json` — в `.gitignore`)
- **Сколько фаз**: 4 — `planning` → `execution` → `verification` → `closed`
- **Какие задачи для fast model**: механические правки в одном модуле (DTO, ветка в `scenario.service`, пункты в `page.tsx`, правка Grafana JSON) — см. таблицу **Model selection** в skill
- **Поддерживает resume**: **да** — обновление JSON + промпт в skill + команда `/orchestrator-resume`; валидация формы: `npm run verify:orchestration`

---

## Скриншоты / видео

- [x] UI приложения → `docs/screenshots/ui-signal-lab.png`
- [x] Grafana *(home + provisioned setup)* → `docs/screenshots/grafana-home.png` *(логин: `grafana-login.png`; для графиков метрик — сделай ещё `grafana-dashboard.png` из **Dashboards → Signal Lab**)*
- [x] Loki logs → `docs/screenshots/loki-explore.png`
- [x] Sentry error → `docs/screenshots/sentry-issue.png`

Индекс: `docs/screenshots/README.md`. После `git push` смотреть на GitHub:

- **Ссылка / архив**: `https://github.com/anvar992626/Test/tree/main/docs/screenshots`

---

## Что не успел и что сделал бы первым при +4 часах



---


---

## Быстрые галочки (как у интервьюера)

- [ ] `docker compose up -d --build` без сюрпризов
- [ ] `http://localhost:3000` — UI
- [ ] `GET http://localhost:3001/health` — `database: up`
- [ ] `http://localhost:3001/api/docs` — Swagger
- [ ] `npm run verify` и `npm run verify:orchestration` — OK
- [ ] Sentry (если требуют рубрику полностью) — по `docs/SENTRY.md`

**Заметки кандидата (свободный текст):**

- **Известные ограничения:** Grafana открывается на **`http://localhost:3020`**, не `http://localhost:3000/grafana` (убраны редиректы `ERR_TOO_MANY_REDIRECTS`). Sentry требует **`SENTRY_DSN`** в окружении.
- **Отклонения от исходного ТЗ + обоснование:** см. выше про URL Grafana; логи в Loki смотреть через **Grafana Explore**, порт `3100` — API Loki, не «красивый» UI.
