"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface Claim {
  id: string;
  date: string;
  property: string;
  type: string;
  amount: number;
  status: "pending" | "approved" | "denied" | "paid";
  description: string;
}

const claims: Claim[] = [
  { id: "claim-1", date: "2026-01-15", property: "Modern Downtown Loft", type: "Property Damage", amount: 450, status: "paid", description: "Broken window in living room" },
  { id: "claim-2", date: "2025-12-20", property: "Cozy Beachfront Cottage", type: "Theft", amount: 1200, status: "approved", description: "Guest stole electronics" },
  { id: "claim-3", date: "2026-02-01", property: "Luxury Mountain Cabin", type: "Cleaning", amount: 350, status: "pending", description: "Extra cleaning required due to pet damage" },
];

const coverageTypes = [
  { id: "damage", name: "Property Damage", coverage: 1000000, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { id: "liability", name: "Liability Protection", coverage: 1000000, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "income", name: "Income Protection", coverage: 50000, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "cancellation", name: "Cancellation Protection", coverage: 10000, icon: "M6 18L18 6M6 6l12 12" },
];

const statusColors = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  denied: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState<"coverage" | "claims" | "documents">("coverage");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimsData, setClaimsData] = useState(claims);

  useEffect(() => {
    fetchModuleData<Claim[]>("/insurance/policies", claims).then(setClaimsData);
  }, []);

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
              <h1 className="font-semibold text-lg">Host Protection Center</h1>
              <p className="text-xs text-zinc-500">Insurance and damage protection</p>
            </div>
          </div>
          <button
            onClick={() => setShowClaimModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            File a Claim
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Protection Status */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-emerald-200">Protection Active</span>
              </div>
              <h2 className="text-2xl font-bold">Host Protection Insurance</h2>
              <p className="text-emerald-100 mt-1">All your properties are covered</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">$1M+</p>
              <p className="text-sm text-emerald-200">Total Coverage</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(["coverage", "claims", "documents"] as const).map((tab) => (
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

        {activeTab === "coverage" && (
          <>
            {/* Coverage Types */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {coverageTypes.map((type) => (
                <div key={type.id} className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={type.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{type.name}</h3>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {formatCurrency(type.coverage)}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">per incident</p>
                    </div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* What's Covered */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4">What's Covered</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Property damage by guests",
                  "Theft of belongings",
                  "Bodily injury liability",
                  "Legal defense costs",
                  "Loss of rental income",
                  "Pet damage",
                  "Vandalism",
                  "Accidental damage",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Not Covered */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Exclusions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Normal wear and tear",
                  "Pre-existing damage",
                  "Intentional damage by host",
                  "Acts of war or terrorism",
                  "Nuclear incidents",
                  "Cyber attacks",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "claims" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold">Claims History</h3>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {claimsData.map((claim) => (
                <div key={claim.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{claim.type}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[claim.status]}`}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{claim.property}</p>
                      <p className="text-sm text-zinc-500">{claim.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(claim.amount)}</p>
                      <p className="text-xs text-zinc-500">{new Date(claim.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            {[
              { name: "Host Protection Policy", type: "PDF", size: "2.4 MB", date: "Jan 1, 2026" },
              { name: "Coverage Certificate", type: "PDF", size: "156 KB", date: "Jan 1, 2026" },
              { name: "Claims Procedure Guide", type: "PDF", size: "890 KB", date: "Jan 1, 2026" },
              { name: "Damage Documentation Template", type: "DOCX", size: "45 KB", date: "Jan 1, 2026" },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-zinc-500">{doc.type} · {doc.size} · {doc.date}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Emergency Contact */}
        <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-rose-600 dark:text-rose-400">24/7 Emergency Support</h3>
              <p className="text-sm text-rose-600/80 dark:text-rose-400/80 mt-1">
                For urgent incidents, call our emergency line anytime.
              </p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-2">1-800-HOST-HELP</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">File a Claim</h3>
              <button onClick={() => setShowClaimModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Property</label>
                <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>Modern Downtown Loft</option>
                  <option>Cozy Beachfront Cottage</option>
                  <option>Luxury Mountain Cabin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Claim Type</label>
                <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>Property Damage</option>
                  <option>Theft</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Incident Date</label>
                <input type="date" className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Estimated Amount</label>
                <input type="number" placeholder="$0.00" className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Description</label>
                <textarea rows={4} placeholder="Describe what happened..." className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Upload Evidence</label>
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-4 text-center">
                  <p className="text-sm text-zinc-500">Drag photos or documents here</p>
                  <button className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Browse files</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowClaimModal(false)} className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
