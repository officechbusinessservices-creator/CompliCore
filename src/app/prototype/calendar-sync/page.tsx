"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarSync } from "@/components/CalendarSync";
import { properties } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

const bookedDates = [
  { start: "2026-02-10", end: "2026-02-14", guestName: "John D." },
  { start: "2026-02-20", end: "2026-02-25", guestName: "Sarah M." },
  { start: "2026-03-05", end: "2026-03-10", guestName: "Alex J." },
  { start: "2026-03-15", end: "2026-03-18", guestName: "Maria G." },
];

export default function CalendarSyncPage() {
  const [calendarProperties, setCalendarProperties] = useState(properties.slice(0, 3));
  const [calendarBookings, setCalendarBookings] = useState(bookedDates);

  useEffect(() => {
    fetchModuleData<typeof properties>("/calendar/properties", properties.slice(0, 3)).then(setCalendarProperties);
    fetchModuleData<typeof bookedDates>("/calendar/bookings", bookedDates).then(setCalendarBookings);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Calendar Sync</h1>
              <p className="text-xs text-zinc-500">Connect external calendars</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Info Banner */}
        <div className="p-4 mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Keep your calendars in sync</p>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                Connect your Airbnb, VRBO, Booking.com, and Google calendars to automatically block dates and prevent double bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Property Calendars */}
        <div className="space-y-6">
          {calendarProperties.map((property) => (
            <CalendarSync
              key={property.id}
              propertyName={property.title}
              propertyId={property.id}
              bookedDates={calendarBookings}
            />
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-4">How Calendar Sync Works</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-500">1</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Export Your Calendar</h4>
              <p className="text-xs text-zinc-500">Download your booking calendar as an iCal file or add directly to Google Calendar.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-500">2</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Import External Calendars</h4>
              <p className="text-xs text-zinc-500">Paste iCal URLs from Airbnb, VRBO, or other platforms to import their bookings.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-500">3</span>
              </div>
              <h4 className="font-medium text-sm mb-1">Auto-Sync</h4>
              <p className="text-xs text-zinc-500">Calendars sync automatically every hour to keep all platforms up to date.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
