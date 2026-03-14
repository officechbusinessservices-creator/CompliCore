from datetime import timedelta

from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from packages.agents.activities import (
        executor_activity,
        planner_activity,
        researcher_activity,
        reviewer_activity,
    )


@workflow.defn
class OperatorCopilotWorkflow:
    def __init__(self) -> None:
        self.current_stage = "pending"
        self.last_result: dict = {}

    @workflow.query
    def get_status(self) -> dict:
        return {
            "current_stage": self.current_stage,
            "last_result": self.last_result,
        }

    @workflow.run
    async def run(self, payload: dict) -> dict:
        self.current_stage = "planning"
        plan = await workflow.execute_activity(
            planner_activity,
            payload,
            start_to_close_timeout=timedelta(seconds=30),
        )
        self.last_result["plan"] = plan

        self.current_stage = "researching"
        research = await workflow.execute_activity(
            researcher_activity,
            plan,
            start_to_close_timeout=timedelta(seconds=30),
        )
        self.last_result["research"] = research

        self.current_stage = "executing"
        execution = await workflow.execute_activity(
            executor_activity,
            research,
            start_to_close_timeout=timedelta(seconds=30),
        )
        self.last_result["execution"] = execution

        self.current_stage = "reviewing"
        review = await workflow.execute_activity(
            reviewer_activity,
            execution,
            start_to_close_timeout=timedelta(seconds=30),
        )
        self.last_result["review"] = review

        self.current_stage = "completed"
        return {
            "objective": payload.get("objective"),
            "status": "completed",
            "plan": plan,
            "research": research,
            "execution": execution,
            "review": review,
        }
