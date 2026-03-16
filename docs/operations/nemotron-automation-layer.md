# Nemotron Automation Layer (Open-Weight Local Titan)

This control-surface document defines how Nemotron-3 Super (A12B) is integrated into CompliCore without breaking safety, cost, or orchestration boundaries.

## Positioning

Nemotron is a **fleet brain provider** for selected reasoning workloads, not a monolithic super-agent and not a replacement for core control-plane components.

- Temporal remains workflow orchestration.
- PostgreSQL remains system-of-record.
- Approval and policy layers remain mandatory.

## Supported roles

Nemotron is routed to these roles:

- planner
- reviewer
- research

It is intentionally excluded from direct side-effect execution and approval decisions.

## Core rule

Use Nemotron through a router abstraction and queue-isolated worker classes. Never let one model instance directly control 1,000 agent loops.

## Safety and governance constraints

1. All destructive/external side effects stay approval-gated.
2. Model routing must respect budget and rate-limit controls.
3. Risky actions stay in guarded/dangerous queues with policy checks.
4. Fail open-weight workloads over to hosted providers only through explicit routing policy.

## Suggested routing

```text
Operator command
→ Antigravity Orchestrator
→ Model Router (Gemini/Nemotron)
→ Division queues
→ Worker fleets
→ Review + scoring
→ Approval / persist / artifacts
```

## Why Nemotron in this stack

- Local-first privacy posture for sensitive enterprise contexts.
- High-throughput review/research workloads under cost constraints.
- Complements hosted providers in a multi-model, non-single-point-of-failure architecture.

## Control-surface references

- `configs/model_provider_matrix.json`
- `GET /models/providers`
