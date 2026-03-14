"use client";

import { useEffect, useMemo, useState } from "react";

interface PluginRow {
  id: string;
  name: string;
  source_type: string;
  state: string;
  trust_level: string;
  owner: string | null;
  created_at: string | null;
}

interface PluginDetail {
  plugin: PluginRow;
  installations: Array<{ workspace: string | null; role: string | null }>;
  versions: Array<{ version: string; created_at: string | null }>;
  reviews: Array<{ status: string; created_at: string | null }>;
}

const OPERATOR_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE ?? "http://localhost:8000";

export default function OperatorPluginsPage() {
  const [plugins, setPlugins] = useState<PluginRow[]>([]);
  const [details, setDetails] = useState<Record<string, PluginDetail>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${OPERATOR_API_BASE}/plugins`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load plugins");
        const rows = (await res.json()) as PluginRow[];
        setPlugins(rows);

        const pairs = await Promise.all(
          rows.map(async (plugin) => {
            const dr = await fetch(`${OPERATOR_API_BASE}/plugins/${plugin.name}`, { cache: "no-store" });
            if (!dr.ok) return [plugin.name, null] as const;
            return [plugin.name, (await dr.json()) as PluginDetail] as const;
          }),
        );

        const next: Record<string, PluginDetail> = {};
        for (const [name, detail] of pairs) {
          if (detail) next[name] = detail;
        }
        setDetails(next);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      }
    };

    load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const rows = useMemo(() => {
    return plugins.map((plugin) => {
      const detail = details[plugin.name];
      const workspaceScope = Array.from(
        new Set((detail?.installations ?? []).map((item) => item.workspace ?? "global")),
      ).join(", ");
      const roleScope = Array.from(
        new Set((detail?.installations ?? []).map((item) => item.role ?? "global")),
      ).join(", ");
      const latestVersion = detail?.versions?.[0]?.version ?? "—";
      const lastReview = detail?.reviews?.[0]?.created_at
        ? new Date(detail.reviews[0].created_at!).toLocaleString()
        : "—";
      return {
        ...plugin,
        workspaceScope: workspaceScope || "—",
        roleScope: roleScope || "—",
        latestVersion,
        lastReview,
      };
    });
  }, [plugins, details]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Operator Plugin Control</h1>
        <p className="text-sm text-muted-foreground">
          Governance view for plugin source, trust, state, scope, and review metadata.
        </p>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Trust</th>
              <th className="px-3 py-2">Workspace Scope</th>
              <th className="px-3 py-2">Role Scope</th>
              <th className="px-3 py-2">Version</th>
              <th className="px-3 py-2">Last Review</th>
              <th className="px-3 py-2">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-muted-foreground" colSpan={9}>
                  No plugins registered yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border/60">
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2">{row.source_type}</td>
                  <td className="px-3 py-2">{row.state}</td>
                  <td className="px-3 py-2">{row.trust_level}</td>
                  <td className="px-3 py-2">{row.workspaceScope}</td>
                  <td className="px-3 py-2">{row.roleScope}</td>
                  <td className="px-3 py-2">{row.latestVersion}</td>
                  <td className="px-3 py-2">{row.lastReview}</td>
                  <td className="px-3 py-2">{row.state === "enabled" ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
