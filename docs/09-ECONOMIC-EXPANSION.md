# 9. Economic Expansion (CCP-301 + SSI)

## 9.1 Objective

This phase transitions CompliCore from post-activation stabilization into institutional growth.

- **CCP-301** introduces the Real-World Asset (RWA) bridge.
- **SSI Framework** introduces identity-bound access and transfer controls.
- **CCP-201 remains the base compliance layer** for jurisdictional routing and policy enforcement.

---

## 9.2 CCP-301 Bridge Overview

CCP-301 links off-chain assets (e.g., real estate, treasury instruments, commodities) to on-chain representations with compliance-aware settlement.

### Legal-Technical Components

| Component | Function | Implementation Pattern |
| --- | --- | --- |
| SPV Wrapper | Legal owner of physical title | Special Purpose Vehicle custody + legal registry mapping |
| Proof of Reserve | Verifies 1:1 backing | Oracle-driven reserve attestations (periodic heartbeat) |
| Token Standard | Encodes transfer logic | ERC-7518-style compliant, identity-bound token schema |
| DvP Settlement | Atomic transfer safety | Delivery-vs-Payment execution path |

---

## 9.3 SSI Framework Overview

SSI removes password-first identity assumptions and reduces stored PII exposure.

### Trust Triangle

| Role | Responsibility |
| --- | --- |
| Issuer | CompliCore issues verifiable credentials after onboarding/KYC |
| Holder | User stores credentials in wallet/device-bound enclave |
| Verifier | DApp verifies cryptographic claims without raw document exposure |

### Rollout Sequence

1. **Selective Disclosure**: prove attributes (e.g., region, age band) without full payload disclosure.
2. **Passkey Binding**: bind credential presentation to device biometrics.
3. **Pairwise DIDs**: use per-context DIDs to reduce cross-service correlation risk.

---

## 9.4 Programmable Compliance Linkage (CCP-201 + CCP-301 + SSI)

Transfer is allowed only when all three checks pass:

1. **Jurisdiction Policy (CCP-201)**: destination and routing satisfy geofence + residency controls.
2. **Identity Proof (SSI)**: holder presents required credential claims.
3. **Reserve / Settlement Check (CCP-301)**: backing and DvP conditions are valid.

If any check fails, transfer is denied and logged with policy reason code.

---

## 9.5 7-Day Execution Protocol (Tier-1)

| Day | Objective | Actions | Success KPI |
| --- | --- | --- | --- |
| Day 1 | Equilibrium Confirmation | Run sentinel + tri-lens checks across regions | 100% cluster sync; integrity 99.99% |
| Day 2 | CCP-301 Drafting | Submit CCP-301 manifest, legal review, risk sign-off | Draft accepted by quorum workflow |
| Day 3 | SSI Activation (Tier-1) | Enable DID namespace + admin VC issuance | 100% Tier-1 accounts DID-bound |
| Day 4 | RWA Test Asset Onboarding | Register first pilot asset + reserve attestation path | 1:1 reserve verification passes |
| Day 5 | Atomic Settlement Dry Run | Execute DvP test transfers under policy constraints | Settlement p95 < 2s |
| Day 6 | Partner Readiness | Prepare Tier-2 onboarding package + node criteria | 1+ candidate partner approved |
| Day 7 | Quorum Review | Post-activation governance review + go/no-go vote | Signed decision and action log |

---

## 9.6 Economic Dashboard Additions

Add these panels to Governance/Observability dashboards:

- **TVL (Total Value Locked)** for RWA token classes
- **Identity Health** (DID-bound active users, VC presentation success rate)
- **Settlement Latency** (DvP p50/p95)
- **Policy Denial Reasons** (jurisdiction/identity/reserve)
- **Reserve Attestation Freshness** (oracle heartbeat age)

---

## 9.7 Operational Controls

### Go/No-Go Checks before CCP-301 live mode

- CCP-201 routing accuracy maintained at production SLO
- SSI verifier success > 99.5% in staging traffic
- Reserve oracle heartbeat within allowed threshold
- Incident runbooks approved for settlement/revocation paths

### Rollback Triggers

- Reserve mismatch event
- Identity verifier degradation beyond threshold
- Region leakage or policy bypass indication

Rollback returns to CCP-201-only policy mode and suspends new RWA issuance.

---

## 9.8 Reference Artifacts

- CCP-301 draft manifest: `docs/manifests/CCP-301.json`
- Inaugural Singapore asset deed draft: `docs/manifests/CCP-301-SG-COMM-MBFC-001.json`
- Monitoring runbook: `MAINTENANCE_CHEAT_SHEET.md`
- Deployment/rollback: `DEPLOYMENT.md`, `scripts/release.sh`, `scripts/rollback.sh`

---

## 9.9 Inaugural RWA Deed (Singapore Pilot)

Pilot target: **S$1.0M commercial property** modeled as 1,000 partitions.

### Metadata profile

- Asset ID: `SG-COMM-MBFC-001`
- Jurisdiction: `Singapore (MAS SFA aligned)`
- Residency cluster: `SG-SOUTH-1`
- Transfer policy: `Accredited investor credential required`

Use draft artifact:

- `docs/manifests/CCP-301-SG-COMM-MBFC-001.json`

### Simulated execution command

```bash
# Example operational command shape (implementation-specific)
docker exec app ccp-rwa-mint --asset SG-COMM-MBFC-001 --amount 1000 --partition "Tier-1_Accredited"
```

> Note: command is a target interface for runbook and governance workflows. Wire to your actual mint service/CLI before production execution.

---

## 9.10 SSI Wallet API Integration (W3C VC Flow)

### Frontend feature detection pattern

```javascript
if (typeof DigitalCredential !== "undefined") {
  console.log("Sovereign Identity API supported. Initializing secure handshake.");
} else {
  alert("Please use a compliant secure wallet.");
}
```

### Wallet assertion request pattern

```javascript
const credentialRequest = {
  protocols: ["https://protocols.complicore.io/v1"],
  providers: ["did:complicore:issuer:root"],
  data: {
    type: "AccreditationCredential",
    constraints: {
      jurisdiction: "SG"
    }
  }
};

const assertion = await DigitalCredential.get(credentialRequest);
// Send assertion to backend verifier for ZK/VC verification and policy checks.
```

### Backend verifier outcome requirements

On assertion verification:

1. validate issuer DID and signature chain,
2. validate expiry/revocation status,
3. evaluate credential claims against CCP-201 jurisdiction policy,
4. allow/deny transfer based on policy + reserve checks.

---

## 9.11 CCP-302 Expansion + Sell-out Automation

Following MBFC-001 pilot completion, CCP-302 enables automated governance handover.

- **Genesis Sell-out Report endpoint**: `/v1/economic/governance/genesis-sellout-report`
- **CCP-302 trigger endpoint**: `/v1/economic/governance/ccp302/auto-trigger`
- **Trigger modes**:
  1. `sellout_auto` when 1,000/1,000 units are allocated
  2. `manual_force` for governance override

### Added manifests

- `docs/manifests/CCP-302.json`
- `docs/manifests/CCP-302-MAV-PORTFOLIO.json`

### 24-hour operational watch script

- `scripts/monitor_whale_sentry.sh`

Example run:

```bash
WINDOW_HOURS=24 INTERVAL_SECONDS=300 ./scripts/monitor_whale_sentry.sh
```

---

## 9.12 Final Settlement + Institutional Capital Call (CCP-302)

The pilot now supports an institutional handover flow:

- **Final Settlement endpoint**: `/v1/economic/settlement/execute-final`
- **Settlement status endpoint**: `/v1/economic/settlement/status`
- **Capital call initiate endpoint**: `/v1/economic/governance/capital-call/initiate`
- **Partner commitment update**: `/v1/economic/governance/capital-call/partner-update`
- **Capital call status**: `/v1/economic/governance/capital-call/status`

### Settlement outcomes

1. DvP final settlement record is emitted and TVV is locked.
2. Retail minting is closed for MBFC-001 post-settlement.
3. Revenue anchor is marked as primed for pro-rata distributions.

### Capital call outcomes

1. $4.0M institutional call can be opened with 48h window.
2. Anchor partner states can be tracked and updated.
3. A first-$1.0M milestone emits an auto-mint signal for **Tech Hub Alpha**.

### Operator automation added

- **Private Capital Update API**: `POST /v1/economic/governance/capital-call/private-update`
  - Generates an Anchor-C-focused nudge payload (subject/body/snapshot/CTA) after rPoR clearance.
- **Vault completion watcher**: `scripts/monitor_vault_100.sh`
  - Polls capital-call status and emits a terminal alert the moment composite vault funding reaches 100%.
  - Example:

```bash
POLL_SECONDS=30 MAX_WAIT_MINUTES=120 ./scripts/monitor_vault_100.sh
```
