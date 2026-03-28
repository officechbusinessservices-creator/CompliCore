from packages.agents.activities import create_execution_plan


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    role = payload.get("role", "ceo")
    objective = payload.get("objective", "")
    constraints = payload.get("constraints", [])

    plan = create_execution_plan(
        workspace=workspace,
        role=role,
        objective=objective,
        constraints=constraints,
    )
    return {
        "workspace": workspace,
        "role": role,
        "objective": objective,
        "plan": plan.model_dump(),
    }
