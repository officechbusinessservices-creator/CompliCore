from __future__ import annotations

import json
from typing import Any

from packages.models import GeminiClient


def review_output(
    content: str,
    rubric: str,
    min_score: int = 70,
    model: str = "gemini-2.5-pro",
) -> dict[str, Any]:
    client = GeminiClient(default_model=model)
    response = client.run_review(content=content, rubric=rubric, model=model)
    text = response.get("text", "")

    score = 0
    confidence = "low"
    contradictions: list[str] = []
    recommendation = "human_review"
    try:
        parsed = json.loads(text)
        score = int(parsed.get("score_0_to_100", 0))
        confidence = str(parsed.get("confidence", "low"))
        contradictions = list(parsed.get("contradictions", []))
        recommendation = str(parsed.get("recommendation", "human_review"))
    except Exception:  # noqa: BLE001
        recommendation = "human_review"

    return {
        "score_0_to_100": score,
        "confidence": confidence,
        "contradictions": contradictions,
        "recommendation": recommendation,
        "requires_human_approval": score < min_score or recommendation in {"reject", "human_review"},
        "raw_text": text,
    }
