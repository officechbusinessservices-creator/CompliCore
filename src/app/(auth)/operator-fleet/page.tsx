"use client";

import { useEffect, useState } from "react";

const OPERATOR_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE ?? "http://localhost:8000";

export default function OperatorFleetPage() {
  const [model, setModel] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${OPERATOR_API_BASE}/fleet/model`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load fleet model");
        setModel(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Fleet Operating Model</h1>
        <p className="text-sm text-muted-foreground">Canonical control-surface plan for 15 divisions, 1,000 execution agents, and 10 command-layer governors.</p>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Execution Agents" value={model?.execution_agents_total ?? 0} />
        <Metric label="Command-Layer Agents" value={model?.command_layer_agents_total ?? 0} />
        <Metric label="Divisions" value={model?.divisions?.length ?? 0} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Division</th>
              <th className="px-3 py-2">Agents</th>
            </tr>
          </thead>
          <tbody>
            {(model?.divisions ?? []).map((division: any) => (
              <tr key={division.id} className="border-t border-border/60">
                <td className="px-3 py-2">{division.id}. {division.name}</td>
                <td className="px-3 py-2">{division.agents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
