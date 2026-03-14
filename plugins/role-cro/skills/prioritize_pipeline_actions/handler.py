from packages.shared.run_store import list_actions, list_kpis, list_opportunities


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    opportunities = list_opportunities(workspace=workspace)
    actions = list_actions(workspace=workspace)
    kpis = list_kpis(workspace=workspace)

    at_risk = [o for o in opportunities if o.get("risk_flag") in {"high", "stalled"}]
    pending = [a for a in actions if a.get("status") == "pending_approval"]

    return {
        "workspace": workspace,
        "revenue_priorities": [
            "Resolve pending approval actions tied to high-value deals",
            "Advance proposal-stage opportunities with 48h follow-up SLA",
            "Escalate stalled opportunities into CRO review queue",
        ],
        "deals_at_risk": at_risk,
        "pending_actions": pending,
        "kpis": kpis,
    }
