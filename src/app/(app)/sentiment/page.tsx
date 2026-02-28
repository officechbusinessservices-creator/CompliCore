"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  guestName: string;
  guestAvatar: string;
  content: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  topics: string[];
  suggestedResponse?: string;
  urgency: "low" | "medium" | "high";
}

interface ConversationStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  avgResponseTime: string;
  satisfactionTrend: "up" | "down" | "stable";
}

const messages: Message[] = [
  {
    id: "m1",
    guestName: "Alex Johnson",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    content: "The apartment was absolutely amazing! Everything was spotless and the location couldn't be better. We'll definitely be back!",
    timestamp: "2026-02-03T14:30:00",
    sentiment: "positive",
    sentimentScore: 95,
    topics: ["Cleanliness", "Location", "Return Intent"],
    urgency: "low",
  },
  {
    id: "m2",
    guestName: "Maria Garcia",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    content: "Hi, we're having trouble with the WiFi. It keeps disconnecting and we need it for work. Can someone help us fix this?",
    timestamp: "2026-02-03T10:15:00",
    sentiment: "negative",
    sentimentScore: 35,
    topics: ["WiFi Issue", "Work Need", "Help Request"],
    suggestedResponse: "I'm so sorry about the WiFi issues! Let me help you right away. First, try restarting the router (unplug for 30 seconds). If that doesn't work, I can send our maintenance person within the hour. Would that work for you?",
    urgency: "high",
  },
  {
    id: "m3",
    guestName: "James Wilson",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    content: "What time is check-out? I couldn't find it in the listing details.",
    timestamp: "2026-02-02T18:45:00",
    sentiment: "neutral",
    sentimentScore: 50,
    topics: ["Check-out Time", "Information Request"],
    suggestedResponse: "Check-out is at 11 AM. If you need a late check-out, just let me know and I'll see what I can arrange based on our next guest's arrival time!",
    urgency: "medium",
  },
  {
    id: "m4",
    guestName: "Emily Chen",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    content: "The heater doesn't seem to be working properly. It's quite cold in here and we're uncomfortable. This needs to be fixed ASAP.",
    timestamp: "2026-02-02T21:30:00",
    sentiment: "negative",
    sentimentScore: 20,
    topics: ["Heating Issue", "Comfort", "Urgent"],
    suggestedResponse: "I'm truly sorry about the heating issue - I understand how uncomfortable that must be! I'm dispatching our HVAC technician immediately. In the meantime, there are extra blankets in the bedroom closet. ETA for repair is within 2 hours.",
    urgency: "high",
  },
  {
    id: "m5",
    guestName: "Sophie Martin",
    guestAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    content: "Thanks for the restaurant recommendations! We tried the Italian place and it was fantastic.",
    timestamp: "2026-02-01T20:00:00",
    sentiment: "positive",
    sentimentScore: 88,
    topics: ["Recommendations", "Gratitude", "Dining"],
    urgency: "low",
  },
  {
    id: "m6",
    guestName: "Hans Mueller",
    guestAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    content: "The place is nice but the street noise at night is a bit loud. Otherwise everything is fine.",
    timestamp: "2026-02-01T09:15:00",
    sentiment: "neutral",
    sentimentScore: 55,
    topics: ["Noise", "Mixed Feedback"],
    suggestedResponse: "Thank you for the feedback! I'm sorry about the street noise - we have earplugs in the nightstand drawer if that helps. We're also looking into soundproofing options for future guests.",
    urgency: "low",
  },
];

const stats: ConversationStats = {
  total: 47,
  positive: 32,
  neutral: 10,
  negative: 5,
  avgResponseTime: "12 min",
  satisfactionTrend: "up",
};

const sentimentColors = {
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  neutral: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  negative: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const urgencyColors = {
  low: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
  medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  high: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
};

export default function SentimentPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "analytics" | "settings">("inbox");
  const [filterSentiment, setFilterSentiment] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = filterSentiment === "all"
    ? messages
    : messages.filter((m) => m.sentiment === filterSentiment);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg flex items-center gap-2">
                Sentiment Analysis
                <span className="px-2 py-0.5 text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full border border-violet-500/20">
                  AI Powered
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Understand guest communication</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Messages</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-600">Positive</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.positive}</p>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-500">Neutral</p>
            <p className="text-2xl font-bold">{stats.neutral}</p>
          </div>
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
            <p className="text-sm text-rose-600">Negative</p>
            <p className="text-2xl font-bold text-rose-600">{stats.negative}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Avg Response</p>
            <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Satisfaction</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +8%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["inbox", "analytics", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "inbox" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filter */}
              <div className="flex gap-2">
                {(["all", "positive", "neutral", "negative"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterSentiment(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                      filterSentiment === filter
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border p-4 cursor-pointer transition-all ${
                    selectedMessage?.id === message.id
                      ? "border-violet-500 ring-2 ring-violet-500/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img src={message.guestAvatar} alt={message.guestName} className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{message.guestName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs capitalize border ${sentimentColors[message.sentiment]}`}>
                            {message.sentiment}
                          </span>
                          {message.urgency === "high" && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${urgencyColors[message.urgency]}`}>
                              Urgent
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{message.content}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.topics.map((topic) => (
                          <span key={topic} className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 h-fit sticky top-24">
              {selectedMessage ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={selectedMessage.guestAvatar} alt="" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{selectedMessage.guestName}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Sentiment Meter */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-500">Sentiment Score</span>
                      <span className={`font-semibold ${
                        selectedMessage.sentimentScore >= 70 ? "text-emerald-600" :
                        selectedMessage.sentimentScore >= 40 ? "text-amber-600" : "text-rose-600"
                      }`}>
                        {selectedMessage.sentimentScore}/100
                      </span>
                    </div>
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          selectedMessage.sentimentScore >= 70 ? "bg-emerald-500" :
                          selectedMessage.sentimentScore >= 40 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${selectedMessage.sentimentScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-zinc-500 mb-2">Message</p>
                    <p className="text-sm bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                      {selectedMessage.content}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-zinc-500 mb-2">Detected Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.topics.map((topic) => (
                        <span key={topic} className="px-3 py-1 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedMessage.suggestedResponse && (
                    <div className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-xl border border-violet-200 dark:border-violet-800">
                      <p className="text-xs text-violet-600 dark:text-violet-400 mb-2 font-medium">AI Suggested Response</p>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedMessage.suggestedResponse}</p>
                      <button className="mt-3 w-full py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                        Use This Response
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>Select a message to analyze</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Sentiment Distribution</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#e4e4e7" strokeWidth="24" className="dark:stroke-zinc-800" />
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#10b981" strokeWidth="24" strokeDasharray={`${(stats.positive / stats.total) * 502} 502`} />
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#71717a" strokeWidth="24" strokeDasharray={`${(stats.neutral / stats.total) * 502} 502`} strokeDashoffset={`-${(stats.positive / stats.total) * 502}`} />
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#f43f5e" strokeWidth="24" strokeDasharray={`${(stats.negative / stats.total) * 502} 502`} strokeDashoffset={`-${((stats.positive + stats.neutral) / stats.total) * 502}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-3xl font-bold">{Math.round((stats.positive / stats.total) * 100)}%</p>
                    <p className="text-sm text-zinc-500">Positive</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-sm">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-zinc-400 rounded-full" />
                  <span className="text-sm">Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full" />
                  <span className="text-sm">Negative</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Common Topics</h3>
              <div className="space-y-3">
                {[
                  { topic: "Cleanliness", count: 18, sentiment: "positive" },
                  { topic: "Location", count: 15, sentiment: "positive" },
                  { topic: "Check-in/out", count: 12, sentiment: "neutral" },
                  { topic: "Amenities", count: 9, sentiment: "positive" },
                  { topic: "WiFi", count: 7, sentiment: "negative" },
                  { topic: "Noise", count: 5, sentiment: "negative" },
                ].map((item) => (
                  <div key={item.topic} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.sentiment === "positive" ? "bg-emerald-500" :
                      item.sentiment === "negative" ? "bg-rose-500" : "bg-zinc-400"
                    }`} />
                    <span className="flex-1 text-sm">{item.topic}</span>
                    <span className="text-sm text-zinc-500">{item.count} mentions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">AI Response Settings</h3>
              <div className="space-y-4">
                {[
                  { label: "Generate AI response suggestions", enabled: true },
                  { label: "Auto-detect urgent messages", enabled: true },
                  { label: "Categorize messages by topic", enabled: true },
                  { label: "Send daily sentiment report", enabled: false },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm">{setting.label}</span>
                    <div className={`w-10 h-6 rounded-full relative cursor-pointer ${setting.enabled ? "bg-violet-600" : "bg-zinc-300 dark:bg-zinc-700"}`}>
                      <span className={`absolute top-0.5 ${setting.enabled ? "right-0.5" : "left-0.5"} w-5 h-5 bg-white rounded-full shadow transition-all`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
