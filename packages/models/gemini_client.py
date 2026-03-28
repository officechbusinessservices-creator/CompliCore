from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any

import requests


@dataclass
class GeminiClient:
    api_key: str | None = None
    base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    default_model: str = "gemini-2.5-pro"

    def __post_init__(self) -> None:
        if self.api_key is None:
            self.api_key = os.getenv("GEMINI_API_KEY")

    def _headers(self) -> dict[str, str]:
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not set")
        return {"Content-Type": "application/json", "x-goog-api-key": self.api_key}

    def run_sync(self, prompt: str, model: str | None = None, temperature: float = 0.2) -> dict[str, Any]:
        model_name = model or self.default_model
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature},
        }
        resp = requests.post(
            f"{self.base_url}/models/{model_name}:generateContent",
            headers=self._headers(),
            data=json.dumps(payload),
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        text = _extract_text(data)
        return {"model": model_name, "text": text, "raw": data}

    def run_with_tools(
        self,
        prompt: str,
        tools: list[dict[str, Any]],
        model: str | None = None,
        thought_signature: str | None = None,
    ) -> dict[str, Any]:
        model_name = model or self.default_model
        payload: dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
            "tools": tools,
        }
        if thought_signature:
            payload["systemInstruction"] = {
                "parts": [{"text": f"thought_signature:{thought_signature}"}],
            }

        resp = requests.post(
            f"{self.base_url}/models/{model_name}:generateContent",
            headers=self._headers(),
            data=json.dumps(payload),
            timeout=90,
        )
        resp.raise_for_status()
        data = resp.json()
        return {"model": model_name, "text": _extract_text(data), "raw": data}

    def run_batch(
        self,
        requests_payload: list[dict[str, Any]],
        model: str = "gemini-2.5-flash",
    ) -> dict[str, Any]:
        payload = {
            "displayName": "complicore-batch",
            "model": f"models/{model}",
            "requests": requests_payload,
        }
        resp = requests.post(
            f"{self.base_url}/batches",
            headers=self._headers(),
            data=json.dumps(payload),
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()

    def run_review(self, content: str, rubric: str, model: str | None = None) -> dict[str, Any]:
        review_prompt = (
            "You are the CompliCore reviewer. Score quality, detect contradictions, and return JSON with "
            "score_0_to_100, confidence, contradictions, and recommendation.\n\n"
            f"Rubric:\n{rubric}\n\nCandidate output:\n{content}"
        )
        return self.run_sync(prompt=review_prompt, model=model or "gemini-2.5-pro")


def _extract_text(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates") or []
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    return "\n".join(part.get("text", "") for part in parts if "text" in part)
