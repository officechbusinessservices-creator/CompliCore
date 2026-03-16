from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from packages.models import GeminiClient

app = FastAPI(title="CompliCore Gemini Router")


class GeminiRouteRequest(BaseModel):
    prompt: str
    mode: str = "sync"  # sync | tools | batch
    model: str = "gemini-2.5-pro"
    tools: list[dict] = []
    thought_signature: str | None = None


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "gemini-router"}


@app.post("/route")
def route_task(request: GeminiRouteRequest) -> dict:
    client = GeminiClient(default_model=request.model)
    try:
        if request.mode == "sync":
            return {"status": "ok", "result": client.run_sync(prompt=request.prompt, model=request.model)}
        if request.mode == "tools":
            return {
                "status": "ok",
                "result": client.run_with_tools(
                    prompt=request.prompt,
                    tools=request.tools,
                    model=request.model,
                    thought_signature=request.thought_signature,
                ),
            }
        raise HTTPException(status_code=400, detail="mode must be sync or tools")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Gemini route failure: {exc}") from exc
