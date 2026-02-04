"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Link2,
  RefreshCw,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Database,
  Shield,
  Zap,
  Globe,
  Building2,
  CalendarDays,
  DollarSign,
  Users,
  FileText,
  History,
  Plug,
  Key,
  Webhook,
  Activity,
  Download,
  Upload,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  Copy,
  ExternalLink,
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

// Mock PMS platforms data
const pmsplatforms = [
  {
    id: "guesty",
    name: "Guesty",
    logo: "🏠",
    description: "End-to-end property management for short-term rentals",
    status: "connected",
    lastSync: "2 minutes ago",
    properties: 12,
    reservations: 847,
    category: "Enterprise",
  },
  {
    id: "hostaway",
    name: "Hostaway",
    logo: "🌟",
    description: "All-in-one vacation rental software",
    status: "connected",
    lastSync: "5 minutes ago",
    properties: 8,
    reservations: 423,
    category: "Professional",
  },
  {
    id: "lodgify",
    name: "Lodgify",
    logo: "🏡",
    description: "Vacation rental website builder and PMS",
    status: "disconnected",
    lastSync: null,
    properties: 0,
    reservations: 0,
    category: "Starter",
  },
  {
    id: "hostfully",
    name: "Hostfully",
    logo: "📋",
    description: "Property management with digital guidebooks",
    status: "error",
    lastSync: "1 hour ago",
    properties: 5,
    reservations: 156,
    category: "Professional",
    error: "API authentication expired",
  },
  {
    id: "escapia",
    name: "Escapia (VRBO)",
    logo: "🏖️",
    description: "Vacation rental management by Expedia Group",
    status: "disconnected",
    lastSync: null,
    properties: 0,
    reservations: 0,
    category: "Enterprise",
  },
  {
    id: "track",
    name: "Track Hospitality",
    logo: "📊",
    description: "Enterprise property management platform",
    status: "pending",
    lastSync: null,
    properties: 0,
    reservations: 0,
    category: "Enterprise",
  },
  {
    id: "streamline",
    name: "Streamline VRS",
    logo: "🌊",
    description: "Vacation rental management software",
    status: "disconnected",
    lastSync: null,
    properties: 0,
    reservations: 0,
    category: "Professional",
  },
  {
    id: "beds24",
    name: "Beds24",
    logo: "🛏️",
    description: "Channel manager and booking system",
    status: "connected",
    lastSync: "15 minutes ago",
    properties: 3,
    reservations: 89,
    category: "Starter",
  },
];

// Mock sync history
const syncHistory = [
  {
    id: 1,
    platform: "Guesty",
    type: "Full Sync",
    status: "success",
    timestamp: "2026-02-03T10:30:00",
    duration: "45s",
    records: { created: 12, updated: 34, deleted: 2 },
  },
  {
    id: 2,
    platform: "Hostaway",
    type: "Reservations",
    status: "success",
    timestamp: "2026-02-03T10:25:00",
    duration: "12s",
    records: { created: 3, updated: 8, deleted: 0 },
  },
  {
    id: 3,
    platform: "Hostfully",
    type: "Properties",
    status: "error",
    timestamp: "2026-02-03T09:15:00",
    duration: "5s",
    records: { created: 0, updated: 0, deleted: 0 },
    error: "API rate limit exceeded",
  },
  {
    id: 4,
    platform: "Guesty",
    type: "Rates",
    status: "success",
    timestamp: "2026-02-03T08:00:00",
    duration: "23s",
    records: { created: 0, updated: 156, deleted: 0 },
  },
  {
    id: 5,
    platform: "Beds24",
    type: "Availability",
    status: "success",
    timestamp: "2026-02-03T07:45:00",
    duration: "8s",
    records: { created: 0, updated: 21, deleted: 0 },
  },
  {
    id: 6,
    platform: "Hostaway",
    type: "Guest Data",
    status: "warning",
    timestamp: "2026-02-03T06:30:00",
    duration: "34s",
    records: { created: 5, updated: 12, deleted: 0 },
    warning: "3 records skipped due to missing email",
  },
];

// Field mapping configuration
const fieldMappings = [
  { source: "property_name", target: "listing_title", platform: "Guesty", status: "mapped" },
  { source: "nightly_rate", target: "base_price", platform: "Guesty", status: "mapped" },
  { source: "guest_name", target: "primary_guest", platform: "Guesty", status: "mapped" },
  { source: "check_in", target: "arrival_date", platform: "Guesty", status: "mapped" },
  { source: "check_out", target: "departure_date", platform: "Guesty", status: "mapped" },
  { source: "cleaning_fee", target: "additional_fees.cleaning", platform: "Guesty", status: "custom" },
  { source: "property_type", target: "category", platform: "Guesty", status: "transform" },
  { source: "amenities", target: "features", platform: "Guesty", status: "mapped" },
];

export default function PMSIntegrationPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>("guesty");
  const [providers, setProviders] = useState(pmsplatforms);
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: "15",
    syncReservations: true,
    syncAvailability: true,
    syncRates: true,
    syncProperties: true,
    syncGuests: true,
    conflictResolution: "pms-priority",
    webhooksEnabled: true,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    apiGet<any>("/pms/providers")
      .then((data) => {
        if (data?.data) setProviders(data.data);
      })
      .catch(() => null);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <XCircle className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Connected</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-zinc-400">Disconnected</Badge>;
    }
  };

  const handleConnect = (platformId: string) => {
    setIsConnecting(true);
    apiPost<any>("/pms/connect", { providerId: platformId }).catch(() => null);
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    apiPost<any>("/pms/sync", { providerId: selectedPlatform || "all" }).catch(() => null);
    setTimeout(() => {
      setIsSyncing(false);
    }, 3000);
  };

  const selectedPlatformData = providers.find((p) => p.id === selectedPlatform);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prototype/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Plug className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">PMS Integration</h1>
                  <p className="text-xs text-zinc-400">Connect your property management systems</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync All"}
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                <Link2 className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Connected PMS</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <Link2 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Synced Properties</p>
                  <p className="text-2xl font-bold text-white">23</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Total Reservations</p>
                  <p className="text-2xl font-bold text-white">1,359</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <CalendarDays className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Last Sync</p>
                  <p className="text-2xl font-bold text-white">2m ago</p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/20">
                  <RefreshCw className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Link href="/prototype/pms-sync" className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors flex flex-col items-center text-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-blue-400" />
            <span className="text-sm font-medium text-white">Two-Way Sync</span>
            <span className="text-xs text-zinc-400">Reservation sync</span>
          </Link>
          <Link href="/prototype/pms-import" className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex flex-col items-center text-center gap-2">
            <Upload className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-white">Import Wizard</span>
            <span className="text-xs text-zinc-400">Data mapping</span>
          </Link>
          <Link href="/prototype/pms-status" className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 transition-colors flex flex-col items-center text-center gap-2">
            <Activity className="h-6 w-6 text-violet-400" />
            <span className="text-sm font-medium text-white">Live Status</span>
            <span className="text-xs text-zinc-400">Real-time monitoring</span>
          </Link>
          <Link href="/prototype/pms-troubleshoot" className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex flex-col items-center text-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <span className="text-sm font-medium text-white">Troubleshoot</span>
            <span className="text-xs text-zinc-400">Fix issues</span>
          </Link>
          <Link href="/prototype/rate-parity" className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-colors flex flex-col items-center text-center gap-2">
            <DollarSign className="h-6 w-6 text-pink-400" />
            <span className="text-sm font-medium text-white">Rate Parity</span>
            <span className="text-xs text-zinc-400">Price monitoring</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PMS Platforms List */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-violet-400" />
                  PMS Platforms
                </CardTitle>
                <CardDescription>Select a platform to configure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {providers.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedPlatform === platform.id
                        ? "bg-violet-500/20 border-violet-500/50"
                        : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.logo}</span>
                        <div>
                          <p className="font-medium text-white">{platform.name}</p>
                          <p className="text-xs text-zinc-400">{platform.category}</p>
                        </div>
                      </div>
                      {getStatusIcon(platform.status)}
                    </div>
                    {platform.status === "connected" && (
                      <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
                        <span>{platform.properties} properties</span>
                        <span>{platform.reservations} reservations</span>
                      </div>
                    )}
                    {platform.error && (
                      <p className="text-xs text-red-400 mt-2">{platform.error}</p>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Platform Configuration */}
          <div className="lg:col-span-2">
            {selectedPlatformData && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedPlatformData.logo}</span>
                      <div>
                        <CardTitle className="text-white">{selectedPlatformData.name}</CardTitle>
                        <CardDescription>{selectedPlatformData.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(selectedPlatformData.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="settings" className="w-full">
                    <TabsList className="bg-zinc-800 border-zinc-700 mb-6">
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                      <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
                      <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                      <TabsTrigger value="credentials">API Credentials</TabsTrigger>
                    </TabsList>

                    <TabsContent value="settings" className="space-y-6">
                      {/* Connection Status */}
                      {selectedPlatformData.status === "disconnected" ? (
                        <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700 text-center">
                          <Plug className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Not Connected</h3>
                          <p className="text-sm text-zinc-400 mb-4">
                            Connect your {selectedPlatformData.name} account to start syncing data.
                          </p>
                          <Button
                            onClick={() => handleConnect(selectedPlatformData.id)}
                            disabled={isConnecting}
                            className="bg-violet-600 hover:bg-violet-700"
                          >
                            {isConnecting ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Link2 className="h-4 w-4 mr-2" />
                                Connect {selectedPlatformData.name}
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Sync Settings */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                              <Settings className="h-4 w-4 text-zinc-400" />
                              Sync Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                <div className="flex items-center gap-3">
                                  <Zap className="h-5 w-5 text-amber-400" />
                                  <div>
                                    <p className="text-sm font-medium text-white">Auto Sync</p>
                                    <p className="text-xs text-zinc-400">Automatically sync data</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={syncSettings.autoSync}
                                  onCheckedChange={(checked) =>
                                    setSyncSettings({ ...syncSettings, autoSync: checked })
                                  }
                                />
                              </div>
                              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                <Label className="text-sm text-zinc-400 mb-2 block">Sync Interval</Label>
                                <Select
                                  value={syncSettings.syncInterval}
                                  onValueChange={(value) =>
                                    setSyncSettings({ ...syncSettings, syncInterval: value })
                                  }
                                >
                                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value="5">Every 5 minutes</SelectItem>
                                    <SelectItem value="15">Every 15 minutes</SelectItem>
                                    <SelectItem value="30">Every 30 minutes</SelectItem>
                                    <SelectItem value="60">Every hour</SelectItem>
                                    <SelectItem value="360">Every 6 hours</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Data Sync Options */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                              <ArrowRightLeft className="h-4 w-4 text-zinc-400" />
                              Data Sync Options
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {[
                                { key: "syncReservations", label: "Reservations", icon: CalendarDays, color: "blue" },
                                { key: "syncAvailability", label: "Availability", icon: Clock, color: "emerald" },
                                { key: "syncRates", label: "Rates & Pricing", icon: DollarSign, color: "amber" },
                                { key: "syncProperties", label: "Properties", icon: Building2, color: "violet" },
                                { key: "syncGuests", label: "Guest Data", icon: Users, color: "rose" },
                              ].map((item) => (
                                <div
                                  key={item.key}
                                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                                >
                                  <div className="flex items-center gap-2">
                                    <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                                    <span className="text-sm text-white">{item.label}</span>
                                  </div>
                                  <Switch
                                    checked={syncSettings[item.key as keyof typeof syncSettings] as boolean}
                                    onCheckedChange={(checked) =>
                                      setSyncSettings({ ...syncSettings, [item.key]: checked })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Conflict Resolution */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                              <Shield className="h-4 w-4 text-zinc-400" />
                              Conflict Resolution
                            </h3>
                            <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                              <Label className="text-sm text-zinc-400 mb-2 block">
                                When data conflicts occur, prioritize:
                              </Label>
                              <Select
                                value={syncSettings.conflictResolution}
                                onValueChange={(value) =>
                                  setSyncSettings({ ...syncSettings, conflictResolution: value })
                                }
                              >
                                <SelectTrigger className="bg-zinc-900 border-zinc-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                  <SelectItem value="pms-priority">PMS Data (External)</SelectItem>
                                  <SelectItem value="platform-priority">Platform Data (This System)</SelectItem>
                                  <SelectItem value="newest">Most Recent Update</SelectItem>
                                  <SelectItem value="manual">Manual Review</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                            <Button onClick={handleSync} disabled={isSyncing}>
                              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                              {isSyncing ? "Syncing..." : "Sync Now"}
                            </Button>
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Import Data
                            </Button>
                            <Button variant="outline">
                              <Upload className="h-4 w-4 mr-2" />
                              Export Data
                            </Button>
                            <Button variant="destructive" className="ml-auto">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Disconnect
                            </Button>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="mapping" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Field Mapping Configuration</h3>
                          <p className="text-xs text-zinc-400">Map fields between your PMS and this platform</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Mappings
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-400">
                          <span>Source Field (PMS)</span>
                          <span>Target Field (Platform)</span>
                          <span>Transform</span>
                          <span>Status</span>
                        </div>
                        {fieldMappings.map((mapping, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 items-center"
                          >
                            <code className="text-sm text-amber-400">{mapping.source}</code>
                            <code className="text-sm text-emerald-400">{mapping.target}</code>
                            <span className="text-sm text-zinc-400">
                              {mapping.status === "transform" ? "Custom" : "Direct"}
                            </span>
                            <Badge
                              className={
                                mapping.status === "mapped"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : mapping.status === "custom"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }
                            >
                              {mapping.status}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full">
                        <Plug className="h-4 w-4 mr-2" />
                        Add Custom Field Mapping
                      </Button>
                    </TabsContent>

                    <TabsContent value="webhooks" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Webhook Configuration</h3>
                          <p className="text-xs text-zinc-400">Real-time event notifications</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-400">Webhooks</span>
                          <Switch
                            checked={syncSettings.webhooksEnabled}
                            onCheckedChange={(checked) =>
                              setSyncSettings({ ...syncSettings, webhooksEnabled: checked })
                            }
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <Label className="text-sm text-zinc-400 mb-2 block">Webhook URL</Label>
                        <div className="flex gap-2">
                          <Input
                            value="https://api.yourplatform.com/webhooks/pms/guesty"
                            readOnly
                            className="bg-zinc-900 border-zinc-700 font-mono text-sm"
                          />
                          <Button variant="outline" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white">Event Subscriptions</h4>
                        {[
                          { event: "reservation.created", description: "New booking created" },
                          { event: "reservation.updated", description: "Booking modified" },
                          { event: "reservation.cancelled", description: "Booking cancelled" },
                          { event: "property.updated", description: "Property details changed" },
                          { event: "rate.updated", description: "Pricing updated" },
                          { event: "availability.updated", description: "Availability changed" },
                        ].map((item) => (
                          <div
                            key={item.event}
                            className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                          >
                            <div>
                              <code className="text-sm text-violet-400">{item.event}</code>
                              <p className="text-xs text-zinc-400">{item.description}</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="credentials" className="space-y-6">
                      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-400">Security Notice</h4>
                            <p className="text-xs text-amber-400/80">
                              API credentials are encrypted and stored securely. Never share these credentials.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-zinc-400 mb-2 block">API Key</Label>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              readOnly
                              className="bg-zinc-900 border-zinc-700 font-mono"
                            />
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-zinc-400 mb-2 block">API Secret</Label>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              value="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              readOnly
                              className="bg-zinc-900 border-zinc-700 font-mono"
                            />
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-zinc-400 mb-2 block">Account ID</Label>
                          <Input
                            value="acc_123456789"
                            readOnly
                            className="bg-zinc-900 border-zinc-700 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                        <Button variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Rotate Credentials
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View in {selectedPlatformData.name}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Sync History */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-zinc-400" />
                      Sync History
                    </CardTitle>
                    <CardDescription>Recent synchronization activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {syncHistory.map((sync) => (
                    <div
                      key={sync.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                    >
                      <div className="flex items-center gap-4">
                        {sync.status === "success" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : sync.status === "error" ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{sync.platform}</p>
                            <Badge variant="outline" className="text-xs">
                              {sync.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-400">
                            {new Date(sync.timestamp).toLocaleString()} • {sync.duration}
                          </p>
                          {sync.error && <p className="text-xs text-red-400 mt-1">{sync.error}</p>}
                          {sync.warning && <p className="text-xs text-amber-400 mt-1">{sync.warning}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3 text-xs">
                          {sync.records.created > 0 && (
                            <span className="text-emerald-400">+{sync.records.created}</span>
                          )}
                          {sync.records.updated > 0 && (
                            <span className="text-blue-400">~{sync.records.updated}</span>
                          )}
                          {sync.records.deleted > 0 && (
                            <span className="text-red-400">-{sync.records.deleted}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Documentation */}
        <Card className="bg-zinc-900/50 border-zinc-800 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-zinc-400" />
              Integration Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  title: "API Documentation",
                  description: "Complete API reference for custom integrations",
                  icon: FileText,
                  color: "blue",
                },
                {
                  title: "SDK Libraries",
                  description: "Official SDKs for Python, Node.js, PHP",
                  icon: Database,
                  color: "emerald",
                },
                {
                  title: "Webhook Guide",
                  description: "Set up real-time event notifications",
                  icon: Webhook,
                  color: "violet",
                },
                {
                  title: "Support Center",
                  description: "Get help with integration issues",
                  icon: Globe,
                  color: "amber",
                },
              ].map((resource) => (
                <button
                  key={resource.title}
                  type="button"
                  className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-all text-left"
                >
                  <resource.icon className={`h-8 w-8 text-${resource.color}-400 mb-3`} />
                  <h4 className="font-medium text-white mb-1">{resource.title}</h4>
                  <p className="text-xs text-zinc-400">{resource.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
