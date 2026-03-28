from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from packages.agents.gemini_reviewer import review_output

app = FastAPI(title="CompliCore Gemini Review Service")


class ReviewRequest(BaseModel):
    content: str
    rubric: str
    min_score: int = 70
    model: str = "gemini-2.5-pro"


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "gemini-review-service"}


@app.post("/review")
def review(request: ReviewRequest) -> dict:
    try:
        review_result = review_output(
            content=request.content,
            rubric=request.rubric,
            min_score=request.min_score,
            model=request.model,
        )
        return {"status": "ok", "review": review_result}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Review failure: {exc}") from exc
