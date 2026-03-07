"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Search, Circle, Loader2, AlertCircle } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api-client";

interface ApiMessage {
  id: number;
  booking_id: number | null;
  sender: string;
  body: string;
  created_at: string;
}

interface BookingSummary {
  id: number;
  guest_name: string;
  property: string | null;
}

interface Thread {
  id: string;
  bookingId: number | null;
  guest: string;
  property: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  avatar: string;
}

type ChatMessage = { from: "guest" | "host"; text: string; time: string };

const EMPTY_MESSAGES: Record<string, ChatMessage[]> = {};

const quickReplies = [
  "Check-in is at 3:00 PM. I'll send the door code 1 hour before.",
  "Yes, free parking is included in your booking.",
  "The Wifi password is on the welcome card on the kitchen counter.",
  "Thank you for staying! Hope to host you again soon.",
];

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function formatRelativeTime(isoLike: string): string {
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatClock(isoLike: string): string {
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function normalizeMessagingData(apiMessages: ApiMessage[], bookings: BookingSummary[]) {
  const bookingById = new Map<number, BookingSummary>(bookings.map((b) => [b.id, b]));
  const grouped = new Map<string, ApiMessage[]>();

  for (const row of apiMessages) {
    const key = row.booking_id == null ? "unassigned" : String(row.booking_id);
    const list = grouped.get(key) || [];
    list.push(row);
    grouped.set(key, list);
  }

  const messagesByThread: Record<string, ChatMessage[]> = {};
  const threadBuilders: Array<{ thread: Thread; lastAt: number }> = [];

  for (const [threadId, rows] of grouped.entries()) {
    const sortedRows = [...rows].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    const last = sortedRows[sortedRows.length - 1];
    if (!last) continue;

    messagesByThread[threadId] = sortedRows.map((row) => ({
      from: row.sender === "host" ? "host" : "guest",
      text: row.body || "",
      time: formatClock(row.created_at),
    }));

    const bookingId = threadId === "unassigned" ? null : Number(threadId);
    const booking = bookingId != null ? bookingById.get(bookingId) : undefined;
    const guest = booking?.guest_name || (bookingId != null ? `Guest ${bookingId}` : "Guest");
    const property = booking?.property || (bookingId != null ? `Booking #${bookingId}` : "General");

    threadBuilders.push({
      thread: {
        id: threadId,
        bookingId,
        guest,
        property,
        lastMsg: last.body || "",
        time: formatRelativeTime(last.created_at),
        unread: last.sender !== "host",
        avatar: toInitials(guest),
      },
      lastAt: new Date(last.created_at).getTime(),
    });
  }

  threadBuilders.sort((a, b) => b.lastAt - a.lastAt);
  const threads = threadBuilders.map((item) => item.thread);
  return { threads, messagesByThread };
}

export default function MessagingPage() {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(EMPTY_MESSAGES);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(
    async (showLoading = true) => {
      if (!token) return;
      if (showLoading) setLoading(true);
      setError(null);

      try {
        const [apiMessages, bookings] = await Promise.all([
          apiFetch<ApiMessage[]>("/messages", { token }),
          apiFetch<BookingSummary[]>("/bookings", { token }).catch(() => []),
        ]);
        const { threads: normalizedThreads, messagesByThread } = normalizeMessagingData(apiMessages, bookings);
        setThreads(normalizedThreads);
        setMessages(messagesByThread);
        setSelected((prev) =>
          prev && normalizedThreads.some((t) => t.id === prev) ? prev : normalizedThreads[0]?.id || "",
        );
      } catch (err) {
        setThreads([]);
        setMessages(EMPTY_MESSAGES);
        setError(err instanceof ApiError ? err.message : "Failed to load messages");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    void loadMessages(true);
  }, [token, loadMessages]);

  const filteredThreads = useMemo(
    () =>
      threads.filter(
        (t) =>
          t.guest.toLowerCase().includes(search.toLowerCase()) ||
          t.property.toLowerCase().includes(search.toLowerCase()),
      ),
    [threads, search],
  );

  const selectedThread = threads.find((t) => t.id === selected);
  const selectedMessages = selected ? messages[selected] || [] : [];

  async function send(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;

    if (!selectedThread?.bookingId) {
      setError("Cannot send message without a booking context");
      return;
    }

    setSending(true);
    setError(null);
    try {
      await apiFetch<ApiMessage>("/messages", {
        method: "POST",
        token,
        body: JSON.stringify({
          booking_id: selectedThread.bookingId,
          sender: "host",
          body: msg,
        }),
      });
      setInput("");
      await loadMessages(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl border border-border bg-card overflow-hidden">
      {/* Thread list */}
      <div className="w-72 flex-shrink-0 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests…"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {loading && (
            <div className="px-4 py-6 text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading conversations...
            </div>
          )}
          {!loading && filteredThreads.length === 0 && (
            <div className="px-4 py-6 text-xs text-muted-foreground">No conversations found.</div>
          )}
          {filteredThreads.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`w-full text-left px-4 py-3.5 hover:bg-accent transition-colors ${selected === t.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-semibold truncate ${t.unread ? "text-foreground" : "text-muted-foreground"}`}>{t.guest}</span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{t.time}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{t.property}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {t.unread ? <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" /> : null}
                    <span className={`text-xs truncate ${t.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>{t.lastMsg}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {selectedThread?.avatar || "?"}
          </div>
          <div>
            <div className="font-semibold text-sm">{selectedThread?.guest || "Select a conversation"}</div>
            <div className="text-xs text-muted-foreground">{selectedThread?.property || "No thread selected"}</div>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-3 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {!loading && selectedMessages.length === 0 && (
            <div className="text-xs text-muted-foreground">No messages in this thread yet.</div>
          )}
          {selectedMessages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "host" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-sm ${
                m.from === "host"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "host" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="px-5 py-2 flex gap-2 overflow-x-auto border-t border-border">
          {quickReplies.map((r) => (
            <button
              key={r}
              onClick={() => send(r)}
              disabled={sending || !selectedThread}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {r.slice(0, 30)}…
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t border-border flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            disabled={sending || !selectedThread}
            className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || sending || !selectedThread}
            className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
