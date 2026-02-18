"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface EnergyData {
  month: string;
  electricity: number;
  gas: number;
  water: number;
  cost: number;
}

interface SustainabilityMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  status: "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

const energyData: EnergyData[] = [
  { month: "Sep", electricity: 320, gas: 45, water: 2800, cost: 185 },
  { month: "Oct", electricity: 290, gas: 65, water: 2650, cost: 195 },
  { month: "Nov", electricity: 310, gas: 120, water: 2400, cost: 225 },
  { month: "Dec", electricity: 380, gas: 180, water: 2200, cost: 285 },
  { month: "Jan", electricity: 350, gas: 195, water: 2100, cost: 275 },
  { month: "Feb", electricity: 340, gas: 150, water: 2300, cost: 245 },
];

const metrics: SustainabilityMetric[] = [
  { name: "Carbon Footprint", current: 2.4, target: 2.0, unit: "tons CO2/year", status: "warning", trend: "down" },
  { name: "Energy Efficiency", current: 78, target: 85, unit: "%", status: "good", trend: "up" },
  { name: "Water Usage", current: 14450, target: 12000, unit: "gal/year", status: "warning", trend: "down" },
  { name: "Waste Diversion", current: 62, target: 75, unit: "%", status: "warning", trend: "up" },
];

const ecoFeatures = [
  { name: "Smart Thermostat", installed: true, savings: "$180/year" },
  { name: "LED Lighting", installed: true, savings: "$95/year" },
  { name: "Low-Flow Fixtures", installed: true, savings: "$120/year" },
  { name: "Solar Panels", installed: false, savings: "$450/year" },
  { name: "Energy Star Appliances", installed: true, savings: "$150/year" },
  { name: "Smart Power Strips", installed: false, savings: "$60/year" },
];

const ecoBadges = [
  { name: "Energy Saver", earned: true, description: "Reduced energy use by 15%" },
  { name: "Water Wise", earned: true, description: "Below average water consumption" },
  { name: "Green Host", earned: false, description: "Complete 5 sustainability goals" },
  { name: "Carbon Neutral", earned: false, description: "Offset all carbon emissions" },
];

export default function SustainabilityPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "energy" | "reports" | "improvements">("overview");
  const [selectedProperty, setSelectedProperty] = useState("Modern Downtown Loft");
  const [dateRange, setDateRange] = useState("6m");
  const [energyUsage, setEnergyUsage] = useState<EnergyData[]>(energyData);
  const [metricsData, setMetricsData] = useState(metrics);
  const [featuresData, setFeaturesData] = useState(ecoFeatures);
  const [badgesData, setBadgesData] = useState(ecoBadges);

  useEffect(() => {
    fetchModuleData<EnergyData[]>("/sustainability/energy", energyData).then(setEnergyUsage);
    fetchModuleData<typeof metrics>("/sustainability/metrics", metrics).then(setMetricsData);
    fetchModuleData<typeof ecoFeatures>("/sustainability/features", ecoFeatures).then(setFeaturesData);
    fetchModuleData<typeof ecoBadges>("/sustainability/badges", ecoBadges).then(setBadgesData);
  }, []);

  const totalCost = energyUsage.reduce((sum, d) => sum + d.cost, 0);
  const avgElectricity = Math.round(energyUsage.reduce((sum, d) => sum + d.electricity, 0) / energyUsage.length);
  const maxElectricity = Math.max(...energyUsage.map((d) => d.electricity));

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
              <h1 className="font-semibold text-lg flex items-center gap-2">
                Sustainability
                <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                  Eco
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Energy monitoring & reports</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm"
            >
              <option>Modern Downtown Loft</option>
              <option>Cozy Beachfront Cottage</option>
              <option>Luxury Mountain Cabin</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm"
            >
              <option value="3m">3 months</option>
              <option value="6m">6 months</option>
              <option value="12m">12 months</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Eco Score */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-1 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <p className="text-sm text-white/80 mb-2">Eco Score</p>
            <p className="text-5xl font-bold">72</p>
            <p className="text-sm text-white/80 mt-2">Good</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">6-Month Energy Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-emerald-500">-12% vs last period</p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">Avg. Monthly kWh</p>
              <p className="text-2xl font-bold">{avgElectricity}</p>
              <p className="text-xs text-zinc-400">electricity usage</p>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">Badges Earned</p>
              <p className="text-2xl font-bold text-emerald-600">{badgesData.filter((b) => b.earned).length}/{badgesData.length}</p>
              <p className="text-xs text-zinc-400">sustainability goals</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["overview", "energy", "reports", "improvements"] as const).map((tab) => (
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
          <div className="grid md:grid-cols-2 gap-6">
            {/* Metrics */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Sustainability Metrics</h3>
              <div className="space-y-4">
                {metricsData.map((metric) => (
                  <div key={metric.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          metric.status === "good" ? "text-emerald-600" :
                          metric.status === "warning" ? "text-amber-600" : "text-rose-600"
                        }`}>
                          {metric.current} {metric.unit}
                        </span>
                        {metric.trend === "up" ? (
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : metric.trend === "down" ? (
                          <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : null}
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          metric.status === "good" ? "bg-emerald-500" :
                          metric.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${(metric.current / metric.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Target: {metric.target} {metric.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Eco Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {badgesData.map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-4 rounded-xl border ${
                      badge.earned
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                        : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {badge.earned ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      <span className="font-medium text-sm">{badge.name}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "energy" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Energy Consumption</h3>
              <div className="h-64 flex items-end gap-4">
                {energyUsage.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col gap-1" style={{ height: `${(data.electricity / maxElectricity) * 100}%` }}>
                      <div className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg" title={`Electricity: ${data.electricity} kWh`} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">{data.month}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded" />
                  <span className="text-sm">Electricity (kWh)</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {energyUsage.slice(-3).map((data) => (
                <div key={data.month} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <p className="text-sm text-zinc-500 mb-3">{data.month} 2026</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Electricity</span>
                      <span className="font-medium">{data.electricity} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gas</span>
                      <span className="font-medium">{data.gas} therms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Water</span>
                      <span className="font-medium">{data.water} gal</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
                      <span className="font-medium">Total Cost</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(data.cost)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Sustainability Reports</h3>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                Download PDF
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Annual Sustainability Report 2025", date: "Jan 15, 2026", size: "2.4 MB" },
                { name: "Q4 2025 Energy Summary", date: "Jan 5, 2026", size: "1.1 MB" },
                { name: "Carbon Footprint Analysis", date: "Dec 20, 2025", size: "850 KB" },
                { name: "Water Usage Report", date: "Dec 1, 2025", size: "620 KB" },
              ].map((report) => (
                <div key={report.name} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-zinc-500">{report.date} · {report.size}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "improvements" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-6">Eco-Friendly Improvements</h3>
            <div className="space-y-4">
              {featuresData.map((feature) => (
                <div key={feature.name} className={`flex items-center justify-between p-4 rounded-lg ${
                  feature.installed ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-zinc-50 dark:bg-zinc-800/50"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      feature.installed ? "bg-emerald-500 text-white" : "bg-zinc-200 dark:bg-zinc-700"
                    }`}>
                      {feature.installed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-zinc-500">{feature.installed ? "Installed" : "Not installed"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{feature.savings}</p>
                    <p className="text-xs text-zinc-500">estimated savings</p>
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
