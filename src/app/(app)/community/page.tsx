"use client";

import { useState } from "react";
import Link from "next/link";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
  isSolved?: boolean;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  views: number;
  helpful: number;
}

const categories = [
  { id: "getting-started", name: "Getting Started", icon: "M13 10V3L4 14h7v7l9-11h-7z", count: 24 },
  { id: "pricing", name: "Pricing Strategies", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", count: 18 },
  { id: "guest-management", name: "Guest Management", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", count: 31 },
  { id: "legal", name: "Legal & Compliance", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", count: 15 },
  { id: "marketing", name: "Marketing & SEO", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", count: 22 },
  { id: "automation", name: "Automation Tips", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", count: 19 },
];

const forumPosts: ForumPost[] = [
  { id: "p1", title: "Best practices for handling last-minute cancellations", author: "Sarah Host", authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", category: "Guest Management", replies: 24, views: 1250, lastActivity: "2 hours ago", isPinned: true },
  { id: "p2", title: "How I increased my occupancy by 40% using dynamic pricing", author: "Mike Manager", authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", category: "Pricing Strategies", replies: 56, views: 3420, lastActivity: "5 hours ago", isSolved: true },
  { id: "p3", title: "Understanding new short-term rental regulations in California", author: "Legal Eagle", authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", category: "Legal & Compliance", replies: 18, views: 890, lastActivity: "1 day ago", isPinned: true },
  { id: "p4", title: "Tips for creating stunning listing photos on a budget", author: "Photo Pro", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", category: "Marketing & SEO", replies: 42, views: 2100, lastActivity: "1 day ago" },
  { id: "p5", title: "Automating guest messages - my complete workflow", author: "Tech Host", authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", category: "Automation Tips", replies: 31, views: 1680, lastActivity: "2 days ago", isSolved: true },
  { id: "p6", title: "First time hosting - what should I know?", author: "New Host", authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", category: "Getting Started", replies: 15, views: 450, lastActivity: "3 days ago" },
];

const knowledgeArticles: KnowledgeArticle[] = [
  { id: "a1", title: "Complete Guide to Setting Up Your First Listing", category: "Getting Started", readTime: "12 min", views: 15420, helpful: 98 },
  { id: "a2", title: "Dynamic Pricing: A Comprehensive Strategy Guide", category: "Pricing Strategies", readTime: "18 min", views: 8930, helpful: 95 },
  { id: "a3", title: "Guest Communication Templates That Work", category: "Guest Management", readTime: "8 min", views: 12100, helpful: 97 },
  { id: "a4", title: "Understanding Tax Obligations for Hosts", category: "Legal & Compliance", readTime: "15 min", views: 6540, helpful: 92 },
  { id: "a5", title: "SEO Tips for Your Listing Title and Description", category: "Marketing & SEO", readTime: "10 min", views: 7820, helpful: 94 },
  { id: "a6", title: "Setting Up Automated Messaging Workflows", category: "Automation Tips", readTime: "14 min", views: 5670, helpful: 96 },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"forum" | "knowledge" | "events">("forum");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <h1 className="font-semibold text-lg">Host Community</h1>
              <p className="text-xs text-zinc-500">Forum & Knowledge Base</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
            New Post
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions and articles..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["forum", "knowledge", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "knowledge" ? "Knowledge Base" : tab}
            </button>
          ))}
        </div>

        {activeTab === "forum" && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-sm transition-colors ${
                      !selectedCategory ? "bg-emerald-500/10 text-emerald-600" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>All Topics</span>
                    <span className="text-zinc-400">{forumPosts.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-sm transition-colors ${
                        selectedCategory === cat.name ? "bg-emerald-500/10 text-emerald-600" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                        </svg>
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-zinc-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="lg:col-span-3 space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className={`bg-white dark:bg-zinc-900 rounded-xl border p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer ${
                  post.isPinned ? "border-emerald-500/50" : "border-zinc-200 dark:border-zinc-800"
                }`}>
                  <div className="flex items-start gap-4">
                    <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.isPinned && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-xs rounded-full">Pinned</span>
                        )}
                        {post.isSolved && (
                          <span className="px-2 py-0.5 bg-violet-500/10 text-violet-600 text-xs rounded-full">Solved</span>
                        )}
                        <span className="text-xs text-zinc-500">{post.category}</span>
                      </div>
                      <h3 className="font-medium mb-1 line-clamp-1">{post.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>by {post.author}</span>
                        <span>{post.replies} replies</span>
                        <span>{post.views} views</span>
                        <span>{post.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgeArticles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
                <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">{article.category}</span>
                <h3 className="font-semibold mt-3 mb-2">{article.title}</h3>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{article.readTime} read</span>
                  <span>{article.views.toLocaleString()} views</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {article.helpful}% found helpful
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-4">
            {[
              { title: "Monthly Host Meetup - Virtual", date: "Feb 15, 2026", time: "7:00 PM EST", attendees: 45, type: "Virtual" },
              { title: "Pricing Masterclass with Expert Hosts", date: "Feb 22, 2026", time: "2:00 PM EST", attendees: 128, type: "Webinar" },
              { title: "New Host Welcome Session", date: "Mar 1, 2026", time: "10:00 AM EST", attendees: 32, type: "Virtual" },
              { title: "Spring Hosting Conference 2026", date: "Mar 15-17, 2026", time: "All Day", attendees: 500, type: "In-Person" },
            ].map((event, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.type === "Virtual" ? "bg-blue-500/10 text-blue-600" :
                      event.type === "Webinar" ? "bg-violet-500/10 text-violet-600" :
                      "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {event.type}
                    </span>
                    <h3 className="font-semibold mt-2 mb-1">{event.title}</h3>
                    <p className="text-sm text-zinc-500">{event.date} at {event.time}</p>
                    <p className="text-xs text-zinc-400 mt-2">{event.attendees} attending</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
