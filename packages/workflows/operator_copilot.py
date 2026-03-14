from datetime import timedelta

from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from packages.agents.activities import (
        create_approval_request_activity,
        executor_activity,
        finalize_workflow_activity,
        planner_activity,
        researcher_activity,
        reviewer_activity,
    )


@workflow.defn
class OperatorCopilotWorkflow:
    def __init__(self) -> None:
        self.current_stage = "pending"
        self.last_result: dict = {}
        self.approval_status = "not_required"
        self.pending_approval_id: str | None = None

    @workflow.query
    def get_status(self) -> dict:
        return {
            "current_stage": self.current_stage,
            "approval_status": self.approval_status,
            "pending_approval_id": self.pending_approval_id,
            "last_result": self.last_result,
        }

    @workflow.signal
    def approve(self, approval_id: str | None = None) -> None:
        self.approval_status = "approved"
        if approval_id:
            self.pending_approval_id = approval_id

    @workflow.signal
    def reject(self, approval_id: str | None = None) -> None:
        self.approval_status = "rejected"
        if approval_id:
            self.pending_approval_id = approval_id

    @workflow.run
    async def run(self, payload: dict) -> dict:
        self.current_stage = "planning"
        plan = await workflow.execute_activity(
            planner_activity,
            payload,
            start_to_close_timeout=timedelta(seconds=30),
            retry_policy=workflow.RetryPolicy(maximum_attempts=2),
        )
        self.last_result["plan"] = plan

        self.current_stage = "researching"
        research = await workflow.execute_activity(
            researcher_activity,
            plan,
            start_to_close_timeout=timedelta(seconds=30),
            retry_policy=workflow.RetryPolicy(maximum_attempts=2),
        )
        self.last_result["research"] = research

        self.current_stage = "executing"
        execution = await workflow.execute_activity(
            executor_activity,
            research,
            start_to_close_timeout=timedelta(seconds=30),
            retry_policy=workflow.RetryPolicy(maximum_attempts=2),
        )
        self.last_result["execution"] = execution

        if execution.get("requires_approval"):
            self.current_stage = "pause_for_approval"
            self.approval_status = "pending"
            approval = await workflow.execute_activity(
                create_approval_request_activity,
                {
                    "db_run_id": payload["db_run_id"],
                    "workflow_id": payload["workflow_id"],
                    "action_type": "high_risk_execution",
                    "stage": "execute",
                    "summary": execution.get("summary"),
                },
                start_to_close_timeout=timedelta(seconds=30),
                retry_policy=workflow.RetryPolicy(maximum_attempts=2),
            )
            self.pending_approval_id = approval.get("approval_id")

            await workflow.wait_condition(lambda: self.approval_status in {"approved", "rejected"})
            if self.approval_status == "rejected":
                self.current_stage = "rejected"
                rejected = {
                    "objective": payload.get("objective"),
                    "status": "rejected",
                    "workspace": payload.get("workspace"),
                    "role": payload.get("role"),
                    "approval_id": self.pending_approval_id,
                }
                await workflow.execute_activity(
                    finalize_workflow_activity,
                    {"db_run_id": payload["db_run_id"], "result": rejected, "status": "rejected"},
                    start_to_close_timeout=timedelta(seconds=30),
                    retry_policy=workflow.RetryPolicy(maximum_attempts=2),
                )
                return rejected

        self.current_stage = "reviewing"
        review = await workflow.execute_activity(
            reviewer_activity,
            execution,
            start_to_close_timeout=timedelta(seconds=30),
            retry_policy=workflow.RetryPolicy(maximum_attempts=2),
        )
        self.last_result["review"] = review

        self.current_stage = "completed"
        final_result = {
            "objective": payload.get("objective"),
            "status": "completed",
            "workspace": payload.get("workspace"),
            "role": payload.get("role"),
            "approval_id": self.pending_approval_id,
            "plan": plan,
            "research": research,
            "execution": execution,
            "review": review,
            "summary": review.get("final_output", {}).get("summary", "Workflow completed"),
            "next_actions": review.get("final_output", {}).get("next_actions", []),
        }
        await workflow.execute_activity(
            finalize_workflow_activity,
            {"db_run_id": payload["db_run_id"], "result": final_result, "status": "completed"},
            start_to_close_timeout=timedelta(seconds=30),
            retry_policy=workflow.RetryPolicy(maximum_attempts=2),
        )
        return final_result
