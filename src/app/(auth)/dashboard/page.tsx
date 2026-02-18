import Link from "next/link";
import {
  TrendingUp,
  Home,
  Calendar,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AnalyticsChart from "@/components/AnalyticsChart";

const kpis = [
  {
    label: "Occupancy Rate",
    value: "78%",
    change: "+4.2%",
    up: true,
    icon: Home,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Avg. Daily Rate",
    value: "$187",
    change: "+$12",
    up: true,
    icon: DollarSign,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Revenue (MTD)",
    value: "$14,320",
    change: "+18%",
    up: true,
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "Avg. Review Score",
    value: "4.87",
    change: "-0.03",
    up: false,
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const upcomingBookings = [
  {
    guest: "Alex Johnson",
    property: "Ocean View Suite",
    checkIn: "Feb 20",
    checkOut: "Feb 24",
    nights: 4,
    total: "$748",
    status: "confirmed",
  },
  {
    guest: "Maria Garcia",
    property: "Downtown Loft",
    checkIn: "Feb 22",
    checkOut: "Feb 25",
    nights: 3,
    total: "$561",
    status: "confirmed",
  },
  {
    guest: "Tom Williams",
    property: "Mountain Cabin",
    checkIn: "Feb 28",
    checkOut: "Mar 4",
    nights: 4,
    total: "$892",
    status: "pending",
  },
];

const tasks = [
  { label: "Cleaning scheduled — Ocean View Suite", due: "Feb 20, 10:00 AM", done: false, urgent: true },
  { label: "Guest check-in instructions sent — Downtown Loft", due: "Feb 22, 3:00 PM", done: true, urgent: false },
  { label: "Smart lock code generated — Mountain Cabin", due: "Feb 28, 4:00 PM", done: false, urgent: false },
  { label: "Tax report Q4 ready for review", due: "Mar 1", done: false, urgent: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back — here&apos;s your portfolio at a glance.
          </p>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
        >
          + Add listing
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  k.up ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-0.5">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Upcoming bookings */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Upcoming Bookings</h2>
            <Link href="/bookings" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingBookings.map((b) => (
              <div key={b.guest} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{b.guest}</div>
                  <div className="text-xs text-muted-foreground truncate">{b.property}</div>
                </div>
                <div className="text-xs text-muted-foreground text-center hidden sm:block">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {b.checkIn} → {b.checkOut}
                  </div>
                  <div>{b.nights} nights</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-sm">{b.total}</div>
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      b.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Tasks & Alerts</h2>
            <span className="text-xs text-muted-foreground">{tasks.filter((t) => !t.done).length} pending</span>
          </div>
          <div className="divide-y divide-border">
            {tasks.map((t) => (
              <div key={t.label} className="px-5 py-3.5 flex items-start gap-3">
                {t.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : t.urgent ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs leading-snug ${t.done ? "line-through text-muted-foreground" : ""}`}>
                    {t.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics chart */}
      <AnalyticsChart />

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Manage Listings", href: "/listings", icon: Home },
          { label: "View Bookings", href: "/bookings", icon: Calendar },
          { label: "Pricing Rules", href: "/pricing", icon: DollarSign },
          { label: "Guest Messages", href: "/messaging", icon: Star },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
          >
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
