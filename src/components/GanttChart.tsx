"use client";

import { useMemo, useState } from "react";

interface Phase {
  id: string;
  name: string;
  startWeek: number;
  durationWeeks: number;
  color: string;
  milestones: Milestone[];
  deliverables: string[];
}

interface Milestone {
  name: string;
  week: number;
}

const phases: Phase[] = [
  {
    id: "foundation",
    name: "Foundation",
    startWeek: 1,
    durationWeeks: 8,
    color: "#6366f1", // indigo
    milestones: [
      { name: "Infrastructure Ready", week: 2 },
      { name: "Auth Complete", week: 4 },
      { name: "Core API Scaffold", week: 6 },
      { name: "Integration Ready", week: 8 },
    ],
    deliverables: [
      "Kubernetes cluster",
      "CI/CD pipeline",
      "Authentication system",
      "Core data models",
      "Security baseline",
    ],
  },
  {
    id: "mvp",
    name: "MVP",
    startWeek: 9,
    durationWeeks: 12,
    color: "#10b981", // emerald
    milestones: [
      { name: "Listings Complete", week: 12 },
      { name: "Booking Engine", week: 16 },
      { name: "Payments Live", week: 18 },
      { name: "MVP Launch", week: 20 },
    ],
    deliverables: [
      "Property management",
      "Availability calendar",
      "Direct booking engine",
      "Payment processing",
      "Guest messaging",
      "Review system",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    startWeek: 21,
    durationWeeks: 16,
    color: "#f59e0b", // amber
    milestones: [
      { name: "Airbnb Integration", week: 26 },
      { name: "Smart Locks", week: 32 },
      { name: "AI Pricing v2", week: 36 },
    ],
    deliverables: [
      "OTA integrations",
      "Smart lock support",
      "Insurance module",
      "Advanced pricing",
      "Guest screening",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    startWeek: 37,
    durationWeeks: 20,
    color: "#8b5cf6", // violet
    milestones: [
      { name: "PM Dashboard", week: 42 },
      { name: "Public API", week: 50 },
      { name: "Accounting Sync", week: 56 },
    ],
    deliverables: [
      "Multi-property management",
      "Team & permissions",
      "Accounting integration",
      "Owner statements",
      "Public API",
    ],
  },
  {
    id: "platform",
    name: "Platform",
    startWeek: 57,
    durationWeeks: 16,
    color: "#ec4899", // pink
    milestones: [
      { name: "Vendor Marketplace", week: 62 },
      { name: "White-label Launch", week: 68 },
      { name: "Mobile Apps", week: 72 },
    ],
    deliverables: [
      "Vendor marketplace",
      "Experience add-ons",
      "White-label solution",
      "Multi-language",
      "Native mobile apps",
    ],
  },
];

const totalWeeks = 72;

export function GanttChart() {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  const weekToMonth = (week: number) => {
    const month = Math.ceil(week / 4.33);
    return `M${month}`;
  };

  const months = useMemo(() => {
    const result: { month: number; label: string }[] = [];
    for (let m = 1; m <= 18; m++) {
      result.push({ month: m, label: `M${m}` });
    }
    return result;
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h3 className="font-semibold text-lg">Project Roadmap Timeline</h3>
        <p className="text-sm text-zinc-500">18-month development plan from Foundation to Platform</p>
      </div>

      {/* Chart */}
      <div className="p-4 overflow-x-auto">
        {/* Month headers */}
        <div className="flex mb-4">
          <div className="w-32 shrink-0" />
          <div className="flex-1 flex">
            {months.map((m) => (
              <div
                key={m.month}
                className="flex-1 text-center text-xs text-zinc-500 border-l border-zinc-800 first:border-l-0"
                style={{ minWidth: 40 }}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-3">
          {phases.map((phase) => {
            const startPercent = ((phase.startWeek - 1) / totalWeeks) * 100;
            const widthPercent = (phase.durationWeeks / totalWeeks) * 100;

            return (
              <div key={phase.id} className="flex items-center gap-4">
                {/* Phase name */}
                <button
                  type="button"
                  onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
                  className={`w-32 shrink-0 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPhase?.id === phase.id
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  {phase.name}
                </button>

                {/* Timeline bar */}
                <div className="flex-1 relative h-10 bg-zinc-800/50 rounded-lg">
                  {/* Grid lines */}
                  {months.map((m) => (
                    <div
                      key={m.month}
                      className="absolute top-0 bottom-0 border-l border-zinc-800/50"
                      style={{ left: `${((m.month - 1) / 18) * 100}%` }}
                    />
                  ))}

                  {/* Phase bar */}
                  <div
                    className="absolute top-1 bottom-1 rounded-md flex items-center px-2 cursor-pointer transition-all hover:brightness-110"
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: phase.color,
                    }}
                    onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedPhase(selectedPhase?.id === phase.id ? null : phase);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="text-xs font-medium text-white truncate">
                      {phase.durationWeeks}w
                    </span>
                  </div>

                  {/* Milestones */}
                  {phase.milestones.map((milestone) => {
                    const milestonePercent = ((milestone.week - 1) / totalWeeks) * 100;
                    const milestoneId = `${phase.id}-${milestone.week}`;

                    return (
                      <div
                        key={milestoneId}
                        className="absolute top-1/2 -translate-y-1/2 z-10"
                        style={{ left: `${milestonePercent}%` }}
                        onMouseEnter={() => setHoveredMilestone(milestoneId)}
                        onMouseLeave={() => setHoveredMilestone(null)}
                      >
                        <div
                          className="w-3 h-3 rounded-full bg-white border-2 transition-transform hover:scale-125 cursor-pointer"
                          style={{ borderColor: phase.color }}
                        />

                        {/* Tooltip */}
                        {hoveredMilestone === milestoneId && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 rounded text-xs whitespace-nowrap z-20 border border-zinc-700">
                            <div className="font-medium">{milestone.name}</div>
                            <div className="text-zinc-400">Week {milestone.week}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded bg-zinc-700" />
            <span>Phase duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-zinc-500" />
            <span>Milestone</span>
          </div>
        </div>
      </div>

      {/* Selected Phase Details */}
      {selectedPhase && (
        <div className="border-t border-zinc-800 p-4 bg-zinc-900/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedPhase.color }}
                />
                {selectedPhase.name} Phase
              </h4>
              <p className="text-sm text-zinc-400">
                Weeks {selectedPhase.startWeek}-{selectedPhase.startWeek + selectedPhase.durationWeeks - 1} ({selectedPhase.durationWeeks} weeks)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPhase(null)}
              className="p-1 text-zinc-500 hover:text-zinc-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-zinc-300 mb-2">Milestones</h5>
              <ul className="space-y-2">
                {selectedPhase.milestones.map((m) => (
                  <li key={m.week} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedPhase.color }}
                    />
                    <span>{m.name}</span>
                    <span className="text-zinc-600">Week {m.week}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-zinc-300 mb-2">Key Deliverables</h5>
              <ul className="space-y-1">
                {selectedPhase.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-zinc-400">
                    <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard
export function GanttChartMini() {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <h4 className="text-sm font-medium mb-3">Development Timeline</h4>
      <div className="space-y-2">
        {phases.map((phase) => {
          const widthPercent = (phase.durationWeeks / totalWeeks) * 100;
          const startPercent = ((phase.startWeek - 1) / totalWeeks) * 100;

          return (
            <div key={phase.id} className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-20 truncate">{phase.name}</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full relative">
                <div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: phase.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-zinc-600">
        <span>M1</span>
        <span>M6</span>
        <span>M12</span>
        <span>M18</span>
      </div>
    </div>
  );
}
