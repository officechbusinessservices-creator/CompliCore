# OpenViking Integration Evaluation

## Decision

Adopt OpenViking as the **context backbone**, not as the workflow engine.

## Why

- Fits role/workspace context partitioning requirements.
- Provides clean abstraction for context retrieval in planner/research flows.
- Keeps existing Temporal + PostgreSQL control architecture intact.

## Risks

- API/image version drift if upstream endpoint contracts change.
- Additional context infra service and connectivity surface.

## Mitigations

- Context gateway wrapper (`apps/context_gateway`) isolates upstream API contracts.
- Local filesystem fallback if OpenViking endpoint is unavailable.
- OpenViking services are optional under docker-compose `context` profile.
