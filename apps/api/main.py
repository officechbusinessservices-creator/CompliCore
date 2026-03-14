from __future__ import annotations

from pathlib import Path
import json
from datetime import datetime, timezone

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
    create_account,
    create_action,
    create_action_policy,
    create_cadence_rule,
    create_connector,
    create_contact,
    create_experiment,
    create_failure,
    create_initiative,
    create_kpi,
    create_opportunity,
    create_outcome,
    attach_sequence_contact,
    create_escalation,
    create_playbook,
    create_program,
    create_program_scorecard,
    create_sequence,
    create_trigger,
    list_escalations,
    list_playbooks,
    list_program_scorecards,
    list_programs,
    list_sequences,
    list_triggers,
    create_recurring_action,
    create_reminder,
    create_schedule,
    decide_approval,
    execute_action,
    get_approval,
    get_plugin_by_name,
    get_plugin_details,
    install_plugin,
    list_accounts,
    list_action_policies,
    list_actions,
    list_connectors,
    list_contacts,
    list_experiments,
    list_failures,
    list_initiatives,
    list_kpis,
    list_opportunities,
    list_outcomes,
    list_plugins,
    list_recurring_actions,
    list_reminders,
    list_schedules,
    mark_opportunity_activity,
    register_plugin,
    resolve_action_policy,
    set_plugin_permissions,
    set_plugin_state,
    write_artifact,
    write_audit,
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


@app.get("/fleet/model")
def fleet_model() -> dict:
    model_path = Path("configs/fleet_operating_model.json")
    if not model_path.exists():
        raise HTTPException(status_code=404, detail="Fleet operating model not found")
    try:
        return json.loads(model_path.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to read fleet model: {exc}") from exc


@app.get("/runs")
def list_runs() -> list[dict]:
    db = SessionLocal()
    try:
        rows = db.query(WorkflowRun).order_by(WorkflowRun.created_at.desc()).all()
        output = []
        for r in rows:
            latest_step = (
                db.query(WorkflowStep)
                .filter(WorkflowStep.run_id == r.id)
                .order_by(WorkflowStep.created_at.desc())
                .first()
            )
            pending_approval = (
                db.query(Approval)
                .filter(Approval.run_id == r.id, Approval.status == "pending")
                .first()
            )
            latest_artifact = (
                db.query(Artifact)
                .filter(Artifact.run_id == r.id)
                .order_by(Artifact.created_at.desc())
                .first()
            )
            output.append(
                {
                    "id": str(r.id),
                    "workflow_name": r.workflow_name,
                    "status": r.status,
                    "role": r.role,
                    "workspace": r.workspace,
                    "current_stage": latest_step.step_name if latest_step else "pending",
                    "waiting_for_approval": pending_approval is not None,
                    "artifact_link": latest_artifact.markdown_path if latest_artifact else None,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                    "last_updated": r.updated_at.isoformat() if r.updated_at else (r.created_at.isoformat() if r.created_at else None),
                }
            )
        return output
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


@app.get("/artifacts")
def list_artifacts() -> list[dict]:
    db = SessionLocal()
    try:
        rows = db.query(Artifact).order_by(Artifact.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "run_id": str(r.run_id),
                "artifact_type": r.artifact_type,
                "file_path": r.file_path,
                "markdown_path": r.markdown_path,
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


class AccountCreateRequest(BaseModel):
    workspace: str = "complicore"
    name: str
    status: str = "active"


class ContactCreateRequest(BaseModel):
    workspace: str = "complicore"
    full_name: str
    email: str | None = None
    role: str | None = None
    account_id: str | None = None


class OpportunityCreateRequest(BaseModel):
    workspace: str = "complicore"
    name: str
    stage: str = "discovery"
    next_step: str | None = None
    estimated_value: str | None = None
    account_id: str | None = None
    contact_id: str | None = None


class ConnectorCreateRequest(BaseModel):
    connector_type: str
    workspace: str = "complicore"
    connector_scope: str = "workspace"
    status: str = "enabled"
    auth_state: str = "connected"
    permissions_json: dict | None = None


class ActionPolicyCreateRequest(BaseModel):
    action_type: str
    workspace: str = "global"
    role: str = "global"
    auto_execute: bool = False
    approval_required: bool = True
    allowed_connector: str | None = None
    max_daily_limit: int = 25


class ActionCreateRequest(BaseModel):
    action_type: str
    action_target: str
    workspace: str = "complicore"
    role: str = "operator"
    connector_type: str | None = None


class ActionDecisionRequest(BaseModel):
    approved: bool = True
    decided_by: str = "operator"


class FollowupDraftSendRequest(BaseModel):
    workspace: str = "complicore"
    role: str = "sales"
    opportunity_id: str
    contact_id: str | None = None
    connector_type: str = "email"
    send_now: bool = False
    message_goal: str = "Advance opportunity"


class ScheduleCreateRequest(BaseModel):
    workspace: str = "complicore"
    role: str = "operator"
    schedule_type: str
    payload_json: dict | None = None
    next_run_at: str | None = None


class ReminderCreateRequest(BaseModel):
    workspace: str = "complicore"
    role: str = "operator"
    message: str
    due_at: str


class CadenceRuleCreateRequest(BaseModel):
    workspace: str = "complicore"
    role: str = "operator"
    rule_name: str
    frequency: str = "weekly"
    action_type: str
    active: bool = True


class RecurringActionCreateRequest(BaseModel):
    cadence_rule_id: str
    action_type: str
    workspace: str = "complicore"
    role: str = "operator"
    next_due_at: str | None = None


@app.get("/accounts")
def accounts_list(workspace: str | None = None) -> list[dict]:
    return list_accounts(workspace=workspace)


@app.post("/accounts")
def accounts_create(request: AccountCreateRequest) -> dict:
    return {"status": "ok", "account": create_account(request.workspace, request.name, request.status)}


@app.get("/contacts")
def contacts_list(workspace: str | None = None) -> list[dict]:
    return list_contacts(workspace=workspace)


@app.post("/contacts")
def contacts_create(request: ContactCreateRequest) -> dict:
    return {
        "status": "ok",
        "contact": create_contact(
            workspace=request.workspace,
            full_name=request.full_name,
            email=request.email,
            role=request.role,
            account_id=request.account_id,
        ),
    }


@app.get("/opportunities")
def opportunities_list(workspace: str | None = None) -> list[dict]:
    return list_opportunities(workspace=workspace)


@app.post("/opportunities")
def opportunities_create(request: OpportunityCreateRequest) -> dict:
    return {
        "status": "ok",
        "opportunity": create_opportunity(
            workspace=request.workspace,
            name=request.name,
            stage=request.stage,
            next_step=request.next_step,
            estimated_value=request.estimated_value,
            account_id=request.account_id,
            contact_id=request.contact_id,
        ),
    }


@app.get("/connectors")
def connectors_list(workspace: str | None = None) -> list[dict]:
    return list_connectors(workspace=workspace)


@app.post("/connectors")
def connectors_create(request: ConnectorCreateRequest) -> dict:
    return {
        "status": "ok",
        "connector": create_connector(
            connector_type=request.connector_type,
            workspace=request.workspace,
            connector_scope=request.connector_scope,
            status=request.status,
            auth_state=request.auth_state,
            permissions_json=request.permissions_json,
        ),
    }


@app.get("/action-policies")
def action_policies_list(workspace: str | None = None, role: str | None = None) -> list[dict]:
    return list_action_policies(workspace=workspace, role=role)


@app.post("/action-policies")
def action_policies_create(request: ActionPolicyCreateRequest) -> dict:
    return {
        "status": "ok",
        "policy": create_action_policy(
            action_type=request.action_type,
            workspace=request.workspace,
            role=request.role,
            auto_execute=request.auto_execute,
            approval_required=request.approval_required,
            allowed_connector=request.allowed_connector,
            max_daily_limit=request.max_daily_limit,
        ),
    }


@app.get("/actions")
def actions_list(workspace: str | None = None, status: str | None = None) -> list[dict]:
    return list_actions(workspace=workspace, status=status)


@app.post("/actions")
def actions_create(request: ActionCreateRequest) -> dict:
    policy = resolve_action_policy(request.action_type, request.workspace, request.role)
    requires_approval = True if not policy else policy["approval_required"]
    action_status = "pending_approval" if requires_approval else "ready"
    action = create_action(
        action_type=request.action_type,
        action_target=request.action_target,
        workspace=request.workspace,
        role=request.role,
        connector_type=request.connector_type,
        requires_approval=requires_approval,
        status=action_status,
    )
    if policy and policy["auto_execute"] and not requires_approval:
        executed = execute_action(action["id"], executed_by="policy:auto")
        return {"status": "ok", "action": executed, "policy": policy}
    return {"status": "ok", "action": action, "policy": policy}


@app.post("/actions/{action_id}/decision")
def action_decision(action_id: str, request: ActionDecisionRequest) -> dict:
    action = execute_action(action_id, executed_by=request.decided_by, approved=request.approved)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return {"status": "ok", "action": action}


@app.post("/workflows/followup-draft-and-send")
def followup_draft_and_send(request: FollowupDraftSendRequest) -> dict:
    opportunities = {item["id"]: item for item in list_opportunities(request.workspace)}
    opportunity = opportunities.get(request.opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    draft = {
        "subject": f"Quick follow-up on {opportunity['name']}",
        "body": (
            f"Hi, following up regarding {opportunity['name']}. "
            f"Goal: {request.message_goal}. "
            "Would next week work for a quick alignment call?"
        ),
    }

    artifact = write_artifact(
        run_id=str(uuid.uuid4()),
        artifact_name="sales-followup-draft",
        result={
            "status": "drafted",
            "summary": draft["subject"],
            "next_actions": ["Review draft", "Approve send", "Track reply"],
            "draft": draft,
            "opportunity_id": request.opportunity_id,
            "contact_id": request.contact_id,
        },
    )

    policy = resolve_action_policy("email_send", request.workspace, request.role)
    requires_approval = True if not policy else policy["approval_required"]
    status = "pending_approval" if requires_approval else "ready"

    action = create_action(
        action_type="email_send",
        action_target=request.opportunity_id,
        workspace=request.workspace,
        role=request.role,
        connector_type=request.connector_type,
        requires_approval=requires_approval,
        status=status,
        artifact_id=artifact["artifact_id"],
        result_json={"draft": draft},
    )

    updated_opp = None
    if request.send_now and (not requires_approval or (policy and policy.get("auto_execute"))):
        action = execute_action(action["id"], executed_by="workflow:followup-draft-and-send", approved=True) or action
        updated_opp = mark_opportunity_activity(
            opportunity_id=request.opportunity_id,
            stage="contacted",
            next_step="Await response",
        )

    write_audit(
        "workflow",
        "followup-draft-and-send",
        "workflow_completed",
        {
            "opportunity_id": request.opportunity_id,
            "action_id": action["id"],
            "requires_approval": requires_approval,
        },
    )

    return {
        "status": "ok",
        "draft": draft,
        "artifact": artifact,
        "action": action,
        "policy": policy,
        "opportunity": updated_opp,
    }


@app.get("/schedules")
def schedules_list(workspace: str | None = None) -> list[dict]:
    return list_schedules(workspace=workspace)


@app.post("/schedules")
def schedules_create(request: ScheduleCreateRequest) -> dict:
    next_run = datetime.fromisoformat(request.next_run_at) if request.next_run_at else None
    return {
        "status": "ok",
        "schedule": create_schedule(request.workspace, request.role, request.schedule_type, request.payload_json, next_run),
    }


@app.get("/reminders")
def reminders_list(workspace: str | None = None, status: str | None = None) -> list[dict]:
    return list_reminders(workspace=workspace, status=status)


@app.post("/reminders")
def reminders_create(request: ReminderCreateRequest) -> dict:
    due_at = datetime.fromisoformat(request.due_at)
    return {"status": "ok", "reminder": create_reminder(request.workspace, request.role, request.message, due_at)}


@app.post("/cadence-rules")
def cadence_rules_create(request: CadenceRuleCreateRequest) -> dict:
    return {
        "status": "ok",
        "rule": create_cadence_rule(
            workspace=request.workspace,
            role=request.role,
            rule_name=request.rule_name,
            frequency=request.frequency,
            action_type=request.action_type,
            active=request.active,
        ),
    }


@app.get("/recurring-actions")
def recurring_actions_list(workspace: str | None = None) -> list[dict]:
    return list_recurring_actions(workspace=workspace)


@app.post("/recurring-actions")
def recurring_actions_create(request: RecurringActionCreateRequest) -> dict:
    next_due = datetime.fromisoformat(request.next_due_at) if request.next_due_at else None
    return {
        "status": "ok",
        "recurring_action": create_recurring_action(
            cadence_rule_id=request.cadence_rule_id,
            action_type=request.action_type,
            workspace=request.workspace,
            role=request.role,
            next_due_at=next_due,
        ),
    }


@app.get("/actions/dashboard")
def actions_dashboard(workspace: str = "complicore") -> dict:
    actions = list_actions(workspace=workspace)
    reminders = list_reminders(workspace=workspace)
    connectors = list_connectors(workspace=workspace)
    return {
        "workspace": workspace,
        "actions_pending_approval": [a for a in actions if a["status"] == "pending_approval"],
        "drafts_ready": [a for a in actions if a["status"] in {"draft", "ready"}],
        "sends_completed": [a for a in actions if a["status"] == "completed" and a["action_type"] == "email_send"],
        "failed_executions": [a for a in actions if a["status"] in {"failed", "rejected"}],
        "overdue_followups": [r for r in reminders if r["status"] == "pending" and r["due_at"] and r["due_at"] < datetime.now(timezone.utc).isoformat()],
        "connector_health": connectors,
    }


class ProgramCreateRequest(BaseModel):
    name: str
    program_type: str
    workspace: str = "complicore"
    owner_role: str = "operator"
    status: str = "active"
    goal: str
    kpi: str | None = None
    cadence: str = "weekly"
    policy_profile: str = "standard"


class PlaybookCreateRequest(BaseModel):
    name: str
    workspace: str = "complicore"
    role: str = "operator"
    trigger: str
    success_condition: str
    failure_path: str | None = None
    steps: list[dict] = []


class TriggerCreateRequest(BaseModel):
    trigger_type: str
    trigger_condition: str
    target_program_id: str
    enabled: bool = True


class SequenceCreateRequest(BaseModel):
    name: str
    workspace: str = "complicore"
    role: str = "sales"
    exit_condition: str | None = None
    next_action_at: str | None = None
    steps: list[dict] = []


class SequenceContactRequest(BaseModel):
    contact_id: str
    opportunity_id: str | None = None
    state: str = "active"


class EscalationCreateRequest(BaseModel):
    workspace: str = "complicore"
    reason: str
    level: str = "medium"
    owner: str = "operator"
    due_at: str | None = None
    resolution: str | None = None


class ProgramScorecardCreateRequest(BaseModel):
    program_id: str
    objective: str
    metrics_json: dict | None = None
    health: str = "green"
    blockers_json: list | None = None
    next_actions_json: list | None = None


class PartnershipProgramRequest(BaseModel):
    workspace: str = "complicore"
    owner_role: str = "cro"


@app.get("/programs")
def programs_list(workspace: str | None = None) -> list[dict]:
    return list_programs(workspace=workspace)


@app.post("/programs")
def programs_create(request: ProgramCreateRequest) -> dict:
    program = create_program(
        name=request.name,
        program_type=request.program_type,
        workspace=request.workspace,
        owner_role=request.owner_role,
        status=request.status,
        goal=request.goal,
        kpi=request.kpi,
        cadence=request.cadence,
        policy_profile=request.policy_profile,
    )
    return {"status": "ok", "program": program}


@app.get("/playbooks")
def playbooks_list(workspace: str | None = None) -> list[dict]:
    return list_playbooks(workspace=workspace)


@app.post("/playbooks")
def playbooks_create(request: PlaybookCreateRequest) -> dict:
    playbook = create_playbook(
        name=request.name,
        workspace=request.workspace,
        role=request.role,
        trigger=request.trigger,
        success_condition=request.success_condition,
        failure_path=request.failure_path,
        steps=request.steps,
    )
    return {"status": "ok", "playbook": playbook}


@app.get("/triggers")
def triggers_list(target_program_id: str | None = None) -> list[dict]:
    return list_triggers(target_program_id=target_program_id)


@app.post("/triggers")
def triggers_create(request: TriggerCreateRequest) -> dict:
    trigger = create_trigger(
        trigger_type=request.trigger_type,
        trigger_condition=request.trigger_condition,
        target_program_id=request.target_program_id,
        enabled=request.enabled,
    )
    return {"status": "ok", "trigger": trigger}


@app.get("/sequences")
def sequences_list(workspace: str | None = None) -> list[dict]:
    return list_sequences(workspace=workspace)


@app.post("/sequences")
def sequences_create(request: SequenceCreateRequest) -> dict:
    sequence = create_sequence(
        name=request.name,
        workspace=request.workspace,
        role=request.role,
        exit_condition=request.exit_condition,
        next_action_at=datetime.fromisoformat(request.next_action_at) if request.next_action_at else None,
        steps=request.steps,
    )
    return {"status": "ok", "sequence": sequence}


@app.post("/sequences/{sequence_id}/contacts")
def sequence_attach_contact(sequence_id: str, request: SequenceContactRequest) -> dict:
    assignment = attach_sequence_contact(
        sequence_id=sequence_id,
        contact_id=request.contact_id,
        opportunity_id=request.opportunity_id,
        state=request.state,
    )
    return {"status": "ok", "assignment": assignment}


@app.get("/escalations")
def escalations_list(workspace: str | None = None, status: str | None = None) -> list[dict]:
    return list_escalations(workspace=workspace, status=status)


@app.post("/escalations")
def escalations_create(request: EscalationCreateRequest) -> dict:
    escalation = create_escalation(
        workspace=request.workspace,
        reason=request.reason,
        level=request.level,
        owner=request.owner,
        due_at=datetime.fromisoformat(request.due_at) if request.due_at else None,
        resolution=request.resolution,
    )
    return {"status": "ok", "escalation": escalation}


@app.get("/program-scorecards")
def program_scorecards_list(program_id: str | None = None) -> list[dict]:
    return list_program_scorecards(program_id=program_id)


@app.post("/program-scorecards")
def program_scorecards_create(request: ProgramScorecardCreateRequest) -> dict:
    scorecard = create_program_scorecard(
        program_id=request.program_id,
        objective=request.objective,
        metrics_json=request.metrics_json,
        health=request.health,
        blockers_json=request.blockers_json,
        next_actions_json=request.next_actions_json,
    )
    return {"status": "ok", "scorecard": scorecard}


@app.post("/programs/partnership-advancement/run")
def run_partnership_advancement_program(request: PartnershipProgramRequest) -> dict:
    programs = [p for p in list_programs(workspace=request.workspace) if p["program_type"] == "partnership-advancement"]
    if programs:
        program = programs[0]
    else:
        program = create_program(
            name="partnership-advancement-program",
            program_type="partnership-advancement",
            workspace=request.workspace,
            owner_role=request.owner_role,
            status="active",
            goal="Advance stalled partnership opportunities",
            kpi="opportunities_advanced",
            cadence="weekly",
            policy_profile="revenue-controlled",
        )

    opportunities = list_opportunities(workspace=request.workspace)
    stalled = [o for o in opportunities if o.get("stage") in {"discovery", "proposal"}]
    actions_created = []
    escalations_created = []

    for opp in stalled[:10]:
        action = create_action(
            action_type="email_send",
            action_target=opp["id"],
            workspace=request.workspace,
            role="sales",
            connector_type="email",
            requires_approval=True,
            status="pending_approval",
            result_json={"reason": "partnership_advancement", "opportunity": opp["name"]},
        )
        actions_created.append(action)

        if opp.get("risk_flag") in {"high", "stalled"}:
            escalations_created.append(
                create_escalation(
                    workspace=request.workspace,
                    reason=f"Opportunity at risk: {opp['name']}",
                    level="high",
                    owner=request.owner_role,
                    due_at=datetime.now(timezone.utc),
                )
            )

    scorecard = create_program_scorecard(
        program_id=program["id"],
        objective="Move stalled opportunities forward this cycle",
        metrics_json={
            "opportunities_reviewed": len(opportunities),
            "stalled_detected": len(stalled),
            "actions_created": len(actions_created),
        },
        health="green" if stalled else "amber",
        blockers_json=[f"{item['name']} waiting approval" for item in stalled[:5]],
        next_actions_json=["Approve queued sends", "Track responses", "Update stage after outreach"],
    )

    write_audit(
        "program",
        "partnership-advancement-program",
        "program_run_completed",
        {
            "workspace": request.workspace,
            "program_id": program["id"],
            "actions_created": len(actions_created),
            "escalations_created": len(escalations_created),
        },
    )

    return {
        "status": "ok",
        "program": program,
        "stalled_opportunities": stalled,
        "actions_created": actions_created,
        "escalations_created": escalations_created,
        "scorecard": scorecard,
    }
