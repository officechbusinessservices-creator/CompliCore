from packages.shared.run_store import list_initiatives, list_kpis


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")

    initiatives = list_initiatives(workspace=workspace)
    kpis = list_kpis(workspace=workspace)
    weakest = [k for k in kpis if k.get("status") != "on-track"][:3]

    queue = []
    for idx, item in enumerate(initiatives[:5], start=1):
        queue.append(
            {
                "priority": idx,
                "title": f"Content sprint for {item['name']}",
                "linked_initiative_score": item["score"],
                "goal": "Lift KPI trend and increase qualified demand",
            }
        )

    return {
        "workspace": workspace,
        "weak_kpis": weakest,
        "content_queue": queue,
    }
