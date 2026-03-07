"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  TrendingUp, DollarSign, BarChart3, ArrowUpRight, Download, Loader2,
} from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api-client";

interface DashboardMetrics {
  totalRevenue: number;
  averageDailyRate: number;
  occupancyRate: number;
  totalBookings: number;
}

interface MonthRevenue {
  month: string;
  revenue: number;
}

interface BookingSource {
  source: string;
  count: number;
  revenue: number;
}

interface AnalyticsData {
  metrics: DashboardMetrics;
  monthlyRevenue: MonthRevenue[];
  bookingsBySource: BookingSource[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export default function RevenuePage() {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<AnalyticsData>("/analytics/dashboard", { token })
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load revenue data"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-rose-500">
        {error || "No data available"}
      </div>
    );
  }

  const { metrics, monthlyRevenue, bookingsBySource } = data;
  const revpar = metrics.averageDailyRate * metrics.occupancyRate;
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const maxSource = Math.max(...bookingsBySource.map((s) => s.count), 1);

  const kpis = [
    {
      label: "Revenue (MTD)",
      value: formatCurrency(metrics.totalRevenue),
      sub: "month to date",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "RevPAR",
      value: formatCurrency(revpar),
      sub: "revenue per available room",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "ADR",
      value: formatCurrency(metrics.averageDailyRate),
      sub: "average daily rate",
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Occupancy",
      value: `${Math.round(metrics.occupancyRate * 100)}%`,
      sub: "this month",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Revenue & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Month-to-date performance and booking source breakdown.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors font-medium">
          <Download className="w-4 h-4" /> Export report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold mb-0.5">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 6-month revenue bar chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-5">Revenue (6 months)</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyRevenue.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-primary/20 hover:bg-primary/40 transition-colors relative group cursor-default"
                style={{ height: `${Math.round((m.revenue / maxRevenue) * 100)}%`, minHeight: "4px" }}
              >
                {m.revenue > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] bg-popover border border-border shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {formatCurrency(m.revenue)}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking sources */}
      {bookingsBySource.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Booking Sources</h2>
          </div>
          <div className="p-5 space-y-4">
            {bookingsBySource.map((s) => (
              <div key={s.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{s.source}</span>
                  <div className="flex items-center gap-4 text-muted-foreground text-xs">
                    <span>{s.count} bookings</span>
                    <span className="font-semibold text-foreground">{formatCurrency(s.revenue)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${Math.round((s.count / maxSource) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
