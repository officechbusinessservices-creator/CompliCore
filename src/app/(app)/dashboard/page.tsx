"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { properties, formatCurrency, formatDate } from "@/lib/mockData";
import { apiGet, apiPost } from "@/lib/api";
import { PropertyCalendar } from "@/components/Calendar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WebSocketProvider, RealtimeNotificationBell } from "@/lib/websocket";

// Extended mock data for dashboard
const dashboardData = {
  stats: {
    totalBookings: 47,
    totalRevenue: 28450,
    occupancyRate: 72,
    averageRating: 4.91,
    pendingBookings: 3,
    upcomingCheckIns: 2,
  },
  recentBookings: [
    {
      id: "book-1",
      confirmationCode: "HX4K9M2",
      guestName: "Alex Johnson",
      guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      property: "Modern Downtown Loft",
      checkIn: "2026-03-15",
      checkOut: "2026-03-18",
      guests: 2,
      total: 749,
      status: "confirmed" as const,
    },
    {
      id: "book-2",
      confirmationCode: "JK7L3P9",
      guestName: "Maria Garcia",
      guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      property: "Luxury Mountain Cabin",
      checkIn: "2026-04-10",
      checkOut: "2026-04-14",
      guests: 6,
      total: 2120,
      status: "pending" as const,
    },
    {
      id: "book-3",
      confirmationCode: "MN5R2T8",
      guestName: "James Wilson",
      guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      property: "Modern Downtown Loft",
      checkIn: "2026-02-20",
      checkOut: "2026-02-23",
      guests: 2,
      total: 682,
      status: "completed" as const,
    },
    {
      id: "book-4",
      confirmationCode: "PQ9S4V1",
      guestName: "Emily Chen",
      guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      property: "Cozy Beachfront Cottage",
      checkIn: "2026-03-01",
      checkOut: "2026-03-05",
      guests: 4,
      total: 1365,
      status: "confirmed" as const,
    },
  ],
  monthlyRevenue: [
    { month: "Sep", revenue: 4200 },
    { month: "Oct", revenue: 5100 },
    { month: "Nov", revenue: 3800 },
    { month: "Dec", revenue: 6200 },
    { month: "Jan", revenue: 4800 },
    { month: "Feb", revenue: 4350 },
  ],
  upcomingPayouts: [
    { date: "2026-02-15", amount: 2450, status: "scheduled" },
    { date: "2026-02-28", amount: 1890, status: "pending" },
  ],
};

type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  roles?: string[];
};

type AuthResponse = {
  message?: string;
  expiresIn?: number;
  user: AuthUser;
};

function DashboardContent() {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const [activeTab, setActiveTab] = useState<"bookings" | "calendar" | "analytics">("bookings");
  const [metrics, setMetrics] = useState(dashboardData.stats);
  const [recentBookings, setRecentBookings] = useState(dashboardData.recentBookings);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState("host");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");

  useEffect(() => {
    apiGet<AuthUser>("/auth/me")
      .then((user) => setAuthUser(user))
      .catch(() => setAuthUser(null));

    apiGet<any>("/analytics/dashboard")
      .then((data) => {
        if (data?.metrics) {
          setMetrics({
            totalBookings: data.metrics.totalBookings,
            totalRevenue: data.metrics.totalRevenue,
            occupancyRate: Math.round((data.metrics.occupancyRate || 0) * 100),
            averageRating: data.metrics.averageRating,
            pendingBookings: dashboardData.stats.pendingBookings,
            upcomingCheckIns: dashboardData.stats.upcomingCheckIns,
          });
        }
      })
      .catch(() => null);

    apiGet<any>("/bookings")
      .then((data) => {
        if (Array.isArray(data)) {
          setRecentBookings((prev) => prev);
        }
      })
      .catch(() => null);
  }, []);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const payload = {
        email: formEmail,
        password: formPassword,
        firstName: formFirstName,
        lastName: formLastName,
        role,
      };
      const res = await apiPost<AuthResponse>(
        authMode === "login" ? "/auth/login" : "/auth/register",
        payload
      );
      setAuthUser(res.user);
      if (res.user?.roles?.[0]) {
        setRole(res.user.roles[0]);
      }
      setFormPassword("");
    } catch (err: any) {
      setAuthError(err?.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await apiPost<{ message: string }>("/auth/logout", {});
    } catch {
      // best effort logout
    }
    setAuthUser(null);
  }

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const maxRevenue = Math.max(...dashboardData.monthlyRevenue.map((m) => m.revenue));

  const activeRole = authUser?.roles?.[0] || "guest";
  const isHostView = ["host", "admin", "enterprise"].includes(activeRole);
  const isCorporateView = ["corporate", "enterprise"].includes(activeRole);
  const isGuestView = activeRole === "guest";
  const isCleanerView = activeRole === "cleaner";
  const isMaintenanceView = activeRole === "maintenance";

  const roleLinks: Record<string, { label: string; href: string }> = {
    guest: { label: "Guest Portal", href: "/portal/guest" },
    host: { label: "Host Portal", href: "/portal/host" },
    enterprise: { label: "Enterprise Portal", href: "/portal/corporate" },
    corporate: { label: "Corporate Portal", href: "/portal/corporate" },
    cleaner: { label: "Cleaner Portal", href: "/portal/cleaner" },
    maintenance: { label: "Maintenance Portal", href: "/portal/maintenance" },
    admin: { label: "Admin Portal", href: "/dashboard" },
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/browse" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-lg">Host Dashboard</span>
              <p className="text-xs text-zinc-500">Manage your properties</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <RealtimeNotificationBell />
            <ThemeToggle />
            {authUser ? (
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Host"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <div className="font-medium">
                    {authUser.displayName || `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || "User"}
                  </div>
                  {authUser.roles?.[0] && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      Role: {authUser.roles[0]}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Not signed in
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Auth Panel */}
        {!authUser && (
          <div className="mb-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{authMode === "login" ? "Log in" : "Register"}</h2>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-sm text-emerald-600 hover:underline"
              >
                {authMode === "login" ? "Need an account? Register" : "Have an account? Log in"}
              </button>
            </div>
            {authError && <p className="text-sm text-rose-500 mb-3">{authError}</p>}
            <form onSubmit={handleAuthSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authMode === "register" && (
                <>
                  <div>
                    <label className="text-sm text-zinc-500">First name</label>
                    <input
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-500">Last name</label>
                    <input
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      placeholder="Doe"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm text-zinc-500">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-500">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                >
                  <option value="guest">Guest</option>
                  <option value="host">Host</option>
                  <option value="enterprise">Enterprise Operator</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="corporate">Corporate Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-500">Password</label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-60"
                >
                  {authLoading ? "Please wait..." : authMode === "login" ? "Log in" : "Create account"}
                </button>
                <p className="text-xs text-zinc-500">
                  Demo auth: any email/password works in dev.
                </p>
              </div>
            </form>
          </div>
        )}

        {authUser && authUser.roles?.[0] && roleLinks[authUser.roles[0]] && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Link href={roleLinks[authUser.roles[0]].href} className="font-semibold">
              Go to {roleLinks[authUser.roles[0]].label}
            </Link>
            <p className="text-xs text-emerald-600 mt-1">
              Role-specific access is enforced on the API and portals.
            </p>
          </div>
        )}

        {isHostView && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold">{metrics.totalBookings}</p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(metrics.totalRevenue)}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold">{metrics.occupancyRate}%</p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Avg Rating</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {metrics.averageRating}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {metrics.pendingBookings}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-1">Check-ins Today</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.upcomingCheckIns}
              </p>
            </div>
          </div>
        )}

        {isGuestView && (
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            {[
              { title: "Upcoming stays", value: "2" },
              { title: "Messages", value: "4" },
              { title: "Wishlist", value: "6" },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {isCorporateView && (
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            {[
              { title: "Policy approvals", value: "5" },
              { title: "Travelers active", value: "18" },
              { title: "ESG compliance", value: "92%" },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {isCleanerView && (
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            {[
              { title: "Turnovers today", value: "3" },
              { title: "Photos pending", value: "2" },
              { title: "Payouts queued", value: "$420" },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {isMaintenanceView && (
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            {[
              { title: "Open work orders", value: "7" },
              { title: "SLA breaches", value: "1" },
              { title: "Vendor visits", value: "4" },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 mb-1">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {isHostView && (
          <div className="flex gap-2 mb-6">
            {(["bookings", "calendar", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isHostView && activeTab === "bookings" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Bookings List */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold">Recent Bookings</h3>
                <select className="text-sm px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                  <option>All Bookings</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <img
                          src={booking.guestAvatar}
                          alt={booking.guestName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-zinc-500">{booking.property}</p>
                          <p className="text-xs text-zinc-400 mt-1">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)} · {booking.guests} guests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(booking.total)}</p>
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${statusColors[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    {booking.status === "pending" && (
                      <div className="flex gap-2 mt-3 ml-13">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Payouts */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <h3 className="font-semibold mb-4">Upcoming Payouts</h3>
                <div className="space-y-3">
                  {dashboardData.upcomingPayouts.map((payout) => (
                    <div key={payout.date} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(payout.amount)}
                        </p>
                        <p className="text-xs text-zinc-500">{formatDate(payout.date)}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {payout.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/messages" className="w-full p-3 text-left text-sm bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors flex items-center gap-3 border border-emerald-200 dark:border-emerald-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Guest Messages
                    <span className="ml-auto text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full">3</span>
                  </Link>
                  <Link href="/reservations" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Manage Reservations
                  </Link>
                  <Link href="/reviews" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Reviews
                    <span className="ml-auto text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">1</span>
                  </Link>
                  <Link href="/analytics" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Link>
                  <Link href="/pricing" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Dynamic Pricing
                  </Link>
                  <Link href="/verification" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Guest Verification
                  </Link>
                  <Link href="/onboarding" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Listing
                  </Link>
                  <Link href="/smart-locks" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Smart Locks
                  </Link>
                  <Link href="/owner-reports" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Owner Reports
                  </Link>
                  <Link href="/calendar-sync" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Calendar Sync
                  </Link>
                  <Link href="/compare" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Compare Properties
                  </Link>
                  <Link href="/wishlist" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Guest Wishlist
                  </Link>
                  <Link href="/write-review" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Write Review (Guest)
                  </Link>
                  <Link href="/seasonal-pricing" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Seasonal Pricing
                  </Link>
                  <Link href="/payouts" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Payout History
                  </Link>
                  <Link href="/map" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Map View
                  </Link>
                  <Link href="/bundles" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Property Bundles
                  </Link>
                  <Link href="/group-chat" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Group Chat
                  </Link>
                  <Link href="/photos" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Trip Photos
                  </Link>
                  <Link href="/insurance" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Host Protection
                  </Link>
                  <Link href="/referrals" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Referral Program
                  </Link>
                  <Link href="/accessibility" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Accessibility
                  </Link>
                  <Link href="/team" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Team Management
                  </Link>
                  <Link href="/loyalty" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Loyalty Program
                  </Link>
                  <Link href="/inspection" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Property Inspection
                  </Link>
                  <Link href="/automations" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message Automations
                  </Link>
                  <Link href="/channels" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Channel Manager
                  </Link>
                  <Link href="/smart-pricing" className="w-full p-3 text-left text-sm bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg transition-colors flex items-center gap-3 border border-violet-200 dark:border-violet-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Smart Pricing (AI)
                    <span className="ml-auto text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                  <Link href="/id-verification" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    ID Verification
                  </Link>
                  <Link href="/maintenance" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Maintenance
                  </Link>
                  <Link href="/forecasting" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Revenue Forecasting
                  </Link>
                  <Link href="/multi-currency" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Multi-Currency
                  </Link>
                  <Link href="/benchmarking" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Benchmarking
                  </Link>
                  <Link href="/sentiment" className="w-full p-3 text-left text-sm bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg transition-colors flex items-center gap-3 border border-violet-200 dark:border-violet-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sentiment Analysis
                    <span className="ml-auto text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded-full">AI</span>
                  </Link>
                  <Link href="/cleaning" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Cleaning Schedule
                  </Link>
                  <Link href="/occupancy" className="w-full p-3 text-left text-sm bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors flex items-center gap-3 border border-emerald-200 dark:border-emerald-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Occupancy Optimizer
                    <span className="ml-auto text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">AI</span>
                  </Link>
                  <Link href="/taxes" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                    Tax Management
                  </Link>
                  <Link href="/virtual-tour" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Virtual Tour
                  </Link>
                  <Link href="/kiosk" className="w-full p-3 text-left text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors flex items-center gap-3 border border-blue-200 dark:border-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Check-in Kiosk
                    <span className="ml-auto text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">Tablet</span>
                  </Link>
                  <Link href="/community" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Host Community
                  </Link>
                  <Link href="/sustainability" className="w-full p-3 text-left text-sm bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors flex items-center gap-3 border border-emerald-200 dark:border-emerald-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sustainability
                    <span className="ml-auto text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Eco</span>
                  </Link>
                  <Link href="/tickets" className="w-full p-3 text-left text-sm bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Support Tickets
                  </Link>
                  <Link href="/pms" className="w-full p-3 text-left text-sm bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg transition-colors flex items-center gap-3 border border-violet-200 dark:border-violet-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    PMS Integration
                    <span className="ml-auto text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                  <Link href="/listing-generator" className="w-full p-3 text-left text-sm bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 hover:from-violet-100 hover:to-pink-100 dark:hover:from-violet-900/30 dark:hover:to-pink-900/30 text-violet-700 dark:text-violet-400 rounded-lg transition-colors flex items-center gap-3 border border-violet-200 dark:border-violet-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Listing Generator
                    <span className="ml-auto text-xs bg-gradient-to-r from-violet-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full">AI</span>
                  </Link>
                  <Link href="/smart-home" className="w-full p-3 text-left text-sm bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg transition-colors flex items-center gap-3 border border-cyan-200 dark:border-cyan-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Smart Home Hub
                    <span className="ml-auto text-xs bg-cyan-500 text-white px-1.5 py-0.5 rounded-full">IoT</span>
                  </Link>
                  <Link href="/surveys" className="w-full p-3 text-left text-sm bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg transition-colors flex items-center gap-3 border border-amber-200 dark:border-amber-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Guest Surveys (NPS)
                    <span className="ml-auto text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                  <Link href="/revenue-split" className="w-full p-3 text-left text-sm bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors flex items-center gap-3 border border-emerald-200 dark:border-emerald-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Revenue Split
                    <span className="ml-auto text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Co-Owners</span>
                  </Link>
                  <Link href="/guidebook" className="w-full p-3 text-left text-sm bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg transition-colors flex items-center gap-3 border border-teal-200 dark:border-teal-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Digital Guidebook
                    <span className="ml-auto text-xs bg-teal-500 text-white px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                  <Link href="/expenses" className="w-full p-3 text-left text-sm bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg transition-colors flex items-center gap-3 border border-rose-200 dark:border-rose-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                    Expense Tracking
                    <span className="ml-auto text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full">Budget</span>
                  </Link>
                  <Link href="/checkin-instructions" className="w-full p-3 text-left text-sm bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors flex items-center gap-3 border border-blue-200 dark:border-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Check-in Instructions
                    <span className="ml-auto text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">Auto</span>
                  </Link>
                  <Link href="/chatbot" className="w-full p-3 text-left text-sm bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 hover:from-violet-100 hover:to-pink-100 dark:hover:from-violet-900/30 dark:hover:to-pink-900/30 text-violet-700 dark:text-violet-400 rounded-lg transition-colors flex items-center gap-3 border border-violet-200 dark:border-violet-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    AI Guest Chatbot
                    <span className="ml-auto text-xs bg-gradient-to-r from-violet-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full">AI</span>
                  </Link>
                  <Link href="/photo-management" className="w-full p-3 text-left text-sm bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-lg transition-colors flex items-center gap-3 border border-pink-200 dark:border-pink-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Photo Management
                    <span className="ml-auto text-xs bg-pink-500 text-white px-1.5 py-0.5 rounded-full">AI Tags</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {isHostView && activeTab === "calendar" && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Property Selector */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 h-fit">
              <h3 className="font-semibold mb-4">Your Properties</h3>
              <div className="space-y-2">
                {properties.slice(0, 3).map((property) => (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => setSelectedProperty(property)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedProperty.id === property.id
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500"
                        : "bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-transparent"
                    }`}
                  >
                    <p className="font-medium text-sm line-clamp-1">{property.title}</p>
                    <p className="text-xs text-zinc-500">{property.location.city}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="lg:col-span-3">
              <PropertyCalendar
                propertyId={selectedProperty.id}
                basePrice={selectedProperty.pricing.basePrice}
                bookedDates={[
                  { start: "2026-02-10", end: "2026-02-14", guestName: "John D." },
                  { start: "2026-02-20", end: "2026-02-25", guestName: "Sarah M." },
                  { start: "2026-03-05", end: "2026-03-10", guestName: "Alex J." },
                ]}
                blockedDates={["2026-02-28", "2026-03-01"]}
              />
            </div>
          </div>
        )}

        {isHostView && activeTab === "analytics" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Monthly Revenue</h3>
              <div className="flex items-end gap-4 h-48">
                {dashboardData.monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-400"
                      style={{ height: `${(month.revenue / maxRevenue) * 100}%` }}
                    />
                    <p className="text-xs text-zinc-500 mt-2">{month.month}</p>
                    <p className="text-xs font-medium">${(month.revenue / 1000).toFixed(1)}k</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Sources */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Booking Sources</h3>
              <div className="space-y-4">
                {[
                  { source: "Direct", percentage: 45, color: "bg-emerald-500" },
                  { source: "Airbnb", percentage: 30, color: "bg-rose-500" },
                  { source: "VRBO", percentage: 15, color: "bg-blue-500" },
                  { source: "Booking.com", percentage: 10, color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.source}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">98%</p>
                  <p className="text-sm text-zinc-500">Response Rate</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">15m</p>
                  <p className="text-sm text-zinc-500">Avg Response Time</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">92%</p>
                  <p className="text-sm text-zinc-500">Acceptance Rate</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
                  <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">2%</p>
                  <p className="text-sm text-zinc-500">Cancellation Rate</p>
                </div>
              </div>
            </div>

            {/* Top Reviews */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Recent Reviews</h3>
              <div className="space-y-4">
                {[
                  { guest: "Emily C.", rating: 5, comment: "Amazing place! Everything was perfect.", date: "2 days ago" },
                  { guest: "James W.", rating: 5, comment: "Great location and very clean.", date: "1 week ago" },
                  { guest: "Maria G.", rating: 4, comment: "Nice stay, would recommend.", date: "2 weeks ago" },
                ].map((review, idx) => (
                  <div key={idx} className="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{review.guest}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                    <p className="text-xs text-zinc-400 mt-1">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <WebSocketProvider>
      <DashboardContent />
    </WebSocketProvider>
  );
}
