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
