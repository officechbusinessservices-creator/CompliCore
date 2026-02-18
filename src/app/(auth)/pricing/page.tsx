import { Zap, TrendingUp, DollarSign, Info } from "lucide-react";

const rules = [
  {
    name: "Weekend Premium",
    property: "All properties",
    type: "Day-of-week",
    adjustment: "+25%",
    status: "active",
  },
  {
    name: "Last-Minute Discount",
    property: "All properties",
    type: "Lead time",
    adjustment: "-15%",
    status: "active",
  },
  {
    name: "Long Stay Discount",
    property: "Ocean View Suite",
    type: "Length of stay",
    adjustment: "-10%",
    status: "active",
  },
  {
    name: "Holiday Surge",
    property: "All properties",
    type: "Seasonal",
    adjustment: "+40%",
    status: "paused",
  },
];

const properties = [
  { name: "Ocean View Suite", base: "$187", ai: "$204", occupancy: "82%", revenue: "$5,610" },
  { name: "Downtown Loft", base: "$143", ai: "$151", occupancy: "74%", revenue: "$3,876" },
  { name: "Mountain Cabin", base: "$223", ai: "$238", occupancy: "68%", revenue: "$3,808" },
  { name: "City Studio", base: "$98", ai: "$112", occupancy: "91%", revenue: "$3,026" },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pricing</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-powered dynamic pricing and manual rules</p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
          + Add rule
        </button>
      </div>

      {/* AI Pricing banner */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-1">AI Pricing is active</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI analyzes market demand, competitor rates, local events, and seasonality to automatically optimize your nightly rates. On average, hosts see a <strong className="text-foreground">+18% revenue lift</strong> in the first 30 days.
          </p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 flex-shrink-0">
          Configure
        </button>
      </div>

      {/* Per-property rates */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Rate Overview</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            AI rate vs. base rate
          </div>
        </div>
        <div className="divide-y divide-border">
          {properties.map((p) => (
            <div key={p.name} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Base: {p.base}/night → AI: <span className="text-emerald-600 font-medium">{p.ai}/night</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm">{p.revenue}</div>
                <div className="text-xs text-muted-foreground">MTD revenue</div>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <div className="font-semibold text-sm">{p.occupancy}</div>
                <div className="text-xs text-muted-foreground">occupancy</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing rules */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Pricing Rules</h2>
        </div>
        <div className="divide-y divide-border">
          {rules.map((r) => (
            <div key={r.name} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {r.property} · {r.type}
                </div>
              </div>
              <div className={`font-semibold text-sm ${r.adjustment.startsWith("+") ? "text-emerald-600" : "text-rose-500"}`}>
                {r.adjustment}
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  r.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {r.status}
              </span>
              <button className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
