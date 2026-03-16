from __future__ import annotations

import json
from typing import Any

from packages.models import GeminiClient


DEFAULT_PLANNER_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "priority_list": {"type": "ARRAY", "items": {"type": "STRING"}},
        "phase_breakdown": {"type": "ARRAY", "items": {"type": "STRING"}},
        "blockers": {"type": "ARRAY", "items": {"type": "STRING"}},
        "next_actions": {"type": "ARRAY", "items": {"type": "STRING"}},
        "recommended_agent_classes": {"type": "ARRAY", "items": {"type": "STRING"}},
    },
}


def create_execution_plan(
    workspace: str,
    role: str,
    objective: str,
    constraints: list[str] | None = None,
    model: str = "gemini-2.5-pro",
) -> dict[str, Any]:
    constraints = constraints or []
    prompt = (
        "You are Gemini Planner in CompliCore's fleet brain layer. Produce a concise execution plan in JSON.\n"
        f"workspace={workspace}\nrole={role}\nobjective={objective}\nconstraints={constraints}\n"
        "Return keys: priority_list, phase_breakdown, blockers, next_actions, recommended_agent_classes."
    )
    client = GeminiClient(default_model=model)
    response = client.run_with_tools(
        prompt=prompt,
        tools=[{"functionDeclarations": [{"name": "submit_plan", "description": "Submit structured plan", "parameters": DEFAULT_PLANNER_SCHEMA}]}],
        model=model,
    )
    return _normalize_plan(response)


def _normalize_plan(response: dict[str, Any]) -> dict[str, Any]:
    text = response.get("text", "")
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            parsed.setdefault("raw_text", text)
            return parsed
    except json.JSONDecodeError:
        pass

    return {
        "priority_list": [],
        "phase_breakdown": [],
        "blockers": [],
        "next_actions": [],
        "recommended_agent_classes": [],
        "raw_text": text,
    }
