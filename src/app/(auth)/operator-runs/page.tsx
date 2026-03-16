"use client";

import { useEffect, useMemo, useState } from "react";

interface RunRow {
  id: string;
  workflow_name: string;
  status: string;
  role: string;
  workspace: string;
  current_stage: string;
  waiting_for_approval: boolean;
  artifact_link: string | null;
  last_updated: string | null;
}

interface ApprovalRow {
  id: string;
  run_id: string;
  action_type: string;
  status: string;
  created_at: string;
}

const OPERATOR_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE ?? "http://localhost:8000";

export default function OperatorRunsPage() {
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [runsRes, approvalsRes] = await Promise.all([
          fetch(`${OPERATOR_API_BASE}/runs`, { cache: "no-store" }),
          fetch(`${OPERATOR_API_BASE}/approvals?status=all`, { cache: "no-store" }),
        ]);
        if (!runsRes.ok || !approvalsRes.ok) {
          throw new Error("Failed to load operator data");
        }
        setRuns((await runsRes.json()) as RunRow[]);
        setApprovals((await approvalsRes.json()) as ApprovalRow[]);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      }
    };

    load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const approvalMap = useMemo(() => {
    const mapping = new Map<string, ApprovalRow>();
    for (const approval of approvals) {
      if (approval.status === "pending") {
        mapping.set(approval.run_id, approval);
      }
    }
    return mapping;
  }, [approvals]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Operator Live Runs</h1>
        <p className="text-sm text-muted-foreground">Live workflow monitor across run state, stage, approvals, artifacts, and update timestamp.</p>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Run ID</th>
              <th className="px-3 py-2">Workflow</th>
              <th className="px-3 py-2">Workspace</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Current Stage</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Waiting Approval</th>
              <th className="px-3 py-2">Artifact</th>
              <th className="px-3 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-muted-foreground" colSpan={9}>
                  No live runs yet.
                </td>
              </tr>
            ) : (
              runs.map((run) => {
                const pendingApproval = approvalMap.get(run.id);
                return (
                  <tr key={run.id} className="border-t border-border/60">
                    <td className="px-3 py-2 font-mono text-xs">{run.id}</td>
                    <td className="px-3 py-2">{run.workflow_name}</td>
                    <td className="px-3 py-2">{run.workspace}</td>
                    <td className="px-3 py-2">{run.role}</td>
                    <td className="px-3 py-2">{run.current_stage}</td>
                    <td className="px-3 py-2">{run.status}</td>
                    <td className="px-3 py-2">{pendingApproval ? `Yes (${pendingApproval.action_type})` : run.waiting_for_approval ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">
                      {run.artifact_link ? (
                        <a href={run.artifact_link} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2">{run.last_updated ? new Date(run.last_updated).toLocaleString() : "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
