import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from packages.shared.db import SessionLocal
from packages.shared.models import Approval, Artifact, AuditEvent, WorkflowRun, WorkflowStep

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
