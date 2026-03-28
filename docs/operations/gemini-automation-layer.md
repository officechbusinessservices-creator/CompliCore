# Gemini Automation Layer

Gemini is the fleet brain layer for planning, routing, review, and batch reasoning.

## Operating rule

Gemini is **not** the workflow engine, approval system, or source-of-record.

- Temporal remains orchestration.
- PostgreSQL remains system-of-record.
- Policy/approval gates remain mandatory for external side effects.

## Four Gemini roles

1. **Commander**: objective decomposition, queue/priority routing.
2. **Planner**: execution plans, skill selection, agent-class choice.
3. **Reviewer**: contradiction checks, quality scoring, confidence checks.
4. **Batch worker brain**: asynchronous non-urgent high-volume processing.

## Services

- `apps/gemini-router/main.py`
- `apps/gemini-batch-manager/main.py`
- `apps/gemini-review-service/main.py`
- `apps/gemini-cli-bridge/main.py`

## API control surfaces

- `GET /fleet/brain`
- `POST /gemini/workflows/create_execution_plan`
- `POST /gemini/workflows/repo_review_plan`
- `POST /gemini/workflows/weekly_ceo_brief`
- `POST /gemini/workflows/pipeline_followup_drafts`
- `POST /gemini/workflows/batch_quality_review`
- `POST /gemini/review`

## Safety constraints

- Keep destructive actions approval-gated.
- Keep risk-class queue isolation.
- Use batch mode only for non-urgent jobs.
- Preserve tool-calling continuity controls (including thought signatures when used).
- Never deploy Gemini as a monolith controlling all worker loops.
