"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  TrendingUp, Calendar, Home, Star, Clock, CheckCircle2,
  X, ArrowRight, Loader2,
} from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api-client";

interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  averageDailyRate: number;
  occupancyRate: number;
  averageRating: number;
  pendingBookings: number;
  upcomingCheckIns: number;
}

interface RecentBooking {
  id: number;
  confirmationCode: string;
  guestName: string;
  property: string | null;
  checkIn: string | null;
  checkOut: string | null;
  total: number;
  status: string;
}

interface MonthRevenue {
  month: string;
  revenue: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  recentBookings: RecentBooking[];
  monthlyRevenue: MonthRevenue[];
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-600 bg-emerald-500/10", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-600 bg-amber-500/10", icon: Clock },
  completed: { label: "Completed", color: "text-blue-600 bg-blue-500/10", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-rose-600 bg-rose-500/10", icon: X },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<DashboardData>("/analytics/dashboard", { token })
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load dashboard"))
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

  const { metrics, recentBookings, monthlyRevenue } = data;
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  const statCards = [
    {
      label: "Total Bookings",
      value: metrics.totalBookings,
      sub: `${metrics.pendingBookings} pending`,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Revenue (MTD)",
      value: formatCurrency(metrics.totalRevenue),
      sub: `${formatCurrency(metrics.averageDailyRate)}/night avg`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Occupancy Rate",
      value: `${Math.round(metrics.occupancyRate * 100)}%`,
      sub: "This month",
      icon: Home,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Avg Rating",
      value: metrics.averageRating > 0 ? metrics.averageRating.toFixed(2) : "—",
      sub: `${metrics.upcomingCheckIns} check-ins today`,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">This month's overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold">Revenue (6 months)</h2>
          </div>
          <div className="flex items-end gap-2 h-32">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/20 hover:bg-primary/40 transition-colors relative group"
                  style={{ height: `${Math.round((m.revenue / maxRevenue) * 100)}%`, minHeight: "4px" }}
                >
                  {m.revenue > 0 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] bg-popover border border-border shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {formatCurrency(m.revenue)}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <h2 className="text-sm font-semibold mb-3">Quick actions</h2>
          {[
            { label: "Manage bookings", href: "/bookings", count: metrics.pendingBookings, countLabel: "pending" },
            { label: "View listings", href: "/listings", count: null, countLabel: "" },
            { label: "Inbox", href: "/messaging", count: null, countLabel: "" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
            >
              <span className="text-sm">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.count != null && item.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium">
                    {item.count} {item.countLabel}
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent bookings</h2>
          <Link href="/bookings" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">No bookings yet</div>
        ) : (
          <div className="divide-y divide-border">
            {recentBookings.map((b) => {
              const sc = statusConfig[b.status] ?? statusConfig.pending;
              const StatusIcon = sc.icon;
              return (
                <div key={b.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{b.guestName}</div>
                    <div className="text-xs text-muted-foreground truncate">{b.property ?? "—"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {b.checkIn ?? "?"} → {b.checkOut ?? "?"}
                  </div>
                  {b.total > 0 && (
                    <div className="text-sm font-semibold hidden md:block">{formatCurrency(b.total)}</div>
                  )}
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${sc.color}`}>
                    <StatusIcon className="w-3 h-3" />{sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
