from packages.shared.run_store import list_experiments, list_failures, list_kpis, list_outcomes


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")

    kpis = list_kpis(workspace=workspace)
    outcomes = list_outcomes(workspace=workspace)
    experiments = list_experiments(workspace=workspace)
    failures = list_failures(workspace=workspace)

    on_track = [k for k in kpis if k.get("status") == "on-track"]
    off_track = [k for k in kpis if k.get("status") != "on-track"]

    return {
        "workspace": workspace,
        "wins": outcomes[:5],
        "kpi_status": {
            "on_track": len(on_track),
            "off_track": len(off_track),
            "total": len(kpis),
        },
        "experiments_running": [e for e in experiments if e.get("status") in {"planned", "running"}],
        "recent_failures": failures[:3],
        "next_week_priorities": [
            "Double down on initiatives with highest score and positive KPI movement.",
            "Resolve off-track KPIs with targeted experiments and owner assignment.",
            "Close open failure fixes with repeat-risk tagged high.",
        ],
    }
