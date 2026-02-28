"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface PricingSuggestion {
  id: string;
  date: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: number;
  factors: string[];
  impact: "high" | "medium" | "low";
}

interface CompetitorData {
  id: string;
  name: string;
  image: string;
  location: string;
  price: number;
  rating: number;
  occupancy: number;
  amenities: string[];
}

interface MarketInsight {
  metric: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
}

const pricingSuggestions: PricingSuggestion[] = [
  {
    id: "s1",
    date: "2026-02-14",
    currentPrice: 199,
    suggestedPrice: 279,
    reason: "Valentine's Day weekend - High demand period",
    confidence: 94,
    factors: ["Holiday weekend", "85% area occupancy", "Competitor prices +35%"],
    impact: "high",
  },
  {
    id: "s2",
    date: "2026-02-21",
    currentPrice: 199,
    suggestedPrice: 249,
    reason: "Presidents' Day weekend - Increased travel",
    confidence: 89,
    factors: ["Long weekend", "Event nearby", "Historical booking surge"],
    impact: "high",
  },
  {
    id: "s3",
    date: "2026-03-14",
    currentPrice: 199,
    suggestedPrice: 329,
    reason: "Spring Break peak - Maximum demand",
    confidence: 96,
    factors: ["Spring break", "92% area occupancy", "Flight searches +120%"],
    impact: "high",
  },
  {
    id: "s4",
    date: "2026-02-10",
    currentPrice: 199,
    suggestedPrice: 169,
    reason: "Midweek gap - Increase occupancy",
    confidence: 78,
    factors: ["Low weekday demand", "Nearby listings discounted", "Gap filling"],
    impact: "medium",
  },
  {
    id: "s5",
    date: "2026-02-25",
    currentPrice: 199,
    suggestedPrice: 219,
    reason: "Local conference - Business travelers",
    confidence: 82,
    factors: ["Tech conference", "Hotel prices up", "Corporate travel"],
    impact: "medium",
  },
];

const competitors: CompetitorData[] = [
  {
    id: "c1",
    name: "Urban Retreat Downtown",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300",
    location: "0.3 miles away",
    price: 225,
    rating: 4.87,
    occupancy: 78,
    amenities: ["WiFi", "Kitchen", "Parking"],
  },
  {
    id: "c2",
    name: "City View Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300",
    location: "0.5 miles away",
    price: 195,
    rating: 4.72,
    occupancy: 82,
    amenities: ["WiFi", "Kitchen", "Gym"],
  },
  {
    id: "c3",
    name: "Modern Studio Haven",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300",
    location: "0.4 miles away",
    price: 175,
    rating: 4.65,
    occupancy: 71,
    amenities: ["WiFi", "Kitchen"],
  },
  {
    id: "c4",
    name: "Luxury Penthouse Suite",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300",
    location: "0.6 miles away",
    price: 350,
    rating: 4.95,
    occupancy: 89,
    amenities: ["WiFi", "Kitchen", "Pool", "Concierge"],
  },
];

const marketInsights: MarketInsight[] = [
  { metric: "Avg. Nightly Rate", value: "$215", change: 12, trend: "up" },
  { metric: "Market Occupancy", value: "76%", change: 8, trend: "up" },
  { metric: "Booking Lead Time", value: "18 days", change: -3, trend: "down" },
  { metric: "Avg. Stay Length", value: "3.2 nights", change: 5, trend: "up" },
];

const demandForecast = [
  { week: "This Week", demand: 72, price: 199 },
  { week: "Next Week", demand: 85, price: 229 },
  { week: "Week 3", demand: 92, price: 269 },
  { week: "Week 4", demand: 78, price: 219 },
  { week: "Week 5", demand: 65, price: 189 },
  { week: "Week 6", demand: 88, price: 249 },
];

export default function SmartPricingPage() {
  const [selectedProperty, setSelectedProperty] = useState("Modern Downtown Loft");
  const [activeTab, setActiveTab] = useState<"suggestions" | "competitors" | "market" | "forecast">("suggestions");
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [autoPrice, setAutoPrice] = useState(false);
  const [suggestionsData, setSuggestionsData] = useState<PricingSuggestion[]>(pricingSuggestions);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>(competitors);
  const [marketData, setMarketData] = useState<MarketInsight[]>(marketInsights);
  const [forecastData, setForecastData] = useState(demandForecast);

  useEffect(() => {
    fetchModuleData<PricingSuggestion[]>("/pricing/suggestions", pricingSuggestions).then(setSuggestionsData);
    fetchModuleData<CompetitorData[]>("/pricing/competitors", competitors).then(setCompetitorData);
    fetchModuleData<MarketInsight[]>("/pricing/market", marketInsights).then(setMarketData);
    fetchModuleData<typeof demandForecast>("/pricing/forecast", demandForecast).then(setForecastData);
  }, []);

  const applySuggestion = (id: string) => {
    setAppliedSuggestions([...appliedSuggestions, id]);
  };

  const potentialRevenue = suggestionsData
    .filter((s) => s.impact === "high")
    .reduce((sum, s) => sum + (s.suggestedPrice - s.currentPrice), 0);

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
                Smart Pricing
                <span className="px-2 py-0.5 text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full border border-violet-500/20">
                  AI Powered
                </span>
              </h1>
              <p className="text-xs text-zinc-500">AI-powered pricing recommendations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">Auto-pricing</span>
              <button
                onClick={() => setAutoPrice(!autoPrice)}
                className={`relative w-12 h-7 rounded-full transition-colors ${autoPrice ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
              >
                <span className={`absolute top-0.5 ${autoPrice ? "right-0.5" : "left-0.5"} w-6 h-6 bg-white rounded-full shadow transition-all`} />
              </button>
            </label>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Property Selector */}
        <div className="mb-6">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
          >
            <option>Modern Downtown Loft</option>
            <option>Cozy Beachfront Cottage</option>
            <option>Luxury Mountain Cabin</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Your Avg. Rate</p>
            <p className="text-2xl font-bold">$199</p>
            <p className="text-xs text-zinc-400">per night</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Market Avg.</p>
            <p className="text-2xl font-bold">$215</p>
            <p className="text-xs text-emerald-500">+8% vs you</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">AI Suggestions</p>
            <p className="text-2xl font-bold text-violet-600">{suggestionsData.length}</p>
            <p className="text-xs text-zinc-400">pending review</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <p className="text-sm text-white/80">Potential Revenue</p>
            <p className="text-2xl font-bold">+{formatCurrency(potentialRevenue)}</p>
            <p className="text-xs text-white/80">if applied</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["suggestions", "competitors", "market", "forecast"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "suggestions" ? "AI Suggestions" : tab === "competitors" ? "Competitor Analysis" : tab === "market" ? "Market Insights" : "Demand Forecast"}
            </button>
          ))}
        </div>

        {activeTab === "suggestions" && (
          <div className="space-y-4">
            {suggestionsData.map((suggestion) => {
              const isApplied = appliedSuggestions.includes(suggestion.id);
              const priceChange = suggestion.suggestedPrice - suggestion.currentPrice;
              const changePercent = ((priceChange / suggestion.currentPrice) * 100).toFixed(0);

              return (
                <div
                  key={suggestion.id}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border p-6 transition-all ${
                    isApplied ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium">
                          {new Date(suggestion.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          suggestion.impact === "high" ? "bg-rose-500/10 text-rose-600" :
                          suggestion.impact === "medium" ? "bg-amber-500/10 text-amber-600" :
                          "bg-zinc-500/10 text-zinc-600"
                        }`}>
                          {suggestion.impact} impact
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/10 text-violet-600">
                          {suggestion.confidence}% confidence
                        </span>
                      </div>
                      <p className="font-medium mb-2">{suggestion.reason}</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.factors.map((factor, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-zinc-500">Current</p>
                        <p className="text-lg font-semibold text-zinc-400 line-through">{formatCurrency(suggestion.currentPrice)}</p>
                      </div>
                      <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <div className="text-center">
                        <p className="text-xs text-zinc-500">Suggested</p>
                        <p className={`text-lg font-bold ${priceChange > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {formatCurrency(suggestion.suggestedPrice)}
                        </p>
                        <p className={`text-xs ${priceChange > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {priceChange > 0 ? "+" : ""}{changePercent}%
                        </p>
                      </div>
                      <button
                        onClick={() => applySuggestion(suggestion.id)}
                        disabled={isApplied}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isApplied
                            ? "bg-emerald-500 text-white cursor-default"
                            : "bg-violet-600 hover:bg-violet-700 text-white"
                        }`}
                      >
                        {isApplied ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAppliedSuggestions(suggestionsData.map((s) => s.id))}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
              >
                Apply All Suggestions
              </button>
              <button className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Dismiss All
              </button>
            </div>
          </div>
        )}

        {activeTab === "competitors" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Nearby Competitors</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {competitorData.map((comp) => (
                  <div key={comp.id} className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <img src={comp.image} alt={comp.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{comp.name}</h4>
                      <p className="text-xs text-zinc-500 mb-2">{comp.location}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold">{formatCurrency(comp.price)}/night</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {comp.rating}
                        </span>
                        <span className="text-zinc-500">{comp.occupancy}% occ.</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {comp.amenities.map((a) => (
                          <span key={a} className="text-xs px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Price Positioning</h3>
              <div className="relative h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-rose-500/20 flex items-center justify-center text-xs text-rose-600">
                  Budget
                </div>
                <div className="absolute inset-y-0 left-1/3 w-1/3 bg-amber-500/20 flex items-center justify-center text-xs text-amber-600">
                  Mid-range
                </div>
                <div className="absolute inset-y-0 right-0 w-1/3 bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-600">
                  Premium
                </div>
                {/* Your position marker */}
                <div className="absolute top-1/2 -translate-y-1/2 left-[42%] w-4 h-4 bg-violet-600 rounded-full border-2 border-white shadow-lg" title="Your Property" />
              </div>
              <p className="text-sm text-zinc-500 text-center mt-3">
                Your property is positioned in the <strong>mid-range</strong> segment
              </p>
            </div>
          </div>
        )}

        {activeTab === "market" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((insight) => (
                <div key={insight.metric} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <p className="text-sm text-zinc-500 mb-1">{insight.metric}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold">{insight.value}</p>
                    <span className={`flex items-center gap-1 text-sm ${
                      insight.trend === "up" ? "text-emerald-500" : insight.trend === "down" ? "text-rose-500" : "text-zinc-500"
                    }`}>
                      {insight.trend === "up" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : insight.trend === "down" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      ) : null}
                      {Math.abs(insight.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Market Trends (Last 12 Months)</h3>
              <div className="h-64 flex items-end gap-4">
                {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map((month, idx) => {
                  const height = 40 + Math.sin(idx * 0.5) * 30 + Math.random() * 20;
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg transition-all hover:from-violet-500 hover:to-violet-300"
                        style={{ height: `${height}%` }}
                      />
                      <p className="text-xs text-zinc-500 mt-2">{month}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">6-Week Demand Forecast</h3>
              <div className="space-y-4">
                {forecastData.map((week, idx) => (
                  <div key={week.week} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-medium">{week.week}</span>
                    <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all ${
                          week.demand >= 85 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                          week.demand >= 70 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                          "bg-gradient-to-r from-rose-500 to-rose-400"
                        }`}
                        style={{ width: `${week.demand}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {week.demand}% demand
                      </span>
                    </div>
                    <div className="w-24 text-right">
                      <span className="font-semibold">{formatCurrency(week.price)}</span>
                      <p className="text-xs text-zinc-500">suggested</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">AI Insight</h4>
                  <p className="text-white/90 text-sm">
                    Based on historical data and current market trends, we predict a <strong>23% increase</strong> in bookings
                    during Week 3 (Spring Break). Consider increasing your minimum stay requirement and adjusting cancellation
                    policies for this high-demand period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
