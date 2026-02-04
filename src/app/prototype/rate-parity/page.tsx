"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Settings,
  Bell,
  Filter,
  Download,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

// Mock channel data
const channels = [
  { id: "direct", name: "Direct Booking", logo: "🏠", color: "bg-emerald-500" },
  { id: "airbnb", name: "Airbnb", logo: "🔴", color: "bg-rose-500" },
  { id: "vrbo", name: "VRBO", logo: "🔵", color: "bg-blue-500" },
  { id: "booking", name: "Booking.com", logo: "🟡", color: "bg-amber-500" },
  { id: "expedia", name: "Expedia", logo: "🟣", color: "bg-violet-500" },
];

// Mock rate parity data by property and date
const rateParityData = [
  {
    property: "Malibu Beach Villa",
    propertyId: "prop-1",
    dates: [
      {
        date: "2026-02-10",
        baseRate: 350,
        channels: {
          direct: { rate: 350, status: "parity" },
          airbnb: { rate: 365, status: "higher", diff: "+4.3%" },
          vrbo: { rate: 350, status: "parity" },
          booking: { rate: 342, status: "lower", diff: "-2.3%" },
          expedia: { rate: 350, status: "parity" },
        },
      },
      {
        date: "2026-02-11",
        baseRate: 350,
        channels: {
          direct: { rate: 350, status: "parity" },
          airbnb: { rate: 350, status: "parity" },
          vrbo: { rate: 350, status: "parity" },
          booking: { rate: 350, status: "parity" },
          expedia: { rate: 350, status: "parity" },
        },
      },
      {
        date: "2026-02-12",
        baseRate: 375,
        channels: {
          direct: { rate: 375, status: "parity" },
          airbnb: { rate: 375, status: "parity" },
          vrbo: { rate: 390, status: "higher", diff: "+4.0%" },
          booking: { rate: 375, status: "parity" },
          expedia: { rate: 368, status: "lower", diff: "-1.9%" },
        },
      },
      {
        date: "2026-02-13",
        baseRate: 425,
        channels: {
          direct: { rate: 425, status: "parity" },
          airbnb: { rate: 450, status: "higher", diff: "+5.9%" },
          vrbo: { rate: 425, status: "parity" },
          booking: { rate: 425, status: "parity" },
          expedia: { rate: 425, status: "parity" },
        },
      },
    ],
  },
  {
    property: "Downtown Loft",
    propertyId: "prop-2",
    dates: [
      {
        date: "2026-02-10",
        baseRate: 180,
        channels: {
          direct: { rate: 180, status: "parity" },
          airbnb: { rate: 180, status: "parity" },
          vrbo: { rate: 180, status: "parity" },
          booking: { rate: 175, status: "lower", diff: "-2.8%" },
          expedia: { rate: 180, status: "parity" },
        },
      },
      {
        date: "2026-02-11",
        baseRate: 180,
        channels: {
          direct: { rate: 180, status: "parity" },
          airbnb: { rate: 195, status: "higher", diff: "+8.3%" },
          vrbo: { rate: 180, status: "parity" },
          booking: { rate: 180, status: "parity" },
          expedia: { rate: 180, status: "parity" },
        },
      },
    ],
  },
];

// Parity statistics
const parityStats = {
  totalChecks: 240,
  inParity: 218,
  violations: 22,
  parityRate: 90.8,
  avgVariance: 3.2,
  lastCheck: "2 minutes ago",
};

// Parity alerts
const parityAlerts = [
  { id: 1, property: "Malibu Beach Villa", channel: "Airbnb", date: "Feb 13", issue: "Rate 5.9% higher than base", severity: "warning" },
  { id: 2, property: "Malibu Beach Villa", channel: "Booking.com", date: "Feb 10", issue: "Rate 2.3% lower than base", severity: "info" },
  { id: 3, property: "Downtown Loft", channel: "Airbnb", date: "Feb 11", issue: "Rate 8.3% higher than base", severity: "warning" },
  { id: 4, property: "Malibu Beach Villa", channel: "VRBO", date: "Feb 12", issue: "Rate 4.0% higher than base", severity: "info" },
];

export default function RateParityPage() {
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [dateRange, setDateRange] = useState("week");
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckParity = () => {
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "parity":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "higher":
        return <ArrowUpRight className="h-4 w-4 text-amber-400" />;
      case "lower":
        return <ArrowDownRight className="h-4 w-4 text-blue-400" />;
      default:
        return <Minus className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "parity":
        return "bg-emerald-500/20 text-emerald-400";
      case "higher":
        return "bg-amber-500/20 text-amber-400";
      case "lower":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-zinc-500/20 text-zinc-400";
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
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Scale className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Rate Parity Monitor</h1>
                  <p className="text-xs text-zinc-400">Channel pricing consistency</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="prop-1">Malibu Beach Villa</SelectItem>
                  <SelectItem value="prop-2">Downtown Loft</SelectItem>
                  <SelectItem value="prop-3">Mountain Retreat</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button
                onClick={handleCheckParity}
                disabled={isChecking}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
                {isChecking ? "Checking..." : "Check Parity"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border-emerald-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400">Parity Rate</p>
                  <p className="text-3xl font-bold text-white">{parityStats.parityRate}%</p>
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
                  <p className="text-sm text-zinc-400">Total Checks</p>
                  <p className="text-2xl font-bold text-white">{parityStats.totalChecks}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">In Parity</p>
                  <p className="text-2xl font-bold text-emerald-400">{parityStats.inParity}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <Scale className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Violations</p>
                  <p className="text-2xl font-bold text-amber-400">{parityStats.violations}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Avg Variance</p>
                  <p className="text-2xl font-bold text-white">{parityStats.avgVariance}%</p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/20">
                  <TrendingUp className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rate Comparison Table */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Rate Comparison</CardTitle>
                    <CardDescription>Compare rates across all channels</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {rateParityData.map((property) => (
                  <div key={property.propertyId} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-medium text-white mb-4">{property.property}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-700">
                            <th className="text-left p-3 text-zinc-400">Date</th>
                            <th className="text-center p-3 text-zinc-400">Base</th>
                            {channels.map((channel) => (
                              <th key={channel.id} className="text-center p-3">
                                <div className="flex items-center justify-center gap-1">
                                  <span>{channel.logo}</span>
                                  <span className="text-zinc-400 text-xs">{channel.name}</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {property.dates.map((dateData) => (
                            <tr key={dateData.date} className="border-b border-zinc-800">
                              <td className="p-3 text-white font-mono">{dateData.date}</td>
                              <td className="p-3 text-center">
                                <span className="font-bold text-white">${dateData.baseRate}</span>
                              </td>
                              {channels.map((channel) => {
                                const channelData = dateData.channels[channel.id as keyof typeof dateData.channels];
                                return (
                                  <td key={channel.id} className="p-3 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="flex items-center gap-1">
                                        {getStatusIcon(channelData.status)}
                                        <span className={channelData.status === "parity" ? "text-white" : channelData.status === "higher" ? "text-amber-400" : "text-blue-400"}>
                                          ${channelData.rate}
                                        </span>
                                      </div>
                                      {channelData.diff && (
                                        <span className={`text-xs ${channelData.status === "higher" ? "text-amber-400" : "text-blue-400"}`}>
                                          {channelData.diff}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Actions */}
          <div className="space-y-6">
            {/* Parity Legend */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Status Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Parity</span>
                  </div>
                  <span className="text-xs text-zinc-400">Rates match base price</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20">
                    <ArrowUpRight className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-amber-400">Higher</span>
                  </div>
                  <span className="text-xs text-zinc-400">Rate above base price</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20">
                    <ArrowDownRight className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-400">Lower</span>
                  </div>
                  <span className="text-xs text-zinc-400">Rate below base price</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Bell className="h-4 w-4 text-amber-400" />
                    Recent Alerts
                  </CardTitle>
                  <Badge variant="outline">{parityAlerts.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {parityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === "warning"
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-blue-500/10 border-blue-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{alert.property}</span>
                      <Badge className={alert.severity === "warning" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400">{alert.channel} • {alert.date}</p>
                    <p className="text-xs text-zinc-300 mt-1">{alert.issue}</p>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Scale className="h-4 w-4 mr-2" />
                  Sync All Rates
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Tolerance
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Alert Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Channel Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
