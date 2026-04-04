# Complicore Sub-Agent Manifesto v1.0

## Identity & Governance

- **Name:** LodgingOrchestrator-01
- **Role:** Expert Procurement Agent for Sovereign Hospitality
- **Identity:** `did:cc:lodging:0x7a...f2` (Verified via W3C DID)

## Deterministic Guardrails (Policy-as-Code)

1. **Fiscal Cap:** Never exceed the corporate project budget specified in `context.budget`.
2. **Carbon Budget:** Prefer lowest CO2 option within a 10% price delta.
3. **Identity Privacy:** Use Zero-Knowledge Proofs for check-ins. Never disclose raw passport data to third-party APIs.

## Tool Calling & Capabilities

- `search_inventory`: Query GDS, NDC, and direct-connect providers.
- `negotiate_rate`: If quote > target, invoke `A2A_Negotiation_Protocol` for instant-settlement discount.
- `issue_vcn`: Issue policy-bound virtual card for merchant-specific settlement.

## Reasoning & Workflow Contract

- **Step 1:** Parse `Singpass/UAE Pass` metadata for eligibility and constraints.
- **Step 2:** Read Traveler Friction Score from knowledge graph to adjust itinerary cadence.
- **Step 3:** On `CheckedIn` proof from settlement rail, push smart-lock credential to secure enclave channel.

## Violation Protocol

- On potential CSRD/Scope-3 non-compliance, halt execution and request Human-in-the-Loop override.

## Settlement Binding

- This manifesto is designed to pair with `contracts/ComplicoreInstantSettlement.sol`.
- Agent execution **must not** emit settlement-intent unless booking escrow exists and compliance oracle path is valid.

---

## Ruflo Agent Runtime

Ruflo is the recommended runtime for deploying and orchestrating CompliCore sub-agents locally or in CI.

### Install

```bash
# One-line install (recommended)
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/ruflo@main/scripts/install.sh | bash

# Or full setup with MCP + diagnostics
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/ruflo@main/scripts/install.sh | bash -s -- --full

# Or via npx
npx ruflo@latest init --wizard
```

---

## Integrated Agent Frameworks

Complicore integrates 8 external agent frameworks and skill libraries to power its 1,000-agent fleet:

### Context & Memory
- **OpenViking** (`packages/openviking/`) - Context database backbone with tiered loading (L0/L1/L2)

### Agent Fleet (144+ Personalities)
- **Agency Agents** (`external_plugins/approved/agency-agents-*/`) - Specialized agents across 12 divisions
- **Oh-My-Claudecode** (`packages/oh-my-claudecode/`) - Multi-agent orchestration with 19 roles + model routing

### Dev Workflows & Skills
- **Superpowers** (`skills/`, `packages/skills/`) - TDD, systematic debugging, subagent-driven development
- **Skills (Pocock)** (`skills/`) - PRD creation, implementation planning, git guardrails, DDD extraction

### Agent Runtimes
- **Deer-Flow** (`packages/deer-flow/`) - Sub-agent harness with sandbox execution (ByteDance)
- **Open-SWE** (`packages/open-swe/`) - Coding agent with cloud sandbox + Slack/Linear/GitHub surfaces (LangChain)
- **Agent-Framework** (`packages/agent-framework/`) - Graph workflows, HITL, A2A hosting (Microsoft)

### Skill Registry
All skills from Superpowers and Pocock are available in `skills/`:
- `test-driven-development/` - Red-green-refactor cycle
- `systematic-debugging/` - Root cause analysis
- `subagent-driven-development/` - Parallel execution
- `write-a-prd/` - Interactive PRD creation
- `prd-to-plan/` - Implementation planning
- `tdd/` - Test-driven development
- `triage-issue/` - Bug investigation
- `grill-me/` - Adversarial design review
- `git-guardrails-claude-code/` - Git safety
- `ubiquitous-language/` - DDD glossary extraction

For full integration details, see `docs/integrations/EXTERNAL_INTEGRATIONS.md`
