# The Agency Integration Evaluation

## Decision

Add **The Agency** as an **external plugin candidate in quarantined state**.

## Integration stance

- Use as a curated source of specialized Claude-compatible agent definitions.
- Treat as plugin acquisition input, not direct production activation.
- Keep Antigravity OS governance process as the authority for activation.

## Current placement

- `external_plugins/quarantined/the-agency/`

## Activation gate (required)

Before enabling, complete:

1. trust/source verification
2. command/agent/skill review
3. MCP and network-scope review
4. permission/sandbox policy assignment
5. plugin state transition (`quarantined` -> `approved`)

## Non-goals

The Agency does **not** replace:

- Temporal workflow engine
- approvals and policy state machine
- internal MCP services
- PostgreSQL system-of-record
