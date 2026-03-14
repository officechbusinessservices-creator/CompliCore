from __future__ import annotations

from pathlib import Path

import os
import uuid
from functools import lru_cache

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text
from temporalio.client import Client

from packages.memory.openviking_client import OpenVikingContextClient
from packages.policies.plugin_policy_guard import evaluate_plugin_enable_policy
from packages.shared.db import SessionLocal
from packages.shared.models import Approval, Artifact, AuditEvent, Plugin, WorkflowRun, WorkflowStep
from packages.shared.run_store import (
    add_plugin_review,
    add_plugin_version,
    create_experiment,
    create_failure,
    create_initiative,
    create_kpi,
    create_outcome,
    decide_approval,
    get_approval,
    get_plugin_by_name,
    get_plugin_details,
    install_plugin,
    list_experiments,
    list_failures,
    list_initiatives,
    list_kpis,
    list_outcomes,
    list_plugins,
    register_plugin,
    set_plugin_permissions,
    set_plugin_state,
)
from packages.tools.plugin_runtime import (
    PluginValidationError,
    dispatch_plugin_command,
    load_plugins_into_registry,
    validate_plugin_manifest,
)

app = FastAPI(title="CompliCore API")


class ApprovalDecisionRequest(BaseModel):
    decision: str
    decided_by: str = "operator"
    reason: str | None = None


class ContextRequest(BaseModel):
    workspace: str
    role: str
    query: str
    max_chunks: int = 5


class PluginRegisterRequest(BaseModel):
    name: str
    source_type: str = Field(pattern="^(internal|external)$")
    source_url: str | None = None
    owner: str | None = None
    version: str = "0.1.0"
    checksum: str | None = None
    state: str = "discovered"
    trust_level: str = "unreviewed"


class PluginInstallRequest(BaseModel):
    workspace: str = "global"
    role: str = "global"
    install_path: str
    installed_by: str = "operator"


class PluginReviewRequest(BaseModel):
    reviewer: str
    status: str
    notes: str | None = None
    checklist_json: dict | None = None


class PluginStateRequest(BaseModel):
    changed_by: str = "operator"
    reason: str | None = None


class PluginPermissionsRequest(BaseModel):
    permissions: list[dict]


class PluginValidateRequest(BaseModel):
    plugin_path: str


class PluginDispatchRequest(BaseModel):
    command: str
    workspace: str
    role: str
    objective: str
    constraints: list[str] = []
    timeout_s: int = 30


class OutcomeCreateRequest(BaseModel):
    workspace: str = "complicore"
    outcome_type: str
    project: str | None = None
    campaign: str | None = None
    opportunity: str | None = None
    value: str | None = None
    confidence: str = "medium"
    source: str | None = None
    details_json: dict | None = None


class KpiCreateRequest(BaseModel):
    workspace: str = "complicore"
    name: str
    owner_role: str = "operator"
    target: str
    current: str
    period: str = "weekly"
    source: str | None = None
    status: str = "on-track"


class InitiativeCreateRequest(BaseModel):
    workspace: str = "complicore"
    name: str
    owner: str | None = None
    status: str = "proposed"
    effort: int = 1
    upside: int = 1
    urgency: int = 1
    confidence: int = 1


class ExperimentCreateRequest(BaseModel):
    workspace: str = "complicore"
    name: str
    hypothesis: str
    success_metric: str
    variant: str | None = None
    status: str = "planned"
    result: str | None = None
    decision: str | None = None


class FailureCreateRequest(BaseModel):
    workspace: str = "complicore"
    failure_type: str
    project: str | None = None
    root_cause: str
    cost: str | None = None
    fix: str | None = None
    repeat_risk: str = "medium"


context_client = OpenVikingContextClient()


@lru_cache(maxsize=1)
def get_temporal_target() -> str:
    return os.getenv("TEMPORAL_HOST", "localhost:7233")


async def signal_approval_workflow(workflow_id: str, decision: str, approval_id: str) -> None:
    client = await Client.connect(get_temporal_target())
    handle = client.get_workflow_handle(workflow_id)
    if decision == "approve":
        await handle.signal("approve", approval_id)
    else:
        await handle.signal("reject", approval_id)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/system/health/deep")
def deep_health() -> dict:
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as exc:  # noqa: BLE001
        db_status = f"error:{exc}"
    finally:
        db.close()

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "database": db_status,
        "temporal_host": get_temporal_target(),
    }


@app.get("/runs")
def list_runs() -> list[dict]:
    db = SessionLocal()
    try:
        rows = db.query(WorkflowRun).order_by(WorkflowRun.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "workflow_name": r.workflow_name,
                "status": r.status,
                "role": r.role,
                "workspace": r.workspace,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
    finally:
        db.close()


@app.get("/workflow/{run_id}")
def workflow_detail(run_id: str) -> dict:
    db = SessionLocal()
    try:
        run_uuid = uuid.UUID(run_id)
        run = db.query(WorkflowRun).filter(WorkflowRun.id == run_uuid).first()
        if not run:
            raise HTTPException(status_code=404, detail="Run not found")

        steps = db.query(WorkflowStep).filter(WorkflowStep.run_id == run_uuid).order_by(WorkflowStep.created_at.asc()).all()
        approvals = db.query(Approval).filter(Approval.run_id == run_uuid).order_by(Approval.created_at.desc()).all()
        artifacts = db.query(Artifact).filter(Artifact.run_id == run_uuid).order_by(Artifact.created_at.desc()).all()

        return {
            "run": {
                "id": str(run.id),
                "workflow_name": run.workflow_name,
                "status": run.status,
                "role": run.role,
                "workspace": run.workspace,
                "input_json": run.input_json,
                "output_json": run.output_json,
                "created_at": run.created_at.isoformat() if run.created_at else None,
            },
            "steps": [
                {
                    "id": str(step.id),
                    "agent_name": step.agent_name,
                    "step_name": step.step_name,
                    "status": step.status,
                    "created_at": step.created_at.isoformat() if step.created_at else None,
                }
                for step in steps
            ],
            "approvals": [
                {
                    "id": str(a.id),
                    "workflow_id": a.workflow_id,
                    "action_type": a.action_type,
                    "status": a.status,
                    "decision_json": a.decision_json,
                    "created_at": a.created_at.isoformat() if a.created_at else None,
                }
                for a in approvals
            ],
            "artifacts": [
                {
                    "id": str(a.id),
                    "artifact_type": a.artifact_type,
                    "file_path": a.file_path,
                    "markdown_path": a.markdown_path,
                    "created_at": a.created_at.isoformat() if a.created_at else None,
                }
                for a in artifacts
            ],
        }
    finally:
        db.close()


@app.get("/workflow/{run_id}/status")
def workflow_status(run_id: str) -> dict:
    db = SessionLocal()
    try:
        run_uuid = uuid.UUID(run_id)
        run = db.query(WorkflowRun).filter(WorkflowRun.id == run_uuid).first()
        if not run:
            raise HTTPException(status_code=404, detail="Run not found")

        pending = (
            db.query(Approval)
            .filter(Approval.run_id == run_uuid, Approval.status == "pending")
            .count()
        )
        return {
            "run_id": str(run.id),
            "status": run.status,
            "role": run.role,
            "workspace": run.workspace,
            "approval_waiting": pending > 0,
            "pending_approvals": pending,
        }
    finally:
        db.close()


@app.get("/steps")
def list_steps() -> list[dict]:
    db = SessionLocal()
    try:
        rows = db.query(WorkflowStep).order_by(WorkflowStep.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "run_id": str(r.run_id),
                "agent_name": r.agent_name,
                "step_name": r.step_name,
                "status": r.status,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
    finally:
        db.close()


@app.get("/audit")
def list_audit() -> list[dict]:
    db = SessionLocal()
    try:
        rows = db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(100).all()
        return [
            {
                "id": str(r.id),
                "actor_type": r.actor_type,
                "actor_name": r.actor_name,
                "event_type": r.event_type,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
    finally:
        db.close()


@app.get("/approvals")
def list_approvals(status: str = "pending") -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Approval)
        if status != "all":
            query = query.filter(Approval.status == status)
        rows = query.order_by(Approval.created_at.desc()).all()
        return [
            {
                "id": str(a.id),
                "run_id": str(a.run_id),
                "workflow_id": a.workflow_id,
                "action_type": a.action_type,
                "status": a.status,
                "approved": a.approved,
                "payload_json": a.payload_json,
                "decision_json": a.decision_json,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in rows
        ]
    finally:
        db.close()


@app.post("/approvals/{approval_id}/decision")
async def decision_approval(approval_id: str, request: ApprovalDecisionRequest) -> dict:
    if request.decision not in {"approve", "reject"}:
        raise HTTPException(status_code=400, detail="decision must be approve or reject")

    approval = get_approval(approval_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval["status"] != "pending":
        raise HTTPException(status_code=409, detail="Approval already decided")

    approved = request.decision == "approve"
    decided = decide_approval(approval_id, approved, request.decided_by, request.reason)
    if not decided:
        raise HTTPException(status_code=404, detail="Approval not found")

    await signal_approval_workflow(approval["workflow_id"], request.decision, approval_id)
    return {
        "status": "ok",
        "approval": decided,
    }


@app.get("/metrics/summary")
def metrics_summary() -> dict:
    db = SessionLocal()
    try:
        total_runs = db.query(WorkflowRun).count()
        completed_runs = db.query(WorkflowRun).filter(WorkflowRun.status == "completed").count()
        rejected_runs = db.query(WorkflowRun).filter(WorkflowRun.status == "rejected").count()
        pending_approvals = db.query(Approval).filter(Approval.status == "pending").count()
        total_artifacts = db.query(Artifact).count()
        total_plugins = db.query(Plugin).count()
        enabled_plugins = db.query(Plugin).filter(Plugin.state == "enabled").count()
        return {
            "total_runs": total_runs,
            "completed_runs": completed_runs,
            "rejected_runs": rejected_runs,
            "pending_approvals": pending_approvals,
            "total_artifacts": total_artifacts,
            "total_plugins": total_plugins,
            "enabled_plugins": enabled_plugins,
            "completion_rate": round(completed_runs / total_runs, 4) if total_runs else 0,
            "total_outcomes": len(list_outcomes()),
            "total_kpis": len(list_kpis()),
            "total_initiatives": len(list_initiatives()),
            "total_experiments": len(list_experiments()),
            "total_failures": len(list_failures()),
        }
    finally:
        db.close()


@app.post("/context/retrieve")
async def retrieve_context(request: ContextRequest) -> dict:
    context = await context_client.retrieve(
        workspace=request.workspace,
        role=request.role,
        query=request.query,
        max_chunks=request.max_chunks,
    )
    return {
        "workspace": request.workspace,
        "role": request.role,
        "query": request.query,
        "context": context,
    }


@app.get("/context/workspaces")
def context_workspaces() -> dict:
    return {
        "roots": [
            "viking://resources/complicore/",
            "viking://resources/livily/",
            "viking://resources/zelloo/",
            "viking://resources/personal/",
            "viking://user/memories/",
            "viking://agent/skills/",
            "viking://agent/memories/",
        ]
    }


# ---------------- Plugin lifecycle ----------------
@app.get("/plugins")
def plugins_list() -> list[dict]:
    return list_plugins()


@app.get("/plugins/{name}")
def plugin_inspect(name: str) -> dict:
    details = get_plugin_details(name)
    if not details:
        raise HTTPException(status_code=404, detail="Plugin not found")
    return details


@app.post("/plugins/register")
def plugin_register(request: PluginRegisterRequest) -> dict:
    plugin = register_plugin(
        name=request.name,
        source_type=request.source_type,
        source_url=request.source_url,
        owner=request.owner,
        trust_level=request.trust_level,
        state=request.state,
    )
    add_plugin_version(plugin["id"], request.version, request.checksum, {"source_url": request.source_url})
    return {"status": "ok", "plugin": plugin}


@app.post("/plugins/{name}/permissions")
def plugin_permissions(name: str, request: PluginPermissionsRequest) -> dict:
    plugin = get_plugin_by_name(name)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    permissions = set_plugin_permissions(plugin["id"], request.permissions)
    return {"status": "ok", "permissions": permissions}


@app.post("/plugins/{name}/install")
def plugin_install(name: str, request: PluginInstallRequest) -> dict:
    plugin = get_plugin_by_name(name)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")

    if plugin["state"] not in {"approved", "enabled"}:
        raise HTTPException(status_code=409, detail="Plugin must be approved before installation")

    installation = install_plugin(
        plugin_id=plugin["id"],
        workspace=request.workspace,
        role=request.role,
        install_path=request.install_path,
        installed_by=request.installed_by,
    )
    return {"status": "ok", "installation": installation}


@app.post("/plugins/{name}/review")
def plugin_review(name: str, request: PluginReviewRequest) -> dict:
    plugin = get_plugin_by_name(name)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    review = add_plugin_review(plugin["id"], request.reviewer, request.status, request.notes, request.checklist_json)
    return {"status": "ok", "review": review}


@app.post("/plugins/{name}/approve")
def plugin_approve(name: str, request: PluginStateRequest) -> dict:
    plugin = get_plugin_by_name(name)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    updated = set_plugin_state(plugin["id"], "approved", request.changed_by, request.reason)
    return {"status": "ok", "plugin": updated}


@app.post("/plugins/{name}/quarantine")
def plugin_quarantine(name: str, request: PluginStateRequest) -> dict:
    plugin = get_plugin_by_name(name)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    updated = set_plugin_state(plugin["id"], "quarantined", request.changed_by, request.reason)
    return {"status": "ok", "plugin": updated}


@app.post("/plugins/{name}/disable")
def plugin_disable(name: str, request: PluginStateRequest) -> dict:
    plugin = get_plugin_by_name(name)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found")
    updated = set_plugin_state(plugin["id"], "disabled", request.changed_by, request.reason)
    return {"status": "ok", "plugin": updated}


@app.post("/plugins/{name}/enable")
def plugin_enable(name: str, request: PluginStateRequest) -> dict:
    details = get_plugin_details(name)
    if not details:
        raise HTTPException(status_code=404, detail="Plugin not found")

    allowed, violations = evaluate_plugin_enable_policy(details["plugin"], details)
    if not allowed:
        raise HTTPException(status_code=409, detail={"policy_violations": violations})

    updated = set_plugin_state(details["plugin"]["id"], "enabled", request.changed_by, request.reason)
    return {"status": "ok", "plugin": updated}


@app.post("/plugins/validate")
def plugin_validate(request: PluginValidateRequest) -> dict:
    try:
        validated = validate_plugin_manifest(Path(request.plugin_path))
        return {
            "status": "ok",
            "plugin": validated["manifest"]["name"],
            "commands": validated["commands"],
            "skills": sorted(validated["skill_handlers"].keys()),
            "manifest_hash": validated["manifest_hash"],
        }
    except PluginValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/plugins/load")
def plugins_load() -> dict:
    return load_plugins_into_registry()


@app.post("/plugins/dispatch")
async def plugins_dispatch(request: PluginDispatchRequest) -> dict:
    try:
        return await dispatch_plugin_command(
            command_name=request.command,
            workspace=request.workspace,
            role=request.role,
            objective=request.objective,
            constraints=request.constraints,
            timeout_s=request.timeout_s,
        )
    except PluginValidationError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


# ---------------- Business outcomes and KPI registry ----------------
@app.get("/outcomes")
def outcomes_list(workspace: str | None = None) -> list[dict]:
    return list_outcomes(workspace=workspace)


@app.post("/outcomes")
def outcomes_create(request: OutcomeCreateRequest) -> dict:
    outcome = create_outcome(
        workspace=request.workspace,
        outcome_type=request.outcome_type,
        project=request.project,
        campaign=request.campaign,
        opportunity=request.opportunity,
        value=request.value,
        confidence=request.confidence,
        source=request.source,
        details_json=request.details_json,
    )
    return {"status": "ok", "outcome": outcome}


@app.get("/kpis")
def kpis_list(workspace: str | None = None) -> list[dict]:
    return list_kpis(workspace=workspace)


@app.post("/kpis")
def kpis_create(request: KpiCreateRequest) -> dict:
    kpi = create_kpi(
        workspace=request.workspace,
        name=request.name,
        owner_role=request.owner_role,
        target=request.target,
        current=request.current,
        period=request.period,
        source=request.source,
        status=request.status,
    )
    return {"status": "ok", "kpi": kpi}


@app.get("/initiatives")
def initiatives_list(workspace: str | None = None) -> list[dict]:
    return list_initiatives(workspace=workspace)


@app.post("/initiatives")
def initiatives_create(request: InitiativeCreateRequest) -> dict:
    initiative = create_initiative(
        workspace=request.workspace,
        name=request.name,
        owner=request.owner,
        status=request.status,
        effort=request.effort,
        upside=request.upside,
        urgency=request.urgency,
        confidence=request.confidence,
    )
    return {"status": "ok", "initiative": initiative}


@app.get("/experiments")
def experiments_list(workspace: str | None = None) -> list[dict]:
    return list_experiments(workspace=workspace)


@app.post("/experiments")
def experiments_create(request: ExperimentCreateRequest) -> dict:
    experiment = create_experiment(
        workspace=request.workspace,
        name=request.name,
        hypothesis=request.hypothesis,
        success_metric=request.success_metric,
        variant=request.variant,
        status=request.status,
        result=request.result,
        decision=request.decision,
    )
    return {"status": "ok", "experiment": experiment}


@app.get("/failures")
def failures_list(workspace: str | None = None) -> list[dict]:
    return list_failures(workspace=workspace)


@app.post("/failures")
def failures_create(request: FailureCreateRequest) -> dict:
    failure = create_failure(
        workspace=request.workspace,
        failure_type=request.failure_type,
        project=request.project,
        root_cause=request.root_cause,
        cost=request.cost,
        fix=request.fix,
        repeat_risk=request.repeat_risk,
    )
    return {"status": "ok", "failure": failure}
