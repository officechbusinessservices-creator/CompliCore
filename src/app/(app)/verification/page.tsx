"use client";

import { useState } from "react";
import Link from "next/link";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  icon: string;
}

interface GuestVerification {
  id: string;
  guestName: string;
  guestEmail: string;
  guestAvatar: string;
  bookingId: string;
  propertyName: string;
  checkIn: string;
  steps: VerificationStep[];
  overallStatus: "pending" | "approved" | "requires_review" | "rejected";
  riskScore: number;
  submittedAt: Date;
}

const mockVerifications: GuestVerification[] = [
  {
    id: "v1",
    guestName: "Maria Garcia",
    guestEmail: "maria.garcia@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    bookingId: "HX4K9M2",
    propertyName: "Modern Downtown Loft",
    checkIn: "2026-03-15",
    overallStatus: "approved",
    riskScore: 15,
    submittedAt: new Date("2026-02-28"),
    steps: [
      { id: "email", title: "Email Verified", description: "Email address confirmed", status: "completed", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      { id: "phone", title: "Phone Verified", description: "Phone number confirmed via SMS", status: "completed", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
      { id: "id", title: "ID Verified", description: "Government ID validated", status: "completed", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
      { id: "background", title: "Background Check", description: "Criminal/fraud screening passed", status: "completed", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ],
  },
  {
    id: "v2",
    guestName: "Alex Johnson",
    guestEmail: "alex.j@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    bookingId: "JK7L3P9",
    propertyName: "Cozy Beach Cottage",
    checkIn: "2026-04-10",
    overallStatus: "requires_review",
    riskScore: 45,
    submittedAt: new Date("2026-03-01"),
    steps: [
      { id: "email", title: "Email Verified", description: "Email address confirmed", status: "completed", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      { id: "phone", title: "Phone Verified", description: "Phone number confirmed via SMS", status: "completed", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
      { id: "id", title: "ID Verification", description: "ID quality issue - needs review", status: "in_progress", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
      { id: "background", title: "Background Check", description: "Pending ID verification", status: "pending", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ],
  },
  {
    id: "v3",
    guestName: "James Wilson",
    guestEmail: "j.wilson@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    bookingId: "MN5R2T8",
    propertyName: "Mountain View Cabin",
    checkIn: "2026-03-20",
    overallStatus: "pending",
    riskScore: 0,
    submittedAt: new Date("2026-03-02"),
    steps: [
      { id: "email", title: "Email Verified", description: "Email address confirmed", status: "completed", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      { id: "phone", title: "Phone Verification", description: "Awaiting SMS confirmation", status: "in_progress", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
      { id: "id", title: "ID Verification", description: "Not started", status: "pending", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
      { id: "background", title: "Background Check", description: "Not started", status: "pending", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ],
  },
];

export default function VerificationPage() {
  const [verifications, setVerifications] = useState<GuestVerification[]>(mockVerifications);
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "requires_review" | "approved">("all");

  const stats = {
    total: verifications.length,
    approved: verifications.filter((v) => v.overallStatus === "approved").length,
    pending: verifications.filter((v) => v.overallStatus === "pending").length,
    needsReview: verifications.filter((v) => v.overallStatus === "requires_review").length,
  };

  const filteredVerifications = verifications.filter((v) => {
    if (filter === "all") return true;
    return v.overallStatus === filter;
  });

  const currentVerification = verifications.find((v) => v.id === selectedVerification);

  const approveVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, overallStatus: "approved" as const } : v
      )
    );
  };

  const rejectVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, overallStatus: "rejected" as const } : v
      )
    );
  };

  const statusColors = {
    pending: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    requires_review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const stepStatusColors = {
    pending: "bg-zinc-200 dark:bg-zinc-700",
    in_progress: "bg-amber-500",
    completed: "bg-emerald-500",
    failed: "bg-rose-500",
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Guest Verification</h1>
              <p className="text-xs text-zinc-500">Identity verification and screening</p>
            </div>
          </div>
          {stats.needsReview > 0 && (
            <span className="px-3 py-1 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
              {stats.needsReview} needs review
            </span>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Total Verifications</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Approved</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approved}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Needs Review</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.needsReview}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "requires_review", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {f === "requires_review" ? "Needs Review" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Verification List */}
          <div className="space-y-4">
            {filteredVerifications.map((verification) => (
              <button
                key={verification.id}
                onClick={() => setSelectedVerification(verification.id)}
                className={`w-full p-4 text-left bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                  selectedVerification === verification.id
                    ? "border-emerald-500 ring-1 ring-emerald-500/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={verification.guestAvatar}
                    alt={verification.guestName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{verification.guestName}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColors[verification.overallStatus]}`}>
                        {verification.overallStatus === "requires_review" ? "Review" : verification.overallStatus}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">{verification.propertyName}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Check-in: {new Date(verification.checkIn).toLocaleDateString()} - Booking #{verification.bookingId}
                    </p>

                    {/* Progress */}
                    <div className="flex gap-1 mt-3">
                      {verification.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`h-1.5 flex-1 rounded-full ${stepStatusColors[step.status]}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Verification Details */}
          {currentVerification ? (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit sticky top-24">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={currentVerification.guestAvatar}
                  alt={currentVerification.guestName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{currentVerification.guestName}</h3>
                  <p className="text-sm text-zinc-500">{currentVerification.guestEmail}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full border ${statusColors[currentVerification.overallStatus]}`}>
                    {currentVerification.overallStatus === "requires_review" ? "Requires Review" : currentVerification.overallStatus}
                  </span>
                </div>
              </div>

              {/* Risk Score */}
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className={`text-lg font-bold ${
                    currentVerification.riskScore <= 25 ? "text-emerald-600 dark:text-emerald-400" :
                    currentVerification.riskScore <= 50 ? "text-amber-600 dark:text-amber-400" :
                    "text-rose-600 dark:text-rose-400"
                  }`}>
                    {currentVerification.riskScore}/100
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      currentVerification.riskScore <= 25 ? "bg-emerald-500" :
                      currentVerification.riskScore <= 50 ? "bg-amber-500" :
                      "bg-rose-500"
                    }`}
                    style={{ width: `${currentVerification.riskScore}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {currentVerification.riskScore <= 25 ? "Low risk - Automatic approval recommended" :
                   currentVerification.riskScore <= 50 ? "Medium risk - Manual review recommended" :
                   "High risk - Additional verification required"}
                </p>
              </div>

              {/* Verification Steps */}
              <div className="space-y-4">
                <h4 className="font-medium">Verification Steps</h4>
                {currentVerification.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === "completed" ? "bg-emerald-500" :
                      step.status === "in_progress" ? "bg-amber-500" :
                      step.status === "failed" ? "bg-rose-500" :
                      "bg-zinc-200 dark:bg-zinc-700"
                    }`}>
                      {step.status === "completed" ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.status === "in_progress" ? (
                        <svg className="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <span className="text-xs font-medium text-zinc-500">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-zinc-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ID Preview (Mock) */}
              {currentVerification.steps.find((s) => s.id === "id")?.status !== "pending" && (
                <div className="mt-6 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <h4 className="font-medium mb-3">ID Document</h4>
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                    <div className="text-center text-zinc-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <p className="text-sm">ID Document Preview</p>
                      <p className="text-xs mt-1">Verified by AI - Details hidden for privacy</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {currentVerification.overallStatus === "requires_review" && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => approveVerification(currentVerification.id)}
                    className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectVerification(currentVerification.id)}
                    className="flex-1 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}

              <p className="text-xs text-zinc-500 mt-4 text-center">
                Submitted {currentVerification.submittedAt.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="font-medium">Select a verification</p>
              <p className="text-sm">Click on a guest to view verification details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
