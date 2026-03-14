# Context Layer Architecture

## Goal

Make context retrieval first-class without replacing orchestration or transactional persistence.

## Flow

```text
CLI / API
  -> Temporal workflow
    -> Agents/skills
      -> Context gateway
        -> OpenViking (primary)
        -> local fallback resources (secondary)
```

## Components

- `packages/memory/openviking_client.py`
  - OpenViking HTTP retrieval client
  - local fallback over `data/workspaces/<workspace>`
- `apps/context_gateway/main.py`
  - service wrapper over context retrieval
- `apps/api/main.py`
  - `/context/retrieve` and `/context/workspaces` operator endpoints

## Ownership boundaries

- Temporal = run state machine and signals
- PostgreSQL = workflows, steps, approvals, artifacts, audit
- OpenViking = context memory/resource retrieval
