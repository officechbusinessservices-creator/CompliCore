"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface BenchmarkMetric {
  name: string;
  yourValue: number;
  marketAvg: number;
  topPerformers: number;
  unit: string;
  higherIsBetter: boolean;
}

interface CompetitorProperty {
  id: string;
  name: string;
  image: string;
  distance: string;
  price: number;
  rating: number;
  reviews: number;
  occupancy: number;
  responseTime: string;
  superhost: boolean;
}

const benchmarkMetrics: BenchmarkMetric[] = [
  { name: "Nightly Rate", yourValue: 199, marketAvg: 215, topPerformers: 275, unit: "$", higherIsBetter: true },
  { name: "Occupancy Rate", yourValue: 78, marketAvg: 72, topPerformers: 88, unit: "%", higherIsBetter: true },
  { name: "Average Rating", yourValue: 4.91, marketAvg: 4.65, topPerformers: 4.95, unit: "", higherIsBetter: true },
  { name: "Response Rate", yourValue: 98, marketAvg: 89, topPerformers: 100, unit: "%", higherIsBetter: true },
  { name: "Response Time", yourValue: 15, marketAvg: 45, topPerformers: 5, unit: "min", higherIsBetter: false },
  { name: "Booking Lead Time", yourValue: 18, marketAvg: 14, topPerformers: 25, unit: "days", higherIsBetter: true },
  { name: "Cancellation Rate", yourValue: 2, marketAvg: 5, topPerformers: 1, unit: "%", higherIsBetter: false },
  { name: "Repeat Guest Rate", yourValue: 24, marketAvg: 15, topPerformers: 35, unit: "%", higherIsBetter: true },
];

const competitors: CompetitorProperty[] = [
  {
    id: "c1",
    name: "Urban Retreat Downtown",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300",
    distance: "0.3 mi",
    price: 225,
    rating: 4.87,
    reviews: 156,
    occupancy: 78,
    responseTime: "< 1 hour",
    superhost: true,
  },
  {
    id: "c2",
    name: "City View Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300",
    distance: "0.5 mi",
    price: 195,
    rating: 4.72,
    reviews: 89,
    occupancy: 82,
    responseTime: "< 1 hour",
    superhost: false,
  },
  {
    id: "c3",
    name: "Modern Studio Haven",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300",
    distance: "0.4 mi",
    price: 175,
    rating: 4.65,
    reviews: 203,
    occupancy: 71,
    responseTime: "Within 2 hours",
    superhost: false,
  },
  {
    id: "c4",
    name: "Luxury Penthouse Suite",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300",
    distance: "0.6 mi",
    price: 350,
    rating: 4.95,
    reviews: 67,
    occupancy: 89,
    responseTime: "< 30 min",
    superhost: true,
  },
  {
    id: "c5",
    name: "Cozy Corner Studio",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300",
    distance: "0.2 mi",
    price: 149,
    rating: 4.58,
    reviews: 312,
    occupancy: 85,
    responseTime: "Within 4 hours",
    superhost: false,
  },
];

const monthlyTrends = [
  { month: "Sep", you: 72, market: 68 },
  { month: "Oct", you: 78, market: 71 },
  { month: "Nov", you: 65, market: 62 },
  { month: "Dec", you: 82, market: 75 },
  { month: "Jan", you: 75, market: 70 },
  { month: "Feb", you: 78, market: 72 },
];

export default function BenchmarkingPage() {
  const [selectedProperty, setSelectedProperty] = useState("Modern Downtown Loft");
  const [activeTab, setActiveTab] = useState<"overview" | "competitors" | "trends" | "insights">("overview");
  const [comparisonRadius, setComparisonRadius] = useState("1");
  const [benchmarkData, setBenchmarkData] = useState(competitors);
  const [metricsData, setMetricsData] = useState(benchmarkMetrics);

  useEffect(() => {
    fetchModuleData<CompetitorProperty[]>("/benchmarks", competitors).then(setBenchmarkData);
    fetchModuleData<BenchmarkMetric[]>("/benchmarks/metrics", benchmarkMetrics).then(setMetricsData);
  }, []);

  const getPerformanceColor = (metric: BenchmarkMetric) => {
    const isAboveAvg = metric.higherIsBetter
      ? metric.yourValue >= metric.marketAvg
      : metric.yourValue <= metric.marketAvg;
    const isTopPerformer = metric.higherIsBetter
      ? metric.yourValue >= metric.topPerformers * 0.9
      : metric.yourValue <= metric.topPerformers * 1.1;

    if (isTopPerformer) return "text-emerald-600";
    if (isAboveAvg) return "text-blue-600";
    return "text-amber-600";
  };

  const getPerformanceLabel = (metric: BenchmarkMetric) => {
    const isAboveAvg = metric.higherIsBetter
      ? metric.yourValue >= metric.marketAvg
      : metric.yourValue <= metric.marketAvg;
    const isTopPerformer = metric.higherIsBetter
      ? metric.yourValue >= metric.topPerformers * 0.9
      : metric.yourValue <= metric.topPerformers * 1.1;

    if (isTopPerformer) return "Top Performer";
    if (isAboveAvg) return "Above Average";
    return "Below Average";
  };

  const overallScore = Math.round(
    metricsData.reduce((sum, m) => {
      const normalized = m.higherIsBetter
        ? (m.yourValue / m.topPerformers) * 100
        : (m.topPerformers / m.yourValue) * 100;
      return sum + Math.min(normalized, 100);
    }, 0) / metricsData.length
  );

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
              <h1 className="font-semibold text-lg">Performance Benchmarking</h1>
              <p className="text-xs text-zinc-500">Compare against local market</p>
            </div>
          </div>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm"
          >
            <option>Modern Downtown Loft</option>
            <option>Cozy Beachfront Cottage</option>
            <option>Luxury Mountain Cabin</option>
          </select>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Overall Score */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-1 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <p className="text-sm text-white/80 mb-2">Performance Score</p>
            <p className="text-5xl font-bold">{overallScore}</p>
            <p className="text-sm text-white/80 mt-2">out of 100</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">Market Rank</p>
              <p className="text-2xl font-bold">#3</p>
              <p className="text-xs text-zinc-400">of 28 similar listings</p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">Revenue vs Market</p>
              <p className="text-2xl font-bold text-emerald-600">+12%</p>
              <p className="text-xs text-zinc-400">above average</p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">Comparison Area</p>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={comparisonRadius}
                  onChange={(e) => setComparisonRadius(e.target.value)}
                  className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm"
                >
                  <option value="0.5">0.5 mi</option>
                  <option value="1">1 mi</option>
                  <option value="2">2 mi</option>
                  <option value="5">5 mi</option>
                </select>
                <span className="text-xs text-zinc-500">radius</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["overview", "competitors", "trends", "insights"] as const).map((tab) => (
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
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold">Key Performance Metrics</h3>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {metricsData.map((metric) => {
                const position = metric.higherIsBetter
                  ? ((metric.yourValue - metric.marketAvg) / (metric.topPerformers - metric.marketAvg)) * 50 + 50
                  : ((metric.marketAvg - metric.yourValue) / (metric.marketAvg - metric.topPerformers)) * 50 + 50;

                return (
                  <div key={metric.name} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className={`text-sm ${getPerformanceColor(metric)}`}>
                          {getPerformanceLabel(metric)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {metric.unit === "$" ? formatCurrency(metric.yourValue) : `${metric.yourValue}${metric.unit}`}
                        </p>
                      </div>
                    </div>
                    <div className="relative h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      <div className="absolute left-1/2 top-0 w-0.5 h-full bg-zinc-400" />
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow ${
                          getPerformanceColor(metric).includes("emerald") ? "bg-emerald-500" :
                          getPerformanceColor(metric).includes("blue") ? "bg-blue-500" : "bg-amber-500"
                        }`}
                        style={{ left: `${Math.min(Math.max(position, 5), 95)}%`, transform: "translate(-50%, -50%)" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 mt-1">
                      <span>Market Avg: {metric.unit === "$" ? formatCurrency(metric.marketAvg) : `${metric.marketAvg}${metric.unit}`}</span>
                      <span>Top: {metric.unit === "$" ? formatCurrency(metric.topPerformers) : `${metric.topPerformers}${metric.unit}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "competitors" && (
          <div className="space-y-4">
            {benchmarkData.map((competitor) => (
              <div key={competitor.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex gap-4">
                  <img src={competitor.image} alt={competitor.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{competitor.name}</h3>
                          {competitor.superhost && (
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 text-xs rounded-full">Superhost</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500">{competitor.distance} away</p>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(competitor.price)}<span className="text-sm font-normal text-zinc-500">/night</span></p>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-zinc-500">Rating</p>
                        <p className="font-semibold flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {competitor.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Reviews</p>
                        <p className="font-semibold">{competitor.reviews}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Occupancy</p>
                        <p className="font-semibold">{competitor.occupancy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Response</p>
                        <p className="font-semibold text-sm">{competitor.responseTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "trends" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-6">Occupancy Trends: You vs Market</h3>
            <div className="h-64 flex items-end gap-4">
              {monthlyTrends.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 h-48">
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-emerald-500 rounded-t-lg"
                        style={{ height: `${month.you}%` }}
                        title={`You: ${month.you}%`}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-zinc-300 dark:bg-zinc-600 rounded-t-lg"
                        style={{ height: `${month.market}%` }}
                        title={`Market: ${month.market}%`}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">{month.month}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded" />
                <span className="text-sm">Your Property</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-300 dark:bg-zinc-600 rounded" />
                <span className="text-sm">Market Average</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-4">
            {[
              { type: "success", title: "Strong Response Rate", description: "Your 98% response rate is well above the market average of 89%. Keep it up!" },
              { type: "success", title: "Excellent Reviews", description: "Your 4.91 rating puts you in the top 10% of listings in your area." },
              { type: "warning", title: "Pricing Opportunity", description: "Your nightly rate is 7% below market average. Consider a price increase during peak seasons." },
              { type: "info", title: "Competitor Activity", description: "2 new listings appeared within 0.5 miles in the last 30 days." },
              { type: "success", title: "Low Cancellation Rate", description: "Your 2% cancellation rate is better than 85% of similar listings." },
            ].map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  insight.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" :
                  insight.type === "warning" ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800" :
                  "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    insight.type === "success" ? "bg-emerald-500" :
                    insight.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {insight.type === "success" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : insight.type === "warning" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
