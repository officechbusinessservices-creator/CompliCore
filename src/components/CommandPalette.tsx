"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Home, Calendar, DollarSign,
  MessageSquare, Wrench, Globe, TrendingUp, Bell, Settings,
  LogOut, Map, Plus, Star, Users, ArrowRight,
} from "lucide-react";

const commands = [
  { group: "Navigate", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keys: ["d"] },
  { group: "Navigate", label: "Listings", href: "/listings", icon: Home, keys: ["l"] },
  { group: "Navigate", label: "Bookings", href: "/bookings", icon: Calendar, keys: ["b"] },
  { group: "Navigate", label: "Pricing", href: "/pricing", icon: DollarSign, keys: [] },
  { group: "Navigate", label: "Messaging", href: "/messaging", icon: MessageSquare, keys: ["m"] },
  { group: "Navigate", label: "Operations", href: "/ops", icon: Wrench, keys: [] },
  { group: "Navigate", label: "Channel Manager", href: "/channels", icon: Globe, keys: [] },
  { group: "Navigate", label: "Revenue & Forecasting", href: "/revenue", icon: TrendingUp, keys: [] },
  { group: "Navigate", label: "Notifications", href: "/notifications", icon: Bell, keys: ["n"] },
  { group: "Navigate", label: "Settings", href: "/settings", icon: Settings, keys: [] },
  { group: "Navigate", label: "Navigation Guide", href: "/nav-guide", icon: Map, keys: [] },
  { group: "Actions", label: "Add new listing", href: "/onboarding", icon: Plus, keys: [] },
  { group: "Actions", label: "Browse stays (guest)", href: "/search", icon: Star, keys: [] },
  { group: "Actions", label: "View booking confirmation", href: "/guest/booking", icon: Calendar, keys: [] },
  { group: "Actions", label: "Leave a review", href: "/guest/review", icon: Star, keys: [] },
  { group: "Account", label: "Sign out", href: "/login", icon: LogOut, keys: [] },
  { group: "Account", label: "Sign up", href: "/signup", icon: Users, keys: [] },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const toggle = useCallback(() => {
    setOpen((v) => !v);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const filtered = query.trim()
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.group.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groups = [...new Set(filtered.map((c) => c.group))];

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[10px] text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results for "{query}"</div>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </div>
                {filtered.filter((c) => c.group === group).map((cmd) => (
                  <button
                    key={cmd.href}
                    onClick={() => go(cmd.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left group"
                  >
                    <cmd.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm flex-1">{cmd.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-border font-mono">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-border font-mono">↵</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-border font-mono">⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
