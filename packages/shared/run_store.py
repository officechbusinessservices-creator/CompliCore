import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from packages.shared.db import SessionLocal
from packages.shared.models import (
    Approval,
    Artifact,
    AuditEvent,
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
    db = SessionLocal()
    try:
        row = WorkflowStep(
            run_id=uuid.UUID(run_id),
            agent_name=agent_name,
            step_name=step_name,
            status=status,
            input_json=payload,
            output_json=payload,
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
    db = SessionLocal()
    try:
        row = db.query(WorkflowRun).filter(WorkflowRun.id == uuid.UUID(run_id)).first()
        if row:
            row.status = status
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
