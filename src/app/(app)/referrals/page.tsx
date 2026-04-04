"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";

interface Referral {
  id: string;
  name: string;
  avatar: string;
  status: "pending" | "signed_up" | "booked" | "completed";
  date: string;
  reward: number;
  rewardStatus: "pending" | "earned" | "paid";
}

const referrals: Referral[] = [
  { id: "ref-1", name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", status: "completed", date: "2026-01-15", reward: 50, rewardStatus: "paid" },
  { id: "ref-2", name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", status: "booked", date: "2026-02-01", reward: 50, rewardStatus: "pending" },
  { id: "ref-3", name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", status: "signed_up", date: "2026-02-05", reward: 0, rewardStatus: "pending" },
  { id: "ref-4", name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", status: "pending", date: "2026-02-10", reward: 0, rewardStatus: "pending" },
];

const statusSteps = ["pending", "signed_up", "booked", "completed"];
const statusLabels = {
  pending: "Invite Sent",
  signed_up: "Signed Up",
  booked: "First Booking",
  completed: "Trip Completed",
};

export default function ReferralsPage() {
  const [referralCode] = useState("ALEX50");
  const [copied, setCopied] = useState(false);

  const totalEarned = referrals.filter((r) => r.rewardStatus === "paid").reduce((sum, r) => sum + r.reward, 0);
  const pendingRewards = referrals.filter((r) => r.rewardStatus === "pending" && r.reward > 0).reduce((sum, r) => sum + r.reward, 0);
  const successfulReferrals = referrals.filter((r) => r.status === "completed").length;

  const copyCode = () => {
    navigator.clipboard.writeText(`https://rentalplatform.com/ref/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIndex = (status: string) => statusSteps.indexOf(status);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/browse" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Referral Program</h1>
              <p className="text-xs text-zinc-500">Invite friends, earn rewards</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Give $25, Get $50</h2>
          <p className="text-violet-200 max-w-md mx-auto">
            Share your referral link with friends. When they complete their first trip, you both get rewarded!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalEarned)}</p>
            <p className="text-sm text-zinc-500">Total Earned</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(pendingRewards)}</p>
            <p className="text-sm text-zinc-500">Pending</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-2xl font-bold">{successfulReferrals}</p>
            <p className="text-sm text-zinc-500">Successful</p>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          <h3 className="font-semibold mb-4">Share Your Referral Link</h3>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono text-sm truncate">
              https://rentalplatform.com/ref/{referralCode}
            </div>
            <button
              onClick={copyCode}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex justify-center gap-3">
            <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </button>
            <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            <button className="p-3 bg-zinc-800 dark:bg-zinc-700 text-white rounded-full hover:opacity-90 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          <h3 className="font-semibold mb-6">How It Works</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Share Link", desc: "Send your unique link to friends" },
              { step: 2, title: "Friend Signs Up", desc: "They create an account" },
              { step: 3, title: "First Booking", desc: "They book their first trip" },
              { step: 4, title: "Get Rewarded", desc: "You both receive credits!" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-violet-600 dark:text-violet-400">{item.step}</span>
                </div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold">Your Referrals</h3>
          </div>

          {referrals.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-zinc-500">No referrals yet. Share your link to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {referrals.map((referral) => (
                <div key={referral.id} className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={referral.avatar} alt="" className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-sm text-zinc-500">Invited {new Date(referral.date).toLocaleDateString()}</p>
                    </div>
                    {referral.reward > 0 && (
                      <div className="text-right">
                        <p className={`font-semibold ${referral.rewardStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                          +{formatCurrency(referral.reward)}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">{referral.rewardStatus}</p>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    {statusSteps.map((step, idx) => (
                      <div key={step} className="flex-1 flex items-center">
                        <div className={`w-full h-1.5 rounded-full ${
                          idx <= getStatusIndex(referral.status)
                            ? "bg-emerald-500"
                            : "bg-zinc-200 dark:bg-zinc-700"
                        }`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {statusSteps.map((step) => (
                      <span key={step} className={`text-[10px] ${
                        getStatusIndex(step) <= getStatusIndex(referral.status)
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400"
                      }`}>
                        {statusLabels[step as keyof typeof statusLabels]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-zinc-500 text-center mt-6">
          Referral credits expire after 12 months. See{" "}
          <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">terms and conditions</a>{" "}
          for full details.
        </p>
      </div>
    </div>
  );
}
