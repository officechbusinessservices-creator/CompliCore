"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "organizer" | "guest";
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "poll" | "itinerary";
  pollData?: {
    question: string;
    options: { id: string; text: string; votes: string[] }[];
  };
  itineraryData?: {
    title: string;
    date: string;
    time: string;
    location: string;
  };
}

interface TripGroup {
  id: string;
  name: string;
  tripName: string;
  dates: string;
  members: GroupMember[];
  messages: Message[];
  propertyName: string;
  propertyImage: string;
}

const currentUserId = "user-1";

const tripGroup: TripGroup = {
  id: "group-1",
  name: "Lake Tahoe Weekend",
  tripName: "Winter Cabin Getaway",
  dates: "Mar 15-18, 2026",
  propertyName: "Luxury Mountain Cabin",
  propertyImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
  members: [
    { id: "user-1", name: "You", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "organizer", isOnline: true },
    { id: "user-2", name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "guest", isOnline: true },
    { id: "user-3", name: "James W.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", role: "guest", isOnline: false },
    { id: "user-4", name: "Emily C.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "guest", isOnline: true },
    { id: "user-5", name: "Mike R.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "guest", isOnline: false },
  ],
  messages: [
    { id: "m1", senderId: "user-1", content: "Hey everyone! Super excited for our cabin trip! 🏔️", timestamp: new Date("2026-02-01T10:00:00"), type: "text" },
    { id: "m2", senderId: "user-2", content: "Can't wait! Should we plan any activities?", timestamp: new Date("2026-02-01T10:05:00"), type: "text" },
    { id: "m3", senderId: "user-3", content: "I'm down for skiing! The slopes should be perfect that weekend.", timestamp: new Date("2026-02-01T10:10:00"), type: "text" },
    { id: "m4", senderId: "user-1", content: "", timestamp: new Date("2026-02-01T10:15:00"), type: "poll", pollData: { question: "What should we do on Saturday?", options: [{ id: "o1", text: "Skiing", votes: ["user-1", "user-3"] }, { id: "o2", text: "Snowboarding", votes: ["user-2"] }, { id: "o3", text: "Hot springs", votes: ["user-4", "user-5"] }, { id: "o4", text: "Hiking", votes: [] }] } },
    { id: "m5", senderId: "user-4", content: "The hot springs sound amazing after a day in the snow!", timestamp: new Date("2026-02-01T10:20:00"), type: "text" },
    { id: "m6", senderId: "user-2", content: "", timestamp: new Date("2026-02-01T10:25:00"), type: "itinerary", itineraryData: { title: "Group Dinner", date: "Mar 15, 2026", time: "7:00 PM", location: "The Lodge Restaurant" } },
    { id: "m7", senderId: "user-5", content: "Perfect! I'll make the reservation for 6 people.", timestamp: new Date("2026-02-01T10:30:00"), type: "text" },
  ],
};

export default function GroupChatPage() {
  const [messages, setMessages] = useState<Message[]>(tripGroup.messages);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMember = (id: string) => tripGroup.members.find((m) => m.id === id);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const createPoll = () => {
    if (!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUserId,
      content: "",
      timestamp: new Date(),
      type: "poll",
      pollData: {
        question: pollQuestion,
        options: pollOptions.filter((o) => o.trim()).map((text, idx) => ({ id: `o${idx}`, text, votes: [] })),
      },
    };

    setMessages([...messages, message]);
    setShowPollModal(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  const votePoll = (messageId: string, optionId: string) => {
    setMessages(messages.map((m) => {
      if (m.id === messageId && m.pollData) {
        return {
          ...m,
          pollData: {
            ...m.pollData,
            options: m.pollData.options.map((o) => ({
              ...o,
              votes: o.id === optionId
                ? o.votes.includes(currentUserId) ? o.votes.filter((v) => v !== currentUserId) : [...o.votes, currentUserId]
                : o.votes.filter((v) => v !== currentUserId),
            })),
          },
        };
      }
      return m;
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm shrink-0 z-50">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/prototype" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <img src={tripGroup.propertyImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="font-semibold">{tripGroup.name}</h1>
              <p className="text-xs text-zinc-500">{tripGroup.members.length} members · {tripGroup.dates}</p>
            </div>
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {tripGroup.members.filter((m) => m.isOnline).length}
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Trip Info Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <img src={tripGroup.propertyImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <p className="text-sm text-emerald-100">Staying at</p>
                  <p className="font-semibold">{tripGroup.propertyName}</p>
                  <p className="text-sm text-emerald-100">{tripGroup.dates}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
                  View Property
                </button>
                <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
                  Share Itinerary
                </button>
              </div>
            </div>

            {/* Messages */}
            {messages.map((message) => {
              const sender = getMember(message.senderId);
              const isOwn = message.senderId === currentUserId;

              return (
                <div key={message.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    <img src={sender?.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
                  )}
                  <div className={`max-w-[75%] ${isOwn ? "items-end" : ""}`}>
                    {!isOwn && (
                      <p className="text-xs text-zinc-500 mb-1">{sender?.name}</p>
                    )}

                    {message.type === "text" && (
                      <div className={`px-4 py-2.5 rounded-2xl ${isOwn ? "bg-emerald-500 text-white rounded-br-md" : "bg-white dark:bg-zinc-800 rounded-bl-md"}`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    )}

                    {message.type === "poll" && message.pollData && (
                      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 min-w-[250px]">
                        <p className="font-medium mb-3">{message.pollData.question}</p>
                        <div className="space-y-2">
                          {message.pollData.options.map((option) => {
                            const totalVotes = message.pollData!.options.reduce((sum, o) => sum + o.votes.length, 0);
                            const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                            const hasVoted = option.votes.includes(currentUserId);

                            return (
                              <button
                                key={option.id}
                                onClick={() => votePoll(message.id, option.id)}
                                className={`w-full p-2 rounded-lg text-left text-sm relative overflow-hidden transition-colors ${hasVoted ? "bg-emerald-500/20 border-2 border-emerald-500" : "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600"}`}
                              >
                                <div className="absolute inset-0 bg-emerald-500/10" style={{ width: `${percentage}%` }} />
                                <div className="relative flex justify-between">
                                  <span>{option.text}</span>
                                  <span className="text-zinc-500">{option.votes.length}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          {message.pollData.options.reduce((sum, o) => sum + o.votes.length, 0)} votes
                        </p>
                      </div>
                    )}

                    {message.type === "itinerary" && message.itineraryData && (
                      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border-l-4 border-amber-500">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{message.itineraryData.title}</p>
                            <p className="text-sm text-zinc-500">{message.itineraryData.date} at {message.itineraryData.time}</p>
                            <p className="text-sm text-zinc-500">{message.itineraryData.location}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex gap-2">
              <button
                onClick={() => setShowPollModal(true)}
                className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Create Poll"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="p-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Trip Members</h3>
              <div className="space-y-3">
                {tripGroup.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${member.isOnline ? "bg-emerald-500" : "bg-zinc-400"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button className="w-full py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  Invite More Guests
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Poll Modal */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Create Poll</h3>
              <button onClick={() => setShowPollModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="What do you want to ask?"
                  className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-500 mb-1">Options</label>
                <div className="space-y-2">
                  {pollOptions.map((option, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...pollOptions];
                        newOptions[idx] = e.target.value;
                        setPollOptions(newOptions);
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  ))}
                </div>
                {pollOptions.length < 5 && (
                  <button
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    + Add option
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPollModal(false)}
                className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPoll}
                disabled={!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2}
                className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
