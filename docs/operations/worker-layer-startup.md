> Architecture note: Antigravity OS is operator-first; CompliCore is one workspace inside that OS. See `docs/operations/antigravity-os-plan.md`.

# Worker-Layer Startup Runbook

This runbook defines how to launch the self-running agent system.

> Important: start agents in the **worker layer**, not in the dashboard.
> The dashboard is for visibility and control, not for workflow/activity execution.

## Python environment bootstrap

Use one of the supported setup modes before running API/worker/scheduler scripts:

```bash
bash scripts/setup_python_env.sh --online
bash scripts/setup_python_env.sh --offline ./vendor/wheels
bash scripts/setup_python_env.sh --verify-only
```

## Antigravity skills bootstrap

## Starter skill routing

When choosing your first skill pack:

- **General use:** start with **Essentials**
- **Web development work:** start with **Web Wizard**
- **Security-focused work:** start with **Security Engineer**

This routing should be applied before adding more specialized skills.

Install global Antigravity skills (default path: `~/.gemini/antigravity/skills`):

```bash
npx antigravity-awesome-skills
```

Install to a custom path:

```bash
npx antigravity-awesome-skills --path /your/custom/skills/path
```

## Required startup order

1. Infrastructure
2. API service
3. Worker processes
4. Scheduler / trigger layer
5. Dashboard (optional observer)

## 1) Start infrastructure

```bash
docker compose up -d postgres redis temporal qdrant prometheus grafana
```

## 2) Start API service

```bash
uvicorn apps.api.main:app --host 0.0.0.0 --port 8000
```

## 3) Start workers (one process per role)

Start from `apps/worker/`:

```bash
python apps.worker.run_orchestrator.py
python apps.worker.run_researcher.py
python apps.worker.run_executor.py
python apps.worker.run_reviewer.py
python apps.worker.run_policy_guard.py
python apps.worker.run_memory_manager.py
```

Recommended task queues:

- `orchestrator-queue`
- `research-queue`
- `execution-queue`
- `review-queue`
- `policy-queue`
- `memory-queue`

## 4) Start scheduler / triggers

```bash
python apps.scheduler.run.py
```

Use this layer for:

- schedule / cron workflow starts
- webhook-triggered starts
- file/event-triggered starts
- manual kickoff commands

## 5) Start dashboard last (observer)

```bash
npm --prefix apps/dashboard run dev
```

## Minimal operating model

1. Bring up infrastructure.
2. Start API.
3. Start workers.
4. Start scheduler.
5. Register schedules.
6. Monitor runs from dashboard.

## First schedules to register

- Daily system health audit
- Plugin health audit
- Backlog triage
- Report generation
- Memory cleanup
- Eval smoke test

## Anti-patterns to avoid

- Starting agents from the dashboard
- A single monolithic `while true` “master agent” loop
- Triggers that bypass the workflow engine
- Embedding scheduling logic directly in model prompts

See also: `docs/operations/skills-usage-guide.md` for practical prompting patterns and starter skill sequencing.


## Optional: Start OpenViking context backbone

```bash
docker compose --profile context up -d openviking context-gateway
```

Context retrieval endpoints:

- `POST /context/retrieve`
- `GET /context/workspaces`
