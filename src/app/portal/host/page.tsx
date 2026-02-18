"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type HostMetrics = {
  metrics?: {
    totalBookings?: number;
    totalRevenue?: number;
    occupancyRate?: number;
  };
};

export default function HostPortalPage() {
  const [metrics, setMetrics] = useState<HostMetrics | null>(null);

  useEffect(() => {
    apiGet<HostMetrics>("/analytics/dashboard").then(setMetrics).catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing/host" className="font-semibold">Host Portal</Link>
          <Link href="/prototype/dashboard" className="text-sm">Dashboard</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold">Host operations hub</h2>
          <p className="text-sm text-zinc-500">Manage listings, payouts, cleanings, maintenance, and compliance workflows.</p>
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
              <p className="text-xs text-zinc-500">Occupancy rate</p>
              <p className="text-2xl font-bold">{Math.round((metrics.metrics.occupancyRate || 0) * 100)}%</p>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Listings", desc: "Create and manage listings.", href: "/prototype/property/1" },
          { title: "Calendar & pricing", desc: "Adjust availability and rates.", href: "/prototype/pricing" },
          { title: "Operations", desc: "Cleaning & maintenance workflows.", href: "/prototype/cleaning" },
          { title: "Payouts", desc: "Track host payouts and transfers.", href: "/prototype/payouts" },
          { title: "Reviews", desc: "Respond to guest reviews.", href: "/prototype/reviews" },
          { title: "Channel manager", desc: "Sync OTA channels and rates.", href: "/prototype/channels" },
          { title: "Smart locks", desc: "Manage access codes and devices.", href: "/prototype/smart-locks" },
          { title: "Team & vendors", desc: "Invite cleaners, maintenance, and co-hosts.", href: "/prototype/team" },
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
