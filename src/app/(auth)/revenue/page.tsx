import { TrendingUp, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import AnalyticsChart from "@/components/AnalyticsChart";

const kpis = [
  { label: "Revenue (YTD)", value: "$89,420", change: "+22%", up: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "RevPAR", value: "$146", change: "+$18", up: true, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "ADR", value: "$187", change: "+$12", up: true, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Occupancy", value: "78%", change: "-2%", up: false, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
];

const forecast = [
  { month: "Mar 2026", projected: "$16,200", confidence: "High", occupancy: "81%" },
  { month: "Apr 2026", projected: "$14,800", confidence: "High", occupancy: "76%" },
  { month: "May 2026", projected: "$18,400", confidence: "Medium", occupancy: "88%" },
  { month: "Jun 2026", projected: "$22,100", confidence: "Medium", occupancy: "94%" },
  { month: "Jul 2026", projected: "$24,600", confidence: "Low", occupancy: "97%" },
  { month: "Aug 2026", projected: "$23,200", confidence: "Low", occupancy: "93%" },
];

const confidenceColor: Record<string, string> = {
  High: "bg-emerald-500/10 text-emerald-600",
  Medium: "bg-amber-500/10 text-amber-600",
  Low: "bg-rose-500/10 text-rose-600",
};

const topProperties = [
  { name: "Ocean View Suite", revenue: "$32,400", occupancy: "82%", adr: "$187", trend: "up" },
  { name: "Downtown Loft", revenue: "$28,100", occupancy: "79%", adr: "$143", trend: "up" },
  { name: "Mountain Cabin", revenue: "$18,920", occupancy: "71%", adr: "$223", trend: "down" },
];

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Revenue & Forecasting</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-powered revenue insights and 6-month projections.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors font-medium">
          <Download className="w-4 h-4" /> Export report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${k.up ? "text-emerald-500" : "text-rose-500"}`}>
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-0.5">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <AnalyticsChart />

      {/* Forecast table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">6-Month Revenue Forecast</h2>
          <span className="text-xs text-muted-foreground">AI-generated · Updated daily</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Month</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Projected Revenue</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Occupancy</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {forecast.map((f) => (
                <tr key={f.month} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{f.month}</td>
                  <td className="px-5 py-3.5 text-right font-semibold">{f.projected}</td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">{f.occupancy}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${confidenceColor[f.confidence]}`}>
                      {f.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top properties */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Top Performing Properties</h2>
        </div>
        <div className="divide-y divide-border">
          {topProperties.map((p) => (
            <div key={p.name} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="font-medium text-sm">{p.name}</div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right hidden sm:block">
                  <div className="font-semibold">{p.revenue}</div>
                  <div className="text-xs text-muted-foreground">Revenue YTD</div>
                </div>
                <div className="text-right hidden md:block">
                  <div className="font-semibold">{p.occupancy}</div>
                  <div className="text-xs text-muted-foreground">Occupancy</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{p.adr}</div>
                  <div className="text-xs text-muted-foreground">ADR</div>
                </div>
                {p.trend === "up"
                  ? <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  : <ArrowDownRight className="w-4 h-4 text-rose-500" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
