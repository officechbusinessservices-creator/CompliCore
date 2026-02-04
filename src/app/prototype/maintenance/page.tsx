"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  property: string;
  propertyImage: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "scheduled" | "completed";
  category: string;
  createdAt: string;
  scheduledFor?: string;
  completedAt?: string;
  assignedTo?: Vendor;
  estimatedCost?: number;
  actualCost?: number;
  photos?: string[];
}

interface Vendor {
  id: string;
  name: string;
  company: string;
  avatar: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  phone: string;
  email: string;
  available: boolean;
}

const priorityColors = {
  urgent: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  low: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

const statusColors = {
  open: "bg-rose-500",
  "in-progress": "bg-amber-500",
  scheduled: "bg-blue-500",
  completed: "bg-emerald-500",
};

const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Mike's Plumbing",
    company: "Mike's Plumbing Co.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    specialty: "Plumbing",
    rating: 4.9,
    completedJobs: 156,
    hourlyRate: 85,
    phone: "+1 (555) 123-4567",
    email: "mike@plumbingco.com",
    available: true,
  },
  {
    id: "v2",
    name: "Sarah's Electric",
    company: "Bright Spark Electric",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    specialty: "Electrical",
    rating: 4.8,
    completedJobs: 89,
    hourlyRate: 95,
    phone: "+1 (555) 234-5678",
    email: "sarah@brightspark.com",
    available: true,
  },
  {
    id: "v3",
    name: "Tom's HVAC",
    company: "Climate Control Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    specialty: "HVAC",
    rating: 4.7,
    completedJobs: 203,
    hourlyRate: 90,
    phone: "+1 (555) 345-6789",
    email: "tom@climatecontrol.com",
    available: false,
  },
  {
    id: "v4",
    name: "Clean Team",
    company: "Sparkle Cleaning Services",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    specialty: "Cleaning",
    rating: 4.9,
    completedJobs: 412,
    hourlyRate: 45,
    phone: "+1 (555) 456-7890",
    email: "info@sparkleclean.com",
    available: true,
  },
];

const maintenanceTasks: MaintenanceTask[] = [
  {
    id: "m1",
    title: "Leaking faucet in bathroom",
    description: "Guest reported continuous drip from bathroom sink faucet. Needs washer replacement.",
    property: "Modern Downtown Loft",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
    priority: "high",
    status: "in-progress",
    category: "Plumbing",
    createdAt: "2026-02-01T10:30:00",
    scheduledFor: "2026-02-04T09:00:00",
    assignedTo: vendors[0],
    estimatedCost: 150,
  },
  {
    id: "m2",
    title: "AC not cooling properly",
    description: "Air conditioning unit not reaching set temperature. May need refrigerant recharge.",
    property: "Cozy Beachfront Cottage",
    propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200",
    priority: "urgent",
    status: "open",
    category: "HVAC",
    createdAt: "2026-02-03T14:20:00",
    estimatedCost: 350,
  },
  {
    id: "m3",
    title: "Replace smoke detector batteries",
    description: "Annual battery replacement for all smoke detectors (5 units).",
    property: "Luxury Mountain Cabin",
    propertyImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200",
    priority: "medium",
    status: "scheduled",
    category: "Safety",
    createdAt: "2026-01-28T09:00:00",
    scheduledFor: "2026-02-10T10:00:00",
    estimatedCost: 50,
  },
  {
    id: "m4",
    title: "Deep cleaning before guest arrival",
    description: "Full property deep clean including carpets and upholstery.",
    property: "Modern Downtown Loft",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
    priority: "high",
    status: "scheduled",
    category: "Cleaning",
    createdAt: "2026-02-02T11:00:00",
    scheduledFor: "2026-02-14T08:00:00",
    assignedTo: vendors[3],
    estimatedCost: 250,
  },
  {
    id: "m5",
    title: "Fix broken window latch",
    description: "Bedroom window latch is broken, window doesn't close securely.",
    property: "Cozy Beachfront Cottage",
    propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200",
    priority: "high",
    status: "completed",
    category: "General",
    createdAt: "2026-01-20T15:30:00",
    completedAt: "2026-01-25T14:00:00",
    estimatedCost: 120,
    actualCost: 95,
  },
];

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "vendors" | "schedule">("tasks");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [tasksData, setTasksData] = useState<MaintenanceTask[]>(maintenanceTasks);

  useEffect(() => {
    fetchModuleData<MaintenanceTask[]>("/maintenance/tasks", maintenanceTasks).then(setTasksData);
  }, []);

  const filteredTasks = filterStatus === "all"
    ? tasksData
    : tasksData.filter((task) => task.status === filterStatus);

  const openTasks = tasksData.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const scheduledTasks = tasksData.filter((t) => t.status === "scheduled").length;
  const totalCost = tasksData.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost || 0), 0);

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
              <h1 className="font-semibold text-lg">Maintenance Manager</h1>
              <p className="text-xs text-zinc-500">Track repairs and manage vendors</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Open Tasks</p>
            <p className="text-2xl font-bold text-rose-600">{openTasks}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600">{scheduledTasks}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Active Vendors</p>
            <p className="text-2xl font-bold">{vendors.filter((v) => v.available).length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Monthly Spend</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["tasks", "vendors", "schedule"] as const).map((tab) => (
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

        {activeTab === "tasks" && (
          <>
            {/* Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["all", "open", "in-progress", "scheduled", "completed"].map((status) => (
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

            {/* Tasks List */}
            <div className="space-y-4">
            {tasksData.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img src={task.propertyImage} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-zinc-500">{task.property}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {task.category}
                        </span>
                        {task.assignedTo && (
                          <span className="flex items-center gap-1">
                            <img src={task.assignedTo.avatar} alt="" className="w-4 h-4 rounded-full" />
                            {task.assignedTo.name}
                          </span>
                        )}
                        {task.estimatedCost && (
                          <span>{formatCurrency(task.estimatedCost)} est.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "vendors" && (
          <div className="grid md:grid-cols-2 gap-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={vendor.avatar} alt={vendor.name} className="w-16 h-16 rounded-full" />
                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${vendor.available ? "bg-emerald-500" : "bg-zinc-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-zinc-500">{vendor.company}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs">
                        {vendor.specialty}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {vendor.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500">Hourly Rate</p>
                    <p className="font-semibold">{formatCurrency(vendor.hourlyRate)}/hr</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Jobs Completed</p>
                    <p className="font-semibold">{vendor.completedJobs}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium">
                    Assign Task
                  </button>
                  <button className="py-2 px-4 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-6">Upcoming Maintenance Schedule</h3>
            <div className="space-y-4">
              {maintenanceTasks
                .filter((t) => t.scheduledFor)
                .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime())
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-center min-w-[60px]">
                      <p className="text-2xl font-bold">{new Date(task.scheduledFor!).getDate()}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(task.scheduledFor!).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-zinc-500">{task.property}</p>
                      {task.assignedTo && (
                        <p className="text-xs text-zinc-400 mt-1">Assigned to: {task.assignedTo.name}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Create Maintenance Task</h3>
              <button onClick={() => setShowNewTaskModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Task Title</label>
                <input type="text" placeholder="e.g., Fix broken faucet" className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Property</label>
                <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <option>Modern Downtown Loft</option>
                  <option>Cozy Beachfront Cottage</option>
                  <option>Luxury Mountain Cabin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Category</label>
                  <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC</option>
                    <option>Cleaning</option>
                    <option>Safety</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Priority</label>
                  <select className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Description</label>
                <textarea placeholder="Describe the issue..." className="w-full h-24 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewTaskModal(false)} className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg">
                Cancel
              </button>
              <button onClick={() => setShowNewTaskModal(false)} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg font-medium">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
