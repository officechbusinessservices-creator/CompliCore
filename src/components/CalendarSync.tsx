"use client";

import { useState } from "react";

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

interface CalendarSyncProps {
  propertyName: string;
  propertyId: string;
  bookedDates: { start: string; end: string; guestName?: string }[];
  onClose?: () => void;
}

export function CalendarSync({ propertyName, propertyId, bookedDates, onClose }: CalendarSyncProps) {
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  // Generate iCal format
  const generateICalContent = (): string => {
    const events = bookedDates.map((booking) => {
      const start = new Date(booking.start);
      const end = new Date(booking.end);
      const uid = `${propertyId}-${start.getTime()}@rentalplatform.com`;

      return `BEGIN:VEVENT
UID:${uid}
DTSTART;VALUE=DATE:${formatDateForICal(start)}
DTEND;VALUE=DATE:${formatDateForICal(end)}
SUMMARY:Booking - ${booking.guestName || 'Guest'}
DESCRIPTION:Property: ${propertyName}
LOCATION:${propertyName}
STATUS:CONFIRMED
END:VEVENT`;
    }).join("\n");

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rental Platform//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${propertyName} - Bookings
${events}
END:VCALENDAR`;
  };

  const formatDateForICal = (date: Date): string => {
    return date.toISOString().split("T")[0].replace(/-/g, "");
  };

  // Download iCal file
  const downloadICalFile = () => {
    const content = generateICalContent();
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${propertyName.replace(/\s+/g, "-").toLowerCase()}-bookings.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate Google Calendar URL
  const openGoogleCalendar = () => {
    if (bookedDates.length === 0) return;

    const booking = bookedDates[0];
    const start = new Date(booking.start);
    const end = new Date(booking.end);

    const googleUrl = new URL("https://calendar.google.com/calendar/render");
    googleUrl.searchParams.set("action", "TEMPLATE");
    googleUrl.searchParams.set("text", `Booking - ${propertyName}`);
    googleUrl.searchParams.set("dates", `${formatDateForICal(start)}/${formatDateForICal(end)}`);
    googleUrl.searchParams.set("details", `Guest: ${booking.guestName || 'Guest'}\nProperty: ${propertyName}`);
    googleUrl.searchParams.set("location", propertyName);

    window.open(googleUrl.toString(), "_blank");
  };

  // Import calendar from URL
  const handleImport = async () => {
    if (!importUrl) return;

    setIsImporting(true);
    setSyncStatus("syncing");

    // Simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsImporting(false);
    setLastSynced(new Date());
    setSyncStatus("success");

    setTimeout(() => setSyncStatus("idle"), 3000);
  };

  // Sync now
  const syncNow = async () => {
    setSyncStatus("syncing");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastSynced(new Date());
    setSyncStatus("success");
    setTimeout(() => setSyncStatus("idle"), 3000);
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Calendar Sync</h3>
          <p className="text-sm text-zinc-500">{propertyName}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Export Options */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">Export Calendar</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={openGoogleCalendar}
            className="flex items-center justify-center gap-3 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div className="text-left">
              <p className="font-medium text-sm">Google Calendar</p>
              <p className="text-xs text-zinc-500">Add events to Google</p>
            </div>
          </button>

          <button
            onClick={downloadICalFile}
            className="flex items-center justify-center gap-3 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <p className="font-medium text-sm">iCal / Outlook</p>
              <p className="text-xs text-zinc-500">Download .ics file</p>
            </div>
          </button>
        </div>
      </div>

      {/* Import Options */}
      <div className="space-y-4 mb-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h4 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">Import External Calendar</h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Calendar URL (iCal format)</label>
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://calendar.google.com/calendar/ical/..."
              className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleImport}
              disabled={!importUrl || isImporting}
              className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {isImporting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Calendar
                </>
              )}
            </button>

            <button
              onClick={syncNow}
              disabled={!importUrl || syncStatus === "syncing"}
              className="px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {syncStatus === "syncing" ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {syncStatus === "success" ? (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Synced successfully</span>
              </>
            ) : syncStatus === "syncing" ? (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs text-amber-600 dark:text-amber-400">Syncing...</span>
              </>
            ) : syncStatus === "error" ? (
              <>
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <span className="text-xs text-rose-600 dark:text-rose-400">Sync failed</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                <span className="text-xs text-zinc-500">Not synced</span>
              </>
            )}
          </div>
          {lastSynced && (
            <span className="text-xs text-zinc-500">
              Last synced: {lastSynced.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm">Auto-sync every hour</span>
          </label>
        </div>
      </div>

      {/* Connected Calendars */}
      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <h4 className="font-medium text-sm text-zinc-600 dark:text-zinc-400 mb-3">Connected Calendars</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Airbnb Calendar</p>
                <p className="text-xs text-zinc-500">Connected via iCal</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">VRBO Calendar</p>
                <p className="text-xs text-zinc-500">Connected via iCal</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export a simple button to trigger calendar sync modal
export function CalendarSyncButton({
  onClick,
  className = ""
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Sync Calendar
    </button>
  );
}
