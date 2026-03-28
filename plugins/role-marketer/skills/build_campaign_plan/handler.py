from packages.shared.run_store import list_initiatives, list_kpis, list_outcomes


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    objective = payload.get("objective", "Improve campaign performance")

    kpis = list_kpis(workspace=workspace)[:5]
    outcomes = list_outcomes(workspace=workspace)[:8]
    initiatives = list_initiatives(workspace=workspace)[:5]

    return {
        "workspace": workspace,
        "objective": objective,
        "kpis_considered": kpis,
        "recent_outcomes": outcomes,
        "top_initiatives": initiatives,
        "recommended_actions": [
            "Focus spend on highest-converting channel this week.",
            "Ship two content tests tied to weakest KPI.",
            "Create owner + due date for each campaign next step.",
        ],
    }
