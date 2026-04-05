#!/usr/bin/env python3
"""Test script to trigger an agent workflow via Temporal."""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[0]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

load_dotenv(ROOT / ".env.local")

from temporalio.client import Client
from packages.workflows.operator_copilot import OperatorCopilotWorkflow


async def main() -> None:
    temporal_host = os.getenv("TEMPORAL_HOST", "localhost:7233")
    print(f"Connecting to Temporal at {temporal_host}...")

    client = await Client.connect(temporal_host)
    print("Connected!")

    payload = {
        "objective": "Analyze the current codebase and suggest 3 improvements",
        "workspace": "complicore",
        "role": "builder",
        "db_run_id": "00000000-0000-0000-0000-000000000001",
        "workflow_id": "test-workflow-001",
    }

    workflow_id = f"operator-copilot-test-{os.getpid()}"

    print(f"\nStarting workflow: {workflow_id}")
    print(f"  Objective: {payload['objective']}")
    print(f"  Workspace: {payload['workspace']}")
    print(f"  Role: {payload['role']}")

    try:
        handle = await client.start_workflow(
            OperatorCopilotWorkflow.run,
            payload,
            id=workflow_id,
            task_queue="orchestrator-queue",
        )
        print(f"\nWorkflow started! Handle ID: {handle.id}")
        print("Waiting for result (timeout: 60s)...")

        result = await asyncio.wait_for(handle.result(), timeout=60)
        print(f"\nWorkflow completed!")
        print(f"  Status: {result.get('status')}")
        print(f"  Summary: {result.get('summary', 'N/A')}")
    except asyncio.TimeoutError:
        print("\nWorkflow is still running (expected for agent workflows)")
        print(
            f"Check status at: http://localhost:8080/namespaces/default/workflows/{workflow_id}/history"
        )
    except Exception as e:
        print(f"\nWorkflow error: {type(e).__name__}: {e}")
        print("\nThis is expected if the activities aren't fully configured yet.")
        print("The worker is running and listening on orchestrator-queue.")


if __name__ == "__main__":
    asyncio.run(main())
