"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowLeftRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  Calendar,
  User,
  DollarSign,
  Home,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Settings,
  Database,
  Activity,
  TrendingUp,
  Filter,
} from "lucide-react";
import { apiPost } from "@/lib/api";

// Mock reservations for sync simulation
const localReservations = [
  { id: "RES-001", guest: "Sarah Johnson", property: "Malibu Beach Villa", checkIn: "2026-02-10", checkOut: "2026-02-14", total: 1250, status: "confirmed", source: "direct" },
  { id: "RES-002", guest: "Michael Chen", property: "Downtown Loft", checkIn: "2026-02-12", checkOut: "2026-02-15", total: 680, status: "confirmed", source: "direct" },
  { id: "RES-003", guest: "Emma Davis", property: "Mountain Retreat", checkIn: "2026-02-20", checkOut: "2026-02-25", total: 1890, status: "pending", source: "direct" },
];

const pmsReservations = [
  { id: "G-78234", guest: "Sarah Johnson", property: "Malibu Beach Villa", checkIn: "2026-02-10", checkOut: "2026-02-14", total: 1250, status: "confirmed", source: "guesty" },
  { id: "G-78235", guest: "James Wilson", property: "Malibu Beach Villa", checkIn: "2026-02-16", checkOut: "2026-02-19", total: 945, status: "confirmed", source: "guesty" },
  { id: "G-78236", guest: "Lisa Park", property: "Downtown Loft", checkIn: "2026-02-22", checkOut: "2026-02-24", total: 420, status: "pending", source: "guesty" },
];

// Sync queue items
const initialSyncQueue = [
  { id: 1, type: "push", reservation: "RES-002", action: "Create in PMS", status: "pending", direction: "outbound" },
  { id: 2, type: "pull", reservation: "G-78235", action: "Import to platform", status: "pending", direction: "inbound" },
  { id: 3, type: "pull", reservation: "G-78236", action: "Import to platform", status: "pending", direction: "inbound" },
  { id: 4, type: "conflict", reservation: "RES-003", action: "Resolve price conflict", status: "conflict", direction: "both", conflict: { local: 1890, pms: 1950 } },
];

// Sync history
const syncHistory = [
  { id: 1, time: "10:30:15", action: "Pulled G-78234 from Guesty", status: "success", direction: "inbound" },
  { id: 2, time: "10:30:14", action: "Pushed RES-001 to Guesty", status: "success", direction: "outbound" },
  { id: 3, time: "10:30:12", action: "Updated availability for Malibu Beach Villa", status: "success", direction: "outbound" },
  { id: 4, time: "10:30:10", action: "Synced rates for Downtown Loft", status: "success", direction: "both" },
  { id: 5, time: "10:29:58", action: "Connection established with Guesty", status: "success", direction: "system" },
];

export default function PMSSyncPage() {
  const [syncQueue, setSyncQueue] = useState(initialSyncQueue);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncDirection, setSyncDirection] = useState<"both" | "push" | "pull">("both");
  const [liveUpdates, setLiveUpdates] = useState<string[]>([]);
  const [syncStats, setSyncStats] = useState({ pushed: 0, pulled: 0, conflicts: 0, errors: 0 });

  // Simulate live sync updates
  useEffect(() => {
    if (isSyncing) {
      const interval = setInterval(() => {
        const updates = [
          "Checking for new reservations...",
          "Syncing availability calendar...",
          "Updating rate information...",
          "Processing guest data...",
          "Validating reservation details...",
        ];
        setLiveUpdates((prev) => [...prev.slice(-4), updates[Math.floor(Math.random() * updates.length)]]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isSyncing]);

  const handleSync = () => {
    setIsSyncing(true);
    setLiveUpdates(["Starting sync process..."]);
    apiPost<any>("/pms/sync", { providerId: "guesty", direction: syncDirection }).catch(() => null);

    // Simulate sync process
    setTimeout(() => {
      setSyncQueue((prev) => prev.map((item) =>
        item.status === "pending" ? { ...item, status: "completed" } : item
      ));
      setSyncStats({ pushed: 2, pulled: 3, conflicts: 1, errors: 0 });
      setIsSyncing(false);
      setLiveUpdates((prev) => [...prev, "Sync completed successfully!"]);
    }, 4000);
  };

  const handleResolveConflict = (id: number, resolution: "local" | "pms") => {
    setSyncQueue((prev) => prev.map((item) =>
      item.id === id ? { ...item, status: "resolved", resolution } : item
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-400" />;
      case "conflict":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "inbound":
        return <ArrowLeftIcon className="h-4 w-4 text-blue-400" />;
      case "outbound":
        return <ArrowRight className="h-4 w-4 text-emerald-400" />;
      case "both":
        return <ArrowLeftRight className="h-4 w-4 text-violet-400" />;
      default:
        return <Activity className="h-4 w-4 text-zinc-400" />;
    }
  };

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
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <ArrowLeftRight className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Two-Way Sync</h1>
                  <p className="text-xs text-zinc-400">Real-time reservation synchronization</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                <Zap className={`h-4 w-4 ${autoSync ? "text-emerald-400" : "text-zinc-500"}`} />
                <span className="text-sm">Auto-Sync</span>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Sync Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <ArrowRight className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{syncStats.pushed}</p>
                  <p className="text-xs text-zinc-400">Pushed to PMS</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <ArrowLeftIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{syncStats.pulled}</p>
                  <p className="text-xs text-zinc-400">Pulled from PMS</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{syncStats.conflicts}</p>
                  <p className="text-xs text-zinc-400">Conflicts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{syncStats.errors}</p>
                  <p className="text-xs text-zinc-400">Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSyncing ? "bg-blue-500/20" : "bg-emerald-500/20"}`}>
                  <Activity className={`h-5 w-5 ${isSyncing ? "text-blue-400 animate-pulse" : "text-emerald-400"}`} />
                </div>
                <div>
                  <p className="text-lg font-bold">{isSyncing ? "Syncing" : "Idle"}</p>
                  <p className="text-xs text-zinc-400">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sync Queue */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Sync Queue</CardTitle>
                    <CardDescription>Pending synchronization tasks</CardDescription>
                  </div>
                  <Select value={syncDirection} onValueChange={(v: "both" | "push" | "pull") => setSyncDirection(v)}>
                    <SelectTrigger className="w-36 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="both">Both Ways</SelectItem>
                      <SelectItem value="push">Push Only</SelectItem>
                      <SelectItem value="pull">Pull Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      item.status === "conflict"
                        ? "bg-orange-500/10 border-orange-500/30"
                        : item.status === "completed" || item.status === "resolved"
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-zinc-800/50 border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getDirectionIcon(item.direction)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{item.reservation}</p>
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                          </div>
                          <p className="text-sm text-zinc-400">{item.action}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <Badge className={
                          item.status === "completed" || item.status === "resolved"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : item.status === "conflict"
                            ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    {item.status === "conflict" && item.conflict && (
                      <div className="mt-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-700">
                        <p className="text-sm text-orange-400 mb-3">Price mismatch detected:</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 p-2 rounded bg-zinc-800 text-center">
                            <p className="text-xs text-zinc-400">Local</p>
                            <p className="text-lg font-bold text-white">${item.conflict.local}</p>
                          </div>
                          <ArrowLeftRight className="h-5 w-5 text-zinc-500" />
                          <div className="flex-1 p-2 rounded bg-zinc-800 text-center">
                            <p className="text-xs text-zinc-400">PMS</p>
                            <p className="text-lg font-bold text-white">${item.conflict.pms}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleResolveConflict(item.id, "local")}
                          >
                            Use Local
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleResolveConflict(item.id, "pms")}
                          >
                            Use PMS
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reservation Comparison */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Reservation Comparison</CardTitle>
                <CardDescription>Side-by-side view of local and PMS reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-emerald-400" />
                      Local Platform
                    </h4>
                    <div className="space-y-2">
                      {localReservations.map((res) => (
                        <div key={res.id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{res.id}</span>
                            <Badge variant="outline" className="text-xs">{res.status}</Badge>
                          </div>
                          <p className="text-xs text-zinc-400">{res.guest}</p>
                          <p className="text-xs text-zinc-500">{res.checkIn} → {res.checkOut}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-400" />
                      Guesty PMS
                    </h4>
                    <div className="space-y-2">
                      {pmsReservations.map((res) => (
                        <div key={res.id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{res.id}</span>
                            <Badge variant="outline" className="text-xs">{res.status}</Badge>
                          </div>
                          <p className="text-xs text-zinc-400">{res.guest}</p>
                          <p className="text-xs text-zinc-500">{res.checkIn} → {res.checkOut}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Updates & History */}
          <div className="space-y-6">
            {/* Live Updates */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className={`h-5 w-5 ${isSyncing ? "text-blue-400 animate-pulse" : "text-zinc-400"}`} />
                  Live Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 overflow-y-auto space-y-2 font-mono text-xs">
                  {liveUpdates.length === 0 ? (
                    <p className="text-zinc-500">Waiting for sync activity...</p>
                  ) : (
                    liveUpdates.map((update, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-zinc-500">[{new Date().toLocaleTimeString()}]</span>
                        <span className="text-zinc-300">{update}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sync History */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Recent Sync History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {syncHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50">
                    {getDirectionIcon(item.direction)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{item.action}</p>
                      <p className="text-xs text-zinc-500">{item.time}</p>
                    </div>
                    {getStatusIcon(item.status)}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sync Settings */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Sync Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Sync Interval</span>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-28 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="1">1 min</SelectItem>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Conflict Resolution</span>
                  <Select defaultValue="manual">
                    <SelectTrigger className="w-28 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="local">Local Wins</SelectItem>
                      <SelectItem value="pms">PMS Wins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
