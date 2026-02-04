"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";

interface TaxJurisdiction {
  id: string;
  name: string;
  type: "state" | "county" | "city" | "tourism";
  rate: number;
  appliesTo: string[];
  filingFrequency: "monthly" | "quarterly" | "annually";
  nextDue: string;
  autoRemit: boolean;
}

interface TaxTransaction {
  id: string;
  bookingId: string;
  guestName: string;
  property: string;
  checkIn: string;
  nights: number;
  subtotal: number;
  taxes: { jurisdiction: string; amount: number }[];
  totalTax: number;
  status: "collected" | "remitted" | "pending";
}

interface TaxReport {
  period: string;
  jurisdiction: string;
  collected: number;
  remitted: number;
  due: number;
  status: "filed" | "pending" | "overdue";
  filingDeadline: string;
}

const jurisdictions: TaxJurisdiction[] = [
  { id: "j1", name: "California State", type: "state", rate: 7.25, appliesTo: ["Modern Downtown Loft"], filingFrequency: "quarterly", nextDue: "2026-04-15", autoRemit: true },
  { id: "j2", name: "San Francisco County", type: "county", rate: 1.25, appliesTo: ["Modern Downtown Loft"], filingFrequency: "quarterly", nextDue: "2026-04-15", autoRemit: true },
  { id: "j3", name: "San Francisco TOT", type: "tourism", rate: 14.0, appliesTo: ["Modern Downtown Loft"], filingFrequency: "monthly", nextDue: "2026-03-01", autoRemit: false },
  { id: "j4", name: "Florida State", type: "state", rate: 6.0, appliesTo: ["Cozy Beachfront Cottage"], filingFrequency: "monthly", nextDue: "2026-03-01", autoRemit: true },
  { id: "j5", name: "Miami-Dade County", type: "county", rate: 1.0, appliesTo: ["Cozy Beachfront Cottage"], filingFrequency: "monthly", nextDue: "2026-03-01", autoRemit: true },
  { id: "j6", name: "Miami Beach Resort Tax", type: "tourism", rate: 4.0, appliesTo: ["Cozy Beachfront Cottage"], filingFrequency: "monthly", nextDue: "2026-03-01", autoRemit: false },
  { id: "j7", name: "Colorado State", type: "state", rate: 2.9, appliesTo: ["Luxury Mountain Cabin"], filingFrequency: "monthly", nextDue: "2026-03-01", autoRemit: true },
  { id: "j8", name: "Summit County", type: "county", rate: 3.5, appliesTo: ["Luxury Mountain Cabin"], filingFrequency: "quarterly", nextDue: "2026-04-15", autoRemit: false },
];

const transactions: TaxTransaction[] = [
  {
    id: "tx1",
    bookingId: "HX4K9M2",
    guestName: "Alex Johnson",
    property: "Modern Downtown Loft",
    checkIn: "2026-02-01",
    nights: 3,
    subtotal: 597,
    taxes: [
      { jurisdiction: "California State", amount: 43.28 },
      { jurisdiction: "San Francisco County", amount: 7.46 },
      { jurisdiction: "San Francisco TOT", amount: 83.58 },
    ],
    totalTax: 134.32,
    status: "collected",
  },
  {
    id: "tx2",
    bookingId: "JK7L3P9",
    guestName: "Maria Garcia",
    property: "Cozy Beachfront Cottage",
    checkIn: "2026-01-28",
    nights: 4,
    subtotal: 876,
    taxes: [
      { jurisdiction: "Florida State", amount: 52.56 },
      { jurisdiction: "Miami-Dade County", amount: 8.76 },
      { jurisdiction: "Miami Beach Resort Tax", amount: 35.04 },
    ],
    totalTax: 96.36,
    status: "remitted",
  },
  {
    id: "tx3",
    bookingId: "MN5R2T8",
    guestName: "James Wilson",
    property: "Luxury Mountain Cabin",
    checkIn: "2026-02-05",
    nights: 5,
    subtotal: 1495,
    taxes: [
      { jurisdiction: "Colorado State", amount: 43.36 },
      { jurisdiction: "Summit County", amount: 52.33 },
    ],
    totalTax: 95.69,
    status: "pending",
  },
];

const reports: TaxReport[] = [
  { period: "Q4 2025", jurisdiction: "California State", collected: 856.42, remitted: 856.42, due: 0, status: "filed", filingDeadline: "2026-01-15" },
  { period: "Q4 2025", jurisdiction: "San Francisco County", collected: 147.65, remitted: 147.65, due: 0, status: "filed", filingDeadline: "2026-01-15" },
  { period: "January 2026", jurisdiction: "San Francisco TOT", collected: 1254.87, remitted: 0, due: 1254.87, status: "pending", filingDeadline: "2026-03-01" },
  { period: "January 2026", jurisdiction: "Florida State", collected: 423.18, remitted: 423.18, due: 0, status: "filed", filingDeadline: "2026-02-20" },
  { period: "Q4 2025", jurisdiction: "Summit County", collected: 312.45, remitted: 0, due: 312.45, status: "overdue", filingDeadline: "2026-01-15" },
];

const typeColors = {
  state: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  county: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  city: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  tourism: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const statusColors = {
  collected: "bg-blue-500/10 text-blue-600",
  remitted: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  filed: "bg-emerald-500/10 text-emerald-600",
  overdue: "bg-rose-500/10 text-rose-600",
};

export default function TaxesPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "jurisdictions" | "transactions" | "reports">("overview");

  const totalCollected = transactions.reduce((sum, t) => sum + t.totalTax, 0);
  const totalRemitted = transactions.filter((t) => t.status === "remitted").reduce((sum, t) => sum + t.totalTax, 0);
  const totalDue = reports.filter((r) => r.status !== "filed").reduce((sum, r) => sum + r.due, 0);
  const overdueCount = reports.filter((r) => r.status === "overdue").length;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Tax Management</h1>
              <p className="text-xs text-zinc-500">Calculation & reporting by jurisdiction</p>
            </div>
          </div>
          {overdueCount > 0 && (
            <span className="px-3 py-1.5 bg-rose-500/10 text-rose-600 rounded-full text-sm font-medium">
              {overdueCount} overdue filing{overdueCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Collected</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCollected)}</p>
            <p className="text-xs text-zinc-400">This month</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Remitted</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRemitted)}</p>
            <p className="text-xs text-zinc-400">Paid to authorities</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Amount Due</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalDue)}</p>
            <p className="text-xs text-zinc-400">To be remitted</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Jurisdictions</p>
            <p className="text-2xl font-bold">{jurisdictions.length}</p>
            <p className="text-xs text-zinc-400">Active tax zones</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["overview", "jurisdictions", "transactions", "reports"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {reports.filter((r) => r.status !== "filed").sort((a, b) => new Date(a.filingDeadline).getTime() - new Date(b.filingDeadline).getTime()).map((report) => (
                  <div key={`${report.period}-${report.jurisdiction}`} className={`p-3 rounded-lg ${report.status === "overdue" ? "bg-rose-50 dark:bg-rose-950/20" : "bg-zinc-50 dark:bg-zinc-800/50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{report.jurisdiction}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">{report.period}</span>
                      <span className={report.status === "overdue" ? "text-rose-600 font-medium" : "text-zinc-600"}>
                        Due: {new Date(report.filingDeadline).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mt-1">{formatCurrency(report.due)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Breakdown by Type */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Tax Breakdown by Type</h3>
              <div className="space-y-4">
                {(["state", "county", "tourism"] as const).map((type) => {
                  const typeJurisdictions = jurisdictions.filter((j) => j.type === type);
                  const avgRate = typeJurisdictions.reduce((sum, j) => sum + j.rate, 0) / typeJurisdictions.length;

                  return (
                    <div key={type} className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs capitalize ${typeColors[type]}`}>
                        {type}
                      </span>
                      <div className="flex-1">
                        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              type === "state" ? "bg-blue-500" :
                              type === "county" ? "bg-violet-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${(avgRate / 15) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">{avgRate.toFixed(1)}% avg</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tax Calculator */}
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4">Quick Tax Calculator</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-white/80 mb-1">Property</label>
                  <select className="w-full px-3 py-2 bg-white/20 rounded-lg text-white">
                    <option>Modern Downtown Loft</option>
                    <option>Cozy Beachfront Cottage</option>
                    <option>Luxury Mountain Cabin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Subtotal</label>
                  <input type="number" defaultValue={500} className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Nights</label>
                  <input type="number" defaultValue={3} className="w-full px-3 py-2 bg-white/20 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Estimated Tax</label>
                  <div className="px-3 py-2 bg-white/20 rounded-lg">
                    <p className="text-xl font-bold">$112.50</p>
                    <p className="text-xs text-white/70">22.5% total rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "jurisdictions" && (
          <div className="space-y-4">
            {jurisdictions.map((jurisdiction) => (
              <div key={jurisdiction.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs capitalize ${typeColors[jurisdiction.type]}`}>
                      {jurisdiction.type}
                    </span>
                    <div>
                      <h3 className="font-medium">{jurisdiction.name}</h3>
                      <p className="text-sm text-zinc-500">{jurisdiction.appliesTo.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{jurisdiction.rate}%</p>
                      <p className="text-xs text-zinc-500">Tax Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium capitalize">{jurisdiction.filingFrequency}</p>
                      <p className="text-xs text-zinc-500">Filing</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{new Date(jurisdiction.nextDue).toLocaleDateString()}</p>
                      <p className="text-xs text-zinc-500">Next Due</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs ${jurisdiction.autoRemit ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"}`}>
                      {jurisdiction.autoRemit ? "Auto-remit" : "Manual"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="text-left p-4 font-medium text-sm">Booking</th>
                  <th className="text-left p-4 font-medium text-sm">Property</th>
                  <th className="text-right p-4 font-medium text-sm">Subtotal</th>
                  <th className="text-right p-4 font-medium text-sm">Total Tax</th>
                  <th className="text-center p-4 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <td className="p-4">
                      <p className="font-medium">{tx.bookingId}</p>
                      <p className="text-sm text-zinc-500">{tx.guestName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{tx.property}</p>
                      <p className="text-xs text-zinc-500">{tx.nights} nights</p>
                    </td>
                    <td className="p-4 text-right font-medium">{formatCurrency(tx.subtotal)}</td>
                    <td className="p-4 text-right">
                      <p className="font-medium">{formatCurrency(tx.totalTax)}</p>
                      <p className="text-xs text-zinc-500">{((tx.totalTax / tx.subtotal) * 100).toFixed(1)}%</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={`${report.period}-${report.jurisdiction}`} className={`bg-white dark:bg-zinc-900 rounded-xl border p-4 ${
                report.status === "overdue" ? "border-rose-500" : "border-zinc-200 dark:border-zinc-800"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{report.jurisdiction}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">{report.period}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-zinc-500">Collected</p>
                      <p className="font-medium">{formatCurrency(report.collected)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-500">Remitted</p>
                      <p className="font-medium text-emerald-600">{formatCurrency(report.remitted)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-500">Due</p>
                      <p className={`font-medium ${report.due > 0 ? "text-amber-600" : "text-zinc-400"}`}>
                        {formatCurrency(report.due)}
                      </p>
                    </div>
                    {report.status !== "filed" && (
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium">
                        File Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
