import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from packages.shared.db import SessionLocal
from packages.shared.models import (
    Approval,
    Artifact,
    AuditEvent,
    Experiment,
    Failure,
    Initiative,
    KPI,
    Outcome,
    Plugin,
    PluginInstallation,
    PluginPermission,
    PluginReview,
    PluginState,
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
