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

load_dotenv()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Query an operator_copilot workflow")
    parser.add_argument(
        "--workflow-id",
        default=os.getenv("WORKFLOW_ID", "operator-copilot-test-001"),
        help="Temporal workflow ID",
    )
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    client = await Client.connect(os.getenv("TEMPORAL_HOST", "localhost:7233"))
    handle = client.get_workflow_handle(args.workflow_id)
    result = await handle.query("get_status")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
