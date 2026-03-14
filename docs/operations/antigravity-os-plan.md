# Antigravity OS Plan

**Subtitle:** Terminal-Native AI Operating System

## Correct Definition

This system is a **personal operator system** for Elias.
CompliCore is one workspace the system serves, not the root object of the OS.

## Purpose

Antigravity OS is a private command center that supports:

- thinking and planning
- execution and review
- marketing and sales
- prioritization and delegation
- tracking and documentation
- operating multiple businesses/workspaces

## Core Operating Modes

### 1) Builder Mode

- architecture planning
- repo analysis
- task decomposition
- coding support
- bug triage
- release planning
- technical documentation
- QA checklists

### 2) CEO Mode

- company priorities
- weekly goals
- strategic planning
- resource allocation
- bottleneck identification
- decision memos
- KPI tracking

### 3) Marketing Mode

- campaign planning
- content generation
- positioning
- channel prioritization
- funnel review
- audience research

### 4) Sales Mode

- lead qualification
- outbound messaging
- follow-up logic
- call prep
- proposal generation
- deal review

### 5) Operations Mode

- SOP creation
- task routing
- recurring schedules
- approvals
- issue tracking
- project oversight

### 6) Intelligence Mode

- research and synthesis
- competitor analysis
- internal retrieval
- memory recall
- scenario analysis

## Architecture Shift

Do not model the OS around CompliCore modules.
Model it around **roles + workspaces + skills**.

## Core Model

### A) Roles

Roles control behavior and execution style.

Example roles:

- Builder
- CEO
- Marketer
- Sales
- Operator
- Researcher
- Reviewer
- Chief of Staff

Each role has:

- default prompts
- allowed tools
- preferred outputs
- KPIs
- workflows

### B) Workspaces

Workspaces isolate business context.

Example workspaces:

- CompliCore
- Livily
- Zelloo
- CH Business Services
- Holiverse
- Personal

Each workspace contains:

- notes, projects, tasks
- decisions and artifacts
- contacts and opportunities
- memory namespaces

### C) Skills

Skills are reusable execution units across workspaces.

Examples:

- `write_strategy_memo`
- `build_launch_plan`
- `review_repo`
- `generate_sales_outreach`
- `create_weekly_ceo_brief`
- `prepare_meeting_brief`

## Recommended Top-Level Structure

```text
antigravity-os/
├─ apps/
│  ├─ api/
│  ├─ worker/
│  ├─ scheduler/
│  ├─ dashboard/
│  ├─ cli/
│  └─ context-gateway/
├─ packages/
│  ├─ roles/
│  ├─ workspaces/
│  ├─ skills/
│  ├─ agents/
│  ├─ workflows/
│  ├─ tools/
│  ├─ mcp-clients/
│  ├─ memory/
│  ├─ policies/
│  ├─ evals/
│  └─ shared/
├─ data/
│  └─ workspaces/
│     ├─ complicore/
│     ├─ livily/
│     ├─ zelloo/
│     └─ personal/
├─ infra/
│  ├─ postgres/
│  ├─ redis/
│  ├─ temporal/
│  ├─ openviking/
│  └─ observability/
├─ plugins/
│  ├─ workspace-complicore/
│  ├─ role-ceo/
│  ├─ role-builder/
│  ├─ example-internal-plugin/
│  └─ internal-example/
├─ external_plugins/
│  ├─ approved/
│  └─ quarantined/
├─ scripts/
├─ tests/
└─ docs/
```

## Agent Layers

### Layer 1: Core System Agents

- orchestrator
- planner
- executor
- reviewer
- policy_guard
- memory_manager
- plugin_router
- evaluator

### Layer 2: Role Specialists

- ceo_advisor
- builder_advisor
- marketing_strategist
- sales_operator
- ops_manager
- research_analyst
- chief_of_staff

## Dashboard Model

### Executive Dashboard

- today’s priorities
- blocked decisions
- key metrics
- overdue tasks
- urgent approvals

### Workspace Dashboard

- active projects
- task status
- strategy docs
- pipeline
- recent artifacts

### Role Dashboard

- Builder queue
- CEO brief
- Marketing calendar
- Sales pipeline
- Ops panel

### System Dashboard

- workflows, agents, skills
- tool/plugin health
- memory stats
- costs
- eval results

## Workflow Families

- CEO workflows (weekly brief, KPI summary, bottleneck detection)
- Builder workflows (repo review, release checklist, architecture critique)
- Marketing workflows (campaign planning, content calendar, positioning)
- Sales workflows (lead research, proposal drafting, pipeline risk)
- Operations workflows (SOP builder, status digest, approval queue)

## Workspace Example: CompliCore

CompliCore is one workspace containing:

- product roadmap
- website/app tasks
- compliance workflows
- pricing and launch assets
- customer pipeline
- investor/partner docs

## Database Entity Direction

Recommended cross-workspace entities:

- users, roles, workspaces, workspace_members
- workspace_projects, tasks, decisions, notes
- contacts, opportunities, skills
- workflow_runs, artifacts, memories, approvals, audit_events
- plugins, plugin_versions, plugin_permissions, plugin_installations, plugin_reviews, plugin_states

## CLI Direction

```bash
antigravity workspace list
antigravity workspace use complicore
antigravity role use ceo
antigravity role use builder
antigravity workflow start weekly_ceo_brief
antigravity skill run create_launch_plan
antigravity approvals pending
antigravity dashboard
```

## Plan Statement (Canonical)

Replace:

- “Terminal-Native AI Operating System Plan for CompliCore”

With:

- **“Terminal-Native AI Operating System Plan for Elias”**

Final separation:

- **Antigravity OS** supports Elias.
- **CompliCore** is one workspace/product inside it.


## Context Layer Decision

Adopt **OpenViking** as the context database for Antigravity OS.
Use it for workspace resources, user memory, agent memory, and skill-linked retrieval through `viking://` URI roots.
Keep **Temporal** as workflow engine and **PostgreSQL** as transactional system of record.


## Plugin Marketplace and Packaging Layer

Adopt the **Claude Code Plugins Directory** as the distribution and packaging model for Claude-compatible extensions.

Use it for:

- installing vetted Claude Code plugins
- discovering reusable MCP-backed integrations
- packaging internal Antigravity OS extensions in Claude-compatible format
- organizing commands, agents, skills, and MCP configs in one plugin unit

### Claude Plugin Directory Standard

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

### Revised Stack Placement

```text
Terminal / CLI
    ↓
Workflow Engine (Temporal)
    ↓
Agents / Skills / Policies
    ↓
Plugin Layer
    ├─ Claude Code Plugins Directory
    ├─ Internal plugins
    └─ External plugins
    ↓
Context Layer (OpenViking)
    ↓
System DB (PostgreSQL)
```

### Separation Rules

Plugin layer does **not** replace:

- native tools layer
- internal MCP servers
- workflow engine
- approval engine

### Internal vs External Plugin Paths

- `plugins/` for internal role/workspace extensions
- `external_plugins/approved/` for production-allowed third-party plugins
- `external_plugins/quarantined/` for review-only plugins

## Claude Code Plugin Standard

Antigravity OS supports Claude Code plugin packaging as a first-class extension model.
Internal extensions follow the Claude plugin directory structure, including plugin metadata, optional MCP config, commands, agents, skills, and docs.
External plugins are isolated behind review and approval before activation.

## Plugin Governance Policy

### Required checks before activation

- source verified
- README reviewed
- MCP scope reviewed
- permissions reviewed
- commands reviewed
- agent behavior reviewed
- skills reviewed
- network behavior reviewed
- secrets exposure risk reviewed
- sandbox decision made

### Plugin lifecycle states

- discovered
- quarantined
- approved
- disabled
- deprecated

### Plugin governance entities (PostgreSQL)

- `plugins`
- `plugin_versions`
- `plugin_permissions`
- `plugin_installations`
- `plugin_reviews`
- `plugin_states`

## Plugin Standardization Phase (Roadmap)

After approval gating and role/workspace routing:

1. create `plugins/` and `external_plugins/`
2. define `.claude-plugin/plugin.json` schema baseline
3. create internal plugin template
4. add plugin registry tables
5. add plugin review workflow
6. add plugin state machine
7. add install/enable/disable commands
8. enforce approved/quarantined separation

## CLI Direction (Extended)

```bash
antigravity plugin list
antigravity plugin inspect <name>
antigravity plugin install <name>
antigravity plugin review <name>
antigravity plugin approve <name>
antigravity plugin disable <name>
antigravity plugin enable <name>
```


## External Plugin Intake Example

Add **The Agency** (`msitarzewski/agency-agents`) as a quarantined external plugin source.
Do not activate directly from marketplace source; require governance review and explicit promotion into `external_plugins/approved/`.
