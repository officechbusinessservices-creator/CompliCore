# Plugin Governance Layer

## Purpose

The Claude Code Plugins Directory is used as the **plugin packaging and governance standard** for Claude-compatible extensions in Antigravity OS.

It is used for:

- plugin discovery and acquisition workflows
- trust/security review checkpoints
- internal extension packaging standards
- MCP/agent/command/skill bundling

It does not replace:

- native tools layer
- internal MCP servers
- Temporal orchestration
- approval engine

## Packaging Standard

```text
plugin-name/
├── .claude-plugin/
│   └── plugin.json
├── .mcp.json
├── commands/
├── agents/
├── skills/
└── README.md
```

## Repository Paths

```text
plugins/
external_plugins/
  ├─ approved/
  └─ quarantined/
```

## Governance States

- discovered
- quarantined
- approved
- disabled
- deprecated

## Required review checks

- source/repo verification
- README + manifest review
- command and agent behavior review
- MCP scope + network behavior review
- permissions and secrets risk review
- sandbox mode decision


## External source example: The Agency

- Source: `https://github.com/msitarzewski/agency-agents`
- Intake state: `quarantined`
- Path: `external_plugins/quarantined/the-agency/`
- Promotion requires full governance checklist and explicit state transition to `approved`.


## Policy enforcement gate

`policy_guard` enforcement is required before enabling a plugin:

- plugin state must be `approved`
- trust level must be reviewed/trusted
- declarations required: `workspace_access`, `role_access`, `secrets_use`, `network_use`, `mcp_endpoints`

Enable operation is blocked if any declaration is missing.

- Source: `https://github.com/openclaw/openclaw`
- Intake state: `quarantined`
- Path: `external_plugins/quarantined/openclaw/`
- Clone helper: `bash scripts/clone_openclaw_repo.sh`


## Runtime execution model

Plugins are executable only after passing runtime checks:

1. manifest validation (`.claude-plugin/plugin.json`, `.mcp.json`, commands/agents/skills structure)
2. controlled loader scans `plugins/` + `external_plugins/approved/`
3. policy boundaries enforced at dispatch time (workspace, role, permissions, timeout)
4. command dispatch resolves command -> plugin -> skill handler
5. audit events written for load/start/finish/failure/policy denial

### Dispatch endpoints

- `POST /plugins/validate`
- `POST /plugins/load`
- `POST /plugins/dispatch`
