from packages.shared.run_store import list_opportunities


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    opportunities = list_opportunities(workspace=workspace)
    risks = [o for o in opportunities if o.get("risk_flag") in {"high", "stalled"}]
    to_push = [o for o in opportunities if o.get("stage") in {"proposal", "negotiation"}]
    return {
        "workspace": workspace,
        "pipeline_risks": risks,
        "deals_to_push": to_push,
        "summary": {
            "total_opportunities": len(opportunities),
            "risks": len(risks),
            "push_candidates": len(to_push),
        },
    }
