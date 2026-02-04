"use client";

import { useState, useMemo } from "react";

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  status: "available" | "blocked" | "booked";
  price?: number;
  bookingId?: string;
}

interface CalendarProps {
  propertyId?: string;
  basePrice?: number;
  onDateSelect?: (date: Date, status: string) => void;
  onDateRangeSelect?: (start: Date, end: Date) => void;
  bookedDates?: { start: string; end: string; guestName?: string }[];
  blockedDates?: string[];
  className?: string;
}

export function PropertyCalendar({
  propertyId,
  basePrice = 150,
  onDateSelect,
  onDateRangeSelect,
  bookedDates = [],
  blockedDates = [],
  className = "",
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        date: new Date(year, month - 1, day),
        day,
        isCurrentMonth: false,
        isToday: false,
        status: "available",
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().split("T")[0];
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Check if date is booked
      const isBooked = bookedDates.some((booking) => {
        const start = new Date(booking.start);
        const end = new Date(booking.end);
        return dateObj >= start && dateObj < end;
      });

      // Check if date is blocked
      const isBlocked = blockedDates.includes(dateStr);

      // Random price variation for demo
      const priceVariation = Math.floor(Math.random() * 40) - 20;

      days.push({
        date: dateObj,
        day,
        isCurrentMonth: true,
        isToday,
        status: isBooked ? "booked" : isBlocked ? "blocked" : "available",
        price: basePrice + priceVariation,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        day,
        isCurrentMonth: false,
        isToday: false,
        status: "available",
      });
    }

    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate, bookedDates, blockedDates, basePrice]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;

    if (!isSelecting) {
      setSelectedRange({ start: day.date, end: null });
      setIsSelecting(true);
    } else {
      if (selectedRange.start && day.date >= selectedRange.start) {
        setSelectedRange({ ...selectedRange, end: day.date });
        setIsSelecting(false);
        if (onDateRangeSelect && selectedRange.start) {
          onDateRangeSelect(selectedRange.start, day.date);
        }
      } else {
        setSelectedRange({ start: day.date, end: null });
      }
    }

    if (onDateSelect) {
      onDateSelect(day.date, day.status);
    }
  };

  const isInRange = (date: Date) => {
    if (!selectedRange.start) return false;
    if (!selectedRange.end) return false;
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const isRangeStart = (date: Date) => {
    return selectedRange.start?.toDateString() === date.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    return selectedRange.end?.toDateString() === date.toDateString();
  };

  // Stats
  const stats = useMemo(() => {
    const monthDays = days.filter((d) => d.isCurrentMonth);
    const available = monthDays.filter((d) => d.status === "available").length;
    const booked = monthDays.filter((d) => d.status === "booked").length;
    const blocked = monthDays.filter((d) => d.status === "blocked").length;
    const occupancyRate = Math.round((booked / monthDays.length) * 100);
    const avgPrice = Math.round(
      monthDays.reduce((sum, d) => sum + (d.price || 0), 0) / monthDays.length
    );

    return { available, booked, blocked, occupancyRate, avgPrice };
  }, [days]);

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{stats.available}</p>
            <p className="text-xs text-zinc-500">Available</p>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.booked}</p>
            <p className="text-xs text-zinc-500">Booked</p>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">{stats.blocked}</p>
            <p className="text-xs text-zinc-500">Blocked</p>
          </div>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">{stats.occupancyRate}%</p>
            <p className="text-xs text-zinc-500">Occupancy</p>
          </div>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
        {dayNames.map((name) => (
          <div
            key={name}
            className="p-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const inRange = isInRange(day.date);
          const isStart = isRangeStart(day.date);
          const isEnd = isRangeEnd(day.date);

          return (
            <button
              key={`${day.date.toISOString()}-${idx}`}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={!day.isCurrentMonth}
              className={`
                relative p-2 min-h-[70px] border-b border-r border-zinc-100 dark:border-zinc-800
                transition-colors text-left
                ${!day.isCurrentMonth ? "bg-zinc-50 dark:bg-zinc-950 opacity-40" : ""}
                ${day.isToday ? "bg-emerald-50 dark:bg-emerald-950/30" : ""}
                ${inRange ? "bg-emerald-100 dark:bg-emerald-900/30" : ""}
                ${isStart || isEnd ? "bg-emerald-200 dark:bg-emerald-800/50" : ""}
                ${day.status === "booked" && day.isCurrentMonth ? "bg-blue-50 dark:bg-blue-950/30" : ""}
                ${day.status === "blocked" && day.isCurrentMonth ? "bg-zinc-100 dark:bg-zinc-800/50" : ""}
                ${day.isCurrentMonth ? "hover:bg-zinc-100 dark:hover:bg-zinc-800" : "cursor-default"}
              `}
            >
              <span
                className={`
                  text-sm font-medium
                  ${day.isToday ? "text-emerald-600 dark:text-emerald-400" : ""}
                  ${!day.isCurrentMonth ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-900 dark:text-zinc-100"}
                `}
              >
                {day.day}
              </span>

              {day.isCurrentMonth && (
                <>
                  {/* Price */}
                  {day.status === "available" && day.price && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      ${day.price}
                    </p>
                  )}

                  {/* Status indicator */}
                  {day.status === "booked" && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-xs px-1 py-0.5 bg-blue-500 text-white rounded truncate">
                        Booked
                      </div>
                    </div>
                  )}
                  {day.status === "blocked" && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-xs px-1 py-0.5 bg-zinc-400 text-white rounded truncate">
                        Blocked
                      </div>
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-zinc-600 dark:text-zinc-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-zinc-600 dark:text-zinc-400">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-zinc-400" />
          <span className="text-zinc-600 dark:text-zinc-400">Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-emerald-500" />
          <span className="text-zinc-600 dark:text-zinc-400">Today</span>
        </div>
      </div>
    </div>
  );
}
