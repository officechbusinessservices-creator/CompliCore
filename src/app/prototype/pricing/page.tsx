"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";
import {
  PRICING,
  calculateCorporateCommission,
  calculateHostClubAiMonthly,
  calculateHostClubMonthly,
  calculateMarkupToCoverCommission,
  calculatePortfolioProMonthly,
} from "@/lib/pricing";
import { LANDING_PLAN_COPY, portfolioBridgeCopy } from "@/lib/landing-copy";

// Types
interface PricingRule {
  id: string;
  name: string;
  type: "seasonal" | "length_of_stay" | "early_bird" | "last_minute" | "occupancy" | "custom";
  adjustment: number;
  adjustmentType: "percentage" | "fixed";
  conditions: Record<string, unknown>;
  active: boolean;
  priority: number;
}

interface PropertyPricing {
  id: string;
  propertyName: string;
  basePrice: number;
  weekendPrice: number;
  cleaningFee: number;
  currency: string;
  minNights: number;
  maxNights: number;
  rules: PricingRule[];
}

// Mock data
const mockProperties: PropertyPricing[] = [
  {
    id: "1",
    propertyName: "Modern Downtown Loft",
    basePrice: 175,
    weekendPrice: 225,
    cleaningFee: 75,
    currency: "USD",
    minNights: 2,
    maxNights: 30,
    rules: [
      {
        id: "r1",
        name: "Summer Season",
        type: "seasonal",
        adjustment: 20,
        adjustmentType: "percentage",
        conditions: { startDate: "2026-06-01", endDate: "2026-08-31" },
        active: true,
        priority: 1,
      },
      {
        id: "r2",
        name: "Weekly Discount",
        type: "length_of_stay",
        adjustment: -10,
        adjustmentType: "percentage",
        conditions: { minNights: 7 },
        active: true,
        priority: 2,
      },
      {
        id: "r3",
        name: "Monthly Discount",
        type: "length_of_stay",
        adjustment: -25,
        adjustmentType: "percentage",
        conditions: { minNights: 28 },
        active: true,
        priority: 3,
      },
      {
        id: "r4",
        name: "Last Minute Deal",
        type: "last_minute",
        adjustment: -15,
        adjustmentType: "percentage",
        conditions: { daysBeforeCheckIn: 3 },
        active: false,
        priority: 4,
      },
    ],
  },
];

// Rule type options
const ruleTypes = [
  { value: "seasonal", label: "Seasonal", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
  { value: "length_of_stay", label: "Length of Stay", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { value: "early_bird", label: "Early Bird", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "last_minute", label: "Last Minute", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { value: "occupancy", label: "Occupancy Based", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { value: "custom", label: "Custom Rule", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
];

export default function PricingEditorPage() {
  const [property, setProperty] = useState<PropertyPricing>(mockProperties[0]);
  const [hostProperties, setHostProperties] = useState(5);
  const [hostClubAiProperties, setHostClubAiProperties] = useState(8);
  const [portfolioProperties, setPortfolioProperties] = useState(PRICING.portfolioProIncludedProperties);
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);
  const [bookingAmount, setBookingAmount] = useState(1000);
  const [addonSelection, setAddonSelection] = useState<string[]>([]);
  useEffect(() => {
    apiGet<any>("/ai/pricing/suggestions?propertyId=demo-property&startDate=2026-03-15&endDate=2026-03-22").catch(() => null);
    apiGet<any>("/billing/plans")
      .then((data) => {
        if (Array.isArray(data)) setPlans(data);
      })
      .catch(() => null);
    apiGet<any>("/billing/subscriptions")
      .then((data) => {
        if (Array.isArray(data)) setSubscriptions(data);
      })
      .catch(() => null);
  }, []);

  const subscribeToPlan = async (planId: string) => {
    setBillingMessage(null);
    try {
      const res = await apiPost<any>("/billing/subscribe", { planId });
      setBillingMessage(`Subscribed: ${res.subscriptionId || planId}`);
      const updated = await apiGet<any>("/billing/subscriptions").catch(() => []);
      if (Array.isArray(updated)) setSubscriptions(updated);
    } catch (err: any) {
      setBillingMessage(err?.message || "Subscription failed");
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    setBillingMessage(null);
    try {
      const res = await apiPost<any>("/billing/cancel", { subscriptionId });
      setBillingMessage(`Canceled: ${res.subscriptionId || subscriptionId}`);
      const updated = await apiGet<any>("/billing/subscriptions").catch(() => []);
      if (Array.isArray(updated)) setSubscriptions(updated);
    } catch (err: any) {
      setBillingMessage(err?.message || "Cancel failed");
    }
  };
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [showAddRule, setShowAddRule] = useState(false);
  const [previewDates, setPreviewDates] = useState<{ start: string; end: string }>({
    start: "2026-03-15",
    end: "2026-03-22",
  });

  // Calculate preview price
  const calculatePreviewPrice = (): { nights: number; baseTotal: number; discounts: { name: string; amount: number }[]; finalTotal: number; cleaningFee: number } => {
    const start = new Date(previewDates.start);
    const end = new Date(previewDates.end);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    let baseTotal = 0;
    for (let i = 0; i < nights; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      baseTotal += isWeekend ? property.weekendPrice : property.basePrice;
    }

    const discounts: { name: string; amount: number }[] = [];
    let finalTotal = baseTotal;

    // Apply active rules
    for (const rule of property.rules.filter((r) => r.active).sort((a, b) => a.priority - b.priority)) {
      let applies = false;
      let discountAmount = 0;

      if (rule.type === "length_of_stay" && rule.conditions.minNights) {
        applies = nights >= Number(rule.conditions.minNights);
      } else if (rule.type === "seasonal" && rule.conditions.startDate && rule.conditions.endDate) {
        const ruleStart = new Date(String(rule.conditions.startDate));
        const ruleEnd = new Date(String(rule.conditions.endDate));
        applies = start >= ruleStart && start <= ruleEnd;
      }

      if (applies) {
        if (rule.adjustmentType === "percentage") {
          discountAmount = (baseTotal * rule.adjustment) / 100;
        } else {
          discountAmount = rule.adjustment;
        }
        discounts.push({ name: rule.name, amount: discountAmount });
        finalTotal += discountAmount;
      }
    }

    return { nights, baseTotal, discounts, finalTotal, cleaningFee: property.cleaningFee };
  };

  const preview = calculatePreviewPrice();

  // Toggle rule active status
  const toggleRule = (ruleId: string) => {
    setProperty((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === ruleId ? { ...r, active: !r.active } : r
      ),
    }));
  };

  // Delete rule
  const deleteRule = (ruleId: string) => {
    setProperty((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== ruleId),
    }));
  };

  // Add new rule
  const addNewRule = (type: string) => {
    const newRule: PricingRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New ${ruleTypes.find((t) => t.value === type)?.label || "Rule"}`,
      type: type as PricingRule["type"],
      adjustment: type.includes("discount") || type === "length_of_stay" ? -10 : 15,
      adjustmentType: "percentage",
      conditions: {},
      active: true,
      priority: property.rules.length + 1,
    };
    setProperty((prev) => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
    setShowAddRule(false);
    setEditingRule(newRule.id);
  };

  const portfolioProMonthly = calculatePortfolioProMonthly(portfolioProperties);
  const hostClubAiEquivalent = calculateHostClubAiMonthly(portfolioProperties);
  const portfolioSavings = hostClubAiEquivalent - portfolioProMonthly;

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
              <h1 className="font-semibold text-lg">Dynamic Pricing</h1>
              <p className="text-xs text-zinc-500">{property.propertyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Reset to Defaults
            </button>
            <button className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h2 className="font-semibold mb-2">{LANDING_PLAN_COPY.hostClub.name}</h2>
            <p className="text-sm text-zinc-500 mb-3">{LANDING_PLAN_COPY.hostClub.priceLabel} · {LANDING_PLAN_COPY.hostClub.summary}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={PRICING.portfolioProIncludedProperties}
                value={hostProperties}
                onChange={(e) => setHostProperties(Number(e.target.value))}
                className="w-20 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
              />
              <span className="text-sm">properties →</span>
              <span className="font-semibold">${calculateHostClubMonthly(hostProperties)}/mo</span>
            </div>
            <button
              onClick={() => subscribeToPlan("host_club")}
              className="mt-3 w-full px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Subscribe
            </button>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h2 className="font-semibold mb-2">{LANDING_PLAN_COPY.hostClubAi.name}</h2>
            <p className="text-sm text-zinc-500 mb-3">{LANDING_PLAN_COPY.hostClubAi.priceLabel} · {LANDING_PLAN_COPY.hostClubAi.summary}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={hostClubAiProperties}
                onChange={(e) => setHostClubAiProperties(Number(e.target.value))}
                className="w-20 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
              />
              <span className="text-sm">properties →</span>
              <span className="font-semibold">${calculateHostClubAiMonthly(hostClubAiProperties)}/mo</span>
            </div>
            <button
              onClick={() => subscribeToPlan("host_club_ai")}
              className="mt-3 w-full px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Subscribe
            </button>
          </div>
          <div className="p-4 rounded-xl bg-primary text-primary-foreground border border-primary/20">
            <h2 className="font-semibold mb-2">{LANDING_PLAN_COPY.portfolioPro.name}</h2>
            <p className="text-sm text-primary-foreground/80 mb-3">{LANDING_PLAN_COPY.portfolioPro.priceLabel} · {LANDING_PLAN_COPY.portfolioPro.summary}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={portfolioProperties}
                onChange={(e) => setPortfolioProperties(Number(e.target.value))}
                className="w-20 px-2 py-1 bg-white/15 rounded"
              />
              <span className="text-sm">properties →</span>
              <span className="font-semibold">${portfolioProMonthly}/mo</span>
            </div>
            <p className="text-xs text-primary-foreground/75 mt-2">
              {portfolioSavings > 0
                ? `Saves $${portfolioSavings}/month vs ${LANDING_PLAN_COPY.hostClubAi.name} at this size.`
                : `${LANDING_PLAN_COPY.portfolioPro.name} becomes the better value as portfolio size grows.`}
            </p>
            <button
              onClick={() => subscribeToPlan("portfolio_pro")}
              className="mt-3 w-full px-3 py-2 text-sm bg-white text-primary rounded-lg hover:bg-white/90"
            >
              Subscribe
            </button>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h2 className="font-semibold mb-2">{LANDING_PLAN_COPY.enterprise.name}</h2>
            <p className="text-sm text-zinc-500 mb-3">{LANDING_PLAN_COPY.enterprise.priceLabel} · {LANDING_PLAN_COPY.enterprise.summary}</p>
            <span className="font-semibold">${PRICING.enterpriseFlat}/mo</span>
            <p className="text-xs text-zinc-500 mt-2">
              Recommended once you exceed {PRICING.enterpriseRecommendedFromProperties} properties.
            </p>
            <button
              onClick={() => subscribeToPlan("enterprise")}
              className="mt-3 w-full px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="mb-8 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-2">Corporate SME commission calculator</h3>
          <p className="text-sm text-zinc-500 mb-3">8% commission per booking with optional markup coverage.</p>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(Number(e.target.value))}
              className="w-24 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded"
            />
            <span className="text-sm">booking amount → commission</span>
            <span className="font-semibold">${calculateCorporateCommission(bookingAmount).toFixed(2)}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Markup to cover commission: ${calculateMarkupToCoverCommission(bookingAmount).toFixed(2)}
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Bridge reference: at {portfolioBridgeCopy.thresholdProperties} properties, Host Club + AI is ${portfolioBridgeCopy.hostClubAiMonthlyAtThreshold}/month while Portfolio Pro is ${portfolioBridgeCopy.portfolioProMonthlyAtThreshold}/month.
          </p>
          <button
            onClick={() => subscribeToPlan("corporate_sme")}
            className="mt-3 px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Subscribe Corporate SME
          </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Marketplace Add-ons</h3>
            <span className="text-xs text-zinc-500">Billed monthly or per use</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {PRICING.marketplaceAddOns.map((addon) => (
              <button
                key={addon.id}
                onClick={() =>
                  setAddonSelection((prev) =>
                    prev.includes(addon.id) ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                  )
                }
                className={`p-4 rounded-lg border text-left transition-colors ${
                  addonSelection.includes(addon.id)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{addon.name}</p>
                    <p className="text-xs text-zinc-500">{addon.cadence}</p>
                  </div>
                  <span className="text-sm font-semibold">${addon.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {billingMessage && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            {billingMessage}
          </div>
        )}
        {subscriptions.length > 0 && (
          <div className="mb-6 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Active Subscriptions</h3>
              <span className="text-xs text-zinc-500">{subscriptions.length} total</span>
            </div>
            <div className="space-y-2">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="font-medium">{sub.plan?.name || sub.planId || sub.plan?.id}</p>
                    <p className="text-xs text-zinc-500">Status: {sub.status}</p>
                  </div>
                  {sub.status !== "canceled" && (
                    <button
                      onClick={() => cancelSubscription(sub.id)}
                      className="px-3 py-1.5 text-xs bg-rose-500/10 text-rose-600 rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Base Pricing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base Rates */}
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h2 className="font-semibold mb-4">Base Rates</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Nightly Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                    <input
                      type="number"
                      value={property.basePrice}
                      onChange={(e) => setProperty((prev) => ({ ...prev, basePrice: Number(e.target.value) }))}
                      className="w-full pl-8 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Weekend Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                    <input
                      type="number"
                      value={property.weekendPrice}
                      onChange={(e) => setProperty((prev) => ({ ...prev, weekendPrice: Number(e.target.value) }))}
                      className="w-full pl-8 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Cleaning Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                    <input
                      type="number"
                      value={property.cleaningFee}
                      onChange={(e) => setProperty((prev) => ({ ...prev, cleaningFee: Number(e.target.value) }))}
                      className="w-full pl-8 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Minimum Nights</label>
                  <input
                    type="number"
                    value={property.minNights}
                    onChange={(e) => setProperty((prev) => ({ ...prev, minNights: Number(e.target.value) }))}
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Maximum Nights</label>
                  <input
                    type="number"
                    value={property.maxNights}
                    onChange={(e) => setProperty((prev) => ({ ...prev, maxNights: Number(e.target.value) }))}
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Currency</label>
                  <select
                    value={property.currency}
                    onChange={(e) => setProperty((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Rules */}
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Pricing Rules</h2>
                <button
                  onClick={() => setShowAddRule(!showAddRule)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Rule
                </button>
              </div>

              {/* Add Rule Modal */}
              {showAddRule && (
                <div className="mb-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Select rule type:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ruleTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => addNewRule(type.value)}
                        className="flex items-center gap-2 p-3 text-left text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-emerald-500/50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={type.icon} />
                        </svg>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules List */}
              <div className="space-y-3">
                {property.rules.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <p className="text-sm">No pricing rules yet</p>
                    <p className="text-xs mt-1">Add rules to automatically adjust prices</p>
                  </div>
                ) : (
                  property.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-lg border transition-all ${
                        rule.active
                          ? "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          : "bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className={`mt-0.5 w-10 h-6 rounded-full p-1 transition-colors ${
                              rule.active ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                rule.active ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{rule.name}</h4>
                              <span className="text-xs px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                                {ruleTypes.find((t) => t.value === rule.type)?.label}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-500 mt-1">
                              {rule.adjustment > 0 ? "+" : ""}{rule.adjustment}
                              {rule.adjustmentType === "percentage" ? "%" : " " + property.currency}
                              {rule.type === "length_of_stay" && rule.conditions.minNights ? (
                                <span> for {Number(rule.conditions.minNights)}+ nights</span>
                              ) : null}
                              {rule.type === "seasonal" && rule.conditions.startDate ? (
                                <span> from {String(rule.conditions.startDate)} to {String(rule.conditions.endDate)}</span>
                              ) : null}
                              {rule.type === "last_minute" && rule.conditions.daysBeforeCheckIn ? (
                                <span> when booking within {Number(rule.conditions.daysBeforeCheckIn)} days</span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingRule(editingRule === rule.id ? null : rule.id)}
                            className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteRule(rule.id)}
                            className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-900/30 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Edit Rule Form */}
                      {editingRule === rule.id && (
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-zinc-500 mb-1">Rule Name</label>
                              <input
                                type="text"
                                value={rule.name}
                                onChange={(e) =>
                                  setProperty((prev) => ({
                                    ...prev,
                                    rules: prev.rules.map((r) =>
                                      r.id === rule.id ? { ...r, name: e.target.value } : r
                                    ),
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-xs text-zinc-500 mb-1">Adjustment</label>
                                <input
                                  type="number"
                                  value={rule.adjustment}
                                  onChange={(e) =>
                                    setProperty((prev) => ({
                                      ...prev,
                                      rules: prev.rules.map((r) =>
                                        r.id === rule.id ? { ...r, adjustment: Number(e.target.value) } : r
                                      ),
                                    }))
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-zinc-500 mb-1">Type</label>
                                <select
                                  value={rule.adjustmentType}
                                  onChange={(e) =>
                                    setProperty((prev) => ({
                                      ...prev,
                                      rules: prev.rules.map((r) =>
                                        r.id === rule.id
                                          ? { ...r, adjustmentType: e.target.value as "percentage" | "fixed" }
                                          : r
                                      ),
                                    }))
                                  }
                                  className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                >
                                  <option value="percentage">%</option>
                                  <option value="fixed">$</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Type-specific conditions */}
                          {rule.type === "length_of_stay" && (
                            <div>
                              <label className="block text-xs text-zinc-500 mb-1">Minimum Nights</label>
                              <input
                                type="number"
                                value={Number(rule.conditions.minNights) || 7}
                                onChange={(e) =>
                                  setProperty((prev) => ({
                                    ...prev,
                                    rules: prev.rules.map((r) =>
                                      r.id === rule.id
                                        ? { ...r, conditions: { ...r.conditions, minNights: Number(e.target.value) } }
                                        : r
                                    ),
                                  }))
                                }
                                className="w-32 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              />
                            </div>
                          )}

                          {rule.type === "seasonal" && (
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-zinc-500 mb-1">Start Date</label>
                                <input
                                  type="date"
                                  value={String(rule.conditions.startDate) || ""}
                                  onChange={(e) =>
                                    setProperty((prev) => ({
                                      ...prev,
                                      rules: prev.rules.map((r) =>
                                        r.id === rule.id
                                          ? { ...r, conditions: { ...r.conditions, startDate: e.target.value } }
                                          : r
                                      ),
                                    }))
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-zinc-500 mb-1">End Date</label>
                                <input
                                  type="date"
                                  value={String(rule.conditions.endDate) || ""}
                                  onChange={(e) =>
                                    setProperty((prev) => ({
                                      ...prev,
                                      rules: prev.rules.map((r) =>
                                        r.id === rule.id
                                          ? { ...r, conditions: { ...r.conditions, endDate: e.target.value } }
                                          : r
                                      ),
                                    }))
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                              </div>
                            </div>
                          )}

                          {rule.type === "last_minute" && (
                            <div>
                              <label className="block text-xs text-zinc-500 mb-1">Days Before Check-in</label>
                              <input
                                type="number"
                                value={Number(rule.conditions.daysBeforeCheckIn) || 3}
                                onChange={(e) =>
                                  setProperty((prev) => ({
                                    ...prev,
                                    rules: prev.rules.map((r) =>
                                      r.id === rule.id
                                        ? { ...r, conditions: { ...r.conditions, daysBeforeCheckIn: Number(e.target.value) } }
                                        : r
                                    ),
                                  }))
                                }
                                className="w-32 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Pricing Suggestions */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI Pricing Suggestions</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Based on market analysis and demand patterns, our AI suggests these optimizations:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">+12%</span>
                      <span className="text-sm">Increase weekend rates for March (high demand period)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                      <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">-8%</span>
                      <span className="text-sm">Add Tuesday discount to boost mid-week occupancy</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded">New</span>
                      <span className="text-sm">Add 14-night discount to attract long-term guests</span>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-violet-600 dark:text-violet-400 hover:underline">
                    Apply all suggestions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 sticky top-24">
              <h2 className="font-semibold mb-4">Price Preview</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={previewDates.start}
                    onChange={(e) => setPreviewDates((prev) => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={previewDates.end}
                    onChange={(e) => setPreviewDates((prev) => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{preview.nights} nights</span>
                  <span>${preview.baseTotal.toFixed(2)}</span>
                </div>

                {preview.discounts.map((discount) => (
                  <div key={discount.name} className="flex justify-between text-sm">
                    <span className="text-zinc-500">{discount.name}</span>
                    <span className={discount.amount < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                      {discount.amount < 0 ? "-" : "+"}${Math.abs(discount.amount).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Cleaning fee</span>
                  <span>${preview.cleaningFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">${(preview.finalTotal + preview.cleaningFee).toFixed(2)}</span>
                </div>

                <div className="text-xs text-zinc-500 text-center">
                  ${((preview.finalTotal + preview.cleaningFee) / preview.nights).toFixed(2)} per night avg
                </div>
              </div>

              {/* Comparison */}
              <div className="mt-6 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-xs text-zinc-500 mb-2">Market Comparison</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your price</span>
                    <span className="font-medium">${((preview.finalTotal + preview.cleaningFee) / preview.nights).toFixed(0)}/night</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Area average</span>
                    <span>$165/night</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, ((preview.finalTotal + preview.cleaningFee) / preview.nights / 165) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500">
                    {((preview.finalTotal + preview.cleaningFee) / preview.nights) > 165 ? "Above" : "Below"} average by{" "}
                    {Math.abs(Math.round((((preview.finalTotal + preview.cleaningFee) / preview.nights) / 165 - 1) * 100))}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
