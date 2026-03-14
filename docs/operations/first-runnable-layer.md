> Architecture note: Antigravity OS is operator-first; CompliCore is one workspace inside that OS. See `docs/operations/antigravity-os-plan.md`.

# First Runnable Worker Layer

This repository now includes a multi-step autonomous layer:

1. Infrastructure in `docker-compose.yml` (Postgres, Redis, Qdrant, Temporal, Temporal UI, optional OpenViking + context-gateway profile)
2. Shared database layer and SQLAlchemy models
3. FastAPI API (`/health`, `/runs`, `/steps`, `/audit`, `/approvals`, `/workflow/{id}/status`)
4. Temporal workflow (`operator_copilot`) with 4 bounded stages
5. Orchestrator worker (`orchestrator-queue`) with registered activities
6. CLI launcher for DB-backed workflow runs
7. CLI query tool for live workflow status inspection
8. Scheduler loop that starts a workflow every 5 minutes (local smoke mode)

## Stage model

- plan
- research
- execute
- review

Each stage runs as a Temporal activity and writes step/audit records to PostgreSQL.

## Python dependency install modes

```bash
bash scripts/setup_python_env.sh --online
bash scripts/setup_python_env.sh --offline ./vendor/wheels
bash scripts/setup_python_env.sh --verify-only
```

Build wheelhouse on a machine with internet access:

```bash
bash scripts/build_wheelhouse.sh
```

## Startup sequence

```bash
docker compose up -d
bash scripts/setup_python_env.sh --offline ./vendor/wheels
source .venv/bin/activate
python scripts/init_db.py
uvicorn apps.api.main:app --reload --port 8000
python apps/worker/run_orchestrator.py
```

If your environment has network access, you can use `--online` instead of `--offline`.

If pip is missing/broken on your system, run:

```bash
python3 -m ensurepip --upgrade
python3 -m pip install --upgrade pip
```

## Validate end-to-end

```bash
python apps/cli/start_workflow.py
python apps/cli/query_workflow.py --workflow-id <workflow_id_from_start_output>
curl http://localhost:8000/runs
curl http://localhost:8000/steps
curl http://localhost:8000/audit
```

## Scheduler smoke mode

```bash
python apps/scheduler/run.py
```

> Note: `while True` scheduler loop is for local smoke testing only.
> Replace with Temporal Schedules / webhook / API triggers for durable production triggering.

## Correct dependency-first sequence

1. Create virtualenv + install dependencies (online or offline mode)
2. Verify imports (`bash scripts/setup_python_env.sh --verify-only`)
3. Run DB init (`python scripts/init_db.py`)
4. Start API (`uvicorn apps.api.main:app --reload --port 8000`)
5. Start worker (`python apps/worker/run_orchestrator.py`)
6. Start scheduler (`python apps/scheduler/run.py`)

## Expected constrained-environment outcomes

In restricted runners, these are expected until wheel artifacts are provisioned:

```bash
bash scripts/setup_python_env.sh --offline ./vendor/wheels
bash scripts/setup_python_env.sh --verify-only
```

- Offline mode should fail clearly when wheel artifacts are missing/incomplete (artifact provisioning failure).
- Verify-only should fail with a list of missing modules when dependencies are not yet installed.

## Antigravity skills bootstrap

## Starter skill routing

Use this default sequence when bootstrapping skills:

- **General use:** Essentials
- **Web Dev:** Web Wizard
- **Security:** Security Engineer

Install skills first, then proceed with worker-layer startup and validation.

Default install path:

```bash
npx antigravity-awesome-skills
```

Custom install path:

```bash
npx antigravity-awesome-skills --path /your/custom/skills/path
```

Project wrapper (recommended):

```bash
bash scripts/setup_antigravity_skills.sh
bash scripts/setup_antigravity_skills.sh --path /your/custom/skills/path
```

See also: `docs/operations/skills-usage-guide.md` for practical prompting patterns and starter skill sequencing.

## One-command demo (end product)

If you want to see the full end product quickly (API + worker + one workflow run):

```bash
# Online dependency setup
make demo-e2e

# Offline wheelhouse mode
make demo-e2e-offline
```

The demo script will:

1. Start infra (`docker compose up -d`)
2. Setup Python env
3. Init DB
4. Launch API + worker in background
5. Start one workflow run
6. Query `/health`, `/runs`, `/steps`, `/audit`, `/approvals`

Logs are written to `./.demo-logs/`.


## Approval-gated control loop

Start an approval-gated run (returns immediately):

```bash
python apps/cli/start_workflow.py --objective "Prepare operator brief" --workspace complicore --role ceo --no-wait
```

List pending approvals:

```bash
curl http://localhost:8000/approvals
```

Approve a pending item:

```bash
curl -X POST http://localhost:8000/approvals/<approval_id>/decision \
  -H "Content-Type: application/json" \
  -d '{"decision":"approve","decided_by":"operator"}'
```

Check exact run status:

```bash
curl http://localhost:8000/workflow/<run_id>/status
```

Run full reliability smoke (includes approval path + artifact checks):

```bash
make smoke-full
```


## OpenViking context backbone (optional profile)

Start context services:

```bash
docker compose --profile context up -d openviking context-gateway
```

Use API context endpoints:

```bash
curl -X POST http://localhost:8000/context/retrieve \
  -H "Content-Type: application/json" \
  -d '{"workspace":"complicore","role":"builder","query":"roadmap"}'

curl http://localhost:8000/context/workspaces
```

If OpenViking is unavailable, retrieval falls back to local files under `data/workspaces/<workspace>`.


## Plugin governance layer

Use Claude-compatible plugin packaging under:

- `plugins/` (internal)
- `external_plugins/approved/`
- `external_plugins/quarantined/`

Do not activate discovered plugins directly. Route through review and approval workflow first.


### The Agency intake (governed)

External plugin intake path:

- `external_plugins/quarantined/the-agency/`

Do not run direct plugin activation from external source until review is complete.
