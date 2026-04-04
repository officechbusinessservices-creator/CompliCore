"use client";

import { useState } from "react";
import Link from "next/link";

interface Owner {
  id: string;
  name: string;
  email: string;
  avatar: string;
  properties: number;
  totalRevenue: number;
  pendingPayout: number;
  lastReport: Date;
}

interface PropertyReport {
  id: string;
  name: string;
  ownerId: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  occupancy: number;
  bookings: number;
  avgNightlyRate: number;
  rating: number;
}

interface Expense {
  id: string;
  propertyId: string;
  category: "cleaning" | "maintenance" | "utilities" | "supplies" | "management_fee" | "other";
  description: string;
  amount: number;
  date: Date;
}

const mockOwners: Owner[] = [
  {
    id: "owner1",
    name: "Robert Chen",
    email: "robert.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    properties: 3,
    totalRevenue: 28450,
    pendingPayout: 4250,
    lastReport: new Date("2026-01-31"),
  },
  {
    id: "owner2",
    name: "Sarah Mitchell",
    email: "s.mitchell@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    properties: 2,
    totalRevenue: 18920,
    pendingPayout: 2840,
    lastReport: new Date("2026-01-31"),
  },
  {
    id: "owner3",
    name: "David Park",
    email: "david.park@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    properties: 1,
    totalRevenue: 8650,
    pendingPayout: 1290,
    lastReport: new Date("2026-01-31"),
  },
];

const mockPropertyReports: PropertyReport[] = [
  { id: "1", name: "Modern Downtown Loft", ownerId: "owner1", revenue: 12450, expenses: 2890, netIncome: 9560, occupancy: 78, bookings: 28, avgNightlyRate: 185, rating: 4.92 },
  { id: "2", name: "Cozy Beach Cottage", ownerId: "owner1", revenue: 8900, expenses: 2150, netIncome: 6750, occupancy: 65, bookings: 18, avgNightlyRate: 195, rating: 4.85 },
  { id: "3", name: "Mountain View Cabin", ownerId: "owner1", revenue: 7100, expenses: 1890, netIncome: 5210, occupancy: 52, bookings: 12, avgNightlyRate: 225, rating: 4.78 },
  { id: "4", name: "Urban Studio Apartment", ownerId: "owner2", revenue: 10500, expenses: 1950, netIncome: 8550, occupancy: 82, bookings: 35, avgNightlyRate: 125, rating: 4.95 },
  { id: "5", name: "Lakeside Retreat", ownerId: "owner2", revenue: 8420, expenses: 2100, netIncome: 6320, occupancy: 58, bookings: 14, avgNightlyRate: 245, rating: 4.88 },
  { id: "6", name: "City Center Penthouse", ownerId: "owner3", revenue: 8650, expenses: 1680, netIncome: 6970, occupancy: 71, bookings: 22, avgNightlyRate: 175, rating: 4.91 },
];

const mockExpenses: Expense[] = [
  { id: "e1", propertyId: "1", category: "cleaning", description: "Professional cleaning service", amount: 450, date: new Date("2026-01-28") },
  { id: "e2", propertyId: "1", category: "management_fee", description: "Monthly management fee (15%)", amount: 1867, date: new Date("2026-01-31") },
  { id: "e3", propertyId: "1", category: "maintenance", description: "HVAC filter replacement", amount: 85, date: new Date("2026-01-15") },
  { id: "e4", propertyId: "1", category: "supplies", description: "Guest amenities restock", amount: 245, date: new Date("2026-01-20") },
  { id: "e5", propertyId: "1", category: "utilities", description: "Electricity bill", amount: 143, date: new Date("2026-01-05") },
];

const categoryLabels: Record<Expense["category"], string> = {
  cleaning: "Cleaning",
  maintenance: "Maintenance",
  utilities: "Utilities",
  supplies: "Supplies",
  management_fee: "Management Fee",
  other: "Other",
};

const categoryColors: Record<Expense["category"], string> = {
  cleaning: "bg-blue-500",
  maintenance: "bg-amber-500",
  utilities: "bg-violet-500",
  supplies: "bg-emerald-500",
  management_fee: "bg-rose-500",
  other: "bg-zinc-500",
};

export default function OwnerReportsPage() {
  const [selectedOwner, setSelectedOwner] = useState<string | null>("owner1");
  const [reportPeriod, setReportPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const currentOwner = mockOwners.find((o) => o.id === selectedOwner);
  const ownerProperties = mockPropertyReports.filter((p) => p.ownerId === selectedOwner);
  const propertyExpenses = mockExpenses.filter((e) => e.propertyId === (selectedProperty || ownerProperties[0]?.id));

  const totalRevenue = ownerProperties.reduce((acc, p) => acc + p.revenue, 0);
  const totalExpenses = ownerProperties.reduce((acc, p) => acc + p.expenses, 0);
  const totalNetIncome = ownerProperties.reduce((acc, p) => acc + p.netIncome, 0);
  const avgOccupancy = Math.round(ownerProperties.reduce((acc, p) => acc + p.occupancy, 0) / ownerProperties.length);

  const managementFeeRate = 0.15;
  const managementFee = Math.round(totalRevenue * managementFeeRate);
  const ownerPayout = totalNetIncome - managementFee;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Owner Reports</h1>
              <p className="text-xs text-zinc-500">Property manager dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
              {(["monthly", "quarterly", "yearly"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setReportPeriod(period)}
                  className={`px-3 py-1.5 text-sm rounded capitalize transition-colors ${
                    reportPeriod === period
                      ? "bg-white dark:bg-zinc-700 shadow-sm font-medium"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Owner List */}
          <div className="space-y-4">
            <h2 className="font-semibold">Property Owners</h2>
            {mockOwners.map((owner) => (
              <button
                key={owner.id}
                onClick={() => setSelectedOwner(owner.id)}
                className={`w-full p-4 text-left bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                  selectedOwner === owner.id
                    ? "border-emerald-500 ring-1 ring-emerald-500/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={owner.avatar} alt={owner.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{owner.name}</h3>
                    <p className="text-sm text-zinc-500">{owner.properties} properties</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${(owner.totalRevenue / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-zinc-500">Revenue</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">${(owner.pendingPayout / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-zinc-500">Pending</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Report Content */}
          {currentOwner ? (
            <div className="lg:col-span-3 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Gross Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">${totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Net Income</p>
                  <p className="text-2xl font-bold">${totalNetIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Avg Occupancy</p>
                  <p className="text-2xl font-bold">{avgOccupancy}%</p>
                </div>
              </div>

              {/* Owner Payout Summary */}
              <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Owner Payout Summary</h3>
                    <p className="text-sm text-zinc-500">For {currentOwner.name} - January 2026</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
                    Process Payout
                  </button>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                    <p className="text-sm text-zinc-500">Net Income</p>
                    <p className="text-xl font-bold">${totalNetIncome.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                    <p className="text-sm text-zinc-500">Management Fee ({(managementFeeRate * 100).toFixed(0)}%)</p>
                    <p className="text-xl font-bold text-rose-600 dark:text-rose-400">-${managementFee.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                    <p className="text-sm text-zinc-500">Owner Payout</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${ownerPayout.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                    <p className="text-sm text-zinc-500">Payout Date</p>
                    <p className="text-xl font-bold">Feb 5, 2026</p>
                  </div>
                </div>
              </div>

              {/* Property Performance */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold mb-4">Property Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                        <th className="pb-3 font-medium">Property</th>
                        <th className="pb-3 font-medium text-right">Revenue</th>
                        <th className="pb-3 font-medium text-right">Expenses</th>
                        <th className="pb-3 font-medium text-right">Net Income</th>
                        <th className="pb-3 font-medium text-right">Occupancy</th>
                        <th className="pb-3 font-medium text-right">Bookings</th>
                        <th className="pb-3 font-medium text-right">ADR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {ownerProperties.map((property) => (
                        <tr
                          key={property.id}
                          onClick={() => setSelectedProperty(property.id)}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{property.name}</p>
                              <div className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs text-zinc-500">{property.rating}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            ${property.revenue.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-rose-600 dark:text-rose-400">
                            ${property.expenses.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-medium">
                            ${property.netIncome.toLocaleString()}
                          </td>
                          <td className="py-3 text-right">
                            <span className={property.occupancy >= 70 ? "text-emerald-600 dark:text-emerald-400" : property.occupancy >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}>
                              {property.occupancy}%
                            </span>
                          </td>
                          <td className="py-3 text-right">{property.bookings}</td>
                          <td className="py-3 text-right">${property.avgNightlyRate}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-zinc-200 dark:border-zinc-800">
                      <tr className="font-semibold">
                        <td className="pt-3">Total</td>
                        <td className="pt-3 text-right text-emerald-600 dark:text-emerald-400">${totalRevenue.toLocaleString()}</td>
                        <td className="pt-3 text-right text-rose-600 dark:text-rose-400">${totalExpenses.toLocaleString()}</td>
                        <td className="pt-3 text-right">${totalNetIncome.toLocaleString()}</td>
                        <td className="pt-3 text-right">{avgOccupancy}%</td>
                        <td className="pt-3 text-right">{ownerProperties.reduce((acc, p) => acc + p.bookings, 0)}</td>
                        <td className="pt-3 text-right">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-semibold mb-4">Expense Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      propertyExpenses.reduce((acc, e) => {
                        acc[e.category] = (acc[e.category] || 0) + e.amount;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([category, amount]) => (
                      <div key={category} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${categoryColors[category as Expense["category"]]}`} />
                        <span className="flex-1 text-sm">{categoryLabels[category as Expense["category"]]}</span>
                        <span className="font-medium">${amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="h-4 rounded-full overflow-hidden flex">
                      {Object.entries(
                        propertyExpenses.reduce((acc, e) => {
                          acc[e.category] = (acc[e.category] || 0) + e.amount;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, amount]) => {
                        const total = propertyExpenses.reduce((acc, e) => acc + e.amount, 0);
                        const percentage = (amount / total) * 100;
                        return (
                          <div
                            key={category}
                            className={`${categoryColors[category as Expense["category"]]}`}
                            style={{ width: `${percentage}%` }}
                            title={`${categoryLabels[category as Expense["category"]]}: $${amount}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-semibold mb-4">Recent Expenses</h3>
                  <div className="space-y-3">
                    {propertyExpenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${categoryColors[expense.category]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{expense.description}</p>
                          <p className="text-xs text-zinc-500">{expense.date.toLocaleDateString()}</p>
                        </div>
                        <span className="font-medium text-rose-600 dark:text-rose-400">-${expense.amount}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                    View all expenses
                  </button>
                </div>
              </div>

              {/* Send Report */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Send Report to Owner</h3>
                    <p className="text-sm text-zinc-500">Email a PDF report to {currentOwner.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm">
                      Preview
                    </button>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-3 p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium">Select an owner</p>
              <p className="text-sm">Click on an owner to view their report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
