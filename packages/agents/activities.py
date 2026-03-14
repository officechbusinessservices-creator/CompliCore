from datetime import datetime, timezone

from temporalio import activity

from packages.shared.run_store import create_workflow_step, write_audit


@activity.defn
async def planner_activity(payload: dict) -> dict:
    objective = payload.get("objective", "")
    run_id = payload["db_run_id"]
    result = {
        "stage": "plan",
        "tasks": [
            {"name": "research", "goal": f"Gather evidence for: {objective}"},
            {"name": "execute", "goal": f"Produce bounded output for: {objective}"},
            {"name": "review", "goal": "Validate output quality and risks"},
        ],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    create_workflow_step(run_id, "planner", "plan", result)
    write_audit("agent", "planner", "stage_completed", result)
    return result


@activity.defn
async def researcher_activity(plan: dict) -> dict:
    run_id = plan["db_run_id"]
    result = {
        "db_run_id": run_id,
        "stage": "research",
        "evidence": [
            "Initial internal context gathered",
            "No external tools used yet",
        ],
        "based_on": {
            "stage": plan.get("stage"),
            "tasks": plan.get("tasks", []),
        },
    }
    create_workflow_step(run_id, "researcher", "research", result)
    write_audit("agent", "researcher", "stage_completed", result)
    return result


@activity.defn
async def executor_activity(research: dict) -> dict:
    run_id = research["db_run_id"]
    summary = "Execution completed from current evidence"
    result = {
        "db_run_id": run_id,
        "stage": "execute",
        "result": {
            "summary": summary,
            "files_changed": [],
            "side_effects": [],
        },
        "based_on": {
            "stage": research.get("stage"),
            "evidence": research.get("evidence", []),
        },
    }
    create_workflow_step(run_id, "executor", "execute", result)
    write_audit("agent", "executor", "stage_completed", result)
    return result


@activity.defn
async def reviewer_activity(execution: dict) -> dict:
    run_id = execution["db_run_id"]
    result = {
        "db_run_id": run_id,
        "stage": "review",
        "approved": True,
        "issues": [],
        "final_output": execution["result"],
    }
    create_workflow_step(run_id, "reviewer", "review", result)
    write_audit("agent", "reviewer", "stage_completed", result)
    return result
