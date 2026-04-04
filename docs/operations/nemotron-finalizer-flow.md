# Nemotron Finalizer Flow

This flow operationalizes Nemotron-based planning/research/review to help finalize CompliCore while keeping governance boundaries intact.

## Trigger

`POST /nemotron/workflows/finalize_complicore`

## Agents

- `nemotron_planner`
- `nemotron_researcher`
- `nemotron_reviewer`
- `policy_guard` (approval bridge)

## Stage contract

1. **Plan**: build milestones, blockers, ownership, next actions, and risk controls.
2. **Research**: produce deep-research brief and evidence gaps.
3. **Review**: score output quality, identify contradictions, and determine if human review is mandatory.
4. **Approval**: policy guard routes low-confidence or risky outputs to human approval.

## Safety model

- Nemotron is routed through API services, not treated as workflow engine.
- Temporal remains orchestration and PostgreSQL remains system-of-record.
- Any side-effectful action must remain approval-gated.

## Machine-readable source

- `configs/nemotron_finalizer_flow.json`
