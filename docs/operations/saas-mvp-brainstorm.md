# SaaS MVP Brainstorm (CompliCore Worker Layer)

## 1) MVP Goal

Ship a usable SaaS MVP that lets operators run and monitor a bounded 4-stage autonomous workflow (`plan → research → execute → review`) with durable execution, auditability, and simple controls.

## 2) Ideal Customer Profile (ICP)

- Small-to-mid operations teams that need repeatable, policy-aware autonomous task runs.
- Teams that require auditable run history and role-based oversight.
- Early adopters comfortable with API-first workflows and lightweight UI.

## 3) Core User Jobs To Be Done

1. Start a workflow run with an objective.
2. Observe progress and results by stage.
3. Inspect audit events for compliance and debugging.
4. Re-run or schedule recurring runs.

## 4) MVP In-Scope Features

### A. Workflow Runtime

- Start workflow via CLI/API.
- Execute 4 deterministic stages via Temporal workers.
- Persist run status and stage outputs to Postgres.

### B. Observability API

- `GET /health`
- `GET /runs`
- `GET /steps`
- `GET /audit`

### C. Local Ops Bootstrap

- Docker infra startup (Postgres, Redis, Temporal, Qdrant, Temporal UI).
- Python dependency setup (`--online`, `--offline`, `--verify-only`).
- Wheelhouse build flow for restricted environments.

### D. Skill Bootstrapping

- Support default Antigravity skills install path.
- Support custom `--path` installs.

## 5) Explicit Out-of-Scope (for MVP)

- Complex multi-tenant billing and invoices.
- Rich dashboard polish and deep analytics.
- Large plugin marketplace or broad MCP sprawl.
- Full enterprise SSO and advanced IAM.

## 6) Thin Vertical Slice (First Customer-Visible Path)

1. Operator submits objective.
2. System creates DB-backed run.
3. Worker executes 4 stages.
4. API returns run/step/audit records.
5. Operator queries live status and final result.

If this path is reliable, the MVP is viable.

## 7) SaaS Packaging for MVP

### Personas

- **Operator:** starts and monitors runs.
- **Reviewer:** checks outputs and audit records.
- **Admin:** manages environment and schedules.

### Access Model (MVP)

- Single-tenant per deployment (simplest production path).
- API token auth initially; RBAC expansion later.

## 8) MVP Architecture Decisions

- **Temporal** for durable orchestration.
- **Postgres** for run/step/audit persistence.
- **FastAPI** for control/visibility endpoints.
- **Worker layer** as execution plane; dashboard as observer/controller only.

## 9) Reliability & Compliance Baseline

- Deterministic workflow logic; side effects in activities.
- Audit event write on stage completion.
- Clear bootstrap diagnostics for dependency failures.
- Reproducible dependency install via pinned requirements + wheelhouse option.

## 10) Metrics (MVP Success Criteria)

### Product Metrics

- Time-to-first-successful-run < 20 minutes.
- > = 90% workflow completion for valid payloads.
- Median stage runtime under target SLA.

### Platform Metrics

- Worker uptime.
- API latency (`/runs`, `/steps`, `/audit`).
- Error rate by stage and by activity.

## 11) MVP Milestones (4 Weeks)

### Week 1 — Stability

- Lock bootstrap path and deterministic local startup.
- Validate end-to-end run path with reproducible scripts.

### Week 2 — Control Plane

- Add run start endpoint and query endpoint hardening.
- Add pagination/filtering on runs/steps.

### Week 3 — Operability

- Add scheduler registration flow (beyond `while True` smoke loop).
- Add alerting for failed runs/stages.

### Week 4 — Pilot Readiness

- Produce pilot runbook.
- Run internal pilot with 1-2 real workflows/day.
- Capture defects and close top reliability gaps.

## 12) Risks and Mitigations

1. **Dependency acquisition failures (restricted envs)**
   - Mitigation: offline wheelhouse + verify-only mode.
2. **Operator confusion around where execution happens**
   - Mitigation: docs emphasize worker-layer execution, dashboard observation.
3. **Silent workflow failure modes**
   - Mitigation: stage-level audit writes and clear status querying.

## 13) Immediate Next Actions

1. Add API endpoint to start workflow runs directly (not just CLI).
2. Add schedule registration endpoint using Temporal schedules.
3. Add minimal auth for API tokens.
4. Add run filtering (`status`, `workflow_name`, time window).
5. Add one pilot-facing dashboard page for `/runs` + `/steps`.

## 14) Brainstorming Output Canvas (Execution-Ready)

Use this as the weekly planning artifact.

### Problem Hypothesis

- Teams need a reliable way to run bounded autonomous workflows with audit trails.
- Existing dashboard-centric execution patterns are brittle and hard to recover.

### Target User + Trigger

- User: Ops lead / automation owner.
- Trigger: A recurring operational objective that must run with repeatability and review.

### MVP Promise

"Start a run, watch each stage complete durably, and audit what happened without digging through raw logs."

### MVP Feature Cutline

- **Must-have:** start run, stage execution, persistence, run/step/audit visibility.
- **Should-have:** schedule registration, basic auth, filtering.
- **Could-have:** dashboard UX improvements.
- **Won't-have (MVP):** billing, enterprise IAM, broad plugin ecosystem.

### GTM Micro-Plan

1. Internal pilot (week 4) with 1-2 real objectives/day.
2. Capture success/failure run stats daily.
3. Convert runbook + API examples into onboarding docs.

## 15) Lint-and-Validate Checklist for This Plan File

Run these checks whenever this file changes:

```bash
npx prettier --check docs/operations/saas-mvp-brainstorm.md
python -m json.tool <<< '{"plan":"ok"}'
```

Validation intent:

- Markdown formatting remains consistent.
- Shell/doc snippets stay syntactically sane for copy/paste workflows.
