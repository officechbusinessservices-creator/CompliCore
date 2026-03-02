"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type CorporateMetrics = {
  bookingsBySource?: { source: string; count: number }[];
  metrics?: { totalBookings?: number; totalRevenue?: number };
};

export default function CorporatePortalPage() {
  const [metrics, setMetrics] = useState<CorporateMetrics | null>(null);

  useEffect(() => {
    apiGet<CorporateMetrics>("/analytics/dashboard").then(setMetrics).catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing/enterprise" className="font-semibold">Corporate Portal</Link>
          <Link href="/dashboard" className="text-sm">Ops Dashboard</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold">Corporate travel command center</h2>
          <p className="text-sm text-zinc-500">Manage travel policy, ESG tracking, and enterprise bookings.</p>
        </div>
        {metrics?.metrics && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Total bookings</p>
              <p className="text-2xl font-bold">{metrics.metrics.totalBookings}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Total revenue</p>
              <p className="text-2xl font-bold">${metrics.metrics.totalRevenue}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Top source</p>
              <p className="text-2xl font-bold">
                {metrics.bookingsBySource?.[0]?.source || "Direct"}
              </p>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Travel policy", desc: "Rate caps and approvals.", href: "/prototype/analytics" },
          { title: "Corporate listings", desc: "Manage discounts & compliance.", href: "/prototype/compare" },
          { title: "Expense exports", desc: "Integrate Concur/Navan.", href: "/prototype/payouts" },
          { title: "ESG tracking", desc: "Carbon, compliance, and safety logs.", href: "/prototype/sustainability" },
          { title: "Approvals queue", desc: "Multi-step approvals and audit trails.", href: "/prototype/tickets" },
          { title: "Corporate messaging", desc: "Unified comms with hosts and vendors.", href: "/prototype/messages" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 transition-colors"
          >
            <h2 className="font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-zinc-500">{item.desc}</p>
          </Link>
        ))}
        </div>
      </main>
    </div>
  );
}
