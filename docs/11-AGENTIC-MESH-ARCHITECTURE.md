# 11. Agentic Mesh Architecture

## 11.1 System Model

The Agentic Mesh is a federated execution layer attached to the sovereign ledger core.

```text
Intent Source (User/App)
   -> Orchestrator Agent
      -> Domain Sub-Agents (Flights, Lodging, Ground, Visa)
         -> Compliance Core (Policy-as-Code + Liability Wrapper)
            -> Settlement Router (VCN / Instant Stablecoin / DvP)
               -> Sovereign Ledger + Audit Trail
```

---

## 11.2 Runtime Components

### 1) Orchestrator

- Interprets trip intent and decomposition plan.
- Delegates to sub-agents.
- Consolidates quotes and constraints.

### 2) Compliance Core

- Deterministic policy evaluation.
- Enforces jurisdictional and credential rules.
- Emits liability decision and reason codes.

### 3) HITL Gate

- If AI confidence is below threshold, route to human approval.
- Current threshold scaffold: **99**.

### 4) Settlement Router

- Chooses settlement mode based on policy and counterpart constraints.
- Supports instant-pay discount logic in negotiation simulation.

---

## 11.3 Initial API Surfaces

### Public status surfaces

- `GET /v1/agentic/status`
- `GET /v1/agentic/foundry/capabilities`

### Controlled orchestration surfaces

- `POST /v1/agentic/journeys/plan`
- `POST /v1/agentic/a2a/negotiate`
- `POST /v1/agentic/compliance/liability-eval`

All POST surfaces are role-gated through existing backend role checks.

---

## 11.4 Safety and Trust Guarantees

1. **Policy First**: actions are policy-evaluated before execution.
2. **Liability Wrapper**: every AI action can be attributed to deterministic rule outcomes.
3. **Auditable Outputs**: each endpoint emits structured decision payloads.
4. **Escalation by Design**: low-confidence agent decisions route to HITL.

---

## 11.5 Corridor Rollout Blueprint

### Phase A — Singapore ↔ Dubai pilot

- Focus: sovereign journey orchestration and A2A negotiation efficiency.
- KPI: policy-pass rate, negotiation acceptance rate, settlement latency.

### Phase B — Enterprise compliance expansion

- Add carbon-budget assertions and CFO-ready reporting traces.
- Extend policy packs per jurisdiction profile.

### Phase C — Agent marketplace

- Third-party specialist agents under liability wrapper constraints.
- Commission-based marketplace model.

---

## 11.6 Agentic Handshake Protocol (Scaffold)

### Registry + Discovery

- Agent Card standard: JSON-LD shape with DID, capabilities, trust metadata.
- Trust scoring: DID format + trusted signature issuer + active status.
- Discovery filters by capability and minimum trust score.

### A2A Negotiation Layer

- Handshake simulation captures iterative transcript across multiple supplier agents.
- Budget + carbon constraints drive rejection/acceptance path.
- Instant settlement concession is modeled as a negotiated close condition.

### Compliance Core Guardrails

- Deterministic decision outcomes: `AUTO_APPROVED`, `HITL_REQUIRED`, `BLOCKED`.
- HITL triggers on:
  - confidence `< 99%`
  - transaction value `> $5,000`
- Carbon check uses corridor segment lookup for emissions thresholding.

### Zero-Touch Sandbox

- Simulates Singpass ↔ UAE Pass identity federation.
- Produces ZKP proof artifact ID.
- Pushes biometric key identifier into mocked hotel PMS pre-authorization flow.

### Implemented Endpoints (Handshake Phase)

- `GET /v1/agentic/registry/agents`
- `POST /v1/agentic/registry/agents` (role-gated)
- `GET /v1/agentic/registry/discovery`
- `POST /v1/agentic/a2a/handshake-simulate`
- `POST /v1/agentic/compliance/guardrail-check`
- `POST /v1/agentic/sandbox/zero-touch`
