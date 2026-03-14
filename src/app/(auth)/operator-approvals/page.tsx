"use client";

import { useEffect, useState } from "react";

const OPERATOR_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE ?? "http://localhost:8000";

interface ApprovalRow {
  id: string;
  workflow_id: string;
  action_type: string;
  run_id: string;
  status: string;
  created_at: string;
}

export default function OperatorApprovalsPage() {
  const [rows, setRows] = useState<ApprovalRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch(`${OPERATOR_API_BASE}/approvals?status=all`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load approvals");
      setRows((await res.json()) as ApprovalRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const decide = async (id: string, decision: "approve" | "reject") => {
    try {
      const res = await fetch(`${OPERATOR_API_BASE}/approvals/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, decided_by: "operator-dashboard", reason: "dashboard decision" }),
      });
      if (!res.ok) throw new Error(`Decision failed: ${decision}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Approvals</h1>
        <p className="text-sm text-muted-foreground">Approve or reject workflow-gated actions.</p>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Approval ID</th>
              <th className="px-3 py-2">Workflow</th>
              <th className="px-3 py-2">Action Type</th>
              <th className="px-3 py-2">Run ID</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-muted-foreground" colSpan={7}>No approvals.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border/60">
                  <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.workflow_id}</td>
                  <td className="px-3 py-2">{row.action_type}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.run_id}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.created_at ? new Date(row.created_at).toLocaleString() : "—"}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      className="rounded bg-emerald-600 px-2 py-1 text-white disabled:opacity-50"
                      disabled={row.status !== "pending"}
                      onClick={() => decide(row.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded bg-rose-600 px-2 py-1 text-white disabled:opacity-50"
                      disabled={row.status !== "pending"}
                      onClick={() => decide(row.id, "reject")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
