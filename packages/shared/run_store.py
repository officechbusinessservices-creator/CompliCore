import uuid

from packages.shared.db import SessionLocal
from packages.shared.models import (
    Approval,
    Artifact,
    AuditEvent,
    WorkerHeartbeat,
    WorkflowRun,
    WorkflowStep,
)


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


def create_workflow_step(
    run_id: str, agent_name: str, step_name: str, payload: dict
) -> None:
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


def write_audit(
    actor_type: str, actor_name: str, event_type: str, payload: dict
) -> None:
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


def request_approval(
    run_id: str, workflow_id: str, action_type: str, payload: dict
) -> str:
    db = SessionLocal()
    try:
        row = Approval(
            workflow_run_id=uuid.UUID(run_id),
            workflow_id=workflow_id,
            action_type=action_type,
            status="pending",
            request_json=payload,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def write_artifact(run_id: str, artifact_type: str, data: dict) -> str:
    db = SessionLocal()
    try:
        row = Artifact(
            workflow_run_id=uuid.UUID(run_id),
            artifact_type=artifact_type,
            content_json=data,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def upsert_worker_heartbeat(
    worker_id: str,
    worker_type: str,
    queue_name: str,
    host: str = "unknown",
    version: str = "dev",
    status: str = "healthy",
    current_load: int = 0,
    max_concurrency: int = 1,
    current_workspace: str = None,
    current_role: str = None,
    metadata_json: dict = None,
    started_at=None,
) -> None:
    from datetime import datetime, timezone

    db = SessionLocal()
    try:
        row = (
            db.query(WorkerHeartbeat)
            .filter(WorkerHeartbeat.worker_id == worker_id)
            .first()
        )
        if row:
            row.status = status
            row.current_load = current_load
            row.heartbeat_at = datetime.now(timezone.utc)
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
    finally:
        db.close()
