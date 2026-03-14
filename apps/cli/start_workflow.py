from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import argparse
import asyncio
import os

from dotenv import load_dotenv
from temporalio.client import Client

from packages.shared.run_store import create_workflow_run
from packages.shared.run_store import complete_workflow_run, create_workflow_run
from packages.workflows.operator_copilot import OperatorCopilotWorkflow

load_dotenv()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Start operator_copilot workflow")
    parser.add_argument("--objective", default="Create execution plan", help="Workflow objective")
    parser.add_argument("--workspace", default="complicore", help="Workspace name")
    parser.add_argument("--role", default="builder", help="Role name")
    parser.add_argument("--constraints", nargs="*", default=[], help="Execution constraints")
    parser.add_argument(
        "--wait",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Wait for workflow completion",
    )
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    payload = {
        "objective": args.objective,
        "workspace": args.workspace,
        "role": args.role,
        "constraints": args.constraints,
    }

    db_run_id = create_workflow_run("operator_copilot", payload)
    workflow_id = f"operator-copilot-{db_run_id}"
    payload["db_run_id"] = db_run_id
    payload["workflow_id"] = workflow_id

    client = await Client.connect(os.getenv("TEMPORAL_HOST", "localhost:7233"))

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

    if not args.wait:
        print({"workflow_id": workflow_id, "db_run_id": db_run_id, "status": "started"})
        return

    result = await handle.result()
    result = await handle.result()
    complete_workflow_run(db_run_id, result)
    print({"workflow_id": workflow_id, "db_run_id": db_run_id, "result": result})


if __name__ == "__main__":
    asyncio.run(main())
