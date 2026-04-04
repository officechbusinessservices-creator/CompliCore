# Complicore External Integrations

## Overview

This document tracks all external repositories integrated into the Complicore project. Each integration is categorized by status, purpose, and location within the codebase.

---

## Integration Matrix

| Repository | Source | Status | Location | Purpose |
|---|---|---|---|---|
| **OpenViking** | volcengine/OpenViking | **Adopted** | `packages/openviking/` | Context database backbone for AI agents |
| **Agency Agents** | msitarzewski/agency-agents | **Approved** | `external_plugins/approved/agency-agents-*/` | 144+ specialized agent personalities across 12 divisions |
| **Superpowers** | obra/superpowers | **Integrated** | `skills/`, `packages/skills/` | TDD workflows, systematic debugging, subagent-driven development |
| **Skills (Pocock)** | mattpocock/skills | **Integrated** | `skills/` | PRD creation, implementation planning, TDD, git guardrails |
| **Oh-My-Claudecode** | Yeachan-Heo/oh-my-claudecode | **Integrated** | `packages/oh-my-claudecode/` | Multi-agent orchestration, 19 specialized agent roles, model routing |
| **Deer-Flow** | bytedance/deer-flow | **Integrated** | `packages/deer-flow/` | Sub-agent harness, sandbox execution, IM channel integration |
| **Open-SWE** | langchain-ai/open-swe | **Integrated** | `packages/open-swe/` | Coding agent framework, middleware patterns, sandbox isolation |
| **Agent-Framework** | microsoft/agent-framework | **Integrated** | `packages/agent-framework/` | Graph workflows, HITL, A2A hosting, multi-language support |

---

## 1. OpenViking (Context Backbone)

**Source:** https://github.com/volcengine/OpenViking.git
**License:** AGPLv3
**Location:** `packages/openviking/`

### What It Provides
- Filesystem-paradigm context store using `viking://` URIs
- Tiered context loading (L0 abstract / L1 overview / L2 details)
- Directory recursive retrieval for improved context accuracy
- Automatic session memory management
- Visualized retrieval trajectories

### Integration Status
- Core Python package copied to `packages/openviking/openviking/`
- CLI tools copied to `packages/openviking/openviking_cli/`
- Server deployment via existing `apps/context_gateway/`

### Setup
```bash
cd packages/openviking
pip install -e .
```

### Notes
- Already evaluated and adopted as Complicore's context backbone
- AGPLv3 license requires careful review for commercial use
- Server runs as `openviking-server` HTTP service

---

## 2. Agency Agents (Agent Fleet)

**Source:** https://github.com/msitarzewski/agency-agents.git
**License:** MIT
**Location:** `external_plugins/approved/agency-agents-*/`

### What It Provides
- 144+ AI agent personalities across 12 divisions
- Engineering (25+), Design (8), Marketing (30+), Sales (8)
- Product (5), Project Management (6), Testing (8), Support (6)
- Spatial Computing (6), Specialized (20+), Game Development, Academic

### Integration Status
- All division folders copied to `external_plugins/approved/`
- Ready for promotion to active fleet after governance review

### Divisions Integrated
- `agency-agents-engineering/` - Frontend, Backend, AI, DevOps agents
- `agency-agents-design/` - UI/UX, Brand, Motion agents
- `agency-agents-marketing/` - Content, SEO, Social, China-market agents
- `agency-agents-sales/` - SDR, AE, Account Management agents
- `agency-agents-product/` - PM, Strategy, Research agents
- `agency-agents-pm/` - Scrum, Delivery, Risk agents
- `agency-agents-testing/` - QA, Automation, Performance agents
- `agency-agents-support/` - Customer Success, Technical Support agents

---

## 3. Superpowers (Dev Workflows)

**Source:** https://github.com/obra/superpowers.git
**License:** MIT
**Location:** `skills/`, `packages/skills/`

### What It Provides
- Test-driven development enforcement
- Systematic debugging workflows
- Subagent-driven development patterns
- Git worktree management
- Brainstorming and planning skills

### Skills Integrated
- `test-driven-development/` - Red-green-refactor cycle
- `systematic-debugging/` - Root cause analysis workflow
- `subagent-driven-development/` - Parallel subagent execution
- `executing-plans/` - Plan execution with progress tracking
- `brainstorming/` - Idea generation and evaluation
- `writing-plans/` - Structured plan creation

### Setup
Zero dependencies - skill files are drop-in compatible with Claude Code, Cursor, Codex, OpenCode, and Gemini CLI.

---

## 4. Skills - Matt Pocock (Planning & Dev)

**Source:** https://github.com/mattpocock/skills.git
**License:** MIT
**Location:** `skills/`

### What It Provides
- PRD creation via interactive interview
- Implementation planning from PRDs
- TDD enforcement
- Git guardrails
- Architecture improvement
- DDD ubiquitous language extraction

### Skills Integrated
- `write-a-prd/` - Interactive PRD creation
- `prd-to-plan/` - PRD to multi-phase implementation plan
- `prd-to-issues/` - PRD to GitHub issues
- `tdd/` - Test-driven development
- `triage-issue/` - Bug investigation
- `improve-codebase-architecture/` - Architecture patterns
- `design-an-interface/` - Parallel subagent interface design
- `grill-me/` - Adversarial design review
- `obsidian-vault/` - Note management
- `git-guardrails-claude-code/` - Git safety
- `ubiquitous-language/` - DDD glossary extraction
- `write-a-skill/` - Skill creation template

---

## 5. Oh-My-Claudecode (Orchestration)

**Source:** https://github.com/Yeachan-Heo/oh-my-claudecode.git
**License:** MIT
**Location:** `packages/oh-my-claudecode/`

### What It Provides
- Team mode pipelines (plan -> prd -> exec -> verify -> fix)
- 19 specialized agent roles
- Smart model routing (Haiku for simple, Opus for complex)
- HUD observability
- tmux-based CLI worker spawning
- Skill learning and extraction

### Components Integrated
- `agents/` - Agent role definitions
- `skills/` - Workflow skills (autopilot, ralph, ultrawork, team)
- `src/` - TypeScript orchestration source
- `package.json` - npm package definition

### Dependencies
- Claude Code CLI
- tmux (for Team mode)
- Optional: Codex CLI, Gemini CLI

---

## 6. Deer-Flow (Agent Harness)

**Source:** https://github.com/bytedance/deer-flow.git
**License:** Apache 2.0
**Location:** `packages/deer-flow/`

### What It Provides
- Sub-agent orchestration with parallel execution
- Docker-isolated sandbox execution
- Long-term memory management
- Context engineering (isolation, summarization, compression)
- IM channel integration (Telegram, Slack, Feishu)

### Components Integrated
- `harness/` - Agent harness (LangGraph-based)
- `skills/` - Built-in skills (research, report-generation, etc.)
- `tools/` - Tool definitions

### Dependencies
- Python 3.12+
- LangGraph, LangChain
- Docker (for sandbox mode)

---

## 7. Open-SWE (Coding Agent)

**Source:** https://github.com/langchain-ai/open-swe.git
**License:** MIT
**Location:** `packages/open-swe/`

### What It Provides
- Cloud sandbox execution (Modal, Daytona, Runloop, LangSmith)
- Slack/Linear/GitHub invocation surfaces
- Sub-agent orchestration via Deep Agents
- Automatic PR creation
- Middleware pattern for request/response processing

### Components Integrated
- `agent/` - Agent harness (Deep Agents framework)
- `scripts/` - Setup and deployment scripts
- `pyproject.toml` - Python dependencies
- `CUSTOMIZATION.md` - Customization guide

### Dependencies
- Python (uv for dependency management)
- LangGraph, Deep Agents framework
- Sandbox provider (Modal, Daytona, Runloop, or LangSmith)

---

## 8. Agent-Framework (Microsoft)

**Source:** https://github.com/microsoft/agent-framework.git
**License:** MIT
**Location:** `packages/agent-framework/`

### What It Provides
- Graph-based workflows with checkpointing and time-travel
- Human-in-the-loop support
- Multi-provider LLM support
- OpenTelemetry observability
- A2A hosting (Agent-to-Agent protocol)
- DevUI for interactive development/testing
- Python and .NET/C# support

### Components Integrated
- `agent-framework-core/` - Core framework package
- `schemas/` - Workflow and agent schemas
- `samples/` - Progressive sample applications
- `README.md` - Documentation

### Dependencies
- Python: `pip install agent-framework`
- Azure AI or OpenAI for LLM providers
- OpenTelemetry (optional, for observability)

---

## Integration Guidelines

### Adding New External Code
1. Clone the repository to `~/` (home directory)
2. Review license compatibility
3. Copy relevant components to appropriate `packages/` or `external_plugins/` directory
4. Update this document
5. Run security audit on any executable code
6. Commit with descriptive message

### Security Considerations
- All external plugins are quarantined in `external_plugins/quarantined/` until reviewed
- Approved plugins move to `external_plugins/approved/`
- Never commit `node_modules/`, `.env`, or credential files
- Review any network calls or file system access in external code

### License Compliance
- **MIT:** Free to use, modify, distribute (Agency Agents, Superpowers, Pocock Skills, Open-SWE, Agent-Framework)
- **Apache 2.0:** Free to use with patent grant (Deer-Flow)
- **AGPLv3:** Requires source disclosure for network use (OpenViking) - review carefully for commercial use
