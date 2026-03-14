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
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def create_workflow_step(run_id: str, agent_name: str, step_name: str, payload: dict) -> None:
    db = SessionLocal()
    try:
        row = WorkflowStep(
            run_id=uuid.UUID(run_id),
            agent_name=agent_name,
            step_name=step_name,
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


def complete_workflow_run(run_id: str, output: dict) -> None:
    db = SessionLocal()
    try:
        row = db.query(WorkflowRun).filter(WorkflowRun.id == uuid.UUID(run_id)).first()
        if row:
            row.status = "completed"
            row.output_json = output
            db.commit()
    finally:
        db.close()
