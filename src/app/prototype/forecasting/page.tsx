"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface MonthlyProjection {
  month: string;
  projected: number;
  actual?: number;
  bookings: number;
  occupancy: number;
}

interface PropertyForecast {
  id: string;
  name: string;
  image: string;
  projectedRevenue: number;
  projectedBookings: number;
  projectedOccupancy: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

const monthlyProjections: MonthlyProjection[] = [
  { month: "Jan 2026", projected: 4200, actual: 4350, bookings: 8, occupancy: 68 },
  { month: "Feb 2026", projected: 4800, actual: 4650, bookings: 9, occupancy: 72 },
  { month: "Mar 2026", projected: 6200, bookings: 12, occupancy: 85 },
  { month: "Apr 2026", projected: 5800, bookings: 11, occupancy: 78 },
  { month: "May 2026", projected: 7200, bookings: 14, occupancy: 92 },
  { month: "Jun 2026", projected: 8500, bookings: 16, occupancy: 95 },
  { month: "Jul 2026", projected: 9200, bookings: 18, occupancy: 98 },
  { month: "Aug 2026", projected: 8800, bookings: 17, occupancy: 96 },
  { month: "Sep 2026", projected: 6500, bookings: 13, occupancy: 82 },
  { month: "Oct 2026", projected: 5200, bookings: 10, occupancy: 74 },
  { month: "Nov 2026", projected: 4600, bookings: 9, occupancy: 70 },
  { month: "Dec 2026", projected: 7800, bookings: 15, occupancy: 88 },
];

const propertyForecasts: PropertyForecast[] = [
  {
    id: "p1",
    name: "Modern Downtown Loft",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
    projectedRevenue: 42000,
    projectedBookings: 85,
    projectedOccupancy: 78,
    trend: "up",
    trendPercent: 15,
  },
  {
    id: "p2",
    name: "Cozy Beachfront Cottage",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200",
    projectedRevenue: 38500,
    projectedBookings: 72,
    projectedOccupancy: 82,
    trend: "up",
    trendPercent: 8,
  },
  {
    id: "p3",
    name: "Luxury Mountain Cabin",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200",
    projectedRevenue: 28200,
    projectedBookings: 48,
    projectedOccupancy: 65,
    trend: "down",
    trendPercent: -3,
  },
];

const scenarioData = {
  conservative: { revenue: 95000, growth: 5 },
  moderate: { revenue: 108700, growth: 12 },
  optimistic: { revenue: 125000, growth: 22 },
};

export default function ForecastingPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "monthly" | "properties" | "scenarios">("overview");
  const [selectedScenario, setSelectedScenario] = useState<"conservative" | "moderate" | "optimistic">("moderate");
  const [forecastRange, setForecastRange] = useState<"6m" | "12m" | "24m">("12m");
  const [forecastData, setForecastData] = useState(monthlyProjections);

  useEffect(() => {
    fetchModuleData<MonthlyProjection[]>("/forecasting", monthlyProjections).then(setForecastData);
  }, []);

  const totalProjected = forecastData.reduce((sum, m) => sum + m.projected, 0);
  const totalActual = forecastData.filter((m) => m.actual).reduce((sum, m) => sum + (m.actual || 0), 0);
  const avgOccupancy = Math.round(forecastData.reduce((sum, m) => sum + m.occupancy, 0) / forecastData.length);
  const totalBookings = forecastData.reduce((sum, m) => sum + m.bookings, 0);

  const maxProjected = Math.max(...forecastData.map((m) => m.projected));

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
              <h1 className="font-semibold text-lg">Revenue Forecasting</h1>
              <p className="text-xs text-zinc-500">Financial projections and insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["6m", "12m", "24m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setForecastRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  forecastRange === range
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <p className="text-sm text-white/80">Projected Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalProjected)}</p>
            <p className="text-xs text-white/80">2026 Annual</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">YTD Actual</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalActual)}</p>
            <p className="text-xs text-zinc-400">vs {formatCurrency(9000)} projected</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg. Occupancy</p>
            <p className="text-2xl font-bold">{avgOccupancy}%</p>
            <p className="text-xs text-emerald-500">+8% vs last year</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Projected Bookings</p>
            <p className="text-2xl font-bold">{totalBookings}</p>
            <p className="text-xs text-zinc-400">annual total</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["overview", "monthly", "properties", "scenarios"] as const).map((tab) => (
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
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Annual Revenue Projection</h3>
              <div className="h-64 flex items-end gap-2">
                {forecastData.map((month, idx) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center gap-1" style={{ height: `${(month.projected / maxProjected) * 100}%` }}>
                      {month.actual && (
                        <div
                          className="w-full bg-emerald-400 rounded-t-sm"
                          style={{ height: `${(month.actual / month.projected) * 100}%` }}
                          title={`Actual: ${formatCurrency(month.actual)}`}
                        />
                      )}
                      <div
                        className={`w-full ${month.actual ? "bg-emerald-600/30 border-2 border-dashed border-emerald-500" : "bg-gradient-to-t from-emerald-600 to-emerald-400"} rounded-t-lg flex-1`}
                        title={`Projected: ${formatCurrency(month.projected)}`}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 -rotate-45 origin-left whitespace-nowrap">
                      {month.month.split(" ")[0]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-400 rounded" />
                  <span className="text-sm text-zinc-500">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-600/30 border-2 border-dashed border-emerald-500 rounded" />
                  <span className="text-sm text-zinc-500">Projected</span>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="font-semibold mb-4">Peak Seasons</h3>
                <div className="space-y-3">
                  {[
                    { period: "Summer (Jun-Aug)", revenue: 26500, growth: "+45%" },
                    { period: "Winter Holidays (Dec)", revenue: 7800, growth: "+32%" },
                    { period: "Spring Break (Mar)", revenue: 6200, growth: "+18%" },
                  ].map((season) => (
                    <div key={season.period} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{season.period}</p>
                        <p className="text-xs text-zinc-500">{formatCurrency(season.revenue)} projected</p>
                      </div>
                      <span className="text-sm text-emerald-600 font-medium">{season.growth}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { source: "Nightly Rates", amount: 82000, percent: 75 },
                    { source: "Cleaning Fees", amount: 16000, percent: 15 },
                    { source: "Extra Guest Fees", amount: 6500, percent: 6 },
                    { source: "Pet Fees", amount: 4200, percent: 4 },
                  ].map((item) => (
                    <div key={item.source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.source}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "monthly" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left p-4 font-medium">Month</th>
                  <th className="text-right p-4 font-medium">Projected</th>
                  <th className="text-right p-4 font-medium">Actual</th>
                  <th className="text-right p-4 font-medium">Variance</th>
                  <th className="text-right p-4 font-medium">Bookings</th>
                  <th className="text-right p-4 font-medium">Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map((month) => {
                  const variance = month.actual ? month.actual - month.projected : null;
                  return (
                    <tr key={month.month} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                      <td className="p-4 font-medium">{month.month}</td>
                      <td className="p-4 text-right">{formatCurrency(month.projected)}</td>
                      <td className="p-4 text-right">
                        {month.actual ? formatCurrency(month.actual) : <span className="text-zinc-400">-</span>}
                      </td>
                      <td className="p-4 text-right">
                        {variance !== null ? (
                          <span className={variance >= 0 ? "text-emerald-600" : "text-rose-600"}>
                            {variance >= 0 ? "+" : ""}{formatCurrency(variance)}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">{month.bookings}</td>
                      <td className="p-4 text-right">
                        <span className={month.occupancy >= 80 ? "text-emerald-600" : month.occupancy >= 60 ? "text-amber-600" : "text-rose-600"}>
                          {month.occupancy}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 font-semibold">
                  <td className="p-4">Total</td>
                  <td className="p-4 text-right">{formatCurrency(totalProjected)}</td>
                  <td className="p-4 text-right">{formatCurrency(totalActual)}</td>
                  <td className="p-4 text-right text-emerald-600">+{formatCurrency(totalActual - 9000)}</td>
                  <td className="p-4 text-right">{totalBookings}</td>
                  <td className="p-4 text-right">{avgOccupancy}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-4">
            {propertyForecasts.map((property) => (
              <div key={property.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex gap-6">
                  <img src={property.image} alt="" className="w-32 h-24 rounded-lg object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{property.name}</h3>
                        <p className="text-sm text-zinc-500">Annual Projection</p>
                      </div>
                      <span className={`flex items-center gap-1 text-sm ${
                        property.trend === "up" ? "text-emerald-600" : property.trend === "down" ? "text-rose-600" : "text-zinc-600"
                      }`}>
                        {property.trend === "up" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : property.trend === "down" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : null}
                        {property.trendPercent > 0 ? "+" : ""}{property.trendPercent}% vs last year
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Revenue</p>
                        <p className="text-xl font-bold text-emerald-600">{formatCurrency(property.projectedRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Bookings</p>
                        <p className="text-xl font-bold">{property.projectedBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Occupancy</p>
                        <p className="text-xl font-bold">{property.projectedOccupancy}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "scenarios" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Revenue Scenarios</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {(["conservative", "moderate", "optimistic"] as const).map((scenario) => (
                  <button
                    key={scenario}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      selectedScenario === scenario
                        ? scenario === "conservative" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" :
                          scenario === "moderate" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" :
                          "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <p className="font-medium capitalize mb-2">{scenario}</p>
                    <p className="text-2xl font-bold mb-1">{formatCurrency(scenarioData[scenario].revenue)}</p>
                    <p className={`text-sm ${scenarioData[scenario].growth > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {scenarioData[scenario].growth > 0 ? "+" : ""}{scenarioData[scenario].growth}% YoY growth
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-4">{selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario Assumptions</h4>
              <ul className="space-y-2 text-white/90">
                {selectedScenario === "conservative" && (
                  <>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> 5% reduction in bookings due to economic uncertainty</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> No rate increases</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> Increased competition in market</li>
                  </>
                )}
                {selectedScenario === "moderate" && (
                  <>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> Steady market conditions</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> 5% rate increase in peak seasons</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> Improved listing optimization</li>
                  </>
                )}
                {selectedScenario === "optimistic" && (
                  <>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> Strong travel rebound</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> 15% rate increase across all seasons</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/80" /> New property added mid-year</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
