from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from packages.models import GeminiClient

app = FastAPI(title="CompliCore Gemini Batch Manager")


class BatchTask(BaseModel):
    id: str
    prompt: str


class BatchRequest(BaseModel):
    tasks: list[BatchTask]
    model: str = "gemini-2.5-flash"


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "gemini-batch-manager"}


@app.post("/batch/submit")
def submit_batch(request: BatchRequest) -> dict:
    if not request.tasks:
        raise HTTPException(status_code=400, detail="tasks cannot be empty")

    payload = [
        {
            "requestId": task.id,
            "contents": [{"parts": [{"text": task.prompt}]}],
        }
        for task in request.tasks
    ]

    client = GeminiClient(default_model=request.model)
    try:
        result = client.run_batch(payload, model=request.model)
        return {"status": "submitted", "result": result, "task_count": len(request.tasks)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Batch submission failed: {exc}") from exc
