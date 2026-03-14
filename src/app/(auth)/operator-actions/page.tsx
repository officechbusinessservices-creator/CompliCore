"use client";

import { useEffect, useState } from "react";

const OPERATOR_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE ?? "http://localhost:8000";

export default function OperatorActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${OPERATOR_API_BASE}/actions`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load actions");
        setActions(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };
    load();
    const timer = window.setInterval(load, 8000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Operator Actions</h1>
        <p className="text-sm text-muted-foreground">Execution table for action type, target, status, connector, result, and execution time.</p>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Action ID</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Connector</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2">Executed At</th>
            </tr>
          </thead>
          <tbody>
            {actions.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-muted-foreground" colSpan={7}>No actions recorded.</td>
              </tr>
            ) : (
              actions.map((action) => (
                <tr key={action.id} className="border-t border-border/60">
                  <td className="px-3 py-2 font-mono text-xs">{action.id}</td>
                  <td className="px-3 py-2">{action.action_type}</td>
                  <td className="px-3 py-2 font-mono text-xs">{action.action_target}</td>
                  <td className="px-3 py-2">{action.status}</td>
                  <td className="px-3 py-2">{action.connector_type ?? "—"}</td>
                  <td className="px-3 py-2">{action.result_json ? JSON.stringify(action.result_json).slice(0, 120) : "—"}</td>
                  <td className="px-3 py-2">{action.executed_at ? new Date(action.executed_at).toLocaleString() : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
