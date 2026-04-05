from pathlib import Path
import socket
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import asyncio
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from temporalio.client import Client
from temporalio.worker import Worker

from packages.agents.activities import (
    create_approval_request_activity,
    executor_activity,
    finalize_workflow_activity,
    executor_activity,
    planner_activity,
    researcher_activity,
    reviewer_activity,
)
from packages.shared.run_store import upsert_worker_heartbeat
from packages.workflows.operator_copilot import OperatorCopilotWorkflow

load_dotenv()

WORKER_ACTIVITY_SETS = {
    "orchestrator": [
        planner_activity,
        researcher_activity,
        executor_activity,
        reviewer_activity,
        create_approval_request_activity,
        finalize_workflow_activity,
    ],
    "planner": [planner_activity],
    "research": [researcher_activity],
    "execution": [executor_activity],
    "review": [reviewer_activity],
    "policy": [create_approval_request_activity],
    "artifact": [finalize_workflow_activity],
}


def env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def parse_queue_names() -> list[str]:
    value = os.getenv("TEMPORAL_TASK_QUEUES", "orchestrator-queue")
    return [q.strip() for q in value.split(",") if q.strip()]


def parse_worker_roles() -> list[str]:
    value = os.getenv("WORKER_ROLES", "orchestrator")
    return [r.strip() for r in value.split(",") if r.strip()]


def resolve_activities(roles: list[str]):
    activity_map = {}
    for role in roles:
        for activity in WORKER_ACTIVITY_SETS.get(role, []):
            activity_map[activity.__name__] = activity
    return list(activity_map.values())


async def heartbeat_loop(
    worker_id: str, worker_type: str, queue_name: str, max_concurrency: int
) -> None:
    while True:
        upsert_worker_heartbeat(
            worker_id=worker_id,
            worker_type=worker_type,
            queue_name=queue_name,
            host=socket.gethostname(),
            version=os.getenv("WORKER_VERSION", "dev"),
            status="healthy",
            current_load=0,
            max_concurrency=max_concurrency,
            current_workspace=os.getenv("WORKER_WORKSPACE"),
            current_role=os.getenv("WORKER_ROLE"),
            metadata_json={
                "queues": parse_queue_names(),
                "roles": parse_worker_roles(),
            },
            started_at=datetime.now(timezone.utc),
        )
        await asyncio.sleep(env_int("WORKER_HEARTBEAT_INTERVAL_S", 15))


async def run_worker_for_queue(
    client: Client, queue_name: str, activities: list, max_concurrency: int
) -> None:
    worker_id = (
        f"{os.getenv('WORKER_NAME_PREFIX', 'worker')}-{queue_name}-{os.getpid()}"
    )
    worker_type = os.getenv("WORKER_TYPE", "multi-role")

    worker = Worker(
        client,
        task_queue=queue_name,
        workflows=[OperatorCopilotWorkflow]
        if queue_name == "orchestrator-queue"
        else [],
        activities=activities,
        max_concurrent_activities=max_concurrency,
    )

    print(
        f"Worker {worker_id} running on {queue_name} with concurrency={max_concurrency}"
    )
    await asyncio.gather(
        worker.run(),
        heartbeat_loop(worker_id, worker_type, queue_name, max_concurrency),
    )


async def main() -> None:
    client = await Client.connect(os.getenv("TEMPORAL_HOST", "localhost:7233"))
    queue_names = parse_queue_names()
    worker_roles = parse_worker_roles()
    activities = resolve_activities(worker_roles)
    max_concurrency = env_int("WORKER_MAX_CONCURRENCY", 8)

    if not activities and "orchestrator-queue" not in queue_names:
        raise RuntimeError(
            "No activities configured and no orchestrator queue assigned."
        )

    await asyncio.gather(
        *[
            run_worker_for_queue(client, queue, activities, max_concurrency)
            for queue in queue_names
        ]
    )


if __name__ == "__main__":
    asyncio.run(main())
