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
