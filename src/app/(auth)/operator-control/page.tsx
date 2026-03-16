"use client";

import { useEffect, useState } from "react";

const OPERATOR_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE ?? "http://localhost:8000";

interface Summary {
  total_outcomes: number;
  total_kpis: number;
  total_initiatives: number;
  total_experiments: number;
  total_failures: number;
}

export default function OperatorControlPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [kpis, setKpis] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, kpiRes, initiativesRes, outcomesRes] = await Promise.all([
          fetch(`${OPERATOR_API_BASE}/metrics/summary`, { cache: "no-store" }),
          fetch(`${OPERATOR_API_BASE}/kpis`, { cache: "no-store" }),
          fetch(`${OPERATOR_API_BASE}/initiatives`, { cache: "no-store" }),
          fetch(`${OPERATOR_API_BASE}/outcomes`, { cache: "no-store" }),
        ]);

        if (!summaryRes.ok || !kpiRes.ok || !initiativesRes.ok || !outcomesRes.ok) {
          throw new Error("Failed to load operator control data");
        }

        setSummary((await summaryRes.json()) as Summary);
        setKpis(await kpiRes.json());
        setInitiatives(await initiativesRes.json());
        setOutcomes(await outcomesRes.json());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      }
    };

    load();
    const timer = window.setInterval(load, 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Executive Control Panel</h1>
        <p className="text-sm text-muted-foreground">
          Single-screen view of KPI status, initiatives, outcomes, and operating risk signals.
        </p>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-5">
        <MetricCard label="Outcomes" value={summary?.total_outcomes ?? 0} />
        <MetricCard label="KPIs" value={summary?.total_kpis ?? 0} />
        <MetricCard label="Initiatives" value={summary?.total_initiatives ?? 0} />
        <MetricCard label="Experiments" value={summary?.total_experiments ?? 0} />
        <MetricCard label="Failures" value={summary?.total_failures ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-2 font-medium">KPI status</h2>
          <ul className="space-y-2 text-sm">
            {kpis.slice(0, 8).map((kpi) => (
              <li key={kpi.id} className="flex items-center justify-between rounded border border-border/60 px-2 py-1">
                <span>{kpi.name}</span>
                <span className={kpi.status === "on-track" ? "text-emerald-500" : "text-amber-500"}>{kpi.status}</span>
              </li>
            ))}
            {kpis.length === 0 ? <li className="text-muted-foreground">No KPIs yet.</li> : null}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-2 font-medium">Top initiatives</h2>
          <ul className="space-y-2 text-sm">
            {initiatives.slice(0, 8).map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border border-border/60 px-2 py-1">
                <span>{item.name}</span>
                <span>score {item.score}</span>
              </li>
            ))}
            {initiatives.length === 0 ? <li className="text-muted-foreground">No initiatives yet.</li> : null}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-2 font-medium">Key outcomes this week</h2>
        <ul className="space-y-2 text-sm">
          {outcomes.slice(0, 10).map((outcome) => (
            <li key={outcome.id} className="rounded border border-border/60 px-2 py-1">
              <span className="font-medium">{outcome.outcome_type}</span>
              {" · "}
              <span>{outcome.value ?? "n/a"}</span>
              {" · "}
              <span className="text-muted-foreground">{outcome.workspace}</span>
            </li>
          ))}
          {outcomes.length === 0 ? <li className="text-muted-foreground">No outcomes yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
