"use client";

import { useState } from "react";
import Link from "next/link";
import { properties } from "@/lib/mockData";

interface ReviewCategory {
  key: string;
  label: string;
  description: string;
}

const reviewCategories: ReviewCategory[] = [
  { key: "cleanliness", label: "Cleanliness", description: "How clean was the property?" },
  { key: "accuracy", label: "Accuracy", description: "How accurate was the listing?" },
  { key: "communication", label: "Communication", description: "How responsive was the host?" },
  { key: "location", label: "Location", description: "How was the location?" },
  { key: "checkIn", label: "Check-in", description: "How easy was check-in?" },
  { key: "value", label: "Value", description: "Was it good value for money?" },
];

interface PastStay {
  id: string;
  property: typeof properties[0];
  checkIn: string;
  checkOut: string;
  reviewed: boolean;
}

const pastStays: PastStay[] = [
  {
    id: "stay-1",
    property: properties[0],
    checkIn: "2026-01-15",
    checkOut: "2026-01-18",
    reviewed: false,
  },
  {
    id: "stay-2",
    property: properties[1],
    checkIn: "2025-12-20",
    checkOut: "2025-12-27",
    reviewed: true,
  },
  {
    id: "stay-3",
    property: properties[2],
    checkIn: "2025-11-10",
    checkOut: "2025-11-14",
    reviewed: false,
  },
];

export default function WriteReviewPage() {
  const [selectedStay, setSelectedStay] = useState<PastStay | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overallRating, setOverallRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingChange = (category: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  const averageRating = Object.values(ratings).length > 0
    ? Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
    : 0;

  const canSubmit = overallRating > 0 && reviewText.length >= 50 && Object.keys(ratings).length === reviewCategories.length;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const StarRating = ({
    value,
    onChange,
    size = "md",
    readonly = false,
  }: {
    value: number;
    onChange?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
    readonly?: boolean;
  }) => {
    const [hovered, setHovered] = useState(0);

    const sizeClasses = {
      sm: "w-5 h-5",
      md: "w-7 h-7",
      lg: "w-9 h-9",
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => onChange?.(star)}
            className={`${sizeClasses[size]} ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          >
            <svg
              className={`w-full h-full ${
                (hovered || value) >= star ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"
              } transition-colors`}
              fill={(hovered || value) >= star ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">Thank you for your review!</h1>
          <p className="text-zinc-500 mb-6">
            Your feedback helps other travelers make informed decisions and helps hosts improve their properties.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/browse"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              Browse More Properties
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedStay(null);
                setRatings({});
                setOverallRating(0);
                setReviewText("");
                setPrivateNote("");
              }}
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Write Another Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/browse" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <h1 className="font-semibold text-lg">Write a Review</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {!selectedStay ? (
          // Stay selection
          <div>
            <h2 className="text-xl font-semibold mb-2">Select a stay to review</h2>
            <p className="text-zinc-500 mb-6">Choose from your recent trips that haven't been reviewed yet</p>

            <div className="space-y-4">
              {pastStays.map((stay) => (
                <button
                  key={stay.id}
                  onClick={() => !stay.reviewed && setSelectedStay(stay)}
                  disabled={stay.reviewed}
                  className={`w-full p-4 bg-white dark:bg-zinc-900 rounded-xl border text-left transition-all ${
                    stay.reviewed
                      ? "border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:shadow-md cursor-pointer"
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={stay.property.photos[0]}
                      alt={stay.property.title}
                      className="w-24 h-24 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{stay.property.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        {stay.property.location.city}, {stay.property.location.state}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        {new Date(stay.checkIn).toLocaleDateString()} - {new Date(stay.checkOut).toLocaleDateString()}
                      </p>
                      {stay.reviewed ? (
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full">
                          Already reviewed
                        </span>
                      ) : (
                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                          Ready to review
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Review form
          <div>
            {/* Property info */}
            <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-8">
              <img
                src={selectedStay.property.photos[0]}
                alt={selectedStay.property.title}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div>
                <h3 className="font-medium">{selectedStay.property.title}</h3>
                <p className="text-sm text-zinc-500">
                  Hosted by {selectedStay.property.host.name}
                </p>
                <p className="text-sm text-zinc-500">
                  {new Date(selectedStay.checkIn).toLocaleDateString()} - {new Date(selectedStay.checkOut).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Overall rating */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Overall Rating</h2>
              <p className="text-sm text-zinc-500 mb-4">How was your overall experience?</p>
              <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
              {overallRating > 0 && (
                <p className="mt-2 text-sm text-zinc-500">
                  {overallRating === 5 && "Excellent!"}
                  {overallRating === 4 && "Great!"}
                  {overallRating === 3 && "Good"}
                  {overallRating === 2 && "Fair"}
                  {overallRating === 1 && "Poor"}
                </p>
              )}
            </div>

            {/* Category ratings */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Rate by Category</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {reviewCategories.map((category) => (
                  <div key={category.key} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{category.label}</span>
                      {ratings[category.key] && (
                        <span className="text-sm text-zinc-500">{ratings[category.key]}/5</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">{category.description}</p>
                    <StarRating
                      value={ratings[category.key] || 0}
                      onChange={(rating) => handleRatingChange(category.key, rating)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
              {Object.keys(ratings).length === reviewCategories.length && (
                <p className="mt-4 text-sm text-zinc-500">
                  Average rating: <span className="font-medium">{averageRating.toFixed(1)}</span>
                </p>
              )}
            </div>

            {/* Written review */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Write Your Review</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Share your experience to help other travelers (minimum 50 characters)
              </p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you love about this place? Was there anything that could be improved? Share details about the property, location, and your host..."
                className="w-full h-40 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
              />
              <div className="flex justify-between mt-2">
                <p className={`text-xs ${reviewText.length >= 50 ? "text-emerald-600" : "text-zinc-500"}`}>
                  {reviewText.length}/50 minimum characters
                </p>
                <p className="text-xs text-zinc-500">{reviewText.length} characters</p>
              </div>
            </div>

            {/* Private note */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Private Note to Host</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Share private feedback with your host (optional, not published)
              </p>
              <textarea
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="Any private feedback for your host that you don't want to publish..."
                className="w-full h-24 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSelectedStay(null)}
                className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>

            {!canSubmit && (
              <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
                Please complete all ratings and write at least 50 characters to submit your review.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
