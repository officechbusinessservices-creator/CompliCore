from __future__ import annotations

import os
import uuid
from functools import lru_cache

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from temporalio.client import Client

from packages.memory.openviking_client import OpenVikingContextClient
from packages.shared.db import SessionLocal
from packages.shared.models import Approval, Artifact, AuditEvent, WorkflowRun, WorkflowStep
from packages.shared.run_store import decide_approval, get_approval
from fastapi import FastAPI

from packages.shared.db import SessionLocal
from packages.shared.models import AuditEvent, WorkflowRun, WorkflowStep

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
        return {
            "total_runs": total_runs,
            "completed_runs": completed_runs,
            "rejected_runs": rejected_runs,
            "pending_approvals": pending_approvals,
            "total_artifacts": total_artifacts,
            "completion_rate": round(completed_runs / total_runs, 4) if total_runs else 0,
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
