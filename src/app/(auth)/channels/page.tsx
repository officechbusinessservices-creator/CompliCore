"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Plus, ExternalLink, Zap } from "lucide-react";

const channels = [
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "🏠",
    status: "connected",
    listings: 3,
    lastSync: "2 min ago",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: "vrbo",
    name: "VRBO",
    logo: "🏡",
    status: "connected",
    listings: 2,
    lastSync: "5 min ago",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "booking",
    name: "Booking.com",
    logo: "🌐",
    status: "error",
    listings: 0,
    lastSync: "Failed 1h ago",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "direct",
    name: "Direct Booking",
    logo: "✨",
    status: "connected",
    listings: 3,
    lastSync: "Live",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "expedia",
    name: "Expedia",
    logo: "✈️",
    status: "disconnected",
    listings: 0,
    lastSync: "Not connected",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    logo: "🦉",
    status: "disconnected",
    listings: 0,
    lastSync: "Not connected",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

const syncLog = [
  { time: "09:12 AM", channel: "Airbnb", event: "Calendar synced — 3 listings updated", ok: true },
  { time: "09:10 AM", channel: "VRBO", event: "Rate update pushed — Ocean View Suite", ok: true },
  { time: "08:45 AM", channel: "Booking.com", event: "Auth token expired — reconnect required", ok: false },
  { time: "08:30 AM", channel: "Airbnb", event: "New booking received — BK-2026-0042", ok: true },
  { time: "08:00 AM", channel: "Direct", event: "Availability block synced across all channels", ok: true },
];

export default function ChannelsPage() {
  const [syncing, setSyncing] = useState<string | null>(null);

  function handleSync(id: string) {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Channel Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sync listings, rates, and availability across all platforms.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
          <Plus className="w-4 h-4" /> Add channel
        </button>
      </div>

      {/* Channel cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div key={ch.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${ch.bg} flex items-center justify-center text-xl`}>
                  {ch.logo}
                </div>
                <div>
                  <div className="font-semibold text-sm">{ch.name}</div>
                  <div className="text-xs text-muted-foreground">{ch.listings} listings</div>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                ch.status === "connected" ? "bg-emerald-500/10 text-emerald-600" :
                ch.status === "error" ? "bg-rose-500/10 text-rose-600" :
                "bg-muted text-muted-foreground"
              }`}>
                {ch.status === "connected" && <CheckCircle2 className="w-3 h-3" />}
                {ch.status === "error" && <AlertCircle className="w-3 h-3" />}
                {ch.status}
              </span>
            </div>

            <div className="text-xs text-muted-foreground mb-4">Last sync: {ch.lastSync}</div>

            <div className="flex gap-2">
              {ch.status === "disconnected" ? (
                <button className="flex-1 text-xs py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  Connect
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleSync(ch.id)}
                    disabled={syncing === ch.id}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-border hover:bg-accent transition-colors font-medium disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3 h-3 ${syncing === ch.id ? "animate-spin" : ""}`} />
                    {syncing === ch.id ? "Syncing…" : "Sync now"}
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sync log */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Sync activity log
          </h2>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
        <div className="divide-y divide-border">
          {syncLog.map((log, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3">
              {log.ok
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              }
              <div className="min-w-0 flex-1">
                <p className="text-xs">{log.event}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{log.channel} · {log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
