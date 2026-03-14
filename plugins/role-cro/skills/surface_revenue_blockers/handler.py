from packages.shared.run_store import list_actions, list_escalations, list_opportunities


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    opportunities = list_opportunities(workspace=workspace)
    actions = list_actions(workspace=workspace)
    escalations = list_escalations(workspace=workspace)

    stalled_deals = [o for o in opportunities if o.get("risk_flag") in {"stalled", "high"}]
    blocked_actions = [a for a in actions if a.get("status") == "pending_approval"]

    return {
        "workspace": workspace,
        "deal_risks": stalled_deals,
        "blocked_actions": blocked_actions,
        "open_escalations": [e for e in escalations if e.get("status") == "open"],
        "decisions_required": [
            "Approve or reject pending sends tied to top 5 opportunities",
            "Assign owner for each high-risk stalled deal",
        ],
    }
