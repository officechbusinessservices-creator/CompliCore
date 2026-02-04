"use client";

import { useState } from "react";
import Link from "next/link";

interface SmartLock {
  id: string;
  name: string;
  propertyName: string;
  propertyId: string;
  status: "online" | "offline" | "low_battery";
  battery: number;
  lastActivity: Date;
  model: string;
  manufacturer: "yale" | "august" | "schlage" | "kwikset";
}

interface AccessCode {
  id: string;
  lockId: string;
  code: string;
  name: string;
  type: "guest" | "cleaner" | "maintenance" | "permanent";
  guestName?: string;
  bookingId?: string;
  validFrom: Date;
  validTo: Date;
  usageCount: number;
  maxUsage?: number;
  status: "active" | "expired" | "disabled";
}

interface ActivityLog {
  id: string;
  lockId: string;
  action: "unlock" | "lock" | "code_used" | "code_created" | "low_battery";
  user?: string;
  code?: string;
  timestamp: Date;
}

const mockLocks: SmartLock[] = [
  {
    id: "lock1",
    name: "Front Door",
    propertyName: "Modern Downtown Loft",
    propertyId: "1",
    status: "online",
    battery: 85,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
    model: "Assure Lock 2",
    manufacturer: "yale",
  },
  {
    id: "lock2",
    name: "Main Entrance",
    propertyName: "Cozy Beach Cottage",
    propertyId: "2",
    status: "online",
    battery: 62,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    model: "Wi-Fi Smart Lock",
    manufacturer: "august",
  },
  {
    id: "lock3",
    name: "Front Door",
    propertyName: "Mountain View Cabin",
    propertyId: "3",
    status: "low_battery",
    battery: 15,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
    model: "Encode Plus",
    manufacturer: "schlage",
  },
];

const mockCodes: AccessCode[] = [
  {
    id: "code1",
    lockId: "lock1",
    code: "4532",
    name: "Maria Garcia - Booking",
    type: "guest",
    guestName: "Maria Garcia",
    bookingId: "HX4K9M2",
    validFrom: new Date("2026-03-15T15:00:00"),
    validTo: new Date("2026-03-18T11:00:00"),
    usageCount: 0,
    status: "active",
  },
  {
    id: "code2",
    lockId: "lock1",
    code: "7891",
    name: "Cleaning Service",
    type: "cleaner",
    validFrom: new Date("2026-01-01"),
    validTo: new Date("2026-12-31"),
    usageCount: 24,
    status: "active",
  },
  {
    id: "code3",
    lockId: "lock2",
    code: "2468",
    name: "Alex Johnson - Booking",
    type: "guest",
    guestName: "Alex Johnson",
    bookingId: "JK7L3P9",
    validFrom: new Date("2026-04-10T15:00:00"),
    validTo: new Date("2026-04-14T11:00:00"),
    usageCount: 0,
    status: "active",
  },
  {
    id: "code4",
    lockId: "lock1",
    code: "1234",
    name: "Master Code",
    type: "permanent",
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2030-12-31"),
    usageCount: 156,
    status: "active",
  },
];

const mockActivity: ActivityLog[] = [
  { id: "a1", lockId: "lock1", action: "unlock", user: "Maria Garcia", code: "4532", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "a2", lockId: "lock1", action: "lock", timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: "a3", lockId: "lock2", action: "code_created", user: "System", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "a4", lockId: "lock1", action: "unlock", user: "Cleaning Service", code: "7891", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "a5", lockId: "lock3", action: "low_battery", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
];

export default function SmartLocksPage() {
  const [locks] = useState<SmartLock[]>(mockLocks);
  const [codes, setCodes] = useState<AccessCode[]>(mockCodes);
  const [selectedLock, setSelectedLock] = useState<string | null>("lock1");
  const [showNewCode, setShowNewCode] = useState(false);
  const [newCode, setNewCode] = useState({
    name: "",
    code: "",
    type: "guest" as AccessCode["type"],
    validFrom: "",
    validTo: "",
  });

  const currentLock = locks.find((l) => l.id === selectedLock);
  const lockCodes = codes.filter((c) => c.lockId === selectedLock);
  const lockActivity = mockActivity.filter((a) => a.lockId === selectedLock);

  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createCode = () => {
    if (!selectedLock || !newCode.name) return;

    const code: AccessCode = {
      id: `code-${Date.now()}`,
      lockId: selectedLock,
      code: newCode.code || generateCode(),
      name: newCode.name,
      type: newCode.type,
      validFrom: new Date(newCode.validFrom || Date.now()),
      validTo: new Date(newCode.validTo || Date.now() + 1000 * 60 * 60 * 24 * 7),
      usageCount: 0,
      status: "active",
    };

    setCodes((prev) => [...prev, code]);
    setShowNewCode(false);
    setNewCode({ name: "", code: "", type: "guest", validFrom: "", validTo: "" });
  };

  const disableCode = (codeId: string) => {
    setCodes((prev) =>
      prev.map((c) => (c.id === codeId ? { ...c, status: "disabled" as const } : c))
    );
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getManufacturerLogo = (manufacturer: SmartLock["manufacturer"]) => {
    const logos: Record<string, string> = {
      yale: "Yale",
      august: "August",
      schlage: "Schlage",
      kwikset: "Kwikset",
    };
    return logos[manufacturer] || manufacturer;
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Smart Locks</h1>
              <p className="text-xs text-zinc-500">Access code management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
              {locks.filter((l) => l.status === "online").length}/{locks.length} online
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Locks List */}
          <div className="space-y-4">
            <h2 className="font-semibold">Your Locks</h2>
            {locks.map((lock) => (
              <button
                key={lock.id}
                onClick={() => setSelectedLock(lock.id)}
                className={`w-full p-4 text-left bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                  selectedLock === lock.id
                    ? "border-emerald-500 ring-1 ring-emerald-500/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lock.status === "online" ? "bg-emerald-500/10" :
                    lock.status === "low_battery" ? "bg-amber-500/10" : "bg-zinc-500/10"
                  }`}>
                    <svg className={`w-6 h-6 ${
                      lock.status === "online" ? "text-emerald-500" :
                      lock.status === "low_battery" ? "text-amber-500" : "text-zinc-500"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{lock.name}</h3>
                      <span className={`w-2 h-2 rounded-full ${
                        lock.status === "online" ? "bg-emerald-500" :
                        lock.status === "low_battery" ? "bg-amber-500" : "bg-zinc-400"
                      }`} />
                    </div>
                    <p className="text-sm text-zinc-500 truncate">{lock.propertyName}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {formatRelativeTime(lock.lastActivity)}
                      </span>
                      <span className={`flex items-center gap-1 ${lock.battery < 20 ? "text-amber-500" : ""}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10H5v4h2m10-4h2v4h-2m-6-6v8m-4 0h8a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z" />
                        </svg>
                        {lock.battery}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Lock Details */}
          {currentLock ? (
            <div className="lg:col-span-2 space-y-6">
              {/* Lock Info */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{currentLock.name}</h2>
                    <p className="text-zinc-500">{currentLock.propertyName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      Unlock
                    </button>
                    <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm">
                      Settings
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-2xl font-bold">{currentLock.battery}%</p>
                    <p className="text-xs text-zinc-500">Battery</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-2xl font-bold capitalize">{currentLock.status.replace("_", " ")}</p>
                    <p className="text-xs text-zinc-500">Status</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-2xl font-bold">{lockCodes.filter((c) => c.status === "active").length}</p>
                    <p className="text-xs text-zinc-500">Active Codes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-lg font-bold">{getManufacturerLogo(currentLock.manufacturer)}</p>
                    <p className="text-xs text-zinc-500">{currentLock.model}</p>
                  </div>
                </div>
              </div>

              {/* Access Codes */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Access Codes</h3>
                  <button
                    onClick={() => setShowNewCode(true)}
                    className="px-3 py-1.5 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Code
                  </button>
                </div>

                {showNewCode && (
                  <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <h4 className="font-medium mb-3">Create New Access Code</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={newCode.name}
                          onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                          placeholder="Guest name or description"
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">Code (auto-generate if empty)</label>
                        <input
                          type="text"
                          value={newCode.code}
                          onChange={(e) => setNewCode({ ...newCode, code: e.target.value.replace(/\D/g, "").substr(0, 6) })}
                          placeholder="4-6 digits"
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">Type</label>
                        <select
                          value={newCode.type}
                          onChange={(e) => setNewCode({ ...newCode, type: e.target.value as AccessCode["type"] })}
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                        >
                          <option value="guest">Guest</option>
                          <option value="cleaner">Cleaner</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="permanent">Permanent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">Valid From</label>
                        <input
                          type="datetime-local"
                          value={newCode.validFrom}
                          onChange={(e) => setNewCode({ ...newCode, validFrom: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowNewCode(false)}
                        className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createCode}
                        className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                      >
                        Create Code
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {lockCodes.map((code) => (
                    <div
                      key={code.id}
                      className={`p-4 rounded-lg border ${
                        code.status === "active"
                          ? "bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-lg font-bold tracking-wider">{code.code}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              code.type === "guest" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                              code.type === "cleaner" ? "bg-violet-500/10 text-violet-600 dark:text-violet-400" :
                              code.type === "maintenance" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}>
                              {code.type}
                            </span>
                            {code.status !== "active" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-500">
                                {code.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{code.name}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Valid: {code.validFrom.toLocaleDateString()} - {code.validTo.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Used {code.usageCount} times
                          </p>
                        </div>
                        {code.status === "active" && (
                          <button
                            onClick={() => disableCode(code.id)}
                            className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {lockActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.action === "unlock" ? "bg-emerald-500/10" :
                        activity.action === "lock" ? "bg-blue-500/10" :
                        activity.action === "low_battery" ? "bg-amber-500/10" : "bg-zinc-500/10"
                      }`}>
                        {activity.action === "unlock" && (
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        )}
                        {activity.action === "lock" && (
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                        {activity.action === "code_created" && (
                          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                        {activity.action === "low_battery" && (
                          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.action === "unlock" && `Unlocked by ${activity.user}`}
                          {activity.action === "lock" && "Locked"}
                          {activity.action === "code_created" && `Code created by ${activity.user}`}
                          {activity.action === "low_battery" && "Low battery warning"}
                        </p>
                        {activity.code && (
                          <p className="text-xs text-zinc-500">Code: {activity.code}</p>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">{formatRelativeTime(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="font-medium">Select a lock</p>
              <p className="text-sm">Click on a lock to manage access codes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
