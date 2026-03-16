from __future__ import annotations

import json
from typing import Any

from packages.models import NemotronClient


def build_finalization_plan(
    objective: str,
    constraints: list[str],
    context: dict[str, Any] | None = None,
) -> dict[str, Any]:
    context = context or {}
    prompt = (
        "Create a finalization plan for CompliCore using Nemotron role=planner. "
        "Return strict JSON with keys: milestones, blockers, ownership, next_actions, risk_controls.\n"
        f"Objective: {objective}\nConstraints: {constraints}\nContext: {context}"
    )
    response = NemotronClient().run_sync(prompt=prompt)
    return _coerce_json(response)


def create_deepresearch_brief(
    topic: str,
    benchmark_notes: str,
    constraints: list[str],
) -> dict[str, Any]:
    prompt = (
        "You are Nemotron role=research. Produce a deep research brief as strict JSON with keys: "
        "insights, evidence_gaps, experiment_backlog, references_needed, confidence.\n"
        f"Topic: {topic}\nBenchmark notes: {benchmark_notes}\nConstraints: {constraints}"
    )
    response = NemotronClient().run_sync(prompt=prompt)
    return _coerce_json(response)


def review_finalization_output(candidate: dict[str, Any], quality_bar: int = 80) -> dict[str, Any]:
    prompt = (
        "You are Nemotron role=reviewer. Score this candidate output and return strict JSON with keys: "
        "score_0_to_100, contradictions, acceptance, required_human_review, fixes.\n"
        f"Quality bar: {quality_bar}\nCandidate: {candidate}"
    )
    response = NemotronClient().run_sync(prompt=prompt)
    parsed = _coerce_json(response)
    parsed.setdefault("required_human_review", parsed.get("score_0_to_100", 0) < quality_bar)
    return parsed


def finalize_complicore_flow(payload: dict[str, Any]) -> dict[str, Any]:
    objective = payload.get("objective", "Finalize CompliCore production-readiness")
    constraints = payload.get("constraints", [])
    benchmark_notes = payload.get(
        "benchmark_notes",
        "Nemotron-3 Super claims #1 DeepResearch and 84.7% PinchBench (source-provided)",
    )

    plan = build_finalization_plan(
        objective=objective,
        constraints=constraints,
        context={
            "workspace": payload.get("workspace", "complicore"),
            "role": payload.get("role", "operator"),
        },
    )
    brief = create_deepresearch_brief(
        topic=objective,
        benchmark_notes=benchmark_notes,
        constraints=constraints,
    )
    review = review_finalization_output(
        {
            "plan": plan,
            "brief": brief,
        },
        quality_bar=int(payload.get("quality_bar", 80)),
    )

    return {
        "status": "ready_for_approval" if not review.get("required_human_review") else "human_review_required",
        "objective": objective,
        "plan": plan,
        "research_brief": brief,
        "review": review,
        "next_actions": plan.get("next_actions", []),
    }


def _coerce_json(response: dict[str, Any]) -> dict[str, Any]:
    text = response.get("text", "")
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            parsed.setdefault("raw_text", text)
            return parsed
    except json.JSONDecodeError:
        pass
    return {"raw_text": text}
