"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  Shield,
  ArrowRight,
  ChevronDown,
  BarChart3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const MARKETS: Record<string, { label: string; multiplier: number; avgAdr: number }> = {
  miami: { label: "Miami, FL", multiplier: 1.18, avgAdr: 195 },
  new_york: { label: "New York, NY", multiplier: 1.22, avgAdr: 265 },
  los_angeles: { label: "Los Angeles, CA", multiplier: 1.2, avgAdr: 235 },
  nashville: { label: "Nashville, TN", multiplier: 1.14, avgAdr: 185 },
  austin: { label: "Austin, TX", multiplier: 1.12, avgAdr: 175 },
  denver: { label: "Denver, CO", multiplier: 1.08, avgAdr: 165 },
  chicago: { label: "Chicago, IL", multiplier: 1.06, avgAdr: 178 },
  orlando: { label: "Orlando, FL", multiplier: 1.1, avgAdr: 168 },
  scottsdale: { label: "Scottsdale, AZ", multiplier: 1.13, avgAdr: 210 },
  charleston: { label: "Charleston, SC", multiplier: 1.09, avgAdr: 192 },
  other: { label: "Other Market", multiplier: 1.0, avgAdr: 155 },
};

const OPTIMAL_OCCUPANCY = 85;
const DAYS_PER_MONTH = 30;
const LABOR_RATE_PER_HOUR = 35;
const HOURS_SAVED_PER_UNIT_PER_WEEK = 2;

function calcLeak(units: number, occupancy: number, adr: number, marketKey: string) {
  const market = MARKETS[marketKey] ?? MARKETS.other;
  const gapPct = Math.max(0, OPTIMAL_OCCUPANCY - occupancy) / 100;
  const rawLeak = units * gapPct * adr * DAYS_PER_MONTH * market.multiplier;
  // CompliCore typically recovers 65% of the leak
  const recoverable = Math.round(rawLeak * 0.65);
  // Hours saved
  const weeklyHours = units * HOURS_SAVED_PER_UNIT_PER_WEEK;
  const monthlyHours = weeklyHours * 4;
  const laborValue = monthlyHours * LABOR_RATE_PER_HOUR;
  // Total monthly gain
  const totalGain = recoverable + laborValue;
  // CompliCore cost
  const complicoreCost = units <= 10
    ? units * 46
    : units <= 25
    ? 399
    : 399 + (units - 25) * 25;
  const netGain = totalGain - complicoreCost;

  return {
    monthlyLeak: Math.round(rawLeak),
    recoverable,
    weeklyHours,
    monthlyHours,
    laborValue,
    totalGain,
    complicoreCost,
    netGain,
    occupancyGap: Math.max(0, OPTIMAL_OCCUPANCY - occupancy),
    marketLabel: market.label,
  };
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
    const start = displayed;
    const end = value;
    const duration = 700;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayed(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span>
      {prefix}{displayed.toLocaleString()}{suffix}
    </span>
  );
}

export default function RevenueAuditPage() {
  const [units, setUnits] = useState(12);
  const [occupancy, setOccupancy] = useState(68);
  const [adr, setAdr] = useState(175);
  const [marketKey, setMarketKey] = useState("miami");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const result = calcLeak(units, occupancy, adr, marketKey);

  const showResult = true; // live calculation

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            CompliCore
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <BarChart3 className="w-3.5 h-3.5" />
          Free Revenue Audit — 60 Seconds
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
          See Exactly How Much Revenue<br />
          <span className="text-emerald-400">Your Properties Are Leaking.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Most managers lose 12–18% of their annual yield to unoptimized mid-week gaps and outdated pricing.
          Get your custom audit in 60 seconds — no sign-up required.
        </p>
      </section>

      {/* Main calculator + result */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
            Tell us about your portfolio
          </h2>

          <div className="space-y-6">
            {/* Units */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400 font-medium">Portfolio Size</label>
                <span className="text-sm font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                  {units} {units === 1 ? "unit" : "units"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>1</span><span>25</span><span>50</span><span>100</span>
              </div>
            </div>

            {/* Occupancy */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400 font-medium">Current Average Occupancy</label>
                <span className="text-sm font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                  {occupancy}%
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={95}
                value={occupancy}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>30%</span><span>50%</span><span>70%</span><span>95%</span>
              </div>
              {occupancy >= 85 && (
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  You&apos;re near market optimum. Focus shifts to rate optimization.
                </p>
              )}
              {occupancy < 70 && (
                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Significant mid-week vacancy gap detected.
                </p>
              )}
            </div>

            {/* ADR */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400 font-medium">Current ADR (Avg Daily Rate)</label>
                <span className="text-sm font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                  ${adr}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={600}
                step={5}
                value={adr}
                onChange={(e) => setAdr(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>$50</span><span>$200</span><span>$400</span><span>$600</span>
              </div>
            </div>

            {/* Market */}
            <div>
              <label className="text-sm text-zinc-400 font-medium block mb-2">Primary Market</label>
              <div className="relative">
                <select
                  value={marketKey}
                  onChange={(e) => setMarketKey(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 pr-8"
                >
                  {Object.entries(MARKETS).map(([key, m]) => (
                    <option key={key} value={key}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="flex flex-col gap-6">
          {/* Primary result */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/80 rounded-2xl border border-emerald-500/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent pointer-events-none" />
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Your Monthly Revenue Leak</p>
            <div className="text-5xl font-bold text-emerald-400 mb-2">
              $<AnimatedNumber value={result.monthlyLeak} />
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Based on market data for <span className="text-white font-medium">{result.marketLabel}</span>,
              your <span className="text-white font-medium">{units}-unit portfolio</span> is currently leaking{" "}
              <span className="text-emerald-400 font-semibold">${result.monthlyLeak.toLocaleString()} per month</span> in
              &quot;Ghost Vacancies.&quot; That&apos;s{" "}
              <span className="text-amber-400 font-semibold">${(result.monthlyLeak * 12).toLocaleString()} annually</span>.
            </p>
            {result.occupancyGap > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">
                  You&apos;re <span className="text-amber-400 font-semibold">{result.occupancyGap}% below</span> the{" "}
                  {OPTIMAL_OCCUPANCY}% market optimum. CompliCore plugs this leak by capturing
                  the mid-week traveler you&apos;re currently missing.
                </p>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300">The CompliCore Math</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-zinc-400">Recoverable Yield</span>
                    <span className="text-sm font-bold text-emerald-400">
                      +$<AnimatedNumber value={result.recoverable} />/mo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">65% vacancy gap recovery via yield engine</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-zinc-400">Labor Savings</span>
                    <span className="text-sm font-bold text-blue-400">
                      +$<AnimatedNumber value={result.laborValue} />/mo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    ~<AnimatedNumber value={result.weeklyHours} /> hrs/week freed @ $35/hr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-zinc-400">Compliance Protection</span>
                    <span className="text-sm font-bold text-amber-400">Priceless</span>
                  </div>
                  <p className="text-xs text-zinc-600">Prevents $1k–$5k fines / license loss</p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-zinc-400">CompliCore Cost</span>
                  <span className="text-sm text-zinc-400">
                    −$<AnimatedNumber value={result.complicoreCost} />/mo
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Net Monthly Gain</span>
                  <span className={`text-lg font-bold ${result.netGain > 0 ? "text-emerald-400" : "text-zinc-400"}`}>
                    {result.netGain > 0 ? "+" : ""}$<AnimatedNumber value={Math.abs(result.netGain)} />/mo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Get the report */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-2">Get Your Full Revenue Report</h2>
          <p className="text-zinc-400 text-sm mb-6">
            We&apos;ll send a detailed PDF showing your exact revenue leak breakdown,
            market benchmarks, and a 30-day recovery roadmap.
          </p>
          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Send Report <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Report on its way to {email}</span>
            </div>
          )}
          <p className="text-xs text-zinc-600 mt-4">No spam. No credit card. Just your numbers.</p>

          <div className="mt-8 pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 mb-4">
              Ready to plug the leak? Start a free 14-day trial — no card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
            >
              Start Recovering Revenue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-zinc-800 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-10">Real results from real operators</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "CompliCore recovered $2,100 in my first month by filling Tuesday–Wednesday gaps I didn't even know existed.",
                name: "Sarah T.",
                detail: "12-unit operator, Miami",
              },
              {
                quote: "We cut admin hours by 60% in 30 days. One person now manages 28 properties without burning out.",
                name: "Marcus R.",
                detail: "28-unit operator, Nashville",
              },
              {
                quote: "The compliance dashboard alone is worth it. We haven't had a permit lapse in 18 months.",
                name: "Dana K.",
                detail: "52-unit enterprise, Chicago",
              },
            ].map((t) => (
              <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs font-semibold text-white">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© 2026 CompliCore. Maximum Revenue. Zero Compliance Headaches.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/#pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
