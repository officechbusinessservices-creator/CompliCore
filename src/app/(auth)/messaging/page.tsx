"use client";

import { useState } from "react";
import { Send, Search, CheckCircle2, Circle } from "lucide-react";

const threads = [
  { id: "1", guest: "Alex Johnson", property: "Ocean View Suite", lastMsg: "What time is check-in?", time: "2m ago", unread: true, avatar: "AJ" },
  { id: "2", guest: "Maria Garcia", property: "Downtown Loft", lastMsg: "Thanks for the quick reply!", time: "1h ago", unread: false, avatar: "MG" },
  { id: "3", guest: "Tom Williams", property: "Mountain Cabin", lastMsg: "Is parking included?", time: "3h ago", unread: true, avatar: "TW" },
  { id: "4", guest: "Priya Kumar", property: "Ocean View Suite", lastMsg: "Loved the stay, 5 stars!", time: "Yesterday", unread: false, avatar: "PK" },
];

const initialMessages: Record<string, { from: "guest" | "host"; text: string; time: string }[]> = {
  "1": [
    { from: "guest", text: "Hi! Quick question — what time is check-in?", time: "10:02 AM" },
    { from: "host", text: "Hi Alex! Check-in is from 3:00 PM. I'll send the smart lock code 1 hour before. Let me know if you need anything!", time: "10:05 AM" },
    { from: "guest", text: "What time is check-in?", time: "10:08 AM" },
  ],
  "2": [
    { from: "guest", text: "Is the parking spot included with the booking?", time: "9:00 AM" },
    { from: "host", text: "Yes! One dedicated parking spot is included. It's in the underground garage, spot B-12.", time: "9:15 AM" },
    { from: "guest", text: "Thanks for the quick reply!", time: "9:16 AM" },
  ],
  "3": [
    { from: "guest", text: "Is parking included?", time: "7:30 AM" },
  ],
  "4": [
    { from: "guest", text: "Loved the stay, 5 stars!", time: "Yesterday" },
    { from: "host", text: "Thank you so much Priya! It was a pleasure hosting you. Hope to see you again! 🌊", time: "Yesterday" },
  ],
};

const quickReplies = [
  "Check-in is at 3:00 PM. I'll send the door code 1 hour before.",
  "Yes, free parking is included in your booking.",
  "The Wifi password is on the welcome card on the kitchen counter.",
  "Thank you for staying! Hope to host you again soon.",
];

export default function MessagingPage() {
  const [selected, setSelected] = useState("1");
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredThreads = threads.filter((t) =>
    t.guest.toLowerCase().includes(search.toLowerCase()) ||
    t.property.toLowerCase().includes(search.toLowerCase())
  );

  function send(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] || []), { from: "host", text: msg, time: "Just now" }],
    }));
    setInput("");
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
            {threads.find((t) => t.id === selected)?.avatar}
          </div>
          <div>
            <div className="font-semibold text-sm">{threads.find((t) => t.id === selected)?.guest}</div>
            <div className="text-xs text-muted-foreground">{threads.find((t) => t.id === selected)?.property}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {(messages[selected] || []).map((m, i) => (
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
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
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
            className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
