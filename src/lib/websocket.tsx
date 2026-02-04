"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type NotificationType = "booking" | "message" | "review" | "payout" | "alert";

export interface RealtimeNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, unknown>;
}

interface WebSocketContextType {
  connected: boolean;
  notifications: RealtimeNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Simulated notification templates
const notificationTemplates: Omit<RealtimeNotification, "id" | "timestamp" | "read">[] = [
  {
    type: "booking",
    title: "New Booking Request",
    message: "John D. wants to book Modern Downtown Loft for Mar 15-18",
    data: { propertyId: "prop-1", guestName: "John D." },
  },
  {
    type: "booking",
    title: "Booking Confirmed",
    message: "Sarah M. confirmed their stay at Beachfront Cottage",
    data: { propertyId: "prop-2", guestName: "Sarah M." },
  },
  {
    type: "message",
    title: "New Message",
    message: "Alex J.: 'What time is check-in available?'",
    data: { guestId: "guest-1", guestName: "Alex J." },
  },
  {
    type: "review",
    title: "New Review Received",
    message: "Maria G. left a 5-star review for Mountain Cabin",
    data: { propertyId: "prop-3", rating: 5 },
  },
  {
    type: "payout",
    title: "Payout Processed",
    message: "$1,250.00 has been transferred to your account",
    data: { amount: 1250 },
  },
  {
    type: "alert",
    title: "Price Alert",
    message: "High demand detected! Consider raising prices 15%",
    data: { suggestion: "raise_price", percentage: 15 },
  },
  {
    type: "booking",
    title: "Upcoming Check-in",
    message: "Emily C. checks in tomorrow at 3:00 PM",
    data: { guestName: "Emily C.", time: "15:00" },
  },
  {
    type: "message",
    title: "Guest Question",
    message: "James W.: 'Is parking available nearby?'",
    data: { guestId: "guest-2", guestName: "James W." },
  },
];

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  // Simulate WebSocket connection
  useEffect(() => {
    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setConnected(true);
    }, 1000);

    return () => clearTimeout(connectTimeout);
  }, []);

  // Simulate receiving notifications
  useEffect(() => {
    if (!connected) return;

    // Add initial notifications
    const initialNotifications: RealtimeNotification[] = [
      {
        id: `notif-${Date.now()}-1`,
        type: "booking",
        title: "New Booking Request",
        message: "Alex J. wants to book Modern Downtown Loft",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: `notif-${Date.now()}-2`,
        type: "message",
        title: "New Message",
        message: "Sarah M.: 'Thanks for the quick response!'",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
    ];
    setNotifications(initialNotifications);

    // Simulate random incoming notifications
    const interval = setInterval(() => {
      const shouldSend = Math.random() > 0.7; // 30% chance every interval
      if (shouldSend) {
        const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
        const newNotification: RealtimeNotification = {
          ...template,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [connected]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

// Real-time notification bell component
export function RealtimeNotificationBell({ className = "" }: { className?: string }) {
  const { connected, notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);

  const typeIcons: Record<NotificationType, string> = {
    booking: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    message: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    review: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    payout: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    alert: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  };

  const typeColors: Record<NotificationType, string> = {
    booking: "bg-emerald-500/10 text-emerald-500",
    message: "bg-blue-500/10 text-blue-500",
    review: "bg-amber-500/10 text-amber-500",
    payout: "bg-violet-500/10 text-violet-500",
    alert: "bg-rose-500/10 text-rose-500",
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white rounded-full px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {connected && (
          <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Notifications</h3>
                {connected && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                      !notification.read ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${typeColors[notification.type]}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcons[notification.type]} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${!notification.read ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400"}`}>
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors shrink-0"
                          >
                            <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-zinc-500 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-zinc-400 mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
