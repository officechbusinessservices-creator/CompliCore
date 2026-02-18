"use client";

import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, Calendar, DollarSign, MessageSquare, Star, Trash2 } from "lucide-react";

type NotifType = "booking" | "payment" | "message" | "review" | "alert" | "info";

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initialNotifs: Notif[] = [
  { id: "1", type: "booking", title: "New booking confirmed", body: "Alex Johnson booked Ocean View Suite · Feb 20–24 · $748", time: "2 min ago", read: false },
  { id: "2", type: "alert", title: "Booking.com sync failed", body: "Auth token expired. Reconnect your Booking.com account to resume syncing.", time: "1 hour ago", read: false },
  { id: "3", type: "payment", title: "Payout processed", body: "$1,204 deposited to your bank account ending in 4242.", time: "3 hours ago", read: false },
  { id: "4", type: "message", title: "New message from Maria Garcia", body: "Hi! Quick question about parking at the Downtown Loft…", time: "5 hours ago", read: true },
  { id: "5", type: "review", title: "New 5-star review", body: "Priya K. left a review for Ocean View Suite: \"Absolutely stunning views…\"", time: "Yesterday", read: true },
  { id: "6", type: "info", title: "AI Pricing updated rates", body: "Dynamic pricing adjusted 3 listings based on local demand spike this weekend.", time: "Yesterday", read: true },
  { id: "7", type: "booking", title: "Booking request pending", body: "Tom Williams requested Mountain Cabin · Feb 28–Mar 4. Respond within 24h.", time: "2 days ago", read: true },
  { id: "8", type: "info", title: "Tax report ready", body: "Your Q4 2025 tax summary is ready to download.", time: "3 days ago", read: true },
];

const iconMap: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  booking: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
  payment: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  message: { icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  review: { icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  alert: { icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  info: { icon: Info, color: "text-cyan-500", bg: "bg-cyan-500/10" },
};

const filters = ["All", "Unread", "Bookings", "Payments", "Messages", "Reviews"];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);
  const [filter, setFilter] = useState("All");

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  const filtered = notifs.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Bookings") return n.type === "booking";
    if (filter === "Payments") return n.type === "payment";
    if (filter === "Messages") return n.type === "message";
    if (filter === "Reviews") return n.type === "review";
    return true;
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted-foreground text-sm">
            <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
            No notifications here
          </div>
        ) : (
          filtered.map((n) => {
            const { icon: Icon, color, bg } = iconMap[n.type];
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${!n.read ? "bg-primary/[0.02]" : ""}`}
              >
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
