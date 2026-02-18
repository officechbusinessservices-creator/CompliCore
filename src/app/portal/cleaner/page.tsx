"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type CleaningTask = { id: string; property: string; status: string };

export default function CleanerPortalPage() {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);

  useEffect(() => {
    apiGet<{ data: CleaningTask[] }>("/cleaning/tasks").then((res) => setTasks(res.data || [])).catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing/host" className="font-semibold">Cleaner Portal</Link>
          <Link href="/prototype/cleaning" className="text-sm">Cleaning Schedule</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold">Cleaner dashboard</h2>
          <p className="text-sm text-zinc-500">Track assignments, photo verification, and payments.</p>
        </div>
        {tasks.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Next assignment: {tasks[0].property}</p>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Assignments", desc: "View upcoming turnovers.", href: "/prototype/cleaning" },
            { title: "Checklist", desc: "Complete clean steps with photo proof.", href: "/prototype/inspection" },
            { title: "Messaging", desc: "Chat with hosts and coordinators.", href: "/prototype/messages" },
            { title: "Payments", desc: "Track payouts and invoices.", href: "/prototype/payouts" },
            { title: "Availability", desc: "Update your schedule.", href: "/prototype/calendar-sync" },
            { title: "Support", desc: "Open tickets and SLAs.", href: "/prototype/tickets" },
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
