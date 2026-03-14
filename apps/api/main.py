from fastapi import FastAPI

from packages.shared.db import SessionLocal
from packages.shared.models import AuditEvent, WorkflowRun, WorkflowStep

app = FastAPI(title="CompliCore API")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


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
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
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
            }
            for r in rows
        ]
    finally:
        db.close()


@app.get("/audit")
def list_audit() -> list[dict]:
    db = SessionLocal()
    try:
        rows = (
            db.query(AuditEvent)
            .order_by(AuditEvent.created_at.desc())
            .limit(100)
            .all()
        )
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
