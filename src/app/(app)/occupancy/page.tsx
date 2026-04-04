"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface OptimizationSuggestion {
  id: string;
  type: "pricing" | "availability" | "minimum-stay" | "promotion" | "listing";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  potentialRevenue: number;
  confidence: number;
  action: string;
  property: string;
  dateRange?: string;
}

interface GapAnalysis {
  date: string;
  dayOfWeek: string;
  status: "booked" | "available" | "blocked";
  suggestedPrice?: number;
  currentPrice?: number;
  demandLevel: "high" | "medium" | "low";
}

const suggestions: OptimizationSuggestion[] = [
  {
    id: "s1",
    type: "pricing",
    title: "Lower price for gap nights",
    description: "You have 2 unbooked nights between reservations. A 15% discount could fill this gap.",
    impact: "high",
    potentialRevenue: 340,
    confidence: 87,
    action: "Apply 15% discount",
    property: "Modern Downtown Loft",
    dateRange: "Feb 10-11",
  },
  {
    id: "s2",
    type: "minimum-stay",
    title: "Reduce minimum stay",
    description: "Consider reducing 3-night minimum to 2 nights for low-demand weekdays to capture more bookings.",
    impact: "medium",
    potentialRevenue: 520,
    confidence: 72,
    action: "Update minimum stay",
    property: "Cozy Beachfront Cottage",
  },
  {
    id: "s3",
    type: "promotion",
    title: "Last-minute deal opportunity",
    description: "This weekend has low bookings in your area. A 20% discount could attract last-minute travelers.",
    impact: "high",
    potentialRevenue: 280,
    confidence: 91,
    action: "Create promotion",
    property: "All Properties",
    dateRange: "Feb 8-9",
  },
  {
    id: "s4",
    type: "availability",
    title: "Open blocked dates",
    description: "You have 5 blocked dates next month with no apparent reason. Opening them could generate revenue.",
    impact: "medium",
    potentialRevenue: 890,
    confidence: 65,
    action: "Review blocked dates",
    property: "Luxury Mountain Cabin",
    dateRange: "Mar 5-9",
  },
  {
    id: "s5",
    type: "listing",
    title: "Update listing photos",
    description: "Properties with updated photos in the last 90 days get 15% more views. Your photos are 8 months old.",
    impact: "medium",
    potentialRevenue: 1200,
    confidence: 78,
    action: "Update photos",
    property: "Modern Downtown Loft",
  },
  {
    id: "s6",
    type: "pricing",
    title: "Increase weekend rates",
    description: "Your weekend bookings fill quickly. A 10% price increase won't impact demand based on market analysis.",
    impact: "high",
    potentialRevenue: 650,
    confidence: 84,
    action: "Raise weekend prices",
    property: "Cozy Beachfront Cottage",
  },
];

const gapAnalysis: GapAnalysis[] = [
  { date: "2026-02-04", dayOfWeek: "Tue", status: "booked", demandLevel: "medium" },
  { date: "2026-02-05", dayOfWeek: "Wed", status: "booked", demandLevel: "medium" },
  { date: "2026-02-06", dayOfWeek: "Thu", status: "booked", demandLevel: "medium" },
  { date: "2026-02-07", dayOfWeek: "Fri", status: "booked", demandLevel: "high" },
  { date: "2026-02-08", dayOfWeek: "Sat", status: "available", currentPrice: 199, suggestedPrice: 169, demandLevel: "low" },
  { date: "2026-02-09", dayOfWeek: "Sun", status: "available", currentPrice: 199, suggestedPrice: 159, demandLevel: "low" },
  { date: "2026-02-10", dayOfWeek: "Mon", status: "available", currentPrice: 179, suggestedPrice: 149, demandLevel: "low" },
  { date: "2026-02-11", dayOfWeek: "Tue", status: "available", currentPrice: 179, suggestedPrice: 149, demandLevel: "low" },
  { date: "2026-02-12", dayOfWeek: "Wed", status: "booked", demandLevel: "medium" },
  { date: "2026-02-13", dayOfWeek: "Thu", status: "booked", demandLevel: "high" },
  { date: "2026-02-14", dayOfWeek: "Fri", status: "booked", demandLevel: "high" },
  { date: "2026-02-15", dayOfWeek: "Sat", status: "booked", demandLevel: "high" },
  { date: "2026-02-16", dayOfWeek: "Sun", status: "blocked", demandLevel: "medium" },
  { date: "2026-02-17", dayOfWeek: "Mon", status: "available", currentPrice: 179, suggestedPrice: 199, demandLevel: "high" },
];

const typeIcons = {
  pricing: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  availability: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  "minimum-stay": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  promotion: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  listing: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
};

const impactColors = {
  high: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  low: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

export default function OccupancyPage() {
  const [activeTab, setActiveTab] = useState<"suggestions" | "gaps" | "forecast">("suggestions");
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("All Properties");
  const [suggestionsData, setSuggestionsData] = useState<OptimizationSuggestion[]>(suggestions);
  const [gapData, setGapData] = useState<GapAnalysis[]>(gapAnalysis);

  useEffect(() => {
    fetchModuleData<OptimizationSuggestion[]>("/occupancy/suggestions", suggestions).then(setSuggestionsData);
    fetchModuleData<GapAnalysis[]>("/occupancy/gaps", gapAnalysis).then(setGapData);
  }, []);

  const filteredSuggestions = selectedProperty === "All Properties"
    ? suggestionsData
    : suggestionsData.filter((s) => s.property === selectedProperty || s.property === "All Properties");

  const totalPotentialRevenue = suggestionsData.reduce((sum, s) => sum + s.potentialRevenue, 0);
  const currentOccupancy = 72;
  const targetOccupancy = 85;

  const applySuggestion = (id: string) => {
    setAppliedSuggestions([...appliedSuggestions, id]);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg flex items-center gap-2">
                Occupancy Optimization
                <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                  AI Powered
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Maximize your booking rates</p>
            </div>
          </div>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm"
          >
            <option>All Properties</option>
            <option>Modern Downtown Loft</option>
            <option>Cozy Beachfront Cottage</option>
            <option>Luxury Mountain Cabin</option>
          </select>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Current Occupancy</p>
            <p className="text-2xl font-bold">{currentOccupancy}%</p>
            <div className="mt-2 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentOccupancy}%` }} />
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Target Occupancy</p>
            <p className="text-2xl font-bold">{targetOccupancy}%</p>
            <p className="text-xs text-amber-600 mt-1">{targetOccupancy - currentOccupancy}% gap to fill</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Open Suggestions</p>
            <p className="text-2xl font-bold text-violet-600">{suggestions.length - appliedSuggestions.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <p className="text-sm text-white/80">Potential Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalPotentialRevenue)}</p>
            <p className="text-xs text-white/80">if all applied</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["suggestions", "gaps", "forecast"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "gaps" ? "Gap Analysis" : tab}
            </button>
          ))}
        </div>

        {activeTab === "suggestions" && (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => {
              const isApplied = appliedSuggestions.includes(suggestion.id);

              return (
                <div
                  key={suggestion.id}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border p-6 transition-all ${
                    isApplied ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      suggestion.type === "pricing" ? "bg-emerald-500/10" :
                      suggestion.type === "promotion" ? "bg-violet-500/10" :
                      suggestion.type === "listing" ? "bg-blue-500/10" : "bg-amber-500/10"
                    }`}>
                      <svg className={`w-6 h-6 ${
                        suggestion.type === "pricing" ? "text-emerald-600" :
                        suggestion.type === "promotion" ? "text-violet-600" :
                        suggestion.type === "listing" ? "text-blue-600" : "text-amber-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcons[suggestion.type]} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{suggestion.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs capitalize border ${impactColors[suggestion.impact]}`}>
                              {suggestion.impact} impact
                            </span>
                          </div>
                          <p className="text-sm text-zinc-500">{suggestion.property}</p>
                          {suggestion.dateRange && (
                            <p className="text-xs text-zinc-400">{suggestion.dateRange}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">+{formatCurrency(suggestion.potentialRevenue)}</p>
                          <p className="text-xs text-zinc-500">{suggestion.confidence}% confidence</p>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{suggestion.description}</p>
                      <button
                        onClick={() => applySuggestion(suggestion.id)}
                        disabled={isApplied}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isApplied
                            ? "bg-emerald-500 text-white cursor-default"
                            : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                      >
                        {isApplied ? "Applied" : suggestion.action}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "gaps" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold">14-Day Calendar Analysis</h3>
              <p className="text-sm text-zinc-500">Modern Downtown Loft</p>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {gapData.map((day) => (
                <div key={day.date} className={`p-4 flex items-center justify-between ${
                  day.status === "available" ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-zinc-500">{day.dayOfWeek}</p>
                      <p className="font-semibold">{new Date(day.date).getDate()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                      day.status === "booked" ? "bg-emerald-500/10 text-emerald-600" :
                      day.status === "blocked" ? "bg-zinc-500/10 text-zinc-600" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>
                      {day.status}
                    </span>
                    <span className={`text-xs ${
                      day.demandLevel === "high" ? "text-emerald-600" :
                      day.demandLevel === "medium" ? "text-amber-600" : "text-zinc-500"
                    }`}>
                      {day.demandLevel} demand
                    </span>
                  </div>
                  {day.status === "available" && day.suggestedPrice && (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-zinc-500 line-through">{formatCurrency(day.currentPrice!)}</p>
                        <p className="font-semibold text-emerald-600">{formatCurrency(day.suggestedPrice)}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm">
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">30-Day Occupancy Forecast</h3>
              <div className="h-48 flex items-end gap-1">
                {Array.from({ length: 30 }).map((_, i) => {
                  const occupancy = 50 + Math.sin(i * 0.3) * 30 + Math.random() * 20;
                  const isWeekend = (i % 7 === 5) || (i % 7 === 6);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t transition-all ${
                          occupancy >= 80 ? "bg-emerald-500" :
                          occupancy >= 60 ? "bg-amber-500" : "bg-rose-500"
                        } ${isWeekend ? "opacity-100" : "opacity-70"}`}
                        style={{ height: `${occupancy}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>Today</span>
                <span>+30 days</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { period: "This Week", occupancy: 85, trend: "up", change: 12 },
                { period: "Next Week", occupancy: 72, trend: "down", change: -8 },
                { period: "Week After", occupancy: 78, trend: "up", change: 5 },
              ].map((week) => (
                <div key={week.period} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <p className="text-sm text-zinc-500">{week.period}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-3xl font-bold">{week.occupancy}%</p>
                    <span className={`flex items-center gap-1 text-sm ${week.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                      {week.trend === "up" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {Math.abs(week.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
