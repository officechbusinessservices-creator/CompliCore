"use client";

import { useState } from "react";
import Link from "next/link";

// Mock analytics data
const monthlyData = [
  { month: "Aug", revenue: 4200, bookings: 8, occupancy: 58, avgNightly: 165 },
  { month: "Sep", revenue: 5100, bookings: 10, occupancy: 67, avgNightly: 170 },
  { month: "Oct", revenue: 6800, bookings: 13, occupancy: 74, avgNightly: 175 },
  { month: "Nov", revenue: 4500, bookings: 9, occupancy: 55, avgNightly: 160 },
  { month: "Dec", revenue: 8200, bookings: 15, occupancy: 82, avgNightly: 195 },
  { month: "Jan", revenue: 6900, bookings: 12, occupancy: 72, avgNightly: 180 },
];

const propertyPerformance = [
  { name: "Modern Downtown Loft", revenue: 12450, bookings: 28, rating: 4.92, occupancy: 78 },
  { name: "Cozy Beach Cottage", revenue: 8900, bookings: 18, rating: 4.85, occupancy: 65 },
  { name: "Mountain View Cabin", revenue: 6200, bookings: 12, rating: 4.78, occupancy: 52 },
  { name: "Urban Studio Apartment", revenue: 4800, bookings: 22, rating: 4.95, occupancy: 71 },
];

const bookingsBySource = [
  { source: "Direct", percentage: 42, count: 35 },
  { source: "Airbnb", percentage: 28, count: 23 },
  { source: "VRBO", percentage: 18, count: 15 },
  { source: "Booking.com", percentage: 12, count: 10 },
];

const guestDemographics = [
  { type: "Couples", percentage: 35 },
  { type: "Families", percentage: 28 },
  { type: "Solo Travelers", percentage: 22 },
  { type: "Business", percentage: 15 },
];

const recentActivity = [
  { type: "booking", message: "New booking for Modern Downtown Loft", time: "2 hours ago", amount: 627 },
  { type: "payout", message: "Payout processed", time: "5 hours ago", amount: 1245 },
  { type: "review", message: "5-star review received", time: "1 day ago" },
  { type: "inquiry", message: "New inquiry from Maria G.", time: "1 day ago" },
  { type: "booking", message: "New booking for Beach Cottage", time: "2 days ago", amount: 892 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "12m">("30d");
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "bookings" | "occupancy">("revenue");

  // Calculate totals
  const totals = {
    revenue: monthlyData.reduce((acc, m) => acc + m.revenue, 0),
    bookings: monthlyData.reduce((acc, m) => acc + m.bookings, 0),
    avgOccupancy: Math.round(monthlyData.reduce((acc, m) => acc + m.occupancy, 0) / monthlyData.length),
    avgNightly: Math.round(monthlyData.reduce((acc, m) => acc + m.avgNightly, 0) / monthlyData.length),
  };

  // Get max value for chart scaling
  const maxValue = Math.max(...monthlyData.map((m) => {
    if (selectedMetric === "revenue") return m.revenue;
    if (selectedMetric === "bookings") return m.bookings;
    return m.occupancy;
  }));

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Analytics</h1>
              <p className="text-xs text-zinc-500">Performance insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "90d", "12m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-emerald-500 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "12 Months"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">Total Revenue</p>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">+18%</span>
            </div>
            <p className="text-3xl font-bold">${totals.revenue.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-1">vs. previous period</p>
          </div>
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">Total Bookings</p>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">+12%</span>
            </div>
            <p className="text-3xl font-bold">{totals.bookings}</p>
            <p className="text-xs text-zinc-500 mt-1">confirmed reservations</p>
          </div>
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">Avg Occupancy</p>
              <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">+5%</span>
            </div>
            <p className="text-3xl font-bold">{totals.avgOccupancy}%</p>
            <p className="text-xs text-zinc-500 mt-1">across all properties</p>
          </div>
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">Avg Nightly Rate</p>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">+8%</span>
            </div>
            <p className="text-3xl font-bold">${totals.avgNightly}</p>
            <p className="text-xs text-zinc-500 mt-1">per night</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Performance Trends</h3>
              <div className="flex gap-2">
                {(["revenue", "bookings", "occupancy"] as const).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                      selectedMetric === metric
                        ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-64 flex items-end gap-4">
              {monthlyData.map((data) => {
                const value = selectedMetric === "revenue" ? data.revenue : selectedMetric === "bookings" ? data.bookings : data.occupancy;
                const height = (value / maxValue) * 100;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">
                      {selectedMetric === "revenue" ? `$${(value / 1000).toFixed(1)}k` : selectedMetric === "occupancy" ? `${value}%` : value}
                    </span>
                    <div className="w-full relative" style={{ height: "200px" }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-300"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Sources */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold mb-6">Booking Sources</h3>
            <div className="space-y-4">
              {bookingsBySource.map((source, index) => {
                const colors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-violet-500"];
                return (
                  <div key={source.source}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{source.source}</span>
                      <span className="text-sm font-medium">{source.percentage}%</span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index]} rounded-full transition-all duration-500`}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{source.count} bookings</p>
                  </div>
                );
              })}
            </div>

            {/* Guest Demographics */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="font-medium mb-4">Guest Demographics</h4>
              <div className="flex h-4 rounded-full overflow-hidden">
                {guestDemographics.map((demo, index) => {
                  const colors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-rose-500"];
                  return (
                    <div
                      key={demo.type}
                      className={`${colors[index]} transition-all duration-500`}
                      style={{ width: `${demo.percentage}%` }}
                      title={`${demo.type}: ${demo.percentage}%`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {guestDemographics.map((demo, index) => {
                  const colors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-rose-500"];
                  return (
                    <div key={demo.type} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors[index]}`} />
                      <span className="text-xs text-zinc-500">{demo.type} ({demo.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Property Performance */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold mb-4">Property Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-3 font-medium">Property</th>
                    <th className="pb-3 font-medium text-right">Revenue</th>
                    <th className="pb-3 font-medium text-right">Bookings</th>
                    <th className="pb-3 font-medium text-right">Occupancy</th>
                    <th className="pb-3 font-medium text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {propertyPerformance.map((property) => (
                    <tr key={property.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3">
                        <p className="font-medium">{property.name}</p>
                      </td>
                      <td className="py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        ${property.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">{property.bookings}</td>
                      <td className="py-3 text-right">
                        <span className={`${property.occupancy >= 70 ? "text-emerald-600 dark:text-emerald-400" : property.occupancy >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {property.occupancy}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {property.rating}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === "booking" ? "bg-emerald-500/10" :
                    activity.type === "payout" ? "bg-blue-500/10" :
                    activity.type === "review" ? "bg-amber-500/10" : "bg-violet-500/10"
                  }`}>
                    {activity.type === "booking" && (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {activity.type === "payout" && (
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {activity.type === "review" && (
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                    {activity.type === "inquiry" && (
                      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">{activity.time}</span>
                      {activity.amount && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          +${activity.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 p-6 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Revenue Opportunity</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Increase weekend rates by 12% in March to capture high-demand spring break travel.
              </p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Occupancy Alert</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Mountain View Cabin has 48% vacancy next month. Consider a 15% discount to boost bookings.
              </p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Guest Preference</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Properties with workspaces see 35% more business traveler bookings. Consider adding a desk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
