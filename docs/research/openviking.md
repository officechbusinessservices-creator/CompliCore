# OpenViking Research Notes

## Positioning Summary

OpenViking is adopted here as a **context database/backbone** for AI agents:

- memory/resource/skills hierarchy
- filesystem-style URI model (`viking://...`)
- tiered context loading and retrieval

It is **not** the workflow runtime.

## Integration Guardrails

OpenViking should own:

- workspace knowledge trees
- user + agent memory retrieval
- skill-linked context lookups
- recursive context search

OpenViking should not own:

- workflow scheduling
- approval state machine
- durable run orchestration
- transactional system of record

## Stack Ownership

- Temporal: orchestration/runtime
- PostgreSQL: run/control/audit system-of-record
- OpenViking: context retrieval backbone
- Antigravity OS: operator-facing role/workspace system

## URI Mapping

- `viking://resources/complicore/`
- `viking://resources/livily/`
- `viking://resources/zelloo/`
- `viking://resources/personal/`
- `viking://user/memories/`
- `viking://agent/skills/`
- `viking://agent/memories/`
