from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any

import requests


@dataclass
class NemotronClient:
    base_url: str = "http://localhost:8001/v1"
    model: str = "nemotron-3-super-120b-a12b"
    api_key: str | None = None

    def __post_init__(self) -> None:
        self.base_url = os.getenv("NEMOTRON_API_BASE", self.base_url).rstrip("/")
        self.model = os.getenv("NEMOTRON_MODEL", self.model)
        if self.api_key is None:
            self.api_key = os.getenv("NEMOTRON_API_KEY")

    def run_sync(self, prompt: str, temperature: float = 0.2, max_tokens: int = 1200) -> dict[str, Any]:
        url = f"{self.base_url}/chat/completions"
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are Nemotron integrated inside CompliCore control-plane. "
                        "Return concise, structured, implementation-safe output."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=90)
        resp.raise_for_status()
        data = resp.json()
        text = (
            data.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
        )
        return {"model": self.model, "text": text, "raw": data}
