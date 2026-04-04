"use client";

import { useState } from "react";
import Link from "next/link";

interface InspectionItem {
  id: string;
  category: string;
  item: string;
  condition: "good" | "fair" | "damaged" | "missing" | "pending";
  notes: string;
  photos: string[];
}

interface Inspection {
  id: string;
  propertyName: string;
  propertyImage: string;
  type: "check-in" | "check-out" | "routine";
  date: string;
  inspector: string;
  status: "in-progress" | "completed" | "reviewed";
  guestName?: string;
  bookingId?: string;
  items: InspectionItem[];
  overallNotes: string;
}

const conditionColors = {
  good: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  fair: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  damaged: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  missing: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  pending: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

const inspectionTemplate: Omit<InspectionItem, "condition" | "notes" | "photos">[] = [
  { id: "1", category: "Living Room", item: "Sofa & Cushions" },
  { id: "2", category: "Living Room", item: "TV & Remote" },
  { id: "3", category: "Living Room", item: "Coffee Table" },
  { id: "4", category: "Living Room", item: "Lamps & Lighting" },
  { id: "5", category: "Kitchen", item: "Appliances" },
  { id: "6", category: "Kitchen", item: "Cookware & Utensils" },
  { id: "7", category: "Kitchen", item: "Dishes & Glassware" },
  { id: "8", category: "Kitchen", item: "Countertops" },
  { id: "9", category: "Bedroom", item: "Bed & Mattress" },
  { id: "10", category: "Bedroom", item: "Linens & Pillows" },
  { id: "11", category: "Bedroom", item: "Closet & Hangers" },
  { id: "12", category: "Bedroom", item: "Nightstands" },
  { id: "13", category: "Bathroom", item: "Toilet" },
  { id: "14", category: "Bathroom", item: "Shower/Tub" },
  { id: "15", category: "Bathroom", item: "Sink & Faucet" },
  { id: "16", category: "Bathroom", item: "Towels" },
  { id: "17", category: "General", item: "Walls & Paint" },
  { id: "18", category: "General", item: "Floors" },
  { id: "19", category: "General", item: "Windows" },
  { id: "20", category: "General", item: "Doors & Locks" },
];

const pastInspections: Inspection[] = [
  {
    id: "insp-1",
    propertyName: "Modern Downtown Loft",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    type: "check-out",
    date: "2026-02-01",
    inspector: "Sarah M.",
    status: "completed",
    guestName: "Alex Johnson",
    bookingId: "HX4K9M2",
    items: [],
    overallNotes: "Property in excellent condition. Minor wear on living room rug.",
  },
  {
    id: "insp-2",
    propertyName: "Cozy Beachfront Cottage",
    propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400",
    type: "check-in",
    date: "2026-01-28",
    inspector: "Mike C.",
    status: "completed",
    guestName: "Maria Garcia",
    bookingId: "JK7L3P9",
    items: [],
    overallNotes: "All items accounted for. Ready for guest.",
  },
  {
    id: "insp-3",
    propertyName: "Luxury Mountain Cabin",
    propertyImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
    type: "routine",
    date: "2026-01-15",
    inspector: "Emily D.",
    status: "reviewed",
    items: [],
    overallNotes: "Quarterly inspection complete. HVAC filter replaced.",
  },
];

export default function InspectionPage() {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [selectedProperty, setSelectedProperty] = useState("Modern Downtown Loft");
  const [inspectionType, setInspectionType] = useState<"check-in" | "check-out" | "routine">("check-out");
  const [items, setItems] = useState<InspectionItem[]>(
    inspectionTemplate.map((t) => ({ ...t, condition: "pending" as const, notes: "", photos: [] }))
  );
  const [overallNotes, setOverallNotes] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Living Room");

  const categories = [...new Set(inspectionTemplate.map((t) => t.category))];

  const updateItemCondition = (id: string, condition: InspectionItem["condition"]) => {
    setItems(items.map((item) => item.id === id ? { ...item, condition } : item));
  };

  const updateItemNotes = (id: string, notes: string) => {
    setItems(items.map((item) => item.id === id ? { ...item, notes } : item));
  };

  const getCompletionStats = () => {
    const total = items.length;
    const completed = items.filter((i) => i.condition !== "pending").length;
    const damaged = items.filter((i) => i.condition === "damaged" || i.condition === "missing").length;
    return { total, completed, damaged, percentage: Math.round((completed / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Property Inspection</h1>
              <p className="text-xs text-zinc-500">Document property condition</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "new"
                ? "bg-emerald-500 text-white"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            New Inspection
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "bg-emerald-500 text-white"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            History
          </button>
        </div>

        {activeTab === "new" && (
          <>
            {/* Setup */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <h2 className="font-semibold mb-4">Inspection Setup</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Property</label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                  >
                    <option>Modern Downtown Loft</option>
                    <option>Cozy Beachfront Cottage</option>
                    <option>Luxury Mountain Cabin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Inspection Type</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as typeof inspectionType)}
                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                  >
                    <option value="check-in">Pre Check-in</option>
                    <option value="check-out">Post Check-out</option>
                    <option value="routine">Routine Inspection</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold">Inspection Progress</h2>
                  <p className="text-sm text-zinc-500">{stats.completed} of {stats.total} items checked</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{stats.percentage}%</p>
                  {stats.damaged > 0 && (
                    <p className="text-sm text-rose-600">{stats.damaged} issue{stats.damaged !== 1 ? "s" : ""} found</p>
                  )}
                </div>
              </div>
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${stats.percentage}%` }} />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryItems = items.filter((i) => i.category === category);
                const isExpanded = expandedCategory === category;

                return (
                  <div key={category} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{category}</h3>
                        <span className="text-xs text-zinc-500">
                          {categoryItems.filter((i) => i.condition !== "pending").length}/{categoryItems.length}
                        </span>
                      </div>
                      <svg className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-sm">{item.item}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs capitalize border ${conditionColors[item.condition]}`}>
                                {item.condition}
                              </span>
                            </div>

                            {/* Condition Buttons */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {(["good", "fair", "damaged", "missing"] as const).map((cond) => (
                                <button
                                  key={cond}
                                  onClick={() => updateItemCondition(item.id, cond)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                                    item.condition === cond
                                      ? cond === "good" ? "bg-emerald-500 text-white"
                                        : cond === "fair" ? "bg-amber-500 text-white"
                                        : cond === "damaged" ? "bg-rose-500 text-white"
                                        : "bg-violet-500 text-white"
                                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                  }`}
                                >
                                  {cond}
                                </button>
                              ))}
                            </div>

                            {/* Notes */}
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateItemNotes(item.id, e.target.value)}
                              placeholder="Add notes..."
                              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />

                            {/* Photo Upload */}
                            <div className="mt-3 flex gap-2">
                              <button className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Add Photo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall Notes */}
            <div className="mt-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-3">Overall Notes</h3>
              <textarea
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                placeholder="Add any additional observations..."
                className="w-full h-24 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Submit */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Save Draft
              </button>
              <button
                disabled={stats.percentage < 100}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Complete Inspection
              </button>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {pastInspections.map((inspection) => (
              <div key={inspection.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex gap-4">
                  <img src={inspection.propertyImage} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{inspection.propertyName}</h3>
                        <p className="text-sm text-zinc-500 capitalize">{inspection.type.replace("-", " ")} Inspection</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                        inspection.status === "completed" ? "bg-emerald-500/10 text-emerald-600"
                          : inspection.status === "reviewed" ? "bg-blue-500/10 text-blue-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {inspection.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(inspection.date).toLocaleDateString()} · Inspector: {inspection.inspector}
                    </p>
                    {inspection.guestName && (
                      <p className="text-xs text-zinc-400">Guest: {inspection.guestName}</p>
                    )}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">{inspection.overallNotes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
