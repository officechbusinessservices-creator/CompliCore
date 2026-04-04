from __future__ import annotations

import os
import subprocess

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="CompliCore Gemini CLI Bridge")


class PlanRequest(BaseModel):
    prompt: str
    cwd: str = "."


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "gemini-cli-bridge"}


@app.post("/plan")
def run_plan_mode(request: PlanRequest) -> dict:
    cmd = os.getenv("GEMINI_CLI_COMMAND", "gemini")
    args = [cmd, "plan", "--prompt", request.prompt]
    try:
        result = subprocess.run(
            args,
            cwd=request.cwd,
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Gemini CLI not found in PATH") from exc
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(status_code=504, detail="Gemini CLI plan timed out") from exc

    return {
        "status": "ok" if result.returncode == 0 else "error",
        "returncode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }
