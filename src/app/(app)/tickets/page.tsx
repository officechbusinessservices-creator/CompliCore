"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  guestName: string;
  guestAvatar: string;
  property: string;
  category: "maintenance" | "cleaning" | "amenity" | "complaint" | "request" | "emergency";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "pending-guest" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  slaStatus: "on-track" | "at-risk" | "breached";
  assignedTo?: string;
  messages: number;
}

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Hot water not working",
    description: "The hot water heater seems to not be working. No hot water in shower or kitchen.",
    guestName: "Alex Johnson",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    property: "Modern Downtown Loft",
    category: "maintenance",
    priority: "urgent",
    status: "in-progress",
    createdAt: "2026-02-03T08:30:00",
    updatedAt: "2026-02-03T09:15:00",
    slaDeadline: "2026-02-03T10:30:00",
    slaStatus: "at-risk",
    assignedTo: "Mike (Maintenance)",
    messages: 4,
  },
  {
    id: "TKT-002",
    subject: "Extra towels request",
    description: "We have 2 extra guests joining us tonight. Could we get 2 more sets of towels?",
    guestName: "Maria Garcia",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    property: "Cozy Beachfront Cottage",
    category: "request",
    priority: "low",
    status: "open",
    createdAt: "2026-02-03T10:00:00",
    updatedAt: "2026-02-03T10:00:00",
    slaDeadline: "2026-02-04T10:00:00",
    slaStatus: "on-track",
    messages: 1,
  },
  {
    id: "TKT-003",
    subject: "Noisy neighbors complaint",
    description: "The apartment next door has been very loud past 11pm for the last 2 nights.",
    guestName: "James Wilson",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    property: "Modern Downtown Loft",
    category: "complaint",
    priority: "high",
    status: "pending-guest",
    createdAt: "2026-02-02T23:45:00",
    updatedAt: "2026-02-03T08:00:00",
    slaDeadline: "2026-02-03T11:45:00",
    slaStatus: "on-track",
    assignedTo: "Sarah (Host)",
    messages: 3,
  },
  {
    id: "TKT-004",
    subject: "WiFi password not working",
    description: "The WiFi password in the welcome guide doesn't seem to work.",
    guestName: "Emily Chen",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    property: "Luxury Mountain Cabin",
    category: "amenity",
    priority: "medium",
    status: "resolved",
    createdAt: "2026-02-02T14:20:00",
    updatedAt: "2026-02-02T14:45:00",
    slaDeadline: "2026-02-02T18:20:00",
    slaStatus: "on-track",
    assignedTo: "Sarah (Host)",
    messages: 5,
  },
  {
    id: "TKT-005",
    subject: "Deep clean after checkout",
    description: "Property requires deep cleaning - previous guest had pet despite no-pet policy.",
    guestName: "System",
    guestAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    property: "Cozy Beachfront Cottage",
    category: "cleaning",
    priority: "high",
    status: "open",
    createdAt: "2026-02-03T11:00:00",
    updatedAt: "2026-02-03T11:00:00",
    slaDeadline: "2026-02-03T15:00:00",
    slaStatus: "on-track",
    messages: 0,
  },
];

const priorityColors = {
  low: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  urgent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const statusColors = {
  open: "bg-blue-500",
  "in-progress": "bg-amber-500",
  "pending-guest": "bg-violet-500",
  resolved: "bg-emerald-500",
  closed: "bg-zinc-500",
};

const slaColors = {
  "on-track": "text-emerald-600",
  "at-risk": "text-amber-600",
  breached: "text-rose-600",
};

const categoryIcons: Record<string, string> = {
  maintenance: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  cleaning: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  amenity: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  complaint: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  request: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  emergency: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "open" | "mine" | "sla">("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "open") return ticket.status === "open" || ticket.status === "in-progress";
    if (activeTab === "mine") return ticket.assignedTo?.includes("Sarah");
    if (activeTab === "sla") return ticket.slaStatus !== "on-track";
    return true;
  }).filter((ticket) => {
    if (filterPriority === "all") return true;
    return ticket.priority === filterPriority;
  });

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const urgentCount = tickets.filter((t) => t.priority === "urgent" && t.status !== "resolved" && t.status !== "closed").length;
  const atRiskCount = tickets.filter((t) => t.slaStatus !== "on-track").length;

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const dl = new Date(deadline);
    const diff = dl.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (diff < 0) return "Overdue";
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}m`;
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
              <h1 className="font-semibold text-lg">Support Tickets</h1>
              <p className="text-xs text-zinc-500">Guest requests & SLA tracking</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Ticket
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Open Tickets</p>
            <p className="text-2xl font-bold">{openCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Urgent</p>
            <p className="text-2xl font-bold text-rose-600">{urgentCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">SLA At Risk</p>
            <p className="text-2xl font-bold text-amber-600">{atRiskCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg. Resolution</p>
            <p className="text-2xl font-bold">2.4h</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "open", "mine", "sla"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "all" ? "All Tickets" : tab === "open" ? "Open" : tab === "mine" ? "Assigned to Me" : "SLA Issues"}
              {tab === "sla" && atRiskCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white text-xs rounded-full">{atRiskCount}</span>
              )}
            </button>
          ))}

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="ml-auto px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`bg-white dark:bg-zinc-900 rounded-xl border p-4 cursor-pointer transition-all ${
                selectedTicket?.id === ticket.id
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons[ticket.category]} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-zinc-400">{ticket.id}</span>
                    <span className={`w-2 h-2 rounded-full ${statusColors[ticket.status]}`} />
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                    {ticket.slaStatus !== "on-track" && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${ticket.slaStatus === "at-risk" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}`}>
                        SLA {ticket.slaStatus}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium mb-1">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <img src={ticket.guestAvatar} alt="" className="w-4 h-4 rounded-full" />
                      {ticket.guestName}
                    </span>
                    <span>{ticket.property}</span>
                    <span>{ticket.messages} messages</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-medium ${slaColors[ticket.slaStatus]}`}>
                    {getTimeRemaining(ticket.slaDeadline)}
                  </p>
                  <p className="text-xs text-zinc-500">SLA remaining</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SLA Legend */}
        <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <h4 className="font-semibold mb-3">SLA Response Times</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-rose-600 font-medium">Urgent</p>
              <p className="text-zinc-500">2 hours</p>
            </div>
            <div>
              <p className="text-amber-600 font-medium">High</p>
              <p className="text-zinc-500">4 hours</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">Medium</p>
              <p className="text-zinc-500">12 hours</p>
            </div>
            <div>
              <p className="text-zinc-600 font-medium">Low</p>
              <p className="text-zinc-500">24 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Create New Ticket</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Subject</label>
                <input type="text" placeholder="Brief description of the issue" className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Category</label>
                  <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <option>Maintenance</option>
                    <option>Cleaning</option>
                    <option>Amenity</option>
                    <option>Complaint</option>
                    <option>Request</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Priority</label>
                  <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Property</label>
                <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <option>Modern Downtown Loft</option>
                  <option>Cozy Beachfront Cottage</option>
                  <option>Luxury Mountain Cabin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Description</label>
                <textarea placeholder="Detailed description..." className="w-full h-24 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewTicketModal(false)} className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg">
                Cancel
              </button>
              <button onClick={() => setShowNewTicketModal(false)} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg font-medium">
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
