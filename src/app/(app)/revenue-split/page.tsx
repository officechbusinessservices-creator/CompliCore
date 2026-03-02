"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  PieChart,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Building2,
  CreditCard,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  FileText,
  Settings,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  RefreshCw,
  Eye,
  Send,
  Calculator,
  Shield,
} from "lucide-react";

// Mock properties with co-owners
const propertiesWithOwners = [
  {
    id: "prop-1",
    name: "Malibu Beach Villa",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300",
    totalRevenue: 125000,
    pendingPayout: 8500,
    owners: [
      { id: 1, name: "Sarah Johnson", email: "sarah@example.com", percentage: 60, role: "Primary Owner", bankConnected: true },
      { id: 2, name: "Michael Chen", email: "michael@example.com", percentage: 25, role: "Co-Owner", bankConnected: true },
      { id: 3, name: "Coastal Properties LLC", email: "accounting@coastal.com", percentage: 15, role: "Investor", bankConnected: true },
    ],
  },
  {
    id: "prop-2",
    name: "Mountain Retreat Cabin",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300",
    totalRevenue: 68000,
    pendingPayout: 4200,
    owners: [
      { id: 1, name: "Sarah Johnson", email: "sarah@example.com", percentage: 50, role: "Primary Owner", bankConnected: true },
      { id: 4, name: "James Wilson", email: "james@example.com", percentage: 50, role: "Co-Owner", bankConnected: false },
    ],
  },
  {
    id: "prop-3",
    name: "Downtown Loft",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300",
    totalRevenue: 42000,
    pendingPayout: 2800,
    owners: [
      { id: 1, name: "Sarah Johnson", email: "sarah@example.com", percentage: 100, role: "Sole Owner", bankConnected: true },
    ],
  },
];

// Mock payout history
const payoutHistory = [
  {
    id: 1,
    property: "Malibu Beach Villa",
    date: "2026-02-01",
    totalAmount: 12500,
    splits: [
      { owner: "Sarah Johnson", amount: 7500, percentage: 60, status: "completed" },
      { owner: "Michael Chen", amount: 3125, percentage: 25, status: "completed" },
      { owner: "Coastal Properties LLC", amount: 1875, percentage: 15, status: "completed" },
    ],
  },
  {
    id: 2,
    property: "Mountain Retreat Cabin",
    date: "2026-02-01",
    totalAmount: 5800,
    splits: [
      { owner: "Sarah Johnson", amount: 2900, percentage: 50, status: "completed" },
      { owner: "James Wilson", amount: 2900, percentage: 50, status: "pending" },
    ],
  },
  {
    id: 3,
    property: "Malibu Beach Villa",
    date: "2026-01-15",
    totalAmount: 9800,
    splits: [
      { owner: "Sarah Johnson", amount: 5880, percentage: 60, status: "completed" },
      { owner: "Michael Chen", amount: 2450, percentage: 25, status: "completed" },
      { owner: "Coastal Properties LLC", amount: 1470, percentage: 15, status: "completed" },
    ],
  },
  {
    id: 4,
    property: "Downtown Loft",
    date: "2026-01-15",
    totalAmount: 3200,
    splits: [
      { owner: "Sarah Johnson", amount: 3200, percentage: 100, status: "completed" },
    ],
  },
];

// Monthly revenue breakdown
const monthlyRevenue = [
  { month: "Sep", revenue: 18500 },
  { month: "Oct", revenue: 22000 },
  { month: "Nov", revenue: 19500 },
  { month: "Dec", revenue: 28000 },
  { month: "Jan", revenue: 24500 },
  { month: "Feb", revenue: 15500 },
];

export default function RevenueSplitPage() {
  const [selectedProperty, setSelectedProperty] = useState(propertiesWithOwners[0]);
  const [showAddOwner, setShowAddOwner] = useState(false);

  const totalRevenue = propertiesWithOwners.reduce((sum, p) => sum + p.totalRevenue, 0);
  const pendingPayouts = propertiesWithOwners.reduce((sum, p) => sum + p.pendingPayout, 0);
  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <PieChart className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Revenue Split Manager</h1>
                  <p className="text-xs text-zinc-400">Manage co-owner payouts and distributions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="h-4 w-4 mr-2" />
                Process Payouts
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Total Revenue (YTD)</p>
                  <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +18% vs last year
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Pending Payouts</p>
                  <p className="text-2xl font-bold text-amber-400">${pendingPayouts.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400 mt-1">Across all properties</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Properties</p>
                  <p className="text-2xl font-bold text-white">{propertiesWithOwners.length}</p>
                  <p className="text-xs text-zinc-400 mt-1">With revenue splits</p>
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
                  <p className="text-sm text-zinc-400">Co-Owners</p>
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-xs text-zinc-400 mt-1">Unique stakeholders</p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/20">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Properties</h2>
            {propertiesWithOwners.map((property) => (
              <button
                key={property.id}
                type="button"
                onClick={() => setSelectedProperty(property)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedProperty.id === property.id
                    ? "bg-emerald-500/20 border-emerald-500/50"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{property.name}</h3>
                    <p className="text-xs text-zinc-400">{property.owners.length} owner{property.owners.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-400">Total Revenue</p>
                    <p className="text-sm font-medium text-white">${property.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Pending</p>
                    <p className="text-sm font-medium text-amber-400">${property.pendingPayout.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedProperty.image}
                      alt={selectedProperty.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedProperty.name}</h2>
                      <p className="text-sm text-zinc-400">{selectedProperty.owners.length} stakeholder{selectedProperty.owners.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAddOwner(!showAddOwner)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Owner
                  </Button>
                </div>

                {/* Ownership Pie Chart Visualization */}
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {selectedProperty.owners.reduce<{ offset: number; elements: JSX.Element[] }>((acc, owner, index) => {
                        const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];
                        const element = (
                          <circle
                            key={owner.id}
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="3"
                            strokeDasharray={`${owner.percentage} ${100 - owner.percentage}`}
                            strokeDashoffset={-acc.offset}
                          />
                        );
                        return {
                          offset: acc.offset + owner.percentage,
                          elements: [...acc.elements, element],
                        };
                      }, { offset: 0, elements: [] }).elements}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">100%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {selectedProperty.owners.map((owner, index) => {
                      const colors = ["bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500"];
                      return (
                        <div key={owner.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                            <span className="text-sm text-white">{owner.name}</span>
                            <Badge variant="outline" className="text-xs">{owner.role}</Badge>
                          </div>
                          <span className="text-sm font-medium text-white">{owner.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owners List */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Ownership Details</CardTitle>
                <CardDescription>Manage stakeholder information and payout settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProperty.owners.map((owner, index) => {
                  const pendingAmount = (selectedProperty.pendingPayout * owner.percentage) / 100;
                  const totalEarned = (selectedProperty.totalRevenue * owner.percentage) / 100;
                  return (
                    <div key={owner.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-sm font-medium">{owner.name.split(" ").map((n) => n[0]).join("")}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{owner.name}</h4>
                            <p className="text-xs text-zinc-400">{owner.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={owner.bankConnected ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                            {owner.bankConnected ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Bank Connected
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Bank Pending
                              </>
                            )}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-zinc-900/50">
                          <p className="text-xs text-zinc-400">Ownership</p>
                          <p className="text-lg font-bold text-white">{owner.percentage}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900/50">
                          <p className="text-xs text-zinc-400">Total Earned</p>
                          <p className="text-lg font-bold text-emerald-400">${totalEarned.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900/50">
                          <p className="text-xs text-zinc-400">Pending</p>
                          <p className="text-lg font-bold text-amber-400">${pendingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Payout History */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Payout History</CardTitle>
                    <CardDescription>Recent distribution transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payoutHistory
                    .filter((p) => p.property === selectedProperty.name)
                    .map((payout) => (
                      <div key={payout.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-400" />
                            <span className="text-sm text-white">{payout.date}</span>
                          </div>
                          <span className="text-lg font-bold text-white">${payout.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="space-y-2">
                          {payout.splits.map((split, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-400">{split.owner}</span>
                                <span className="text-zinc-500">({split.percentage}%)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-white">${split.amount.toLocaleString()}</span>
                                <Badge className={split.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                                  {split.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <Card className="bg-zinc-900/50 border-zinc-800 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue across all properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-48">
              {monthlyRevenue.map((month) => {
                const height = (month.revenue / maxMonthlyRevenue) * 100;
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-zinc-400">${(month.revenue / 1000).toFixed(0)}k</span>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-zinc-500">{month.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
