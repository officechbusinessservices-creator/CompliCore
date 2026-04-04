"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type MaintenanceTask = { id: string; title: string; status: string };

export default function MaintenancePortalPage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);

  useEffect(() => {
    apiGet<{ data: MaintenanceTask[] }>("/maintenance/tasks").then((res) => setTasks(res.data || [])).catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing/host" className="font-semibold">Maintenance Portal</Link>
          <Link href="/maintenance" className="text-sm">Work Orders</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold">Maintenance command center</h2>
          <p className="text-sm text-zinc-500">Track work orders, SLA timelines, vendor schedules, and costs.</p>
        </div>
        {tasks.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Next work order: {tasks[0].title}</p>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Work orders", desc: "View open maintenance requests.", href: "/prototype/maintenance" },
            { title: "Vendor schedule", desc: "Coordinate vendor visits.", href: "/prototype/team" },
            { title: "Inventory", desc: "Track parts and supplies.", href: "/prototype/expenses" },
            { title: "Compliance", desc: "Safety checks and reports.", href: "/prototype/inspection" },
            { title: "Messaging", desc: "Chat with hosts and vendors.", href: "/prototype/messages" },
            { title: "Support", desc: "Escalations and SLA tracking.", href: "/prototype/tickets" },
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
