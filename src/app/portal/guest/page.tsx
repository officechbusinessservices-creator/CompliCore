"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type UserProfile = {
  displayName?: string;
  firstName?: string;
  roles?: string[];
};

export default function GuestPortalPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    apiGet<UserProfile>("/users/me").then(setUser).catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing/guest" className="font-semibold">Guest Portal</Link>
          <Link href="/prototype" className="text-sm">Search stays</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold">Welcome back{user?.displayName ? `, ${user.displayName}` : ""}</h2>
          <p className="text-sm text-zinc-500">Manage stays, trip albums, and unified messaging in one place.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Trip dashboard", desc: "Manage upcoming stays and itineraries.", href: "/prototype/reservations" },
          { title: "Messaging", desc: "Chat with hosts and support.", href: "/prototype/messages" },
          { title: "Wishlist", desc: "Save favorites and share plans.", href: "/prototype/wishlist" },
          { title: "Trip albums", desc: "Create shared albums and itineraries.", href: "/prototype/photos" },
          { title: "Budget planning", desc: "Track spend and receipts.", href: "/prototype/expenses" },
          { title: "Support center", desc: "Open tickets and track resolutions.", href: "/prototype/tickets" },
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
