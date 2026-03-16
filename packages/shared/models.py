import uuid

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from packages.shared.db import Base


class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    role = Column(String, nullable=False, default="operator")
    workspace = Column(String, nullable=False, default="default")
    input_json = Column(JSON, nullable=True)
    output_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    input_json = Column(JSON, nullable=True)
    output_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id = Column(UUID(as_uuid=True), nullable=False)
    agent_name = Column(String, nullable=False)
    step_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    input_json = Column(JSON, nullable=True)
    output_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_type = Column(String, nullable=False)
    actor_name = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    payload_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id = Column(UUID(as_uuid=True), nullable=False)
    agent_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    input_json = Column(JSON, nullable=True)
    output_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ToolCall(Base):
    __tablename__ = "tool_calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id = Column(UUID(as_uuid=True), nullable=False)
    agent_name = Column(String, nullable=False)
    tool_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    args_json = Column(JSON, nullable=True)
    result_json = Column(JSON, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id = Column(UUID(as_uuid=True), nullable=False)
    workflow_id = Column(String, nullable=False)
    action_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    approved = Column(Boolean, nullable=False, default=False)
    payload_json = Column(JSON, nullable=True)
    decision_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id = Column(UUID(as_uuid=True), nullable=False)
    artifact_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    markdown_path = Column(String, nullable=False)
    payload_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Plugin(Base):
    __tablename__ = "plugins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    source_type = Column(String, nullable=False, default="external")
    source_url = Column(String, nullable=True)
    trust_level = Column(String, nullable=False, default="unreviewed")
    state = Column(String, nullable=False, default="discovered")
    owner = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PluginVersion(Base):
    __tablename__ = "plugin_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plugin_id = Column(UUID(as_uuid=True), nullable=False)
    version = Column(String, nullable=False)
    checksum = Column(String, nullable=True)
    manifest_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PluginPermission(Base):
    __tablename__ = "plugin_permissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plugin_id = Column(UUID(as_uuid=True), nullable=False)
    permission_name = Column(String, nullable=False)
    scope = Column(String, nullable=True)
    allowed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PluginInstallation(Base):
    __tablename__ = "plugin_installations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plugin_id = Column(UUID(as_uuid=True), nullable=False)
    workspace = Column(String, nullable=True)
    role = Column(String, nullable=True)
    install_path = Column(String, nullable=False)
    installed_by = Column(String, nullable=True)
    status = Column(String, nullable=False, default="installed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PluginReview(Base):
    __tablename__ = "plugin_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plugin_id = Column(UUID(as_uuid=True), nullable=False)
    reviewer = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    notes = Column(String, nullable=True)
    checklist_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PluginState(Base):
    __tablename__ = "plugin_states"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plugin_id = Column(UUID(as_uuid=True), nullable=False)
    state = Column(String, nullable=False)
    reason = Column(String, nullable=True)
    changed_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    outcome_type = Column(String, nullable=False)
    project = Column(String, nullable=True)
    campaign = Column(String, nullable=True)
    opportunity = Column(String, nullable=True)
    value = Column(String, nullable=True)
    outcome_date = Column(DateTime(timezone=True), server_default=func.now())
    confidence = Column(String, nullable=False, default="medium")
    source = Column(String, nullable=True)
    details_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class KPI(Base):
    __tablename__ = "kpis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    name = Column(String, nullable=False)
    owner_role = Column(String, nullable=False, default="operator")
    target = Column(String, nullable=False)
    current = Column(String, nullable=False)
    period = Column(String, nullable=False, default="weekly")
    source = Column(String, nullable=True)
    status = Column(String, nullable=False, default="on-track")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Initiative(Base):
    __tablename__ = "initiatives"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    name = Column(String, nullable=False)
    owner = Column(String, nullable=True)
    status = Column(String, nullable=False, default="proposed")
    score = Column(Integer, nullable=False, default=0)
    effort = Column(Integer, nullable=False, default=1)
    upside = Column(Integer, nullable=False, default=1)
    urgency = Column(Integer, nullable=False, default=1)
    confidence = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    name = Column(String, nullable=False)
    hypothesis = Column(String, nullable=False)
    success_metric = Column(String, nullable=False)
    variant = Column(String, nullable=True)
    status = Column(String, nullable=False, default="planned")
    result = Column(String, nullable=True)
    decision = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Failure(Base):
    __tablename__ = "failures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    failure_type = Column(String, nullable=False)
    project = Column(String, nullable=True)
    root_cause = Column(String, nullable=False)
    cost = Column(String, nullable=True)
    fix = Column(String, nullable=True)
    repeat_risk = Column(String, nullable=False, default="medium")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), nullable=True)
    workspace = Column(String, nullable=False, default="complicore")
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    role = Column(String, nullable=True)
    last_activity_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    account_id = Column(UUID(as_uuid=True), nullable=True)
    contact_id = Column(UUID(as_uuid=True), nullable=True)
    name = Column(String, nullable=False)
    stage = Column(String, nullable=False, default="discovery")
    next_step = Column(String, nullable=True)
    estimated_value = Column(String, nullable=True)
    risk_flag = Column(String, nullable=False, default="normal")
    last_activity_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Action(Base):
    __tablename__ = "actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action_type = Column(String, nullable=False)
    action_target = Column(String, nullable=False)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="operator")
    status = Column(String, nullable=False, default="draft")
    requires_approval = Column(Boolean, nullable=False, default=True)
    connector_type = Column(String, nullable=True)
    result_json = Column(JSON, nullable=True)
    artifact_id = Column(UUID(as_uuid=True), nullable=True)
    executed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Connector(Base):
    __tablename__ = "connectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    connector_type = Column(String, nullable=False)
    connector_scope = Column(String, nullable=False, default="workspace")
    workspace = Column(String, nullable=False, default="complicore")
    status = Column(String, nullable=False, default="enabled")
    auth_state = Column(String, nullable=False, default="connected")
    permissions_json = Column(JSON, nullable=True)
    last_check_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ActionPolicy(Base):
    __tablename__ = "action_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action_type = Column(String, nullable=False)
    workspace = Column(String, nullable=False, default="global")
    role = Column(String, nullable=False, default="global")
    auto_execute = Column(Boolean, nullable=False, default=False)
    approval_required = Column(Boolean, nullable=False, default=True)
    allowed_connector = Column(String, nullable=True)
    max_daily_limit = Column(Integer, nullable=False, default=25)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="operator")
    schedule_type = Column(String, nullable=False)
    payload_json = Column(JSON, nullable=True)
    next_run_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="operator")
    message = Column(String, nullable=False)
    due_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CadenceRule(Base):
    __tablename__ = "cadence_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="operator")
    rule_name = Column(String, nullable=False)
    frequency = Column(String, nullable=False, default="weekly")
    action_type = Column(String, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RecurringAction(Base):
    __tablename__ = "recurring_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cadence_rule_id = Column(UUID(as_uuid=True), nullable=False)
    action_type = Column(String, nullable=False)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="operator")
    status = Column(String, nullable=False, default="scheduled")
    next_due_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Program(Base):
    __tablename__ = "programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    program_type = Column(String, nullable=False)
    workspace = Column(String, nullable=False, default="complicore")
    owner_role = Column(String, nullable=False, default="operator")
    status = Column(String, nullable=False, default="active")
    goal = Column(String, nullable=False)
    kpi = Column(String, nullable=True)
    cadence = Column(String, nullable=False, default="weekly")
    policy_profile = Column(String, nullable=False, default="standard")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Playbook(Base):
    __tablename__ = "playbooks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="operator")
    trigger = Column(String, nullable=False)
    success_condition = Column(String, nullable=False)
    failure_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PlaybookStep(Base):
    __tablename__ = "playbook_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    playbook_id = Column(UUID(as_uuid=True), nullable=False)
    step_order = Column(Integer, nullable=False)
    step_name = Column(String, nullable=False)
    step_action_type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Trigger(Base):
    __tablename__ = "triggers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trigger_type = Column(String, nullable=False)
    trigger_condition = Column(String, nullable=False)
    target_program_id = Column(UUID(as_uuid=True), nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    last_fired_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Sequence(Base):
    __tablename__ = "sequences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    workspace = Column(String, nullable=False, default="complicore")
    role = Column(String, nullable=False, default="sales")
    state = Column(String, nullable=False, default="active")
    exit_condition = Column(String, nullable=True)
    next_action_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SequenceStep(Base):
    __tablename__ = "sequence_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sequence_id = Column(UUID(as_uuid=True), nullable=False)
    step_order = Column(Integer, nullable=False)
    action_type = Column(String, nullable=False)
    template = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SequenceContact(Base):
    __tablename__ = "sequence_contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sequence_id = Column(UUID(as_uuid=True), nullable=False)
    contact_id = Column(UUID(as_uuid=True), nullable=False)
    opportunity_id = Column(UUID(as_uuid=True), nullable=True)
    state = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace = Column(String, nullable=False, default="complicore")
    reason = Column(String, nullable=False)
    level = Column(String, nullable=False, default="medium")
    owner = Column(String, nullable=False, default="operator")
    due_at = Column(DateTime(timezone=True), nullable=True)
    resolution = Column(String, nullable=True)
    status = Column(String, nullable=False, default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ProgramScorecard(Base):
    __tablename__ = "program_scorecards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), nullable=False)
    objective = Column(String, nullable=False)
    metrics_json = Column(JSON, nullable=True)
    health = Column(String, nullable=False, default="green")
    blockers_json = Column(JSON, nullable=True)
    next_actions_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WorkerHeartbeat(Base):
    __tablename__ = "worker_heartbeats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    worker_id = Column(String, nullable=False, unique=True)
    worker_type = Column(String, nullable=False)
    queue_name = Column(String, nullable=False)
    host = Column(String, nullable=False, default="unknown")
    version = Column(String, nullable=False, default="dev")
    status = Column(String, nullable=False, default="healthy")
    current_load = Column(Integer, nullable=False, default=0)
    max_concurrency = Column(Integer, nullable=False, default=1)
    current_workspace = Column(String, nullable=True)
    current_role = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    heartbeat_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
