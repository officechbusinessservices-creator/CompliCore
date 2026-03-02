"use client";

import { useState } from "react";
import Link from "next/link";
import { MermaidDiagram, architectureDiagrams } from "@/components/MermaidDiagram";
import { GanttChart } from "@/components/GanttChart";

const diagramTabs = [
  { id: "system", label: "System Overview", diagram: architectureDiagrams.systemOverview },
  { id: "booking", label: "Booking Flow", diagram: architectureDiagrams.bookingFlow },
  { id: "data", label: "Data Flow", diagram: architectureDiagrams.dataFlow },
  { id: "ai", label: "AI Pipeline", diagram: architectureDiagrams.aiPipeline },
  { id: "rbac", label: "RBAC Model", diagram: architectureDiagrams.rbacMatrix },
];

export default function DiagramsPage() {
  const [activeTab, setActiveTab] = useState("system");
  const [showRoadmap, setShowRoadmap] = useState(false);

  const activeDiagram = diagramTabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-lg">Architecture Diagrams</span>
              <p className="text-xs text-zinc-500">Interactive visualizations</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowRoadmap(!showRoadmap)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showRoadmap
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {showRoadmap ? "Show Diagrams" : "Show Roadmap"}
            </button>
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-zinc-200"
            >
              Back to Docs
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showRoadmap ? (
          /* Gantt Chart View */
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Project Roadmap</h1>
              <p className="text-zinc-400">
                Interactive timeline showing the 18-month development plan from Foundation to Platform.
              </p>
            </div>
            <GanttChart />
          </div>
        ) : (
          /* Diagram View */
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Architecture Diagrams</h1>
              <p className="text-zinc-400">
                Interactive Mermaid diagrams visualizing system components, data flows, and processes.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {diagramTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Diagram */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 overflow-hidden">
              {activeDiagram && (
                <MermaidDiagram
                  chart={activeDiagram.diagram}
                  id={`diagram-${activeDiagram.id}`}
                  className="min-h-[400px]"
                />
              )}
            </div>

            {/* Diagram Description */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {activeTab === "system" && (
                <>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Client Layer</h3>
                    <p className="text-sm text-zinc-400">
                      Multi-platform frontend applications including guest web app, mobile PWA,
                      host portal, and admin dashboard. All clients communicate through the API Gateway.
                    </p>
                  </div>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Service Layer</h3>
                    <p className="text-sm text-zinc-400">
                      Microservices architecture with dedicated services for identity, listings,
                      bookings, pricing, payments, messaging, and analytics.
                    </p>
                  </div>
                </>
              )}
              {activeTab === "booking" && (
                <>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Search & Quote</h3>
                    <p className="text-sm text-zinc-400">
                      Guest searches for properties, selects dates, and receives a detailed
                      price quote calculated by the Pricing Engine.
                    </p>
                  </div>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Confirm & Notify</h3>
                    <p className="text-sm text-zinc-400">
                      Payment is processed, booking is created, channels are updated,
                      and confirmation is sent via email/SMS.
                    </p>
                  </div>
                </>
              )}
              {activeTab === "data" && (
                <>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Write Path</h3>
                    <p className="text-sm text-zinc-400">
                      All writes go to PostgreSQL primary, then CDC (Debezium) captures
                      changes and publishes to event stream for downstream consumers.
                    </p>
                  </div>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Read Path</h3>
                    <p className="text-sm text-zinc-400">
                      Reads go through Redis cache first, falling back to Elasticsearch
                      for search queries or PostgreSQL replicas for entity queries.
                    </p>
                  </div>
                </>
              )}
              {activeTab === "ai" && (
                <>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Feature Engineering</h3>
                    <p className="text-sm text-zinc-400">
                      Raw data from properties, bookings, market, and events is transformed
                      into ML-ready features for model inference.
                    </p>
                  </div>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Guardrails & Limits</h3>
                    <p className="text-sm text-zinc-400">
                      All AI outputs pass through guardrails that enforce price limits,
                      prevent discrimination, and ensure transparency.
                    </p>
                  </div>
                </>
              )}
              {activeTab === "rbac" && (
                <>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Role Hierarchy</h3>
                    <p className="text-sm text-zinc-400">
                      Super Admin has full access, Org Admin has organization-scoped access,
                      and other roles have progressively limited permissions.
                    </p>
                  </div>
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <h3 className="font-semibold mb-2">Resource Scoping</h3>
                    <p className="text-sm text-zinc-400">
                      Permissions are scoped to own resources (Host, Guest), assigned
                      resources (PM), or organization resources (Org Admin).
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation */}
      <div className="fixed bottom-6 right-6 flex gap-2">
        <Link
          href="/browse"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium border border-zinc-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Prototype
        </Link>
      </div>
    </div>
  );
}
