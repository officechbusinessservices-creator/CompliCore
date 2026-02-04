"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Types
interface Conversation {
  id: string;
  guestName: string;
  guestAvatar: string;
  propertyName: string;
  propertyId: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  status: "active" | "booking" | "archived";
  checkIn?: Date;
  checkOut?: Date;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "booking" | "system";
  status: "sent" | "delivered" | "read";
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    guestName: "Maria Garcia",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    propertyName: "Modern Downtown Loft",
    propertyId: "1",
    lastMessage: "Thanks for the check-in instructions!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    status: "booking",
    checkIn: new Date("2026-03-15"),
    checkOut: new Date("2026-03-18"),
  },
  {
    id: "2",
    guestName: "Alex Johnson",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    propertyName: "Cozy Beach Cottage",
    propertyId: "2",
    lastMessage: "Is early check-in available?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 1,
    status: "active",
  },
  {
    id: "3",
    guestName: "Sophie Chen",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    propertyName: "Mountain View Cabin",
    propertyId: "3",
    lastMessage: "Great stay, thank you!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    status: "archived",
    checkIn: new Date("2026-02-01"),
    checkOut: new Date("2026-02-05"),
  },
  {
    id: "4",
    guestName: "James Wilson",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    propertyName: "Urban Studio Apartment",
    propertyId: "4",
    lastMessage: "Looking forward to our stay next month!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 0,
    status: "booking",
    checkIn: new Date("2026-04-10"),
    checkOut: new Date("2026-04-15"),
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", senderId: "guest", content: "Hi! I just booked your Modern Downtown Loft for March 15-18.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), type: "text", status: "read" },
    { id: "2", senderId: "host", content: "Welcome Maria! I'm excited to host you. Let me know if you have any questions about the property.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), type: "text", status: "read" },
    { id: "3", senderId: "system", content: "Booking confirmed for Mar 15-18, 2026. Total: $627.00", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), type: "booking", status: "read" },
    { id: "4", senderId: "guest", content: "That's great! Could you send me the check-in instructions?", timestamp: new Date(Date.now() - 1000 * 60 * 30), type: "text", status: "read" },
    { id: "5", senderId: "host", content: "Sure! Here are your check-in details:\n\n- Check-in time: 3:00 PM\n- Door code: Will be sent 24hrs before\n- Parking: Spot #42 in the garage\n- WiFi: Downtown_Loft / password123", timestamp: new Date(Date.now() - 1000 * 60 * 10), type: "text", status: "read" },
    { id: "6", senderId: "guest", content: "Thanks for the check-in instructions!", timestamp: new Date(Date.now() - 1000 * 60 * 5), type: "text", status: "delivered" },
    { id: "7", senderId: "guest", content: "One more question - is there a coffee maker in the kitchen?", timestamp: new Date(Date.now() - 1000 * 60 * 4), type: "text", status: "delivered" },
  ],
  "2": [
    { id: "1", senderId: "guest", content: "Hello! I'm interested in booking your beach cottage.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), type: "text", status: "read" },
    { id: "2", senderId: "host", content: "Hi Alex! The cottage is available. It's a wonderful spot right on the beach.", timestamp: new Date(Date.now() - 1000 * 60 * 60), type: "text", status: "read" },
    { id: "3", senderId: "guest", content: "Is early check-in available?", timestamp: new Date(Date.now() - 1000 * 60 * 30), type: "text", status: "delivered" },
  ],
};

// Quick reply templates
const quickReplies = [
  "Thanks for reaching out!",
  "Check-in is at 3:00 PM",
  "Check-out is at 11:00 AM",
  "I'll get back to you shortly",
  "The WiFi password is in the welcome guide",
  "Early check-in may be available, let me check",
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "booking" | "archived">("all");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  // Filter conversations
  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch = conv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || conv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Get current conversation
  const currentConversation = mockConversations.find((c) => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  // Send message
  const sendMessage = (content: string) => {
    if (!content.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: "host",
      content: content.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sent",
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMsg],
    }));
    setNewMessage("");
    setShowQuickReplies(false);
  };

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Messages</h1>
              <p className="text-xs text-zinc-500">Guest communications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {mockConversations.filter((c) => c.unreadCount > 0).length} unread
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Conversation List */}
        <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "active", "booking", "archived"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 text-left border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                  selectedConversation === conversation.id ? "bg-zinc-50 dark:bg-zinc-800/50" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <img
                      src={conversation.guestAvatar}
                      alt={conversation.guestName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{conversation.guestName}</span>
                      <span className="text-xs text-zinc-500 shrink-0">{formatRelativeTime(conversation.timestamp)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{conversation.propertyName}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                </div>
                {conversation.checkIn && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {conversation.checkIn.toLocaleDateString()} - {conversation.checkOut?.toLocaleDateString()}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentConversation.guestAvatar}
                    alt={currentConversation.guestName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold">{currentConversation.guestName}</h2>
                    <p className="text-xs text-zinc-500">
                      {currentConversation.propertyName}
                      {currentConversation.checkIn && (
                        <span className="ml-2">
                          {currentConversation.checkIn.toLocaleDateString()} - {currentConversation.checkOut?.toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <Link
                    href={`/prototype/property/${currentConversation.propertyId}`}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === "host" ? "justify-end" : message.senderId === "system" ? "justify-center" : "justify-start"}`}
                  >
                    {message.type === "system" || message.type === "booking" ? (
                      <div className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm max-w-md text-center">
                        <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {message.content}
                      </div>
                    ) : (
                      <div className={`max-w-md ${message.senderId === "host" ? "order-1" : ""}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.senderId === "host"
                              ? "bg-emerald-500 text-white rounded-br-md"
                              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-zinc-500 ${message.senderId === "host" ? "justify-end" : ""}`}>
                          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {message.senderId === "host" && (
                            <span>
                              {message.status === "read" ? (
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : message.status === "delivered" ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    className={`p-2 rounded-lg transition-colors ${
                      showQuickReplies
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(newMessage);
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <button
                    onClick={() => sendMessage(newMessage)}
                    disabled={!newMessage.trim()}
                    className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a message thread from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
