import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from packages.shared.db import SessionLocal
from packages.shared.models import Approval, Artifact, AuditEvent, WorkflowRun, WorkflowStep

ARTIFACTS_DIR = Path("artifacts")
from packages.shared.models import (
    Account,
    Action,
    ActionPolicy,
    Approval,
    Artifact,
    AuditEvent,
    CadenceRule,
    Connector,
    Contact,
    Escalation,
    Approval,
    Artifact,
    AuditEvent,
    Experiment,
    Failure,
    Initiative,
    KPI,
    Opportunity,
    Outcome,
    Plugin,
    PluginInstallation,
    PluginPermission,
    PluginReview,
    PluginState,
    Playbook,
    PlaybookStep,
    PluginVersion,
    Program,
    ProgramScorecard,
    RecurringAction,
    Reminder,
    Schedule,
    Sequence,
    SequenceContact,
    SequenceStep,
    Trigger,
    WorkflowRun,
    WorkflowStep,
    WorkerHeartbeat,
)

ARTIFACTS_DIR = Path("artifacts")
    PluginVersion,
    WorkflowRun,
    WorkflowStep,
)

ARTIFACTS_DIR = Path("artifacts")
from packages.shared.models import Approval, Artifact, AuditEvent, WorkflowRun, WorkflowStep

ARTIFACTS_DIR = Path("artifacts")
import uuid

from packages.shared.db import SessionLocal
from packages.shared.models import AuditEvent, WorkflowRun, WorkflowStep


def create_workflow_run(workflow_name: str, payload: dict) -> str:
    db = SessionLocal()
    try:
        row = WorkflowRun(
            workflow_name=workflow_name,
            status="running",
            input_json=payload,
            role=payload.get("role", "operator"),
            workspace=payload.get("workspace", "default"),
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def create_workflow_step(
    run_id: str,
    agent_name: str,
    step_name: str,
    payload: dict,
    status: str = "completed",
) -> None:
def create_workflow_step(run_id: str, agent_name: str, step_name: str, payload: dict) -> None:
    db = SessionLocal()
    try:
        row = WorkflowStep(
            run_id=uuid.UUID(run_id),
            agent_name=agent_name,
            step_name=step_name,
            status=status,
            input_json=payload,
            output_json=payload,
            status="completed",
            input_json=payload,
        )
        db.add(row)
        db.commit()
    finally:
        db.close()


def write_audit(actor_type: str, actor_name: str, event_type: str, payload: dict) -> None:
    db = SessionLocal()
    try:
        row = AuditEvent(
            actor_type=actor_type,
            actor_name=actor_name,
            event_type=event_type,
            payload_json=payload,
        )
        db.add(row)
        db.commit()
    finally:
        db.close()


# ---------------- Workflow approvals ----------------
def request_approval(run_id: str, workflow_id: str, action_type: str, payload: dict) -> str:
    db = SessionLocal()
    try:
        row = Approval(
            run_id=uuid.UUID(run_id),
            workflow_id=workflow_id,
            action_type=action_type,
            status="pending",
            approved=False,
            payload_json=payload,
            decision_json=None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def decide_approval(approval_id: str, approved: bool, decided_by: str, reason: str | None = None) -> dict | None:
    db = SessionLocal()
    try:
        row = db.query(Approval).filter(Approval.id == uuid.UUID(approval_id)).first()
        if not row:
            return None
        row.status = "approved" if approved else "rejected"
        row.approved = approved
        row.decision_json = {
            "approved": approved,
            "decided_by": decided_by,
            "reason": reason,
            "decided_at": datetime.now(timezone.utc).isoformat(),
        }
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "run_id": str(row.run_id),
            "workflow_id": row.workflow_id,
            "status": row.status,
            "approved": row.approved,
            "action_type": row.action_type,
        }
    finally:
        db.close()


def get_approval(approval_id: str) -> dict | None:
    db = SessionLocal()
    try:
        row = db.query(Approval).filter(Approval.id == uuid.UUID(approval_id)).first()
        if not row:
            return None
        return {
            "id": str(row.id),
            "run_id": str(row.run_id),
            "workflow_id": row.workflow_id,
            "status": row.status,
            "approved": row.approved,
            "action_type": row.action_type,
            "payload_json": row.payload_json,
            "decision_json": row.decision_json,
        }
    finally:
        db.close()


def complete_workflow_run(run_id: str, output: dict, status: str = "completed") -> None:
def complete_workflow_run(run_id: str, output: dict) -> None:
    db = SessionLocal()
    try:
        row = db.query(WorkflowRun).filter(WorkflowRun.id == uuid.UUID(run_id)).first()
        if row:
            row.status = status
            row.status = "completed"
            row.output_json = output
            db.commit()
    finally:
        db.close()


def write_artifact(run_id: str, artifact_name: str, result: dict) -> dict:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    json_path = ARTIFACTS_DIR / f"{run_id}-{artifact_name}.json"
    md_path = ARTIFACTS_DIR / f"{run_id}-{artifact_name}.md"

    json_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    markdown = "\n".join(
        [
            f"# Artifact: {artifact_name}",
            "",
            f"Run ID: `{run_id}`",
            f"Status: `{result.get('status', 'unknown')}`",
            "",
            "## Summary",
            result.get("summary", "No summary available."),
            "",
            "## Next Actions",
            *[f"- {item}" for item in result.get("next_actions", [])],
        ]
    )
    md_path.write_text(markdown, encoding="utf-8")

    db = SessionLocal()
    try:
        row = Artifact(
            run_id=uuid.UUID(run_id),
            artifact_type="workflow_result",
            file_path=str(json_path),
            markdown_path=str(md_path),
            payload_json=result,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "artifact_id": str(row.id),
            "json_path": str(json_path),
            "markdown_path": str(md_path),
        }
    finally:
        db.close()


# ---------------- Plugin registry ----------------
def register_plugin(
    name: str,
    source_type: str,
    source_url: str | None,
    owner: str | None,
    trust_level: str = "unreviewed",
    state: str = "discovered",
) -> dict:
    db = SessionLocal()
    try:
        row = db.query(Plugin).filter(Plugin.name == name).first()
        if row:
            row.source_type = source_type
            row.source_url = source_url
            row.owner = owner
            row.trust_level = trust_level
            row.state = state
        else:
            row = Plugin(
                name=name,
                source_type=source_type,
                source_url=source_url,
                owner=owner,
                trust_level=trust_level,
                state=state,
            )
            db.add(row)
        db.commit()
        db.refresh(row)
        return plugin_to_dict(row)
    finally:
        db.close()


def add_plugin_version(plugin_id: str, version: str, checksum: str | None, manifest_json: dict | None) -> dict:
    db = SessionLocal()
    try:
        row = PluginVersion(
            plugin_id=uuid.UUID(plugin_id),
            version=version,
            checksum=checksum,
            manifest_json=manifest_json,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "plugin_id": str(row.plugin_id),
            "version": row.version,
            "checksum": row.checksum,
        }
    finally:
        db.close()


def set_plugin_state(plugin_id: str, state: str, changed_by: str, reason: str | None = None) -> dict | None:
    db = SessionLocal()
    try:
        plugin = db.query(Plugin).filter(Plugin.id == uuid.UUID(plugin_id)).first()
        if not plugin:
            return None
        plugin.state = state
        if state == "approved":
            plugin.trust_level = "reviewed"

        history = PluginState(
            plugin_id=plugin.id,
            state=state,
            reason=reason,
            changed_by=changed_by,
        )
        db.add(history)
        db.commit()
        db.refresh(plugin)
        return plugin_to_dict(plugin)
    finally:
        db.close()


def add_plugin_review(plugin_id: str, reviewer: str, status: str, notes: str | None, checklist_json: dict | None) -> dict:
    db = SessionLocal()
    try:
        row = PluginReview(
            plugin_id=uuid.UUID(plugin_id),
            reviewer=reviewer,
            status=status,
            notes=notes,
            checklist_json=checklist_json,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "plugin_id": str(row.plugin_id),
            "reviewer": row.reviewer,
            "status": row.status,
            "notes": row.notes,
            "created_at": row.created_at.isoformat() if row.created_at else None,
        }
    finally:
        db.close()


def set_plugin_permissions(plugin_id: str, permissions: list[dict]) -> list[dict]:
    db = SessionLocal()
    try:
        pid = uuid.UUID(plugin_id)
        db.query(PluginPermission).filter(PluginPermission.plugin_id == pid).delete()
        created = []
        for permission in permissions:
            row = PluginPermission(
                plugin_id=pid,
                permission_name=permission.get("permission_name", "unknown"),
                scope=permission.get("scope"),
                allowed=bool(permission.get("allowed", False)),
            )
            db.add(row)
            created.append(row)
        db.commit()
        return [
            {
                "permission_name": row.permission_name,
                "scope": row.scope,
                "allowed": row.allowed,
            }
            for row in created
        ]
    finally:
        db.close()


def install_plugin(
    plugin_id: str,
    workspace: str | None,
    role: str | None,
    install_path: str,
    installed_by: str,
    status: str = "installed",
) -> dict:
    db = SessionLocal()
    try:
        row = PluginInstallation(
            plugin_id=uuid.UUID(plugin_id),
            workspace=workspace,
            role=role,
            install_path=install_path,
            installed_by=installed_by,
            status=status,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "plugin_id": str(row.plugin_id),
            "workspace": row.workspace,
            "role": row.role,
            "install_path": row.install_path,
            "status": row.status,
        }
    finally:
        db.close()


def get_plugin_by_name(name: str) -> dict | None:
    db = SessionLocal()
    try:
        row = db.query(Plugin).filter(Plugin.name == name).first()
        return plugin_to_dict(row) if row else None
    finally:
        db.close()


def list_plugins() -> list[dict]:
    db = SessionLocal()
    try:
        rows = db.query(Plugin).order_by(Plugin.created_at.desc()).all()
        return [plugin_to_dict(r) for r in rows]
    finally:
        db.close()


def get_plugin_details(name: str) -> dict | None:
    db = SessionLocal()
    try:
        plugin = db.query(Plugin).filter(Plugin.name == name).first()
        if not plugin:
            return None
        pid = plugin.id
        versions = (
            db.query(PluginVersion)
            .filter(PluginVersion.plugin_id == pid)
            .order_by(PluginVersion.created_at.desc())
            .all()
        )
        states = (
            db.query(PluginState)
            .filter(PluginState.plugin_id == pid)
            .order_by(PluginState.created_at.desc())
            .all()
        )
        reviews = (
            db.query(PluginReview)
            .filter(PluginReview.plugin_id == pid)
            .order_by(PluginReview.created_at.desc())
            .all()
        )
        installations = (
            db.query(PluginInstallation)
            .filter(PluginInstallation.plugin_id == pid)
            .order_by(PluginInstallation.created_at.desc())
            .all()
        )
        permissions = db.query(PluginPermission).filter(PluginPermission.plugin_id == pid).all()

        return {
            "plugin": plugin_to_dict(plugin),
            "versions": [
                {
                    "version": v.version,
                    "checksum": v.checksum,
                    "created_at": v.created_at.isoformat() if v.created_at else None,
                }
                for v in versions
            ],
            "states": [
                {
                    "state": s.state,
                    "reason": s.reason,
                    "changed_by": s.changed_by,
                    "created_at": s.created_at.isoformat() if s.created_at else None,
                }
                for s in states
            ],
            "reviews": [
                {
                    "reviewer": r.reviewer,
                    "status": r.status,
                    "notes": r.notes,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in reviews
            ],
            "installations": [
                {
                    "workspace": i.workspace,
                    "role": i.role,
                    "install_path": i.install_path,
                    "status": i.status,
                    "installed_by": i.installed_by,
                    "created_at": i.created_at.isoformat() if i.created_at else None,
                }
                for i in installations
            ],
            "permissions": [
                {
                    "permission_name": p.permission_name,
                    "scope": p.scope,
                    "allowed": p.allowed,
                }
                for p in permissions
            ],
        }
    finally:
        db.close()


def plugin_to_dict(row: Plugin) -> dict:
    return {
        "id": str(row.id),
        "name": row.name,
        "source_type": row.source_type,
        "source_url": row.source_url,
        "trust_level": row.trust_level,
        "state": row.state,
        "owner": row.owner,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


# ---------------- Business registry ----------------
def create_outcome(
    workspace: str,
    outcome_type: str,
    project: str | None,
    campaign: str | None,
    opportunity: str | None,
    value: str | None,
    confidence: str,
    source: str | None,
    details_json: dict | None,
) -> dict:
    db = SessionLocal()
    try:
        row = Outcome(
            workspace=workspace,
            outcome_type=outcome_type,
            project=project,
            campaign=campaign,
            opportunity=opportunity,
            value=value,
            confidence=confidence,
            source=source,
            details_json=details_json,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return outcome_to_dict(row)
    finally:
        db.close()


def list_outcomes(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Outcome)
        if workspace:
            query = query.filter(Outcome.workspace == workspace)
        rows = query.order_by(Outcome.created_at.desc()).all()
        return [outcome_to_dict(row) for row in rows]
    finally:
        db.close()


def create_kpi(
    workspace: str,
    name: str,
    owner_role: str,
    target: str,
    current: str,
    period: str,
    source: str | None,
    status: str,
) -> dict:
    db = SessionLocal()
    try:
        row = KPI(
            workspace=workspace,
            name=name,
            owner_role=owner_role,
            target=target,
            current=current,
            period=period,
            source=source,
            status=status,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return kpi_to_dict(row)
    finally:
        db.close()


def list_kpis(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(KPI)
        if workspace:
            query = query.filter(KPI.workspace == workspace)
        rows = query.order_by(KPI.created_at.desc()).all()
        return [kpi_to_dict(row) for row in rows]
    finally:
        db.close()


def create_initiative(
    workspace: str,
    name: str,
    owner: str | None,
    status: str,
    effort: int,
    upside: int,
    urgency: int,
    confidence: int,
) -> dict:
    db = SessionLocal()
    try:
        score = max(1, upside * urgency * confidence) - effort
        row = Initiative(
            workspace=workspace,
            name=name,
            owner=owner,
            status=status,
            score=score,
            effort=effort,
            upside=upside,
            urgency=urgency,
            confidence=confidence,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return initiative_to_dict(row)
    finally:
        db.close()


def list_initiatives(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Initiative)
        if workspace:
            query = query.filter(Initiative.workspace == workspace)
        rows = query.order_by(Initiative.score.desc(), Initiative.created_at.desc()).all()
        return [initiative_to_dict(row) for row in rows]
    finally:
        db.close()


def create_experiment(
    workspace: str,
    name: str,
    hypothesis: str,
    success_metric: str,
    variant: str | None,
    status: str,
    result: str | None,
    decision: str | None,
) -> dict:
    db = SessionLocal()
    try:
        row = Experiment(
            workspace=workspace,
            name=name,
            hypothesis=hypothesis,
            success_metric=success_metric,
            variant=variant,
            status=status,
            result=result,
            decision=decision,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return experiment_to_dict(row)
    finally:
        db.close()


def list_experiments(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Experiment)
        if workspace:
            query = query.filter(Experiment.workspace == workspace)
        rows = query.order_by(Experiment.created_at.desc()).all()
        return [experiment_to_dict(row) for row in rows]
    finally:
        db.close()


def create_failure(
    workspace: str,
    failure_type: str,
    project: str | None,
    root_cause: str,
    cost: str | None,
    fix: str | None,
    repeat_risk: str,
) -> dict:
    db = SessionLocal()
    try:
        row = Failure(
            workspace=workspace,
            failure_type=failure_type,
            project=project,
            root_cause=root_cause,
            cost=cost,
            fix=fix,
            repeat_risk=repeat_risk,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return failure_to_dict(row)
    finally:
        db.close()


def list_failures(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Failure)
        if workspace:
            query = query.filter(Failure.workspace == workspace)
        rows = query.order_by(Failure.created_at.desc()).all()
        return [failure_to_dict(row) for row in rows]
    finally:
        db.close()


def outcome_to_dict(row: Outcome) -> dict:
    return {
        "id": str(row.id),
        "workspace": row.workspace,
        "outcome_type": row.outcome_type,
        "project": row.project,
        "campaign": row.campaign,
        "opportunity": row.opportunity,
        "value": row.value,
        "confidence": row.confidence,
        "source": row.source,
        "details_json": row.details_json,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


def kpi_to_dict(row: KPI) -> dict:
    return {
        "id": str(row.id),
        "workspace": row.workspace,
        "name": row.name,
        "owner_role": row.owner_role,
        "target": row.target,
        "current": row.current,
        "period": row.period,
        "source": row.source,
        "status": row.status,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


def initiative_to_dict(row: Initiative) -> dict:
    return {
        "id": str(row.id),
        "workspace": row.workspace,
        "name": row.name,
        "owner": row.owner,
        "status": row.status,
        "score": row.score,
        "effort": row.effort,
        "upside": row.upside,
        "urgency": row.urgency,
        "confidence": row.confidence,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


def experiment_to_dict(row: Experiment) -> dict:
    return {
        "id": str(row.id),
        "workspace": row.workspace,
        "name": row.name,
        "hypothesis": row.hypothesis,
        "success_metric": row.success_metric,
        "variant": row.variant,
        "status": row.status,
        "result": row.result,
        "decision": row.decision,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


def failure_to_dict(row: Failure) -> dict:
    return {
        "id": str(row.id),
        "workspace": row.workspace,
        "failure_type": row.failure_type,
        "project": row.project,
        "root_cause": row.root_cause,
        "cost": row.cost,
        "fix": row.fix,
        "repeat_risk": row.repeat_risk,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


def _iso(dt):
    return dt.isoformat() if dt else None


# ---------------- Revenue objects ----------------
def create_account(workspace: str, name: str, status: str = "active") -> dict:
    db = SessionLocal()
    try:
        row = Account(workspace=workspace, name=name, status=status)
        db.add(row)
        db.commit()
        db.refresh(row)
        return {"id": str(row.id), "workspace": row.workspace, "name": row.name, "status": row.status, "created_at": _iso(row.created_at)}
    finally:
        db.close()


def list_accounts(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Account)
        if workspace:
            query = query.filter(Account.workspace == workspace)
        rows = query.order_by(Account.created_at.desc()).all()
        return [{"id": str(r.id), "workspace": r.workspace, "name": r.name, "status": r.status, "created_at": _iso(r.created_at)} for r in rows]
    finally:
        db.close()


def create_contact(workspace: str, full_name: str, email: str | None, role: str | None, account_id: str | None = None) -> dict:
    db = SessionLocal()
    try:
        row = Contact(
            workspace=workspace,
            full_name=full_name,
            email=email,
            role=role,
            account_id=uuid.UUID(account_id) if account_id else None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "workspace": row.workspace,
            "account_id": str(row.account_id) if row.account_id else None,
            "full_name": row.full_name,
            "email": row.email,
            "role": row.role,
            "last_activity_at": _iso(row.last_activity_at),
            "created_at": _iso(row.created_at),
        }
    finally:
        db.close()


def list_contacts(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Contact)
        if workspace:
            query = query.filter(Contact.workspace == workspace)
        rows = query.order_by(Contact.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "workspace": r.workspace,
                "account_id": str(r.account_id) if r.account_id else None,
                "full_name": r.full_name,
                "email": r.email,
                "role": r.role,
                "last_activity_at": _iso(r.last_activity_at),
                "created_at": _iso(r.created_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def create_opportunity(
    workspace: str,
    name: str,
    stage: str = "discovery",
    next_step: str | None = None,
    estimated_value: str | None = None,
    account_id: str | None = None,
    contact_id: str | None = None,
) -> dict:
    db = SessionLocal()
    try:
        row = Opportunity(
            workspace=workspace,
            name=name,
            stage=stage,
            next_step=next_step,
            estimated_value=estimated_value,
            account_id=uuid.UUID(account_id) if account_id else None,
            contact_id=uuid.UUID(contact_id) if contact_id else None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return opportunity_to_dict(row)
    finally:
        db.close()


def list_opportunities(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Opportunity)
        if workspace:
            query = query.filter(Opportunity.workspace == workspace)
        rows = query.order_by(Opportunity.created_at.desc()).all()
        return [opportunity_to_dict(r) for r in rows]
    finally:
        db.close()


def mark_opportunity_activity(opportunity_id: str, stage: str | None = None, next_step: str | None = None, risk_flag: str | None = None) -> dict | None:
    db = SessionLocal()
    try:
        row = db.query(Opportunity).filter(Opportunity.id == uuid.UUID(opportunity_id)).first()
        if not row:
            return None
        row.last_activity_at = datetime.now(timezone.utc)
        if stage:
            row.stage = stage
        if next_step:
            row.next_step = next_step
        if risk_flag:
            row.risk_flag = risk_flag
        db.commit()
        db.refresh(row)
        return opportunity_to_dict(row)
    finally:
        db.close()


def opportunity_to_dict(row: Opportunity) -> dict:
    return {
        "id": str(row.id),
        "workspace": row.workspace,
        "account_id": str(row.account_id) if row.account_id else None,
        "contact_id": str(row.contact_id) if row.contact_id else None,
        "name": row.name,
        "stage": row.stage,
        "next_step": row.next_step,
        "estimated_value": row.estimated_value,
        "risk_flag": row.risk_flag,
        "last_activity_at": _iso(row.last_activity_at),
        "created_at": _iso(row.created_at),
    }


# ---------------- Controlled execution ----------------
def create_connector(
    connector_type: str,
    workspace: str,
    connector_scope: str,
    status: str,
    auth_state: str,
    permissions_json: dict | None,
) -> dict:
    db = SessionLocal()
    try:
        row = Connector(
            connector_type=connector_type,
            workspace=workspace,
            connector_scope=connector_scope,
            status=status,
            auth_state=auth_state,
            permissions_json=permissions_json,
            last_check_at=datetime.now(timezone.utc),
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return connector_to_dict(row)
    finally:
        db.close()


def list_connectors(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Connector)
        if workspace:
            query = query.filter(Connector.workspace == workspace)
        rows = query.order_by(Connector.created_at.desc()).all()
        return [connector_to_dict(r) for r in rows]
    finally:
        db.close()


def connector_to_dict(row: Connector) -> dict:
    return {
        "id": str(row.id),
        "connector_type": row.connector_type,
        "connector_scope": row.connector_scope,
        "workspace": row.workspace,
        "status": row.status,
        "auth_state": row.auth_state,
        "permissions_json": row.permissions_json,
        "last_check_at": _iso(row.last_check_at),
        "created_at": _iso(row.created_at),
    }


def create_action_policy(
    action_type: str,
    workspace: str,
    role: str,
    auto_execute: bool,
    approval_required: bool,
    allowed_connector: str | None,
    max_daily_limit: int,
) -> dict:
    db = SessionLocal()
    try:
        row = ActionPolicy(
            action_type=action_type,
            workspace=workspace,
            role=role,
            auto_execute=auto_execute,
            approval_required=approval_required,
            allowed_connector=allowed_connector,
            max_daily_limit=max_daily_limit,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return action_policy_to_dict(row)
    finally:
        db.close()


def list_action_policies(workspace: str | None = None, role: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(ActionPolicy)
        if workspace:
            query = query.filter(ActionPolicy.workspace.in_([workspace, "global"]))
        if role:
            query = query.filter(ActionPolicy.role.in_([role, "global"]))
        rows = query.order_by(ActionPolicy.created_at.desc()).all()
        return [action_policy_to_dict(r) for r in rows]
    finally:
        db.close()


def action_policy_to_dict(row: ActionPolicy) -> dict:
    return {
        "id": str(row.id),
        "action_type": row.action_type,
        "workspace": row.workspace,
        "role": row.role,
        "auto_execute": row.auto_execute,
        "approval_required": row.approval_required,
        "allowed_connector": row.allowed_connector,
        "max_daily_limit": row.max_daily_limit,
        "created_at": _iso(row.created_at),
    }


def resolve_action_policy(action_type: str, workspace: str, role: str) -> dict | None:
    candidates = list_action_policies(workspace=workspace, role=role)
    for policy in candidates:
        if policy["action_type"] == action_type and policy["workspace"] in {workspace, "global"} and policy["role"] in {role, "global"}:
            return policy
    return None


def create_action(
    action_type: str,
    action_target: str,
    workspace: str,
    role: str,
    connector_type: str | None,
    requires_approval: bool,
    status: str = "pending_approval",
    result_json: dict | None = None,
    artifact_id: str | None = None,
) -> dict:
    db = SessionLocal()
    try:
        row = Action(
            action_type=action_type,
            action_target=action_target,
            workspace=workspace,
            role=role,
            connector_type=connector_type,
            requires_approval=requires_approval,
            status=status,
            result_json=result_json,
            artifact_id=uuid.UUID(artifact_id) if artifact_id else None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return action_to_dict(row)
    finally:
        db.close()


def list_actions(workspace: str | None = None, status: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Action)
        if workspace:
            query = query.filter(Action.workspace == workspace)
        if status:
            query = query.filter(Action.status == status)
        rows = query.order_by(Action.created_at.desc()).all()
        return [action_to_dict(r) for r in rows]
    finally:
        db.close()


def action_to_dict(row: Action) -> dict:
    return {
        "id": str(row.id),
        "action_type": row.action_type,
        "action_target": row.action_target,
        "workspace": row.workspace,
        "role": row.role,
        "status": row.status,
        "requires_approval": row.requires_approval,
        "connector_type": row.connector_type,
        "result_json": row.result_json,
        "artifact_id": str(row.artifact_id) if row.artifact_id else None,
        "executed_at": _iso(row.executed_at),
        "created_at": _iso(row.created_at),
    }


def execute_action(action_id: str, executed_by: str, approved: bool = True) -> dict | None:
    db = SessionLocal()
    try:
        row = db.query(Action).filter(Action.id == uuid.UUID(action_id)).first()
        if not row:
            return None
        if row.requires_approval and not approved:
            row.status = "rejected"
            row.result_json = {"approved": False, "executed_by": executed_by}
        else:
            row.status = "completed"
            row.executed_at = datetime.now(timezone.utc)
            row.result_json = {
                "approved": approved,
                "executed_by": executed_by,
                "message": f"Simulated execution for {row.action_type} on {row.action_target}",
            }
        db.commit()
        db.refresh(row)
        write_audit("action", str(row.id), "action_executed" if row.status == "completed" else "action_rejected", row.result_json or {})
        return action_to_dict(row)
    finally:
        db.close()


def create_schedule(workspace: str, role: str, schedule_type: str, payload_json: dict | None, next_run_at: datetime | None) -> dict:
    db = SessionLocal()
    try:
        row = Schedule(workspace=workspace, role=role, schedule_type=schedule_type, payload_json=payload_json, next_run_at=next_run_at)
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "workspace": row.workspace,
            "role": row.role,
            "schedule_type": row.schedule_type,
            "payload_json": row.payload_json,
            "next_run_at": _iso(row.next_run_at),
            "status": row.status,
            "created_at": _iso(row.created_at),
        }
    finally:
        db.close()


def list_schedules(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Schedule)
        if workspace:
            query = query.filter(Schedule.workspace == workspace)
        rows = query.order_by(Schedule.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "workspace": r.workspace,
                "role": r.role,
                "schedule_type": r.schedule_type,
                "payload_json": r.payload_json,
                "next_run_at": _iso(r.next_run_at),
                "status": r.status,
                "created_at": _iso(r.created_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def create_reminder(workspace: str, role: str, message: str, due_at: datetime) -> dict:
    db = SessionLocal()
    try:
        row = Reminder(workspace=workspace, role=role, message=message, due_at=due_at)
        db.add(row)
        db.commit()
        db.refresh(row)
        return {"id": str(row.id), "workspace": row.workspace, "role": row.role, "message": row.message, "due_at": _iso(row.due_at), "status": row.status, "created_at": _iso(row.created_at)}
    finally:
        db.close()


def list_reminders(workspace: str | None = None, status: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Reminder)
        if workspace:
            query = query.filter(Reminder.workspace == workspace)
        if status:
            query = query.filter(Reminder.status == status)
        rows = query.order_by(Reminder.due_at.asc()).all()
        return [{"id": str(r.id), "workspace": r.workspace, "role": r.role, "message": r.message, "due_at": _iso(r.due_at), "status": r.status, "created_at": _iso(r.created_at)} for r in rows]
    finally:
        db.close()


def create_cadence_rule(workspace: str, role: str, rule_name: str, frequency: str, action_type: str, active: bool = True) -> dict:
    db = SessionLocal()
    try:
        row = CadenceRule(workspace=workspace, role=role, rule_name=rule_name, frequency=frequency, action_type=action_type, active=active)
        db.add(row)
        db.commit()
        db.refresh(row)
        return {"id": str(row.id), "workspace": row.workspace, "role": row.role, "rule_name": row.rule_name, "frequency": row.frequency, "action_type": row.action_type, "active": row.active, "created_at": _iso(row.created_at)}
    finally:
        db.close()


def create_recurring_action(cadence_rule_id: str, action_type: str, workspace: str, role: str, next_due_at: datetime | None) -> dict:
    db = SessionLocal()
    try:
        row = RecurringAction(
            cadence_rule_id=uuid.UUID(cadence_rule_id),
            action_type=action_type,
            workspace=workspace,
            role=role,
            next_due_at=next_due_at,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {"id": str(row.id), "cadence_rule_id": str(row.cadence_rule_id), "action_type": row.action_type, "workspace": row.workspace, "role": row.role, "status": row.status, "next_due_at": _iso(row.next_due_at), "created_at": _iso(row.created_at)}
    finally:
        db.close()


def list_recurring_actions(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(RecurringAction)
        if workspace:
            query = query.filter(RecurringAction.workspace == workspace)
        rows = query.order_by(RecurringAction.created_at.desc()).all()
        return [{"id": str(r.id), "cadence_rule_id": str(r.cadence_rule_id), "action_type": r.action_type, "workspace": r.workspace, "role": r.role, "status": r.status, "next_due_at": _iso(r.next_due_at), "created_at": _iso(r.created_at)} for r in rows]
    finally:
        db.close()


# ---------------- Program engines ----------------
def create_program(
    name: str,
    program_type: str,
    workspace: str,
    owner_role: str,
    goal: str,
    kpi: str | None,
    cadence: str,
    policy_profile: str,
    status: str = "active",
) -> dict:
    db = SessionLocal()
    try:
        row = Program(
            name=name,
            program_type=program_type,
            workspace=workspace,
            owner_role=owner_role,
            status=status,
            goal=goal,
            kpi=kpi,
            cadence=cadence,
            policy_profile=policy_profile,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "name": row.name,
            "program_type": row.program_type,
            "workspace": row.workspace,
            "owner_role": row.owner_role,
            "status": row.status,
            "goal": row.goal,
            "kpi": row.kpi,
            "cadence": row.cadence,
            "policy_profile": row.policy_profile,
            "created_at": _iso(row.created_at),
        }
    finally:
        db.close()


def list_programs(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Program)
        if workspace:
            query = query.filter(Program.workspace == workspace)
        rows = query.order_by(Program.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "name": r.name,
                "program_type": r.program_type,
                "workspace": r.workspace,
                "owner_role": r.owner_role,
                "status": r.status,
                "goal": r.goal,
                "kpi": r.kpi,
                "cadence": r.cadence,
                "policy_profile": r.policy_profile,
                "created_at": _iso(r.created_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def create_playbook(
    name: str,
    workspace: str,
    role: str,
    trigger: str,
    success_condition: str,
    failure_path: str | None,
    steps: list[dict],
) -> dict:
    db = SessionLocal()
    try:
        row = Playbook(
            name=name,
            workspace=workspace,
            role=role,
            trigger=trigger,
            success_condition=success_condition,
            failure_path=failure_path,
        )
        db.add(row)
        db.flush()
        for idx, step in enumerate(steps, start=1):
            db.add(
                PlaybookStep(
                    playbook_id=row.id,
                    step_order=step.get("step_order", idx),
                    step_name=step.get("step_name", f"step-{idx}"),
                    step_action_type=step.get("step_action_type", "task_create"),
                )
            )
        db.commit()
        db.refresh(row)
        return {"id": str(row.id), "name": row.name, "workspace": row.workspace, "role": row.role, "trigger": row.trigger}
    finally:
        db.close()


def list_playbooks(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Playbook)
        if workspace:
            query = query.filter(Playbook.workspace == workspace)
        rows = query.order_by(Playbook.created_at.desc()).all()
        output = []
        for row in rows:
            steps = (
                db.query(PlaybookStep)
                .filter(PlaybookStep.playbook_id == row.id)
                .order_by(PlaybookStep.step_order.asc())
                .all()
            )
            output.append(
                {
                    "id": str(row.id),
                    "name": row.name,
                    "workspace": row.workspace,
                    "role": row.role,
                    "trigger": row.trigger,
                    "success_condition": row.success_condition,
                    "failure_path": row.failure_path,
                    "steps": [
                        {
                            "id": str(step.id),
                            "step_order": step.step_order,
                            "step_name": step.step_name,
                            "step_action_type": step.step_action_type,
                        }
                        for step in steps
                    ],
                }
            )
        return output
    finally:
        db.close()


def create_trigger(trigger_type: str, trigger_condition: str, target_program_id: str, enabled: bool = True) -> dict:
    db = SessionLocal()
    try:
        row = Trigger(
            trigger_type=trigger_type,
            trigger_condition=trigger_condition,
            target_program_id=uuid.UUID(target_program_id),
            enabled=enabled,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "trigger_type": row.trigger_type,
            "trigger_condition": row.trigger_condition,
            "target_program_id": str(row.target_program_id),
            "enabled": row.enabled,
            "last_fired_at": _iso(row.last_fired_at),
        }
    finally:
        db.close()


def list_triggers(target_program_id: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Trigger)
        if target_program_id:
            query = query.filter(Trigger.target_program_id == uuid.UUID(target_program_id))
        rows = query.order_by(Trigger.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "trigger_type": r.trigger_type,
                "trigger_condition": r.trigger_condition,
                "target_program_id": str(r.target_program_id),
                "enabled": r.enabled,
                "last_fired_at": _iso(r.last_fired_at),
                "created_at": _iso(r.created_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def create_sequence(
    name: str,
    workspace: str,
    role: str,
    exit_condition: str | None,
    next_action_at: datetime | None,
    steps: list[dict],
) -> dict:
    db = SessionLocal()
    try:
        row = Sequence(
            name=name,
            workspace=workspace,
            role=role,
            exit_condition=exit_condition,
            next_action_at=next_action_at,
        )
        db.add(row)
        db.flush()
        for idx, step in enumerate(steps, start=1):
            db.add(
                SequenceStep(
                    sequence_id=row.id,
                    step_order=step.get("step_order", idx),
                    action_type=step.get("action_type", "email_send"),
                    template=step.get("template"),
                )
            )
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "name": row.name,
            "workspace": row.workspace,
            "role": row.role,
            "state": row.state,
            "next_action_at": _iso(row.next_action_at),
        }
    finally:
        db.close()


def attach_sequence_contact(sequence_id: str, contact_id: str, opportunity_id: str | None = None, state: str = "active") -> dict:
    db = SessionLocal()
    try:
        row = SequenceContact(
            sequence_id=uuid.UUID(sequence_id),
            contact_id=uuid.UUID(contact_id),
            opportunity_id=uuid.UUID(opportunity_id) if opportunity_id else None,
            state=state,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "sequence_id": str(row.sequence_id),
            "contact_id": str(row.contact_id),
            "opportunity_id": str(row.opportunity_id) if row.opportunity_id else None,
            "state": row.state,
        }
    finally:
        db.close()


def list_sequences(workspace: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Sequence)
        if workspace:
            query = query.filter(Sequence.workspace == workspace)
        rows = query.order_by(Sequence.created_at.desc()).all()
        out = []
        for row in rows:
            steps = db.query(SequenceStep).filter(SequenceStep.sequence_id == row.id).order_by(SequenceStep.step_order.asc()).all()
            contacts = db.query(SequenceContact).filter(SequenceContact.sequence_id == row.id).all()
            out.append(
                {
                    "id": str(row.id),
                    "name": row.name,
                    "workspace": row.workspace,
                    "role": row.role,
                    "state": row.state,
                    "next_action_at": _iso(row.next_action_at),
                    "exit_condition": row.exit_condition,
                    "steps": [
                        {
                            "id": str(s.id),
                            "step_order": s.step_order,
                            "action_type": s.action_type,
                            "template": s.template,
                        }
                        for s in steps
                    ],
                    "contacts": [
                        {
                            "id": str(c.id),
                            "contact_id": str(c.contact_id),
                            "opportunity_id": str(c.opportunity_id) if c.opportunity_id else None,
                            "state": c.state,
                        }
                        for c in contacts
                    ],
                }
            )
        return out
    finally:
        db.close()


def create_escalation(workspace: str, reason: str, level: str, owner: str, due_at: datetime | None, resolution: str | None = None) -> dict:
    db = SessionLocal()
    try:
        row = Escalation(
            workspace=workspace,
            reason=reason,
            level=level,
            owner=owner,
            due_at=due_at,
            resolution=resolution,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "workspace": row.workspace,
            "reason": row.reason,
            "level": row.level,
            "owner": row.owner,
            "due_at": _iso(row.due_at),
            "resolution": row.resolution,
            "status": row.status,
        }
    finally:
        db.close()


def list_escalations(workspace: str | None = None, status: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(Escalation)
        if workspace:
            query = query.filter(Escalation.workspace == workspace)
        if status:
            query = query.filter(Escalation.status == status)
        rows = query.order_by(Escalation.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "workspace": r.workspace,
                "reason": r.reason,
                "level": r.level,
                "owner": r.owner,
                "due_at": _iso(r.due_at),
                "resolution": r.resolution,
                "status": r.status,
                "created_at": _iso(r.created_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def create_program_scorecard(
    program_id: str,
    objective: str,
    metrics_json: dict | None,
    health: str,
    blockers_json: list | None,
    next_actions_json: list | None,
) -> dict:
    db = SessionLocal()
    try:
        row = ProgramScorecard(
            program_id=uuid.UUID(program_id),
            objective=objective,
            metrics_json=metrics_json,
            health=health,
            blockers_json=blockers_json,
            next_actions_json=next_actions_json,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "program_id": str(row.program_id),
            "objective": row.objective,
            "metrics_json": row.metrics_json,
            "health": row.health,
            "blockers_json": row.blockers_json,
            "next_actions_json": row.next_actions_json,
            "created_at": _iso(row.created_at),
        }
    finally:
        db.close()


def list_program_scorecards(program_id: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(ProgramScorecard)
        if program_id:
            query = query.filter(ProgramScorecard.program_id == uuid.UUID(program_id))
        rows = query.order_by(ProgramScorecard.created_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "program_id": str(r.program_id),
                "objective": r.objective,
                "metrics_json": r.metrics_json,
                "health": r.health,
                "blockers_json": r.blockers_json,
                "next_actions_json": r.next_actions_json,
                "created_at": _iso(r.created_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def upsert_worker_heartbeat(
    worker_id: str,
    worker_type: str,
    queue_name: str,
    host: str,
    version: str,
    status: str,
    current_load: int,
    max_concurrency: int,
    current_workspace: str | None = None,
    current_role: str | None = None,
    metadata_json: dict | None = None,
    started_at: datetime | None = None,
) -> dict:
    db = SessionLocal()
    try:
        row = db.query(WorkerHeartbeat).filter(WorkerHeartbeat.worker_id == worker_id).first()
        if row:
            row.worker_type = worker_type
            row.queue_name = queue_name
            row.host = host
            row.version = version
            row.status = status
            row.current_load = current_load
            row.max_concurrency = max_concurrency
            row.current_workspace = current_workspace
            row.current_role = current_role
            row.metadata_json = metadata_json
            if started_at:
                row.started_at = started_at
        else:
            row = WorkerHeartbeat(
                worker_id=worker_id,
                worker_type=worker_type,
                queue_name=queue_name,
                host=host,
                version=version,
                status=status,
                current_load=current_load,
                max_concurrency=max_concurrency,
                current_workspace=current_workspace,
                current_role=current_role,
                metadata_json=metadata_json,
                started_at=started_at,
            )
            db.add(row)
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "worker_id": row.worker_id,
            "worker_type": row.worker_type,
            "queue_name": row.queue_name,
            "host": row.host,
            "version": row.version,
            "status": row.status,
            "current_load": row.current_load,
            "max_concurrency": row.max_concurrency,
            "current_workspace": row.current_workspace,
            "current_role": row.current_role,
            "metadata_json": row.metadata_json,
            "started_at": _iso(row.started_at),
            "heartbeat_at": _iso(row.heartbeat_at),
        }
    finally:
        db.close()


def list_worker_heartbeats(worker_type: str | None = None, queue_name: str | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        query = db.query(WorkerHeartbeat)
        if worker_type:
            query = query.filter(WorkerHeartbeat.worker_type == worker_type)
        if queue_name:
            query = query.filter(WorkerHeartbeat.queue_name == queue_name)
        rows = query.order_by(WorkerHeartbeat.heartbeat_at.desc()).all()
        return [
            {
                "id": str(r.id),
                "worker_id": r.worker_id,
                "worker_type": r.worker_type,
                "queue_name": r.queue_name,
                "host": r.host,
                "version": r.version,
                "status": r.status,
                "current_load": r.current_load,
                "max_concurrency": r.max_concurrency,
                "current_workspace": r.current_workspace,
                "current_role": r.current_role,
                "metadata_json": r.metadata_json,
                "started_at": _iso(r.started_at),
                "heartbeat_at": _iso(r.heartbeat_at),
            }
            for r in rows
        ]
    finally:
        db.close()


def fleet_worker_summary() -> dict:
    workers = list_worker_heartbeats()
    by_type: dict[str, dict] = {}
    by_queue: dict[str, dict] = {}

    for worker in workers:
        wt = worker["worker_type"]
        qn = worker["queue_name"]
        by_type.setdefault(wt, {"active_workers": 0, "busy_workers": 0, "total_load": 0, "total_concurrency": 0, "error_workers": 0})
        by_queue.setdefault(qn, {"active_workers": 0, "busy_workers": 0, "total_load": 0, "total_concurrency": 0, "error_workers": 0})

        for bucket in (by_type[wt], by_queue[qn]):
            bucket["active_workers"] += 1
            bucket["total_load"] += worker["current_load"]
            bucket["total_concurrency"] += worker["max_concurrency"]
            if worker["current_load"] > 0:
                bucket["busy_workers"] += 1
            if worker["status"] != "healthy":
                bucket["error_workers"] += 1

    for bucket in list(by_type.values()) + list(by_queue.values()):
        total_capacity = bucket["total_concurrency"]
        bucket["idle_workers"] = max(bucket["active_workers"] - bucket["busy_workers"], 0)
        bucket["utilization"] = round(bucket["total_load"] / total_capacity, 4) if total_capacity else 0

    return {
        "total_workers": len(workers),
        "healthy_workers": sum(1 for w in workers if w["status"] == "healthy"),
        "unhealthy_workers": sum(1 for w in workers if w["status"] != "healthy"),
        "by_type": by_type,
        "by_queue": by_queue,
    }
