"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
  pointsMultiplier: number;
}

interface PointsActivity {
  id: string;
  type: "earned" | "redeemed" | "expired" | "bonus";
  description: string;
  points: number;
  date: string;
  bookingId?: string;
}

const tiers: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    color: "from-amber-600 to-amber-800",
    benefits: ["Earn 1 point per $1 spent", "Member-only deals", "Birthday bonus points"],
    pointsMultiplier: 1,
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 1000,
    color: "from-zinc-400 to-zinc-600",
    benefits: ["Earn 1.25x points", "Early check-in (when available)", "Priority customer support", "Exclusive silver deals"],
    pointsMultiplier: 1.25,
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 5000,
    color: "from-yellow-500 to-amber-600",
    benefits: ["Earn 1.5x points", "Free early check-in", "Free late checkout", "Room upgrades", "Dedicated support line"],
    pointsMultiplier: 1.5,
  },
  {
    id: "platinum",
    name: "Platinum",
    minPoints: 15000,
    color: "from-zinc-300 to-zinc-500",
    benefits: ["Earn 2x points", "Guaranteed room upgrades", "Free cancellation", "Exclusive platinum properties", "24/7 concierge", "Airport transfers"],
    pointsMultiplier: 2,
  },
];

const activities: PointsActivity[] = [
  { id: "a1", type: "earned", description: "Booking at Modern Downtown Loft", points: 425, date: "2026-01-28", bookingId: "HX4K9M2" },
  { id: "a2", type: "bonus", description: "Welcome bonus", points: 500, date: "2026-01-15" },
  { id: "a3", type: "earned", description: "Booking at Luxury Mountain Cabin", points: 890, date: "2025-12-20", bookingId: "JK7L3P9" },
  { id: "a4", type: "redeemed", description: "Redeemed for $25 credit", points: -500, date: "2025-12-15" },
  { id: "a5", type: "earned", description: "Review bonus", points: 50, date: "2025-12-10" },
  { id: "a6", type: "earned", description: "Booking at Cozy Beachfront Cottage", points: 665, date: "2025-11-05", bookingId: "MN5R2T8" },
  { id: "a7", type: "bonus", description: "Birthday bonus", points: 200, date: "2025-10-15" },
];

const rewards = [
  { id: "r1", name: "$10 Booking Credit", points: 200, category: "credits" },
  { id: "r2", name: "$25 Booking Credit", points: 500, category: "credits" },
  { id: "r3", name: "$50 Booking Credit", points: 900, category: "credits" },
  { id: "r4", name: "$100 Booking Credit", points: 1700, category: "credits" },
  { id: "r5", name: "Free Cleaning Fee", points: 300, category: "perks" },
  { id: "r6", name: "Late Checkout (4pm)", points: 250, category: "perks" },
  { id: "r7", name: "Early Check-in (11am)", points: 250, category: "perks" },
  { id: "r8", name: "Room Upgrade", points: 600, category: "perks" },
  { id: "r9", name: "Airport Pickup", points: 800, category: "experiences" },
  { id: "r10", name: "Welcome Gift Basket", points: 400, category: "experiences" },
  { id: "r11", name: "Local Experience Tour", points: 1500, category: "experiences" },
];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "earn" | "redeem" | "history">("overview");
  const [rewardCategory, setRewardCategory] = useState("all");
  const [activitiesData, setActivitiesData] = useState<PointsActivity[]>(activities);
  const [rewardsData, setRewardsData] = useState(rewards);

  useEffect(() => {
    fetchModuleData<PointsActivity[]>("/loyalty/activity", activities).then(setActivitiesData);
    fetchModuleData<typeof rewards>("/loyalty/rewards", rewards).then(setRewardsData);
  }, []);

  // User's current points and tier
  const currentPoints = 2230;
  const lifetimePoints = 3230;
  const currentTier = tiers.find((t, i) => {
    const nextTier = tiers[i + 1];
    return currentPoints >= t.minPoints && (!nextTier || currentPoints < nextTier.minPoints);
  }) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const pointsToNextTier = nextTier ? nextTier.minPoints - currentPoints : 0;
  const tierProgress = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const filteredRewards = rewardCategory === "all"
    ? rewardsData
    : rewardsData.filter((r) => r.category === rewardCategory);

  const activityColors = {
    earned: "text-emerald-600 dark:text-emerald-400",
    redeemed: "text-rose-600 dark:text-rose-400",
    expired: "text-zinc-400",
    bonus: "text-violet-600 dark:text-violet-400",
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Rewards Program</h1>
              <p className="text-xs text-zinc-500">Earn points, unlock rewards</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Points Card */}
        <div className={`bg-gradient-to-br ${currentTier.color} rounded-2xl p-6 sm:p-8 text-white mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">{currentTier.name} Member</p>
              <p className="text-4xl font-bold">{currentPoints.toLocaleString()}</p>
              <p className="text-white/80 text-sm">Available Points</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {nextTier && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{currentTier.name}</span>
                <span>{pointsToNextTier.toLocaleString()} points to {nextTier.name}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${tierProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["overview", "earn", "redeem", "history"] as const).map((tab) => (
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
          <>
            {/* Tier Benefits */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-4">Your {currentTier.name} Benefits</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {currentTier.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All Tiers */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Membership Tiers</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-xl border ${
                      currentTier.id === tier.id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tier.color} mb-3`} />
                    <h3 className="font-semibold">{tier.name}</h3>
                    <p className="text-sm text-zinc-500 mb-2">
                      {tier.minPoints === 0 ? "Starting tier" : `${tier.minPoints.toLocaleString()}+ points`}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {tier.pointsMultiplier}x points multiplier
                    </p>
                    {currentTier.id === tier.id && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "earn" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="font-semibold text-lg mb-4">Ways to Earn Points</h2>
              <div className="space-y-4">
                {[
                  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Book a Stay", desc: "Earn 1 point for every $1 spent on bookings", points: "1 pt / $1" },
                  { icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", title: "Write a Review", desc: "Share your experience after each stay", points: "+50 pts" },
                  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Refer a Friend", desc: "Get bonus points when friends join and book", points: "+500 pts" },
                  { icon: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z", title: "Birthday Bonus", desc: "Receive bonus points on your birthday", points: "+200 pts" },
                  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Complete Profile", desc: "Add your preferences and verification", points: "+100 pts" },
                ].map((way) => (
                  <div key={way.title} className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={way.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{way.title}</p>
                      <p className="text-sm text-zinc-500">{way.desc}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{way.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "redeem" && (
          <div>
            {/* Category Filter */}
            <div className="flex gap-2 mb-6">
              {["all", "credits", "perks", "experiences"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setRewardCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                    rewardCategory === cat
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => (
                <div key={reward.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{reward.name}</h3>
                      <p className="text-sm text-zinc-500 capitalize">{reward.category}</p>
                    </div>
                    <span className={`text-lg font-bold ${currentPoints >= reward.points ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                      {reward.points}
                    </span>
                  </div>
                  <button
                    disabled={currentPoints < reward.points}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPoints >= reward.points
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                    }`}
                  >
                    {currentPoints >= reward.points ? "Redeem" : `Need ${reward.points - currentPoints} more`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-semibold">Points History</h3>
              <p className="text-sm text-zinc-500">Lifetime: {lifetimePoints.toLocaleString()} pts</p>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {activitiesData.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-zinc-500">{new Date(activity.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <span className={`font-semibold ${activityColors[activity.type]}`}>
                    {activity.points > 0 ? "+" : ""}{activity.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
