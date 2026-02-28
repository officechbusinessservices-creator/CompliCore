"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface Turnover {
  id: string;
  property: string;
  propertyImage: string;
  checkoutDate: string;
  checkoutTime: string;
  checkinDate: string;
  checkinTime: string;
  guestOut: string;
  guestIn: string;
  cleaner: Cleaner | null;
  status: "pending" | "assigned" | "in-progress" | "completed" | "verified";
  notes?: string;
  cleaningType: "standard" | "deep" | "express";
  estimatedDuration: number;
}

interface Cleaner {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  completedCleans: number;
  available: boolean;
  hourlyRate: number;
}

const cleaners: Cleaner[] = [
  { id: "cl1", name: "Maria Santos", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", phone: "+1 (555) 123-4567", rating: 4.95, completedCleans: 234, available: true, hourlyRate: 35 },
  { id: "cl2", name: "Juan Rodriguez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", phone: "+1 (555) 234-5678", rating: 4.88, completedCleans: 189, available: true, hourlyRate: 32 },
  { id: "cl3", name: "Lisa Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", phone: "+1 (555) 345-6789", rating: 4.92, completedCleans: 156, available: false, hourlyRate: 38 },
  { id: "cl4", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", phone: "+1 (555) 456-7890", rating: 4.78, completedCleans: 98, available: true, hourlyRate: 30 },
];

const turnoverData: Turnover[] = [
  {
    id: "t1",
    property: "Modern Downtown Loft",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
    checkoutDate: "2026-02-04",
    checkoutTime: "11:00",
    checkinDate: "2026-02-04",
    checkinTime: "15:00",
    guestOut: "Alex Johnson",
    guestIn: "Maria Garcia",
    cleaner: cleaners[0],
    status: "assigned",
    cleaningType: "standard",
    estimatedDuration: 2,
  },
  {
    id: "t2",
    property: "Cozy Beachfront Cottage",
    propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200",
    checkoutDate: "2026-02-05",
    checkoutTime: "10:00",
    checkinDate: "2026-02-05",
    checkinTime: "16:00",
    guestOut: "James Wilson",
    guestIn: "Emily Chen",
    cleaner: null,
    status: "pending",
    cleaningType: "deep",
    estimatedDuration: 4,
    notes: "Pet stayed - extra vacuuming needed",
  },
  {
    id: "t3",
    property: "Luxury Mountain Cabin",
    propertyImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200",
    checkoutDate: "2026-02-06",
    checkoutTime: "11:00",
    checkinDate: "2026-02-07",
    checkinTime: "15:00",
    guestOut: "Sophie Martin",
    guestIn: "Hans Mueller",
    cleaner: cleaners[1],
    status: "assigned",
    cleaningType: "standard",
    estimatedDuration: 3,
  },
  {
    id: "t4",
    property: "Modern Downtown Loft",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
    checkoutDate: "2026-02-03",
    checkoutTime: "11:00",
    checkinDate: "2026-02-03",
    checkinTime: "15:00",
    guestOut: "Previous Guest",
    guestIn: "Alex Johnson",
    cleaner: cleaners[0],
    status: "completed",
    cleaningType: "standard",
    estimatedDuration: 2,
  },
];

const statusColors = {
  pending: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  assigned: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  verified: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

const cleaningTypeLabels = {
  standard: "Standard Clean",
  deep: "Deep Clean",
  express: "Express Clean",
};

export default function CleaningPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "cleaners" | "settings">("schedule");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTurnover, setSelectedTurnover] = useState<Turnover | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [turnovers, setTurnovers] = useState<Turnover[]>(turnoverData);

  useEffect(() => {
    fetchModuleData<Turnover[]>("/cleaning/tasks", turnoverData).then(setTurnovers);
  }, []);

  const filteredTurnovers = filterStatus === "all"
    ? turnovers
    : turnovers.filter((t) => t.status === filterStatus);

  const pendingCount = turnovers.filter((t) => t.status === "pending").length;
  const todayCount = turnovers.filter((t) => t.checkoutDate === "2026-02-04").length;

  const getTimeGap = (turnover: Turnover) => {
    const checkout = new Date(`${turnover.checkoutDate}T${turnover.checkoutTime}`);
    const checkin = new Date(`${turnover.checkinDate}T${turnover.checkinTime}`);
    const diffHours = (checkin.getTime() - checkout.getTime()) / (1000 * 60 * 60);
    return diffHours;
  };

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
              <h1 className="font-semibold text-lg">Cleaning Schedule</h1>
              <p className="text-xs text-zinc-500">Turnover management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-sm">
                {pendingCount} unassigned
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Today's Turnovers</p>
            <p className="text-2xl font-bold">{todayCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">This Week</p>
            <p className="text-2xl font-bold">{turnovers.length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Available Cleaners</p>
            <p className="text-2xl font-bold text-emerald-600">{cleaners.filter((c) => c.available).length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg. Turnover Time</p>
            <p className="text-2xl font-bold">2.5 hrs</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["schedule", "cleaners", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "schedule" && (
          <>
            {/* Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["all", "pending", "assigned", "in-progress", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize whitespace-nowrap ${
                    filterStatus === status
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {status.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Turnovers List */}
            <div className="space-y-4">
              {filteredTurnovers.map((turnover) => {
                const timeGap = getTimeGap(turnover);
                const isTight = timeGap < 5;

                return (
                  <div
                    key={turnover.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4"
                  >
                    <div className="flex gap-4">
                      <img src={turnover.propertyImage} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-medium">{turnover.property}</h3>
                            <p className="text-sm text-zinc-500">
                              {new Date(turnover.checkoutDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${statusColors[turnover.status]}`}>
                              {turnover.status.replace("-", " ")}
                            </span>
                            {isTight && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                Tight window
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-xs text-zinc-500">Check-out</p>
                            <p className="font-semibold">{turnover.checkoutTime}</p>
                            <p className="text-xs text-zinc-400">{turnover.guestOut}</p>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="h-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700" />
                            <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                              {timeGap}h window
                            </div>
                            <div className="h-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-zinc-500">Check-in</p>
                            <p className="font-semibold">{turnover.checkinTime}</p>
                            <p className="text-xs text-zinc-400">{turnover.guestIn}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                              {cleaningTypeLabels[turnover.cleaningType]}
                            </span>
                            <span className="text-xs text-zinc-500">
                              Est. {turnover.estimatedDuration} hours
                            </span>
                          </div>
                          {turnover.cleaner ? (
                            <div className="flex items-center gap-2">
                              <img src={turnover.cleaner.avatar} alt="" className="w-6 h-6 rounded-full" />
                              <span className="text-sm">{turnover.cleaner.name}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedTurnover(turnover);
                                setShowAssignModal(true);
                              }}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium"
                            >
                              Assign Cleaner
                            </button>
                          )}
                        </div>

                        {turnover.notes && (
                          <p className="mt-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                            Note: {turnover.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "cleaners" && (
          <div className="grid md:grid-cols-2 gap-4">
            {cleaners.map((cleaner) => (
              <div key={cleaner.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={cleaner.avatar} alt={cleaner.name} className="w-16 h-16 rounded-full" />
                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${cleaner.available ? "bg-emerald-500" : "bg-zinc-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{cleaner.name}</h3>
                    <p className="text-sm text-zinc-500">{cleaner.phone}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-sm">
                        <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {cleaner.rating}
                      </span>
                      <span className="text-sm text-zinc-500">{cleaner.completedCleans} cleans</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(cleaner.hourlyRate)}/hr</p>
                    <span className={`text-xs ${cleaner.available ? "text-emerald-600" : "text-zinc-500"}`}>
                      {cleaner.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Cleaning Types & Pricing</h3>
              <div className="space-y-4">
                {[
                  { type: "Standard Clean", duration: "2-3 hours", price: 85 },
                  { type: "Deep Clean", duration: "4-5 hours", price: 150 },
                  { type: "Express Clean", duration: "1-2 hours", price: 65 },
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-zinc-500">{item.duration}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Automation Settings</h3>
              <div className="space-y-4">
                {[
                  { label: "Auto-assign cleaners based on availability", enabled: true },
                  { label: "Send reminder 2 hours before cleaning", enabled: true },
                  { label: "Request photos after cleaning", enabled: true },
                  { label: "Auto-approve verified cleaners", enabled: false },
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
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedTurnover && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Assign Cleaner</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-zinc-500 mb-4">{selectedTurnover.property}</p>
            <div className="space-y-3">
              {cleaners.filter((c) => c.available).map((cleaner) => (
                <button
                  key={cleaner.id}
                  onClick={() => setShowAssignModal(false)}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                >
                  <img src={cleaner.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{cleaner.name}</p>
                    <p className="text-sm text-zinc-500">{formatCurrency(cleaner.hourlyRate)}/hr</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm">
                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {cleaner.rating}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
