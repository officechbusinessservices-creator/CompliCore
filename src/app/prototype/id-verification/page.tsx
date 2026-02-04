"use client";

import { useState } from "react";
import Link from "next/link";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  icon: string;
}

interface VerificationRequest {
  id: string;
  guestName: string;
  guestAvatar: string;
  bookingId: string;
  propertyName: string;
  checkIn: string;
  status: "pending" | "verified" | "failed" | "manual-review";
  documentType: string;
  submittedAt: string;
  verifiedAt?: string;
  matchScore?: number;
  flags?: string[];
}

const verificationSteps: VerificationStep[] = [
  { id: "s1", title: "Document Upload", description: "Guest uploads government-issued ID", status: "completed", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "s2", title: "Document Analysis", description: "AI extracts and validates document data", status: "completed", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "s3", title: "Selfie Capture", description: "Guest takes a live selfie for matching", status: "in-progress", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
  { id: "s4", title: "Face Matching", description: "AI compares selfie with document photo", status: "pending", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "s5", title: "Background Check", description: "Optional criminal and fraud screening", status: "pending", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

const verificationRequests: VerificationRequest[] = [
  {
    id: "v1",
    guestName: "Alex Johnson",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    bookingId: "HX4K9M2",
    propertyName: "Modern Downtown Loft",
    checkIn: "2026-03-15",
    status: "verified",
    documentType: "Passport",
    submittedAt: "2026-02-01T10:30:00",
    verifiedAt: "2026-02-01T10:32:00",
    matchScore: 98,
  },
  {
    id: "v2",
    guestName: "Maria Garcia",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    bookingId: "JK7L3P9",
    propertyName: "Luxury Mountain Cabin",
    checkIn: "2026-04-10",
    status: "pending",
    documentType: "Driver's License",
    submittedAt: "2026-02-03T14:20:00",
  },
  {
    id: "v3",
    guestName: "James Wilson",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    bookingId: "MN5R2T8",
    propertyName: "Cozy Beachfront Cottage",
    checkIn: "2026-02-20",
    status: "manual-review",
    documentType: "National ID",
    submittedAt: "2026-02-02T09:15:00",
    matchScore: 72,
    flags: ["Low match score", "Document expiring soon"],
  },
  {
    id: "v4",
    guestName: "Emily Chen",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    bookingId: "PQ9S4V1",
    propertyName: "Modern Downtown Loft",
    checkIn: "2026-03-01",
    status: "failed",
    documentType: "Passport",
    submittedAt: "2026-02-01T16:45:00",
    flags: ["Document appears altered", "Multiple submission attempts"],
  },
];

const statusColors = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  verified: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "manual-review": "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

export default function IdVerificationPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "settings" | "demo">("requests");
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [uploadedDoc, setUploadedDoc] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(false);

  const verifiedCount = verificationRequests.filter((r) => r.status === "verified").length;
  const pendingCount = verificationRequests.filter((r) => r.status === "pending" || r.status === "manual-review").length;

  const runDemoStep = () => {
    if (demoStep < verificationSteps.length) {
      setDemoStep(demoStep + 1);
    }
  };

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
                Identity Verification
                <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                  Secure
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Document scanning & facial recognition</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Verified</p>
            <p className="text-2xl font-bold text-emerald-600">{verifiedCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg. Verification Time</p>
            <p className="text-2xl font-bold">2m 15s</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Success Rate</p>
            <p className="text-2xl font-bold">94%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["requests", "settings", "demo"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "demo" ? "Live Demo" : tab}
            </button>
          ))}
        </div>

        {activeTab === "requests" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {verificationRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border p-4 cursor-pointer transition-all ${
                    selectedRequest?.id === request.id
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={request.guestAvatar} alt={request.guestName} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-medium">{request.guestName}</p>
                        <p className="text-sm text-zinc-500">{request.propertyName}</p>
                        <p className="text-xs text-zinc-400">
                          Check-in: {new Date(request.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${statusColors[request.status]}`}>
                        {request.status.replace("-", " ")}
                      </span>
                      {request.matchScore && (
                        <p className="text-sm mt-1">
                          <span className={request.matchScore >= 90 ? "text-emerald-600" : request.matchScore >= 70 ? "text-amber-600" : "text-rose-600"}>
                            {request.matchScore}% match
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {request.flags && request.flags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.flags.map((flag) => (
                        <span key={flag} className="text-xs px-2 py-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-full">
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 h-fit sticky top-24">
              {selectedRequest ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={selectedRequest.guestAvatar} alt="" className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="font-semibold">{selectedRequest.guestName}</h3>
                      <p className="text-sm text-zinc-500">Booking #{selectedRequest.bookingId}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Document Type</p>
                      <p className="font-medium">{selectedRequest.documentType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Submitted</p>
                      <p className="font-medium">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                    </div>
                    {selectedRequest.matchScore && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Face Match Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                selectedRequest.matchScore >= 90 ? "bg-emerald-500" :
                                selectedRequest.matchScore >= 70 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${selectedRequest.matchScore}%` }}
                            />
                          </div>
                          <span className="font-medium">{selectedRequest.matchScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedRequest.status === "manual-review" && (
                    <div className="mt-6 flex gap-2">
                      <button className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium">
                        Approve
                      </button>
                      <button className="flex-1 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium">
                        Reject
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p>Select a verification request to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Verification Requirements</h3>
              <div className="space-y-4">
                {[
                  { label: "Require ID verification for all bookings", enabled: true },
                  { label: "Require selfie match", enabled: true },
                  { label: "Run background check", enabled: false },
                  { label: "Verify guests from all countries", enabled: true },
                  { label: "Allow expired documents (within 6 months)", enabled: false },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm">{setting.label}</span>
                    <div className={`w-10 h-6 rounded-full relative cursor-pointer ${setting.enabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}`}>
                      <span className={`absolute top-0.5 ${setting.enabled ? "right-0.5" : "left-0.5"} w-5 h-5 bg-white rounded-full shadow transition-all`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Accepted Documents</h3>
              <div className="grid grid-cols-2 gap-3">
                {["Passport", "Driver's License", "National ID Card", "Residence Permit"].map((doc) => (
                  <label key={doc} className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500" />
                    <span className="text-sm">{doc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Match Threshold</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Minimum face match score</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <input type="range" min="50" max="100" defaultValue="85" className="w-full" />
                </div>
                <p className="text-xs text-zinc-500">
                  Verifications below this threshold will be flagged for manual review.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "demo" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <h3 className="font-semibold mb-6 text-center">Guest Verification Flow Demo</h3>

              {/* Steps */}
              <div className="space-y-4 mb-8">
                {verificationSteps.map((step, idx) => {
                  const isCompleted = idx < demoStep;
                  const isCurrent = idx === demoStep;

                  return (
                    <div key={step.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isCompleted ? "bg-emerald-50 dark:bg-emerald-950/20" :
                      isCurrent ? "bg-violet-50 dark:bg-violet-950/20 ring-2 ring-violet-500/30" :
                      "bg-zinc-50 dark:bg-zinc-800/50"
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted ? "bg-emerald-500 text-white" :
                        isCurrent ? "bg-violet-500 text-white" :
                        "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                      }`}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-zinc-500">{step.description}</p>
                      </div>
                      {isCurrent && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Demo Controls */}
              {demoStep < verificationSteps.length ? (
                <button
                  onClick={runDemoStep}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                >
                  {demoStep === 0 ? "Start Verification Demo" : "Continue to Next Step"}
                </button>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-lg text-emerald-600 mb-2">Verification Complete!</h4>
                  <p className="text-zinc-500 mb-4">Identity verified with 98% confidence</p>
                  <button
                    onClick={() => setDemoStep(0)}
                    className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Run Demo Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
