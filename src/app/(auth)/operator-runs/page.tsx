"use client";

import { useEffect, useMemo, useState } from "react";

interface RunRow {
  id: string;
  workflow_name: string;
  status: string;
  role: string;
  workspace: string;
  created_at: string;
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
          fetch(`${OPERATOR_API_BASE}/approvals`, { cache: "no-store" }),
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
      mapping.set(approval.run_id, approval);
    }
    return mapping;
  }, [approvals]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Operator Live Runs</h1>
        <p className="text-sm text-muted-foreground">Live workflow monitor with approval gate visibility.</p>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-6 px-4 py-3 text-xs uppercase text-muted-foreground border-b border-border">
          <span>Run</span>
          <span>Stage / Status</span>
          <span>Role</span>
          <span>Workspace</span>
          <span>Approval</span>
          <span>Updated</span>
        </div>
        {runs.length === 0 ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">No live runs yet.</div>
        ) : (
          runs.map((run) => {
            const approval = approvalMap.get(run.id);
            return (
              <div key={run.id} className="grid grid-cols-6 gap-2 px-4 py-3 text-sm border-b border-border/60 last:border-b-0">
                <span className="font-mono text-xs truncate">{run.id}</span>
                <span>{run.status}</span>
                <span>{run.role}</span>
                <span>{run.workspace}</span>
                <span>{approval ? `${approval.status} (${approval.action_type})` : "—"}</span>
                <span>{run.created_at ? new Date(run.created_at).toLocaleString() : "—"}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
