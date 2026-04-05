import uuid
from datetime import datetime, timezone

from packages.shared.db import SessionLocal
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
    Experiment,
    Failure,
    Initiative,
    KPI,
    Opportunity,
    Outcome,
    Playbook,
    Plugin,
    PluginInstallation,
    PluginPermission,
    PluginReview,
    PluginState,
    PluginVersion,
    Program,
    ProgramScorecard,
    RecurringAction,
    Reminder,
    Schedule,
    Sequence,
    SequenceContact,
    Trigger,
    WorkerHeartbeat,
    WorkflowRun,
    WorkflowStep,
)


# ── Workflow helpers ──────────────────────────────────────────────


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
            run_id=uuid.UUID(run_id),
            artifact_type=artifact_type,
            file_path=f"artifacts/{run_id}/{artifact_type}.json",
            markdown_path=f"artifacts/{run_id}/{artifact_type}.md",
            payload_json=data,
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


# ── Approval helpers ──────────────────────────────────────────────


def get_approval(approval_id: str) -> dict:
    db = SessionLocal()
    try:
        row = db.query(Approval).filter(Approval.id == uuid.UUID(approval_id)).first()
        if not row:
            return None
        return {
            "id": str(row.id),
            "status": row.status,
            "action_type": row.action_type,
            "request_json": row.request_json,
            "response_json": row.response_json,
        }
    finally:
        db.close()


def decide_approval(approval_id: str, approved: bool, notes: str = "") -> dict:
    db = SessionLocal()
    try:
        row = db.query(Approval).filter(Approval.id == uuid.UUID(approval_id)).first()
        if not row:
            return {"error": "approval not found"}
        row.status = "approved" if approved else "rejected"
        row.response_json = {"approved": approved, "notes": notes}
        db.commit()
        db.refresh(row)
        return {
            "id": str(row.id),
            "status": row.status,
            "approved": approved,
        }
    finally:
        db.close()


# ── Plugin helpers ────────────────────────────────────────────────


def get_plugin_by_name(name: str) -> dict:
    db = SessionLocal()
    try:
        row = db.query(Plugin).filter(Plugin.name == name).first()
        if not row:
            return None
        return {
            "id": str(row.id),
            "name": row.name,
            "version": row.version,
            "status": row.status,
            "description": row.description,
        }
    finally:
        db.close()


def get_plugin_details(plugin_id: str) -> dict:
    db = SessionLocal()
    try:
        row = db.query(Plugin).filter(Plugin.id == uuid.UUID(plugin_id)).first()
        if not row:
            return None
        return {
            "id": str(row.id),
            "name": row.name,
            "version": row.version,
            "status": row.status,
            "description": row.description,
            "config_json": row.config_json,
        }
    finally:
        db.close()


def register_plugin(
    name: str, version: str, description: str = "", config: dict = None
) -> str:
    db = SessionLocal()
    try:
        row = Plugin(
            name=name,
            version=version,
            description=description,
            status="registered",
            config_json=config or {},
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def install_plugin(plugin_id: str, workspace: str = "default") -> dict:
    db = SessionLocal()
    try:
        plugin = db.query(Plugin).filter(Plugin.id == uuid.UUID(plugin_id)).first()
        if not plugin:
            return {"error": "plugin not found"}
        plugin.status = "installed"
        db.commit()
        return {"plugin_id": plugin_id, "status": "installed", "workspace": workspace}
    finally:
        db.close()


def set_plugin_permissions(plugin_id: str, permissions: dict) -> None:
    db = SessionLocal()
    try:
        row = (
            db.query(PluginPermission)
            .filter(PluginPermission.plugin_id == uuid.UUID(plugin_id))
            .first()
        )
        if row:
            row.permissions_json = permissions
        else:
            row = PluginPermission(
                plugin_id=uuid.UUID(plugin_id), permissions_json=permissions
            )
            db.add(row)
        db.commit()
    finally:
        db.close()


def set_plugin_state(plugin_id: str, state: dict) -> None:
    db = SessionLocal()
    try:
        row = (
            db.query(PluginState)
            .filter(PluginState.plugin_id == uuid.UUID(plugin_id))
            .first()
        )
        if row:
            row.state_json = state
        else:
            row = PluginState(plugin_id=uuid.UUID(plugin_id), state_json=state)
            db.add(row)
        db.commit()
    finally:
        db.close()


def add_plugin_review(
    plugin_id: str, reviewer: str, rating: int, notes: str = ""
) -> str:
    db = SessionLocal()
    try:
        row = PluginReview(
            plugin_id=uuid.UUID(plugin_id),
            reviewer=reviewer,
            rating=rating,
            notes=notes,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def add_plugin_version(plugin_id: str, version: str, changelog: str = "") -> str:
    db = SessionLocal()
    try:
        row = PluginVersion(
            plugin_id=uuid.UUID(plugin_id), version=version, changelog=changelog
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


# ── Generic CRUD generator ────────────────────────────────────────


def _make_crud(model_cls, name_snake: str):
    """Return (create_fn, list_fn) for a model."""

    def create_fn(**kwargs) -> str:
        db = SessionLocal()
        try:
            row = model_cls(**kwargs)
            db.add(row)
            db.commit()
            db.refresh(row)
            return str(row.id)
        finally:
            db.close()

    def list_fn(skip: int = 0, limit: int = 100):
        db = SessionLocal()
        try:
            return db.query(model_cls).offset(skip).limit(limit).all()
        finally:
            db.close()

    create_fn.__name__ = f"create_{name_snake}"
    list_fn.__name__ = f"list_{name_snake}s"
    return create_fn, list_fn


# Generate CRUD for every model
create_account, list_accounts = _make_crud(Account, "account")
create_action, list_actions = _make_crud(Action, "action")
create_action_policy, list_action_policies = _make_crud(ActionPolicy, "action_policy")
create_cadence_rule, list_cadence_rules = _make_crud(CadenceRule, "cadence_rule")
create_connector, list_connectors = _make_crud(Connector, "connector")
create_contact, list_contacts = _make_crud(Contact, "contact")
create_escalation, list_escalations = _make_crud(Escalation, "escalation")
create_experiment, list_experiments = _make_crud(Experiment, "experiment")
create_failure, list_failures = _make_crud(Failure, "failure")
create_initiative, list_initiatives = _make_crud(Initiative, "initiative")
create_kpi, list_kpis = _make_crud(KPI, "kpi")
create_opportunity, list_opportunities = _make_crud(Opportunity, "opportunity")
create_outcome, list_outcomes = _make_crud(Outcome, "outcome")
create_playbook, list_playbooks = _make_crud(Playbook, "playbook")
create_plugin, list_plugins = _make_crud(Plugin, "plugin")
create_program, list_programs = _make_crud(Program, "program")
create_program_scorecard, list_program_scorecards = _make_crud(
    ProgramScorecard, "program_scorecard"
)
create_recurring_action, list_recurring_actions = _make_crud(
    RecurringAction, "recurring_action"
)
create_reminder, list_reminders = _make_crud(Reminder, "reminder")
create_schedule, list_schedules = _make_crud(Schedule, "schedule")
create_sequence, list_sequences = _make_crud(Sequence, "sequence")
create_trigger, list_triggers = _make_crud(Trigger, "trigger")
create_worker_heartbeat, list_worker_heartbeats = _make_crud(
    WorkerHeartbeat, "worker_heartbeat"
)


# ── Specialised helpers ───────────────────────────────────────────


def execute_action(action_id: str, payload: dict = None) -> dict:
    db = SessionLocal()
    try:
        row = db.query(Action).filter(Action.id == uuid.UUID(action_id)).first()
        if not row:
            return {"error": "action not found"}
        row.status = "executing"
        db.commit()
        return {"action_id": action_id, "status": "executing", "payload": payload}
    finally:
        db.close()


def resolve_action_policy(policy_id: str) -> dict:
    db = SessionLocal()
    try:
        row = (
            db.query(ActionPolicy)
            .filter(ActionPolicy.id == uuid.UUID(policy_id))
            .first()
        )
        if not row:
            return {"error": "policy not found"}
        return {
            "id": str(row.id),
            "name": row.name,
            "rules": row.rules_json,
            "status": row.status,
        }
    finally:
        db.close()


def mark_opportunity_activity(
    opportunity_id: str, activity_type: str, notes: str = ""
) -> dict:
    db = SessionLocal()
    try:
        row = (
            db.query(Opportunity)
            .filter(Opportunity.id == uuid.UUID(opportunity_id))
            .first()
        )
        if not row:
            return {"error": "opportunity not found"}
        return {
            "opportunity_id": opportunity_id,
            "activity": activity_type,
            "notes": notes,
        }
    finally:
        db.close()


def attach_sequence_contact(sequence_id: str, contact_id: str) -> str:
    db = SessionLocal()
    try:
        row = SequenceContact(
            sequence_id=uuid.UUID(sequence_id), contact_id=uuid.UUID(contact_id)
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return str(row.id)
    finally:
        db.close()


def fleet_worker_summary() -> dict:
    db = SessionLocal()
    try:
        workers = db.query(WorkerHeartbeat).all()
        return {
            "total_workers": len(workers),
            "healthy": sum(1 for w in workers if w.status == "healthy"),
            "workers": [
                {
                    "worker_id": w.worker_id,
                    "type": w.worker_type,
                    "status": w.status,
                    "load": w.current_load,
                    "max_concurrency": w.max_concurrency,
                }
                for w in workers
            ],
        }
    finally:
        db.close()
