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
  Receipt,
  Plus,
  Download,
  Upload,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Home,
  Wrench,
  Droplets,
  Zap,
  Wifi,
  Shield,
  Sparkles,
  Users,
  Car,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Camera,
} from "lucide-react";

// Mock expense categories
const categories = [
  { id: "cleaning", name: "Cleaning", icon: Sparkles, color: "bg-cyan-500", budget: 1500, spent: 1280 },
  { id: "maintenance", name: "Maintenance", icon: Wrench, color: "bg-amber-500", budget: 2000, spent: 1650 },
  { id: "utilities", name: "Utilities", icon: Zap, color: "bg-violet-500", budget: 800, spent: 720 },
  { id: "supplies", name: "Supplies", icon: Home, color: "bg-emerald-500", budget: 500, spent: 380 },
  { id: "insurance", name: "Insurance", icon: Shield, color: "bg-blue-500", budget: 400, spent: 400 },
  { id: "internet", name: "Internet/Cable", icon: Wifi, color: "bg-pink-500", budget: 200, spent: 180 },
  { id: "landscaping", name: "Landscaping", icon: Droplets, color: "bg-green-500", budget: 600, spent: 450 },
  { id: "management", name: "Property Management", icon: Users, color: "bg-orange-500", budget: 1200, spent: 1200 },
];

// Mock transactions
const transactions = [
  { id: 1, date: "2026-02-02", description: "Deep cleaning after checkout", category: "cleaning", amount: 180, property: "Malibu Beach Villa", vendor: "CleanPro Services", receipt: true },
  { id: 2, date: "2026-02-01", description: "HVAC filter replacement", category: "maintenance", amount: 85, property: "Malibu Beach Villa", vendor: "Cool Air Inc", receipt: true },
  { id: 3, date: "2026-01-30", description: "Pool chemicals", category: "supplies", amount: 120, property: "Malibu Beach Villa", vendor: "Pool Supply Co", receipt: true },
  { id: 4, date: "2026-01-28", description: "Electric bill - January", category: "utilities", amount: 245, property: "Malibu Beach Villa", vendor: "SoCal Edison", receipt: false },
  { id: 5, date: "2026-01-25", description: "Lawn maintenance", category: "landscaping", amount: 150, property: "Malibu Beach Villa", vendor: "Green Thumb", receipt: true },
  { id: 6, date: "2026-01-22", description: "Plumber - toilet repair", category: "maintenance", amount: 275, property: "Downtown Loft", vendor: "Quick Fix Plumbing", receipt: true },
  { id: 7, date: "2026-01-20", description: "Linens and towels", category: "supplies", amount: 320, property: "Mountain Retreat", vendor: "Home Depot", receipt: true },
  { id: 8, date: "2026-01-18", description: "Standard cleaning", category: "cleaning", amount: 120, property: "Downtown Loft", vendor: "CleanPro Services", receipt: true },
  { id: 9, date: "2026-01-15", description: "Internet service", category: "internet", amount: 89, property: "Malibu Beach Villa", vendor: "Spectrum", receipt: false },
  { id: 10, date: "2026-01-12", description: "Property insurance - monthly", category: "insurance", amount: 400, property: "Malibu Beach Villa", vendor: "Allstate", receipt: true },
];

// Monthly expense data
const monthlyData = [
  { month: "Sep", expenses: 4200, revenue: 12500 },
  { month: "Oct", expenses: 3800, revenue: 15200 },
  { month: "Nov", expenses: 4500, revenue: 11800 },
  { month: "Dec", expenses: 5200, revenue: 18500 },
  { month: "Jan", expenses: 4800, revenue: 14200 },
  { month: "Feb", expenses: 2100, revenue: 8500 },
];

export default function ExpensesPage() {
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const budgetRemaining = totalBudget - totalSpent;
  const budgetUsedPercent = Math.round((totalSpent / totalBudget) * 100);

  const maxMonthly = Math.max(...monthlyData.map((m) => Math.max(m.expenses, m.revenue)));

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
                <div className="p-2 rounded-lg bg-rose-500/20">
                  <Receipt className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Expense Tracking</h1>
                  <p className="text-xs text-zinc-400">Monitor property expenses and budgets</p>
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
                  <SelectItem value="malibu">Malibu Beach Villa</SelectItem>
                  <SelectItem value="downtown">Downtown Loft</SelectItem>
                  <SelectItem value="mountain">Mountain Retreat</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
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
                  <p className="text-sm text-zinc-400">Total Budget</p>
                  <p className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400 mt-1">Monthly allocation</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <PieChart className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Spent This Month</p>
                  <p className="text-2xl font-bold text-rose-400">${totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400 mt-1">{budgetUsedPercent}% of budget</p>
                </div>
                <div className="p-3 rounded-lg bg-rose-500/20">
                  <TrendingDown className="h-6 w-6 text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Remaining</p>
                  <p className="text-2xl font-bold text-emerald-400">${budgetRemaining.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400 mt-1">{100 - budgetUsedPercent}% available</p>
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
                  <p className="text-sm text-zinc-400">Net Profit (MTD)</p>
                  <p className="text-2xl font-bold text-emerald-400">$6,400</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +12% vs last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Budget by Category */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Budget by Category</CardTitle>
                <CardDescription>Monthly budget allocation and spending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => {
                  const percent = Math.round((category.spent / category.budget) * 100);
                  const isOverBudget = percent > 100;
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${category.color}/20`}>
                            <IconComponent className={`h-4 w-4 ${category.color.replace("bg-", "text-")}`} />
                          </div>
                          <span className="text-sm text-white">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-white">${category.spent}</span>
                          <span className="text-xs text-zinc-400"> / ${category.budget}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isOverBudget ? "bg-red-500" : category.color}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      {isOverBudget && (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Over budget by ${category.spent - category.budget}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Revenue vs Expenses Chart */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-40">
                  {monthlyData.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-0.5 h-32">
                        <div
                          className="flex-1 bg-emerald-500 rounded-t"
                          style={{ height: `${(month.revenue / maxMonthly) * 100}%`, marginTop: "auto" }}
                        />
                        <div
                          className="flex-1 bg-rose-500 rounded-t"
                          style={{ height: `${(month.expenses / maxMonthly) * 100}%`, marginTop: "auto" }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-xs text-zinc-400">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-rose-500" />
                    <span className="text-xs text-zinc-400">Expenses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Transactions</CardTitle>
                    <CardDescription>All expense records</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-36 bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => {
                    const category = categories.find((c) => c.id === tx.category);
                    const IconComponent = category?.icon || Receipt;
                    return (
                      <div key={tx.id} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <div className={`p-2 rounded-lg ${category?.color}/20`}>
                          <IconComponent className={`h-5 w-5 ${category?.color.replace("bg-", "text-")}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{tx.description}</h4>
                            {tx.receipt && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                <Camera className="h-3 w-3 mr-1" />
                                Receipt
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">{tx.vendor} • {tx.property}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-rose-400">-${tx.amount}</p>
                          <p className="text-xs text-zinc-500">{tx.date}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-zinc-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-400">Showing 10 of 156 transactions</p>
                  <Button variant="outline" size="sm">
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Expense */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Quick Add Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-zinc-400 text-sm">Amount</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input placeholder="0.00" className="bg-zinc-800 border-zinc-700 pl-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-sm">Category</Label>
                    <Select>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-sm">Description</Label>
                    <Input placeholder="What was this for?" className="bg-zinc-800 border-zinc-700 mt-1" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
