from packages.shared.run_store import list_actions, list_initiatives, list_opportunities


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    opportunities = list_opportunities(workspace=workspace)
    initiatives = list_initiatives(workspace=workspace)
    actions = list_actions(workspace=workspace)

    return {
        "workspace": workspace,
        "coordination_plan": {
            "sales_followups": [o for o in opportunities if o.get("stage") in {"discovery", "proposal"}][:10],
            "marketing_support": initiatives[:5],
            "approval_queue": [a for a in actions if a.get("status") == "pending_approval"],
        },
    }
