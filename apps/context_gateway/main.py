from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from packages.memory.openviking_client import OpenVikingContextClient

app = FastAPI(title="Antigravity Context Gateway")
context_client = OpenVikingContextClient()


class ContextRequest(BaseModel):
    workspace: str
    role: str
    query: str
    max_chunks: int = 5


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "context-gateway"}


@app.post("/context/retrieve")
async def retrieve_context(request: ContextRequest) -> dict:
    result = await context_client.retrieve(
        workspace=request.workspace,
        role=request.role,
        query=request.query,
        max_chunks=request.max_chunks,
    )
    return {
        "workspace": request.workspace,
        "role": request.role,
        "query": request.query,
        "context": result,
    }
