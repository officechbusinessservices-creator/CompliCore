import { Wrench, Sparkles, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";

const tasks = [
  {
    id: "1",
    type: "Cleaning",
    property: "Ocean View Suite",
    assignee: "Maria C.",
    due: "Feb 20, 10:00 AM",
    status: "scheduled",
    priority: "high",
  },
  {
    id: "2",
    type: "Maintenance",
    property: "Downtown Loft",
    assignee: "James R.",
    due: "Feb 21, 2:00 PM",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "3",
    type: "Cleaning",
    property: "Mountain Cabin",
    assignee: "Maria C.",
    due: "Feb 28, 11:00 AM",
    status: "scheduled",
    priority: "normal",
  },
  {
    id: "4",
    type: "Inspection",
    property: "City Studio",
    assignee: "Tom B.",
    due: "Mar 1, 9:00 AM",
    status: "scheduled",
    priority: "normal",
  },
  {
    id: "5",
    type: "Cleaning",
    property: "Ocean View Suite",
    assignee: "Maria C.",
    due: "Feb 18, 10:00 AM",
    status: "completed",
    priority: "normal",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-500/10 text-blue-600", icon: Clock },
  "in-progress": { label: "In Progress", color: "bg-amber-500/10 text-amber-600", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
};

const priorityColor: Record<string, string> = {
  high: "text-rose-500",
  medium: "text-amber-500",
  normal: "text-muted-foreground",
};

export default function OpsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Operations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cleaning, maintenance, and inspection tasks
          </p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
          <Plus className="w-4 h-4" />
          Add task
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Scheduled", count: tasks.filter((t) => t.status === "scheduled").length, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "In Progress", count: tasks.filter((t) => t.status === "in-progress").length, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Completed", count: tasks.filter((t) => t.status === "completed").length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "High Priority", count: tasks.filter((t) => t.priority === "high").length, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className={`text-2xl font-bold mb-0.5 ${s.color}`}>{s.count}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Smart lock banner */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <div className="font-semibold text-sm mb-1">Smart lock codes auto-generated</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unique access codes are automatically created for each booking and expire at checkout. Codes are sent to guests 1 hour before check-in.
          </p>
        </div>
      </div>

      {/* Task list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">All Tasks</h2>
        </div>
        <div className="divide-y divide-border">
          {tasks.map((t) => {
            const cfg = statusConfig[t.status];
            const Icon = cfg.icon;
            return (
              <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color.replace("text-", "bg-").replace("600", "500/10")}`}>
                  <Icon className={`w-4 h-4 ${cfg.color.split(" ")[1]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{t.type}</span>
                    <span className={`text-[10px] font-medium ${priorityColor[t.priority]}`}>
                      {t.priority !== "normal" ? `● ${t.priority}` : ""}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.property} · Assigned to {t.assignee}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div className="text-xs text-muted-foreground">{t.due}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
