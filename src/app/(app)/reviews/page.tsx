"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

interface Review {
  id: string;
  guestName: string;
  guestAvatar: string;
  propertyName: string;
  propertyId: string;
  rating: number;
  categories: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
  content: string;
  date: Date;
  bookingDates: { checkIn: string; checkOut: string };
  hostResponse?: string;
  hostResponseDate?: Date;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: "1",
    guestName: "Maria Garcia",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    propertyName: "Modern Downtown Loft",
    propertyId: "1",
    rating: 5,
    categories: { cleanliness: 5, communication: 5, checkIn: 5, accuracy: 5, location: 5, value: 5 },
    content: "Absolutely loved staying here! The loft was immaculately clean, beautifully decorated, and the location couldn't be better. Sarah was an amazing host who responded quickly to all my questions. The check-in process was seamless with the smart lock. Would definitely stay again!",
    date: new Date("2026-01-28"),
    bookingDates: { checkIn: "2026-01-20", checkOut: "2026-01-25" },
    hostResponse: "Thank you so much, Maria! It was a pleasure hosting you. You were a wonderful guest and I'd be happy to welcome you back anytime!",
    hostResponseDate: new Date("2026-01-29"),
    helpful: 12,
  },
  {
    id: "2",
    guestName: "Alex Johnson",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    propertyName: "Cozy Beach Cottage",
    propertyId: "2",
    rating: 4,
    categories: { cleanliness: 4, communication: 5, checkIn: 5, accuracy: 4, location: 5, value: 4 },
    content: "Great little cottage right near the beach! The location is perfect and Sarah was very responsive. The only minor issue was that the WiFi was a bit slow, but honestly we spent most of our time outside anyway. Would recommend!",
    date: new Date("2026-01-25"),
    bookingDates: { checkIn: "2026-01-18", checkOut: "2026-01-22" },
    helpful: 8,
  },
  {
    id: "3",
    guestName: "Sophie Chen",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    propertyName: "Modern Downtown Loft",
    propertyId: "1",
    rating: 5,
    categories: { cleanliness: 5, communication: 5, checkIn: 5, accuracy: 5, location: 5, value: 5 },
    content: "Perfect stay! Everything was exactly as described. The kitchen was fully stocked, beds were comfortable, and the neighborhood is lovely. Already planning my next visit!",
    date: new Date("2026-01-20"),
    bookingDates: { checkIn: "2026-01-10", checkOut: "2026-01-15" },
    hostResponse: "Thank you Sophie! So glad you enjoyed your stay. Looking forward to hosting you again!",
    hostResponseDate: new Date("2026-01-21"),
    helpful: 5,
  },
  {
    id: "4",
    guestName: "James Wilson",
    guestAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    propertyName: "Mountain View Cabin",
    propertyId: "3",
    rating: 3,
    categories: { cleanliness: 3, communication: 4, checkIn: 4, accuracy: 3, location: 4, value: 3 },
    content: "The cabin has great views and the location is nice for hiking. However, it could use some updates - the furniture is a bit dated and we found a few maintenance issues. The heating was also inconsistent. Sarah was helpful in addressing our concerns though.",
    date: new Date("2026-01-15"),
    bookingDates: { checkIn: "2026-01-08", checkOut: "2026-01-12" },
    helpful: 15,
  },
  {
    id: "5",
    guestName: "Emily Davis",
    guestAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    propertyName: "Urban Studio Apartment",
    propertyId: "4",
    rating: 5,
    categories: { cleanliness: 5, communication: 5, checkIn: 5, accuracy: 5, location: 4, value: 5 },
    content: "Fantastic little studio in a great location! Very clean, modern, and had everything I needed for a work trip. The desk setup was perfect for remote work. Highly recommend!",
    date: new Date("2026-01-10"),
    bookingDates: { checkIn: "2026-01-05", checkOut: "2026-01-08" },
    helpful: 7,
  },
];

const categoryLabels: Record<keyof Review["categories"], string> = {
  cleanliness: "Cleanliness",
  communication: "Communication",
  checkIn: "Check-in",
  accuracy: "Accuracy",
  location: "Location",
  value: "Value",
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  useEffect(() => {
    apiGet<any>("/properties/demo-property/reviews")
      .then(() => null)
      .catch(() => null);
  }, []);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  // Calculate stats
  const stats = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    pendingResponses: reviews.filter((r) => !r.hostResponse).length,
    fiveStarPercent: Math.round((reviews.filter((r) => r.rating === 5).length / reviews.length) * 100),
  };

  // Filter reviews
  const filteredReviews = reviews
    .filter((r) => {
      if (filter === "pending") return !r.hostResponse;
      if (filter === "responded") return !!r.hostResponse;
      return true;
    })
    .filter((r) => {
      if (selectedProperty !== "all") return r.propertyId === selectedProperty;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return b.date.getTime() - a.date.getTime();
      return b.rating - a.rating;
    });

  // Submit response
  const submitResponse = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, hostResponse: replyText, hostResponseDate: new Date() }
          : r
      )
    );
    setReplyText("");
    setReplyingTo(null);
    apiPost<any>("/reviews", {
      bookingId: "demo",
      overallRating: 5,
      comment: replyText,
    }).catch(() => null);
  };

  // Render stars
  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${star <= rating ? "text-amber-400 fill-current" : "text-zinc-300 dark:text-zinc-600"}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Reviews</h1>
              <p className="text-xs text-zinc-500">Manage guest feedback</p>
            </div>
          </div>
          {stats.pendingResponses > 0 && (
            <span className="px-3 py-1 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
              {stats.pendingResponses} pending response{stats.pendingResponses > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold">{stats.totalReviews}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{stats.averageRating.toFixed(2)}</p>
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">5-Star Reviews</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.fiveStarPercent}%</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 mb-1">Response Rate</p>
            <p className="text-2xl font-bold">{Math.round(((stats.totalReviews - stats.pendingResponses) / stats.totalReviews) * 100)}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(["all", "pending", "responded"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {f === "pending" ? "Needs Response" : f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
            >
              <option value="all">All Properties</option>
              <option value="1">Modern Downtown Loft</option>
              <option value="2">Cozy Beach Cottage</option>
              <option value="3">Mountain View Cabin</option>
              <option value="4">Urban Studio Apartment</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "rating")}
              className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
            >
              <option value="date">Most Recent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`p-6 bg-white dark:bg-zinc-900 rounded-xl border transition-all ${
                !review.hostResponse
                  ? "border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <img
                    src={review.guestAvatar}
                    alt={review.guestName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{review.guestName}</h3>
                    <p className="text-sm text-zinc-500">{review.propertyName}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(review.bookingDates.checkIn).toLocaleDateString()} - {new Date(review.bookingDates.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="font-semibold">{review.rating}.0</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {review.date.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">{review.content}</p>

              {/* Category Ratings */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                {Object.entries(review.categories).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-zinc-500 mb-1">{categoryLabels[key as keyof Review["categories"]]}</p>
                    <div className="flex items-center justify-center gap-1">
                      {renderStars(value, "sm")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Host Response */}
              {review.hostResponse ? (
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Your Response</span>
                    <span className="text-xs text-zinc-500">
                      {review.hostResponseDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{review.hostResponse}</p>
                </div>
              ) : replyingTo === review.id ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a thoughtful response to this review..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      Tip: Thank the guest and address any concerns professionally
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                        className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitResponse(review.id)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Response
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(review.id)}
                  className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Respond to this review
                </button>
              )}

              {/* Helpful Count */}
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4 text-sm text-zinc-500">
                <span>{review.helpful} guests found this helpful</span>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">No reviews found</p>
            <p className="text-sm text-zinc-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
