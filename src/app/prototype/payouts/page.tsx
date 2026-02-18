"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "processing" | "failed";
  method: "bank_transfer" | "paypal" | "stripe";
  bookings: {
    id: string;
    propertyName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    grossAmount: number;
    platformFee: number;
    netAmount: number;
  }[];
}

const payouts: Payout[] = [
  {
    id: "payout-1",
    date: "2026-02-01",
    amount: 2847.50,
    status: "completed",
    method: "bank_transfer",
    bookings: [
      { id: "b1", propertyName: "Modern Downtown Loft", guestName: "Alex J.", checkIn: "2026-01-20", checkOut: "2026-01-24", grossAmount: 856, platformFee: 85.60, netAmount: 770.40 },
      { id: "b2", propertyName: "Modern Downtown Loft", guestName: "Maria G.", checkIn: "2026-01-25", checkOut: "2026-01-28", grossAmount: 642, platformFee: 64.20, netAmount: 577.80 },
      { id: "b3", propertyName: "Cozy Beachfront Cottage", guestName: "James W.", checkIn: "2026-01-15", checkOut: "2026-01-20", grossAmount: 1665, platformFee: 166.50, netAmount: 1498.50 },
    ],
  },
  {
    id: "payout-2",
    date: "2026-01-15",
    amount: 3421.00,
    status: "completed",
    method: "bank_transfer",
    bookings: [
      { id: "b4", propertyName: "Luxury Mountain Cabin", guestName: "Emily C.", checkIn: "2026-01-05", checkOut: "2026-01-10", grossAmount: 2125, platformFee: 212.50, netAmount: 1912.50 },
      { id: "b5", propertyName: "Modern Downtown Loft", guestName: "Sarah M.", checkIn: "2026-01-08", checkOut: "2026-01-14", grossAmount: 1676, platformFee: 167.60, netAmount: 1508.40 },
    ],
  },
  {
    id: "payout-3",
    date: "2026-02-15",
    amount: 1890.00,
    status: "pending",
    method: "bank_transfer",
    bookings: [
      { id: "b6", propertyName: "Modern Downtown Loft", guestName: "John D.", checkIn: "2026-02-05", checkOut: "2026-02-08", grossAmount: 642, platformFee: 64.20, netAmount: 577.80 },
      { id: "b7", propertyName: "Cozy Beachfront Cottage", guestName: "Lisa P.", checkIn: "2026-02-01", checkOut: "2026-02-05", grossAmount: 1458, platformFee: 145.80, netAmount: 1312.20 },
    ],
  },
  {
    id: "payout-4",
    date: "2026-02-28",
    amount: 2450.00,
    status: "processing",
    method: "bank_transfer",
    bookings: [
      { id: "b8", propertyName: "Luxury Mountain Cabin", guestName: "Robert K.", checkIn: "2026-02-15", checkOut: "2026-02-20", grossAmount: 2722, platformFee: 272.20, netAmount: 2449.80 },
    ],
  },
];

const statusColors = {
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const methodLabels = {
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  stripe: "Stripe",
};

export default function PayoutsPage() {
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [dateRange, setDateRange] = useState("all");
  const [payoutsData, setPayoutsData] = useState<Payout[]>(payouts);

  useEffect(() => {
    fetchModuleData<Payout[]>("/payouts", payouts).then(setPayoutsData);
  }, []);

  // Calculate totals
  const totalPaid = payoutsData.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payoutsData.filter((p) => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0);
  const totalBookings = payoutsData.reduce((sum, p) => sum + p.bookings.length, 0);
  const avgPayout = totalPaid / payoutsData.filter((p) => p.status === "completed").length || 0;

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
              <h1 className="font-semibold text-lg">Payout History</h1>
              <p className="text-xs text-zinc-500">View all your earnings and transactions</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalPending)}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Bookings</p>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg Payout</p>
            <p className="text-2xl font-bold">{formatCurrency(avgPayout)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <select className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        {/* Payouts List */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Bookings</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Method</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
          {payoutsData.map((payout) => (
                  <tr key={payout.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="p-4">
                      <p className="font-medium">{new Date(payout.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(payout.amount)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{payout.bookings.length} booking{payout.bookings.length !== 1 ? "s" : ""}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{methodLabels[payout.method]}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[payout.status]}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedPayout(selectedPayout?.id === payout.id ? null : payout)}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        {selectedPayout?.id === payout.id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Details Modal/Expanded */}
        {selectedPayout && (
          <div className="mt-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Payout Details</h3>
                <p className="text-sm text-zinc-500">
                  {new Date(selectedPayout.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-medium text-zinc-500 mb-3">Included Bookings</h4>
              <div className="space-y-3">
                {selectedPayout.bookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{booking.propertyName}</p>
                        <p className="text-sm text-zinc-500">
                          {booking.guestName} · {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-500">Gross: {formatCurrency(booking.grossAmount)}</p>
                        <p className="text-sm text-zinc-500">Fee: -{formatCurrency(booking.platformFee)}</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">Net: {formatCurrency(booking.netAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Payout</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedPayout.amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Bank Account ending in 4242</p>
                <p className="text-sm text-zinc-500">Chase Bank · Checking</p>
              </div>
            </div>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Edit
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Payouts are processed every 2 weeks. Next payout scheduled for February 15, 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
