from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import asyncio
import os

from dotenv import load_dotenv
from temporalio.client import Client
from temporalio.worker import Worker

from packages.agents.activities import (
    executor_activity,
    planner_activity,
    researcher_activity,
    reviewer_activity,
)
from packages.workflows.operator_copilot import OperatorCopilotWorkflow

load_dotenv()


async def main() -> None:
    client = await Client.connect(os.getenv("TEMPORAL_HOST", "localhost:7233"))
    worker = Worker(
        client,
        task_queue="orchestrator-queue",
        workflows=[OperatorCopilotWorkflow],
        activities=[
            planner_activity,
            researcher_activity,
            executor_activity,
            reviewer_activity,
        ],
    )
    print("Orchestrator worker running on orchestrator-queue")
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())
