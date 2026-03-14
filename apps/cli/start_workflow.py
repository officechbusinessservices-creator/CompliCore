from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import asyncio
import os

from dotenv import load_dotenv
from temporalio.client import Client

from packages.shared.run_store import complete_workflow_run, create_workflow_run
from packages.workflows.operator_copilot import OperatorCopilotWorkflow

load_dotenv()


async def main() -> None:
    payload = {"objective": "Test self-running system"}
    db_run_id = create_workflow_run("operator_copilot", payload)
    payload["db_run_id"] = db_run_id

    client = await Client.connect(os.getenv("TEMPORAL_HOST", "localhost:7233"))
    workflow_id = f"operator-copilot-{db_run_id}"
    handle = await client.start_workflow(
        OperatorCopilotWorkflow.run,
        payload,
        id=workflow_id,
        task_queue="orchestrator-queue",
    )
    result = await handle.result()
    complete_workflow_run(db_run_id, result)
    print({"workflow_id": workflow_id, "db_run_id": db_run_id, "result": result})


if __name__ == "__main__":
    asyncio.run(main())
