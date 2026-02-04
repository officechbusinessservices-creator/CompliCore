"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

interface Reservation {
  id: string;
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  guestAvatar: string;
  guestPhone: string;
  propertyName: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  status: "confirmed" | "pending" | "modified" | "cancelled";
  createdAt: Date;
  specialRequests?: string;
  modifications: Modification[];
}

interface Modification {
  id: string;
  type: "dates" | "guests" | "cancel";
  requestedAt: Date;
  status: "pending" | "approved" | "rejected";
  originalValue: string;
  newValue: string;
  priceDifference: number;
  reason?: string;
}

const mockReservations: Reservation[] = [
  {
    id: "res1",
    confirmationCode: "HX4K9M2",
    guestName: "Maria Garcia",
    guestEmail: "maria.garcia@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    guestPhone: "+1 (555) 123-4567",
    propertyName: "Modern Downtown Loft",
    propertyId: "1",
    checkIn: "2026-03-15",
    checkOut: "2026-03-18",
    guests: 2,
    nights: 3,
    basePrice: 525,
    cleaningFee: 75,
    serviceFee: 52,
    total: 652,
    status: "confirmed",
    createdAt: new Date("2026-02-10"),
    specialRequests: "Early check-in if possible",
    modifications: [],
  },
  {
    id: "res2",
    confirmationCode: "JK7L3P9",
    guestName: "Alex Johnson",
    guestEmail: "alex.j@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    guestPhone: "+1 (555) 234-5678",
    propertyName: "Cozy Beach Cottage",
    propertyId: "2",
    checkIn: "2026-04-10",
    checkOut: "2026-04-14",
    guests: 4,
    nights: 4,
    basePrice: 780,
    cleaningFee: 100,
    serviceFee: 78,
    total: 958,
    status: "pending",
    createdAt: new Date("2026-02-28"),
    modifications: [
      {
        id: "mod1",
        type: "dates",
        requestedAt: new Date("2026-03-01"),
        status: "pending",
        originalValue: "Apr 10-14, 2026",
        newValue: "Apr 12-16, 2026",
        priceDifference: 0,
        reason: "Flight changed",
      },
    ],
  },
  {
    id: "res3",
    confirmationCode: "MN5R2T8",
    guestName: "Sophie Chen",
    guestEmail: "sophie.c@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    guestPhone: "+1 (555) 345-6789",
    propertyName: "Modern Downtown Loft",
    propertyId: "1",
    checkIn: "2026-03-25",
    checkOut: "2026-03-28",
    guests: 2,
    nights: 3,
    basePrice: 525,
    cleaningFee: 75,
    serviceFee: 52,
    total: 652,
    status: "modified",
    createdAt: new Date("2026-02-15"),
    modifications: [
      {
        id: "mod2",
        type: "guests",
        requestedAt: new Date("2026-02-20"),
        status: "approved",
        originalValue: "2 guests",
        newValue: "3 guests",
        priceDifference: 45,
      },
    ],
  },
  {
    id: "res4",
    confirmationCode: "PQ9S4V1",
    guestName: "James Wilson",
    guestEmail: "j.wilson@email.com",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    guestPhone: "+1 (555) 456-7890",
    propertyName: "Mountain View Cabin",
    propertyId: "3",
    checkIn: "2026-04-05",
    checkOut: "2026-04-08",
    guests: 6,
    nights: 3,
    basePrice: 675,
    cleaningFee: 125,
    serviceFee: 67,
    total: 867,
    status: "cancelled",
    createdAt: new Date("2026-02-01"),
    modifications: [
      {
        id: "mod3",
        type: "cancel",
        requestedAt: new Date("2026-02-20"),
        status: "approved",
        originalValue: "Confirmed",
        newValue: "Cancelled",
        priceDifference: -607, // Refund amount
        reason: "Personal emergency",
      },
    ],
  },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [selectedReservation, setSelectedReservation] = useState<string | null>("res1");
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "modified" | "cancelled">("all");
  const [showModifyModal, setShowModifyModal] = useState<"dates" | "guests" | "cancel" | null>(null);
  const [modifyData, setModifyData] = useState({
    newCheckIn: "",
    newCheckOut: "",
    newGuests: 2,
    cancelReason: "",
  });

  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const currentReservation = reservations.find((r) => r.id === selectedReservation);

  useEffect(() => {
    apiGet<any>("/bookings")
      .then((data) => {
        if (Array.isArray(data)) {
          setReservations((prev) => prev.map((r) => ({ ...r, status: r.status }))); // keep demo shape
        }
      })
      .catch(() => null);
  }, []);

  const handleModification = (type: "dates" | "guests" | "cancel") => {
    if (!currentReservation) return;

    const newMod: Modification = {
      id: `mod-${Date.now()}`,
      type,
      requestedAt: new Date(),
      status: "pending",
      originalValue: type === "dates" ? `${currentReservation.checkIn} - ${currentReservation.checkOut}` :
                     type === "guests" ? `${currentReservation.guests} guests` : "Confirmed",
      newValue: type === "dates" ? `${modifyData.newCheckIn} - ${modifyData.newCheckOut}` :
                type === "guests" ? `${modifyData.newGuests} guests` : "Cancelled",
      priceDifference: type === "cancel" ? -Math.round(currentReservation.total * 0.7) : 0,
      reason: type === "cancel" ? modifyData.cancelReason : undefined,
    };

    setReservations((prev) =>
      prev.map((r) =>
        r.id === currentReservation.id
          ? { ...r, status: type === "cancel" ? "cancelled" as const : "modified" as const, modifications: [...r.modifications, newMod] }
          : r
      )
    );

    if (type === "cancel") {
      apiPost<any>(`/bookings/${currentReservation.id}/cancel`, { reason: modifyData.cancelReason }).catch(() => null);
    }
    setShowModifyModal(null);
    setModifyData({ newCheckIn: "", newCheckOut: "", newGuests: 2, cancelReason: "" });
  };

  const approveModification = (resId: string, modId: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId
          ? {
              ...r,
              modifications: r.modifications.map((m) =>
                m.id === modId ? { ...m, status: "approved" as const } : m
              ),
            }
          : r
      )
    );
  };

  const rejectModification = (resId: string, modId: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId
          ? {
              ...r,
              status: "confirmed",
              modifications: r.modifications.map((m) =>
                m.id === modId ? { ...m, status: "rejected" as const } : m
              ),
            }
          : r
      )
    );
  };

  const statusColors = {
    confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    modified: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
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
              <h1 className="font-semibold text-lg">Reservations</h1>
              <p className="text-xs text-zinc-500">Manage bookings and modifications</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "confirmed", "pending", "modified", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Reservation List */}
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <button
                key={reservation.id}
                onClick={() => setSelectedReservation(reservation.id)}
                className={`w-full p-4 text-left bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                  selectedReservation === reservation.id
                    ? "border-emerald-500 ring-1 ring-emerald-500/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={reservation.guestAvatar}
                    alt={reservation.guestName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{reservation.guestName}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColors[reservation.status]}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">{reservation.propertyName}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                      <span>{new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}</span>
                      <span>{reservation.nights} nights</span>
                      <span>{reservation.guests} guests</span>
                    </div>
                    <p className="text-sm font-semibold mt-2">${reservation.total}</p>

                    {reservation.modifications.some((m) => m.status === "pending") && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Modification pending
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Reservation Details */}
          {currentReservation ? (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit sticky top-24">
              {/* Guest Info */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={currentReservation.guestAvatar}
                  alt={currentReservation.guestName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{currentReservation.guestName}</h3>
                  <p className="text-sm text-zinc-500">{currentReservation.guestEmail}</p>
                  <p className="text-sm text-zinc-500">{currentReservation.guestPhone}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full border ${statusColors[currentReservation.status]}`}>
                  {currentReservation.status}
                </span>
              </div>

              {/* Booking Details */}
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Check-in</p>
                    <p className="font-medium">{new Date(currentReservation.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Check-out</p>
                    <p className="font-medium">{new Date(currentReservation.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Guests</p>
                    <p className="font-medium">{currentReservation.guests}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Confirmation</p>
                    <p className="font-medium">{currentReservation.confirmationCode}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">${Math.round(currentReservation.basePrice / currentReservation.nights)} x {currentReservation.nights} nights</span>
                    <span>${currentReservation.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cleaning fee</span>
                    <span>${currentReservation.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service fee</span>
                    <span>${currentReservation.serviceFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 font-semibold">
                    <span>Total</span>
                    <span>${currentReservation.total}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {currentReservation.specialRequests && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Special Requests</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    {currentReservation.specialRequests}
                  </p>
                </div>
              )}

              {/* Modifications History */}
              {currentReservation.modifications.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Modification History</h4>
                  <div className="space-y-3">
                    {currentReservation.modifications.map((mod) => (
                      <div key={mod.id} className={`p-3 rounded-lg border ${
                        mod.status === "pending" ? "border-amber-500/50 bg-amber-50 dark:bg-amber-900/10" :
                        mod.status === "approved" ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10" :
                        "border-rose-500/30 bg-rose-50 dark:bg-rose-900/10"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize">
                            {mod.type === "dates" ? "Date Change" : mod.type === "guests" ? "Guest Change" : "Cancellation"}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            mod.status === "pending" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                            mod.status === "approved" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                            "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                          }`}>
                            {mod.status}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {mod.originalValue} → {mod.newValue}
                        </p>
                        {mod.reason && (
                          <p className="text-xs text-zinc-500 mt-1">Reason: {mod.reason}</p>
                        )}
                        {mod.priceDifference !== 0 && (
                          <p className={`text-sm font-medium mt-2 ${mod.priceDifference > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {mod.priceDifference > 0 ? "+" : ""}{mod.priceDifference} price adjustment
                          </p>
                        )}

                        {mod.status === "pending" && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => approveModification(currentReservation.id, mod.id)}
                              className="flex-1 py-1.5 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectModification(currentReservation.id, mod.id)}
                              className="flex-1 py-1.5 text-sm bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {currentReservation.status !== "cancelled" && (
                <div className="space-y-3">
                  <h4 className="font-medium">Actions</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setModifyData((prev) => ({
                          ...prev,
                          newCheckIn: currentReservation.checkIn,
                          newCheckOut: currentReservation.checkOut,
                        }));
                        setShowModifyModal("dates");
                      }}
                      className="p-3 text-center text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Change Dates
                    </button>
                    <button
                      onClick={() => {
                        setModifyData((prev) => ({ ...prev, newGuests: currentReservation.guests }));
                        setShowModifyModal("guests");
                      }}
                      className="p-3 text-center text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Change Guests
                    </button>
                    <button
                      onClick={() => setShowModifyModal("cancel")}
                      className="p-3 text-center text-sm bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-500 mt-4 text-center">
                Booked {currentReservation.createdAt.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium">Select a reservation</p>
              <p className="text-sm">Click on a booking to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modify Modal */}
      {showModifyModal && currentReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {showModifyModal === "dates" ? "Change Dates" :
               showModifyModal === "guests" ? "Change Guests" :
               "Cancel Reservation"}
            </h3>

            {showModifyModal === "dates" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Check-in</label>
                  <input
                    type="date"
                    value={modifyData.newCheckIn}
                    onChange={(e) => setModifyData((prev) => ({ ...prev, newCheckIn: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Check-out</label>
                  <input
                    type="date"
                    value={modifyData.newCheckOut}
                    onChange={(e) => setModifyData((prev) => ({ ...prev, newCheckOut: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                  />
                </div>
              </div>
            )}

            {showModifyModal === "guests" && (
              <div>
                <label className="block text-sm font-medium mb-1">Number of Guests</label>
                <input
                  type="number"
                  value={modifyData.newGuests}
                  onChange={(e) => setModifyData((prev) => ({ ...prev, newGuests: Number(e.target.value) }))}
                  min={1}
                  max={10}
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                />
              </div>
            )}

            {showModifyModal === "cancel" && (
              <div>
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 mb-4">
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    Cancellation will refund ~70% (${Math.round(currentReservation.total * 0.7)}) based on your policy.
                  </p>
                </div>
                <label className="block text-sm font-medium mb-1">Reason for cancellation</label>
                <textarea
                  value={modifyData.cancelReason}
                  onChange={(e) => setModifyData((prev) => ({ ...prev, cancelReason: e.target.value }))}
                  placeholder="Enter reason..."
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModifyModal(null)}
                className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModification(showModifyModal)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                  showModifyModal === "cancel"
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {showModifyModal === "cancel" ? "Confirm Cancellation" : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
