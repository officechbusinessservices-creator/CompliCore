"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, CheckCircle2, Clock, AlertCircle, X, Eye, MessageSquare } from "lucide-react";

const initialBookings = [
  { id: "BK-0042", guest: "Alex Johnson", property: "Ocean View Suite", checkIn: "Feb 20", checkOut: "Feb 24", nights: 4, total: 748, status: "confirmed" },
  { id: "BK-0041", guest: "Maria Garcia", property: "Downtown Loft", checkIn: "Feb 22", checkOut: "Feb 25", nights: 3, total: 561, status: "confirmed" },
  { id: "BK-0040", guest: "Tom Williams", property: "Mountain Cabin", checkIn: "Feb 28", checkOut: "Mar 4", nights: 4, total: 892, status: "pending" },
  { id: "BK-0039", guest: "Priya Kumar", property: "Ocean View Suite", checkIn: "Feb 10", checkOut: "Feb 14", nights: 4, total: 748, status: "completed" },
  { id: "BK-0038", guest: "James Lee", property: "City Studio", checkIn: "Feb 5", checkOut: "Feb 7", nights: 2, total: 196, status: "cancelled" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  confirmed: { label: "Confirmed", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-600", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-rose-500/10 text-rose-600", icon: X },
};

const filters = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

export default function BookingsPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function approve(id: string) {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "confirmed" } : b));
    showToast("Booking approved ✓");
  }

  function decline(id: string) {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
    showToast("Booking declined");
  }

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter.toLowerCase());

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-lg">
          <CheckCircle2 className="w-4 h-4" /><span className="text-sm">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{bookings.length} total · {bookings.filter((b) => b.status === "pending").length} pending approval</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent text-muted-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Booking</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Dates</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Total</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => {
                const sc = statusConfig[b.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium">{b.guest}</div>
                      <div className="text-xs text-muted-foreground font-mono">{b.id}</div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{b.property}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />{b.checkIn} → {b.checkOut}
                      </div>
                      <div className="text-xs text-muted-foreground">{b.nights} nights</div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">${b.total}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" />{sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => approve(b.id)} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 text-xs font-medium hover:bg-emerald-500/20 transition-colors">Approve</button>
                            <button onClick={() => decline(b.id)} className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 text-xs font-medium hover:bg-rose-500/20 transition-colors">Decline</button>
                          </>
                        )}
                        <Link href="/guest/booking" className="p-1.5 rounded-md hover:bg-accent transition-colors" title="View details">
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        </Link>
                        <Link href="/messaging" className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Message guest">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">No {filter.toLowerCase()} bookings</div>
        )}
      </div>
    </div>
  );
}
