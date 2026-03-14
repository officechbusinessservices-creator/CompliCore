from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field
from temporalio import activity

from packages.memory.openviking_client import OpenVikingContextClient
from packages.shared.run_store import (
    create_workflow_step,
    request_approval,
    complete_workflow_run,
    write_artifact,
    write_audit,
)


class StageContext(BaseModel):
    db_run_id: str
    workflow_id: str
    workspace: str = "complicore"
    role: str = "builder"
    objective: str
    constraints: list[str] = Field(default_factory=list)


class ExecutionPlan(BaseModel):
    priority_list: list[str]
    execution_phases: list[dict]
    blockers: list[str]
    next_actions: list[str]
    approval_needed_actions: list[str]


class PlanResult(BaseModel):
    db_run_id: str
    workflow_id: str
    stage: Literal["plan"] = "plan"
    workspace: str
    role: str
    objective: str
    plan: ExecutionPlan
    created_at: str


class ResearchResult(BaseModel):
    db_run_id: str
    workflow_id: str
    stage: Literal["research"] = "research"
    evidence: list[str]
    risks: list[str]
    assumptions: list[str]


class ExecutionResult(BaseModel):
    db_run_id: str
    workflow_id: str
    stage: Literal["execute"] = "execute"
    status: str
    summary: str
    deliverables: list[str]
    requires_approval: bool


class ReviewResult(BaseModel):
    db_run_id: str
    workflow_id: str
    stage: Literal["review"] = "review"
    approved: bool
    issues: list[str]
    final_output: dict


def create_execution_plan(
    workspace: str,
    role: str,
    objective: str,
    constraints: list[str],
) -> ExecutionPlan:
    role_prefix = f"[{role.upper()}::{workspace}]"
    base_priorities = [
        f"{role_prefix} Clarify objective and success criteria",
        f"{role_prefix} Execute highest-leverage workstream first",
        f"{role_prefix} Capture decision + evidence for audit",
    ]

    if role.lower() == "ceo":
        phases = [
            {"name": "alignment", "goal": "Validate strategic fit and KPIs"},
            {"name": "allocation", "goal": "Assign owners and resources"},
            {"name": "execution", "goal": "Drive weekly accountability"},
        ]
    elif role.lower() == "marketer":
        phases = [
            {"name": "research", "goal": "Define audience + offer + channel"},
            {"name": "campaign", "goal": "Build launch calendar and assets"},
            {"name": "measurement", "goal": "Track funnel metrics and optimize"},
        ]
    else:
        phases = [
            {"name": "scoping", "goal": "Break objective into executable tasks"},
            {"name": "implementation", "goal": "Deliver bounded output"},
            {"name": "review", "goal": "Validate quality and policy compliance"},
        ]

    blockers = [
        "Missing owner approvals for high-risk action",
        "Incomplete context or unclear constraints",
    ]
    next_actions = [
        "Assign owner to each phase",
        "Start phase-1 tasks and capture results",
        "Escalate blockers within 24h",
    ]
    approval_actions = [
        "Production-impacting execution",
        "Policy exception or budget-raising decision",
    ]

    if constraints:
        blockers.append(f"Constraint checks: {', '.join(constraints)}")

    return ExecutionPlan(
        priority_list=base_priorities,
        execution_phases=phases,
        blockers=blockers,
        next_actions=next_actions,
        approval_needed_actions=approval_actions,
    )


@activity.defn
async def planner_activity(payload: dict) -> dict:
    context = StageContext.model_validate(payload)
    plan = create_execution_plan(
        workspace=context.workspace,
        role=context.role,
        objective=context.objective,
        constraints=context.constraints,
    )
    result = PlanResult(
        db_run_id=context.db_run_id,
        workflow_id=context.workflow_id,
        workspace=context.workspace,
        role=context.role,
        objective=context.objective,
        plan=plan,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    payload_out = result.model_dump()
    create_workflow_step(context.db_run_id, "planner", "create_execution_plan", payload_out)
    write_audit("agent", "planner", "stage_completed", payload_out)
    return payload_out


@activity.defn
async def researcher_activity(plan_payload: dict) -> dict:
    plan = PlanResult.model_validate(plan_payload)
    context_client = OpenVikingContextClient()
    context = await context_client.retrieve(
        workspace=plan.workspace,
        role=plan.role,
        query=plan.objective,
        max_chunks=5,
    )
    evidence = [
        f"Workspace `{plan.workspace}` context loaded via {context.get('provider')}",
        f"Role `{plan.role}` playbook selected",
        f"Objective assessed: {plan.objective}",
    ]
    for chunk in context.get("chunks", [])[:3]:
        evidence.append(f"Context hit: {chunk.get('uri', 'unknown')}")
    result = ResearchResult(
        db_run_id=plan.db_run_id,
        workflow_id=plan.workflow_id,
        evidence=evidence,
        risks=["Approval-latency could block execution"],
        assumptions=["Core systems and API endpoints reachable"],
    )
    payload_out = result.model_dump()
    payload_out["context"] = context
    create_workflow_step(plan.db_run_id, "researcher", "research_context", payload_out)
    write_audit("agent", "researcher", "stage_completed", payload_out)
    return payload_out


@activity.defn
async def executor_activity(research_payload: dict) -> dict:
    research = ResearchResult.model_validate(research_payload)
    requires_approval = True
    summary = "Execution staged and waiting for approval for high-risk action."
    result = ExecutionResult(
        db_run_id=research.db_run_id,
        workflow_id=research.workflow_id,
        status="paused_for_approval" if requires_approval else "completed",
        summary=summary,
        deliverables=["execution_plan.json", "operator_summary.md"],
        requires_approval=requires_approval,
    )
    payload_out = result.model_dump()
    create_workflow_step(research.db_run_id, "executor", "execute_plan", payload_out)
    write_audit("agent", "executor", "stage_completed", payload_out)
    return payload_out


@activity.defn
async def reviewer_activity(execution_payload: dict) -> dict:
    execution = ExecutionResult.model_validate(execution_payload)
    result = ReviewResult(
        db_run_id=execution.db_run_id,
        workflow_id=execution.workflow_id,
        approved=True,
        issues=[],
        final_output={
            "summary": execution.summary,
            "next_actions": ["Publish artifact", "Queue follow-up workflow"],
        },
    )
    payload_out = result.model_dump()
    create_workflow_step(execution.db_run_id, "reviewer", "review_execution", payload_out)
    write_audit("agent", "reviewer", "stage_completed", payload_out)
    return payload_out


@activity.defn
async def create_approval_request_activity(payload: dict) -> dict:
    approval_id = request_approval(
        run_id=payload["db_run_id"],
        workflow_id=payload["workflow_id"],
        action_type=payload.get("action_type", "high_risk_execution"),
        payload=payload,
    )
    audit_payload = {"approval_id": approval_id, **payload}
    write_audit("system", "approval_gate", "approval_requested", audit_payload)
    return {
        "approval_id": approval_id,
        "run_id": payload["db_run_id"],
        "workflow_id": payload["workflow_id"],
        "status": "pending",
    }


@activity.defn
async def finalize_workflow_activity(payload: dict) -> dict:
    run_id = payload["db_run_id"]
    result = payload["result"]
    status = result.get("status", payload.get("status", "completed"))
    complete_workflow_run(run_id, result, status=status)
    artifact = write_artifact(run_id, "workflow-result", result)
    write_audit("system", "finalizer", "workflow_finalized", {"run_id": run_id, "status": status, "artifact": artifact})
    return {"run_id": run_id, "status": status, "artifact": artifact}
