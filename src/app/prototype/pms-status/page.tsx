"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Circle,
} from "lucide-react";
import { apiGet } from "@/lib/api";

// Mock PMS connections with health data
const connections = [
  {
    id: "guesty",
    name: "Guesty",
    logo: "🏠",
    status: "healthy",
    uptime: 99.9,
    latency: 45,
    lastSync: "2 min ago",
    syncRate: 98.5,
    errors24h: 2,
    dataPoints: { reservations: 847, properties: 12, rates: 365 },
  },
  {
    id: "hostaway",
    name: "Hostaway",
    logo: "🌟",
    status: "healthy",
    uptime: 99.7,
    latency: 62,
    lastSync: "5 min ago",
    syncRate: 97.2,
    errors24h: 5,
    dataPoints: { reservations: 423, properties: 8, rates: 244 },
  },
  {
    id: "beds24",
    name: "Beds24",
    logo: "🛏️",
    status: "degraded",
    uptime: 98.1,
    latency: 180,
    lastSync: "15 min ago",
    syncRate: 89.5,
    errors24h: 12,
    dataPoints: { reservations: 89, properties: 3, rates: 91 },
  },
];

// Live sync events
const initialEvents = [
  { id: 1, time: "10:32:45", type: "sync", message: "Synced 3 new reservations from Guesty", status: "success" },
  { id: 2, time: "10:32:30", type: "update", message: "Updated rates for Malibu Beach Villa", status: "success" },
  { id: 3, time: "10:32:15", type: "sync", message: "Availability calendar synced", status: "success" },
  { id: 4, time: "10:31:58", type: "warning", message: "Slow response from Beds24 API", status: "warning" },
  { id: 5, time: "10:31:45", type: "sync", message: "Guest data synchronized", status: "success" },
];

// Hourly sync stats
const hourlyStats = [
  { hour: "6AM", syncs: 45, errors: 1 },
  { hour: "7AM", syncs: 62, errors: 0 },
  { hour: "8AM", syncs: 78, errors: 2 },
  { hour: "9AM", syncs: 95, errors: 1 },
  { hour: "10AM", syncs: 82, errors: 3 },
  { hour: "Now", syncs: 34, errors: 0 },
];

export default function PMSStatusPage() {
  const [events, setEvents] = useState(initialEvents);
  const [isLive, setIsLive] = useState(true);
  const [providers, setProviders] = useState(connections);

  // Simulate live events
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const newEvents = [
          { type: "sync", message: "Synced availability for Downtown Loft", status: "success" },
          { type: "update", message: "Rate update received from Guesty", status: "success" },
          { type: "sync", message: "New reservation synced: RES-1234", status: "success" },
          { type: "health", message: "Connection health check passed", status: "success" },
        ];
        const randomEvent = newEvents[Math.floor(Math.random() * newEvents.length)];
        setEvents((prev) => [
          { id: Date.now(), time: new Date().toLocaleTimeString(), ...randomEvent },
          ...prev.slice(0, 9),
        ]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  useEffect(() => {
    apiGet<any>("/pms/providers")
      .then((data) => {
        if (data?.data) {
          setProviders((prev) =>
            prev.map((conn) => ({
              ...conn,
              ...data.data.find((p: any) => p.id === conn.id),
            }))
          );
        }
      })
      .catch(() => null);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-emerald-400";
      case "degraded":
        return "text-amber-400";
      case "down":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-500/20";
      case "degraded":
        return "bg-amber-500/20";
      case "down":
        return "bg-red-500/20";
      default:
        return "bg-zinc-500/20";
    }
  };

  const maxSyncs = Math.max(...hourlyStats.map((h) => h.syncs));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prototype/pms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  PMS Integration
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Sync Status Dashboard</h1>
                  <p className="text-xs text-zinc-400">Real-time connection monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                <div className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                <span className="text-sm">{isLive ? "Live" : "Paused"}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsLive(!isLive)}
                >
                  {isLive ? <Circle className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overall Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border-emerald-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400">System Status</p>
                  <p className="text-2xl font-bold text-white">Operational</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Active Connections</p>
                  <p className="text-2xl font-bold text-white">{connections.length}/3</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Wifi className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Syncs Today</p>
                  <p className="text-2xl font-bold text-white">396</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +12% vs yesterday
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/20">
                  <RefreshCw className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Avg Latency</p>
                  <p className="text-2xl font-bold text-white">95ms</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" /> -15ms improvement
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Zap className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connection Health */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Connection Health</CardTitle>
                <CardDescription>Real-time status of all PMS connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {providers.map((conn) => (
                  <div key={conn.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{conn.logo}</span>
                        <div>
                          <h3 className="font-medium text-white">{conn.name}</h3>
                          <p className="text-xs text-zinc-400">Last sync: {conn.lastSync}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusBg(conn.status)} ${getStatusColor(conn.status)} border-0`}>
                        {conn.status === "healthy" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {conn.status === "degraded" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {conn.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-2 rounded bg-zinc-900/50">
                        <p className="text-lg font-bold text-white">{conn.uptime}%</p>
                        <p className="text-xs text-zinc-400">Uptime</p>
                      </div>
                      <div className="text-center p-2 rounded bg-zinc-900/50">
                        <p className={`text-lg font-bold ${conn.latency > 150 ? "text-amber-400" : "text-white"}`}>
                          {conn.latency}ms
                        </p>
                        <p className="text-xs text-zinc-400">Latency</p>
                      </div>
                      <div className="text-center p-2 rounded bg-zinc-900/50">
                        <p className="text-lg font-bold text-white">{conn.syncRate}%</p>
                        <p className="text-xs text-zinc-400">Sync Rate</p>
                      </div>
                      <div className="text-center p-2 rounded bg-zinc-900/50">
                        <p className={`text-lg font-bold ${conn.errors24h > 10 ? "text-red-400" : "text-white"}`}>
                          {conn.errors24h}
                        </p>
                        <p className="text-xs text-zinc-400">Errors (24h)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-700">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Calendar className="h-3 w-3" />
                        <span>{conn.dataPoints.reservations} reservations</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Home className="h-3 w-3" />
                        <span>{conn.dataPoints.properties} properties</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <DollarSign className="h-3 w-3" />
                        <span>{conn.dataPoints.rates} rate records</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hourly Sync Chart */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Sync Activity (Last 6 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 h-32">
                  {hourlyStats.map((stat) => (
                    <div key={stat.hour} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col items-center gap-0.5">
                        {stat.errors > 0 && (
                          <div
                            className="w-full bg-red-500 rounded-t"
                            style={{ height: `${(stat.errors / 5) * 20}px` }}
                          />
                        )}
                        <div
                          className="w-full bg-emerald-500 rounded-t"
                          style={{ height: `${(stat.syncs / maxSyncs) * 80}px` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{stat.hour}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-xs text-zinc-400">Successful Syncs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-xs text-zinc-400">Errors</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Events */}
          <div>
            <Card className="bg-zinc-900/50 border-zinc-800 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className={`h-5 w-5 ${isLive ? "text-emerald-400 animate-pulse" : "text-zinc-400"}`} />
                    Live Events
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {isLive ? "Streaming" : "Paused"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${
                        event.status === "success"
                          ? "bg-zinc-800/50 border-zinc-700"
                          : event.status === "warning"
                          ? "bg-amber-500/10 border-amber-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-500">{event.time}</span>
                        {event.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {event.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                        {event.status === "error" && <XCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <p className="text-sm text-white">{event.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
