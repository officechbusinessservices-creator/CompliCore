from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import asyncio
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from temporalio.client import Client

from packages.shared.run_store import complete_workflow_run, create_workflow_run
from packages.workflows.operator_copilot import OperatorCopilotWorkflow

load_dotenv()


async def main() -> None:
    client = await Client.connect(os.getenv("TEMPORAL_HOST", "localhost:7233"))

    while True:
        payload = {"objective": "Scheduled autonomous run"}
        db_run_id = create_workflow_run("operator_copilot", payload)
        payload["db_run_id"] = db_run_id

        workflow_id = f"scheduled-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        handle = await client.start_workflow(
            OperatorCopilotWorkflow.run,
            payload,
            id=workflow_id,
            task_queue="orchestrator-queue",
        )
        result = await handle.result()
        complete_workflow_run(db_run_id, result)
        print(f"Started and completed {workflow_id}")

        await asyncio.sleep(300)


if __name__ == "__main__":
    asyncio.run(main())
