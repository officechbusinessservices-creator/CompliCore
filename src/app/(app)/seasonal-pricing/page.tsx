"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { properties, formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface PricingDay {
  date: Date;
  basePrice: number;
  adjustedPrice: number;
  seasonType: "peak" | "high" | "regular" | "low";
  isWeekend: boolean;
  hasEvent: boolean;
  eventName?: string;
  occupancy: number;
}

const seasonColors = {
  peak: { bg: "bg-rose-500/20", text: "text-rose-600 dark:text-rose-400", label: "Peak Season" },
  high: { bg: "bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", label: "High Season" },
  regular: { bg: "bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", label: "Regular" },
  low: { bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", label: "Low Season" },
};

const seasonalPricingRules = [
  { name: "Peak Season (Jun-Aug)", modifier: "+40%", active: true },
  { name: "High Season (Dec-Jan)", modifier: "+25%", active: true },
  { name: "Low Season (Sep-Nov)", modifier: "-15%", active: true },
  { name: "Weekend Premium", modifier: "+15%", active: true },
  { name: "Last Minute (< 3 days)", modifier: "-10%", active: false },
  { name: "Long Stay (7+ nights)", modifier: "-20%", active: true },
];

const events = [
  { date: "2026-03-14", name: "Spring Break", modifier: 1.5 },
  { date: "2026-03-15", name: "Spring Break", modifier: 1.5 },
  { date: "2026-03-16", name: "Spring Break", modifier: 1.5 },
  { date: "2026-04-04", name: "Easter Weekend", modifier: 1.4 },
  { date: "2026-04-05", name: "Easter Weekend", modifier: 1.4 },
  { date: "2026-05-23", name: "Memorial Day", modifier: 1.3 },
  { date: "2026-05-24", name: "Memorial Day", modifier: 1.3 },
  { date: "2026-05-25", name: "Memorial Day", modifier: 1.3 },
  { date: "2026-07-04", name: "Independence Day", modifier: 1.6 },
];

export default function SeasonalPricingPage() {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // February 2026
  const [viewMode, setViewMode] = useState<"calendar" | "chart">("calendar");
  const [seasonalRules, setSeasonalRules] = useState(seasonalPricingRules);

  useEffect(() => {
    fetchModuleData<any[]>("/pricing/seasonal", seasonalPricingRules).then(setSeasonalRules);
  }, []);

  const basePrice = selectedProperty.pricing.basePrice;

  // Generate pricing data for the month
  const generatePricingData = (month: Date): PricingDay[] => {
    const days: PricingDay[] = [];
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const daysInMonth = new Date(year, monthNum + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      const dateStr = date.toISOString().split("T")[0];

      // Determine season
      let seasonType: "peak" | "high" | "regular" | "low" = "regular";
      let seasonModifier = 1;

      if (monthNum >= 5 && monthNum <= 7) { // June-August
        seasonType = "peak";
        seasonModifier = 1.4;
      } else if (monthNum === 11 || monthNum === 0) { // Dec-Jan
        seasonType = "high";
        seasonModifier = 1.25;
      } else if (monthNum >= 2 && monthNum <= 4) { // March-May
        seasonType = "regular";
        seasonModifier = 1;
      } else { // Sept-Nov
        seasonType = "low";
        seasonModifier = 0.85;
      }

      // Check for events
      const event = events.find((e) => e.date === dateStr);
      const eventModifier = event ? event.modifier : 1;

      // Weekend modifier
      const weekendModifier = isWeekend ? 1.15 : 1;

      // Calculate adjusted price
      const adjustedPrice = Math.round(basePrice * seasonModifier * weekendModifier * eventModifier);

      // Random occupancy for demo
      const occupancy = Math.floor(Math.random() * 40) + 60;

      days.push({
        date,
        basePrice,
        adjustedPrice,
        seasonType,
        isWeekend,
        hasEvent: !!event,
        eventName: event?.name,
        occupancy,
      });
    }

    return days;
  };

  const pricingData = generatePricingData(currentMonth);
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  // Calculate stats
  const avgPrice = Math.round(pricingData.reduce((sum, d) => sum + d.adjustedPrice, 0) / pricingData.length);
  const maxPrice = Math.max(...pricingData.map((d) => d.adjustedPrice));
  const minPrice = Math.min(...pricingData.map((d) => d.adjustedPrice));
  const avgOccupancy = Math.round(pricingData.reduce((sum, d) => sum + d.occupancy, 0) / pricingData.length);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Seasonal Pricing Calendar</h1>
              <p className="text-xs text-zinc-500">Visualize and manage pricing by season</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === "calendar" ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === "chart" ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}
            >
              Chart
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Property Selector */}
        <div className="mb-6">
          <label className="block text-sm text-zinc-500 mb-2">Select Property</label>
          <select
            value={selectedProperty.id}
            onChange={(e) => setSelectedProperty(properties.find((p) => p.id === e.target.value) || properties[0])}
            className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Base Price</p>
            <p className="text-xl font-bold">{formatCurrency(basePrice)}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg Adjusted</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(avgPrice)}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Price Range</p>
            <p className="text-xl font-bold">{formatCurrency(minPrice)} - {formatCurrency(maxPrice)}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg Occupancy</p>
            <p className="text-xl font-bold">{avgOccupancy}%</p>
          </div>
        </div>

        {/* Season Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(seasonColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${value.bg}`} />
              <span className={`text-sm ${value.text}`}>{value.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-violet-500/20" />
            <span className="text-sm text-violet-600 dark:text-violet-400">Special Event</span>
          </div>
        </div>

        {viewMode === "calendar" ? (
          /* Calendar View */
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Month Navigation */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-semibold text-lg">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-zinc-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before the first */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {pricingData.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square p-1.5 rounded-lg border ${
                      day.hasEvent
                        ? "bg-violet-500/10 border-violet-500/30"
                        : `${seasonColors[day.seasonType].bg} border-transparent`
                    } ${day.isWeekend ? "ring-1 ring-zinc-300 dark:ring-zinc-700" : ""}`}
                  >
                    <div className="h-full flex flex-col">
                      <span className="text-xs text-zinc-500">{day.date.getDate()}</span>
                      <span className={`text-sm font-semibold mt-auto ${seasonColors[day.seasonType].text}`}>
                        ${day.adjustedPrice}
                      </span>
                      {day.hasEvent && (
                        <span className="text-[10px] text-violet-600 dark:text-violet-400 truncate">
                          {day.eventName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chart View */
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-6">Price Trend - {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>

            {/* Simple Bar Chart */}
            <div className="relative h-64">
              <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-zinc-500">
                <span>${maxPrice}</span>
                <span>${Math.round((maxPrice + minPrice) / 2)}</span>
                <span>${minPrice}</span>
              </div>

              <div className="ml-14 h-full flex items-end gap-1">
                {pricingData.map((day, idx) => {
                  const height = ((day.adjustedPrice - minPrice) / (maxPrice - minPrice)) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full rounded-t ${
                          day.hasEvent
                            ? "bg-violet-500"
                            : day.isWeekend
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      {idx % 5 === 0 && (
                        <span className="text-[10px] text-zinc-500">{day.date.getDate()}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-sm text-zinc-500">Weekday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-sm text-zinc-500">Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-violet-500" />
                <span className="text-sm text-zinc-500">Event</span>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Pricing Rules */}
        <div className="mt-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-semibold mb-4">Active Pricing Rules</h3>
          <div className="space-y-3">
            {seasonalRules.map((rule) => (
              <div key={rule.name} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${rule.active ? "bg-emerald-500" : "bg-zinc-400"}`} />
                  <span className="text-sm">{rule.name}</span>
                </div>
                <span className={`text-sm font-medium ${rule.modifier.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                  {rule.modifier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
