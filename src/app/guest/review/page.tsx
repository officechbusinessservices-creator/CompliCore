"use client";

import Link from "next/link";
import { useState } from "react";
import { Star, Home, CheckCircle2 } from "lucide-react";

const categories = ["Cleanliness", "Accuracy", "Check-in", "Communication", "Location", "Value"];

export default function GuestReviewPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const overall = Object.values(ratings).length
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : "—";

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Review submitted!</h1>
          <p className="text-muted-foreground mb-8">Thank you for your feedback. It helps other guests and rewards great hosts.</p>
          <Link href="/search" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Browse more stays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          CompliCore
        </Link>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">How was your stay?</h1>
          <p className="text-muted-foreground text-sm">Ocean View Suite · Miami Beach · Feb 20–24, 2026</p>
        </div>

        {/* Overall */}
        <div className="rounded-xl border border-border bg-card p-5 mb-6 text-center">
          <div className="text-4xl font-bold mb-1">{overall}</div>
          <div className="flex justify-center gap-1 mb-1">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-6 h-6 ${Number(overall) >= s ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Overall rating</div>
        </div>

        {/* Category ratings */}
        <div className="rounded-xl border border-border bg-card p-5 mb-6 space-y-4">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-sm font-medium">{cat}</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <button
                    key={s}
                    onMouseEnter={() => setHovered((h) => ({ ...h, [cat]: s }))}
                    onMouseLeave={() => setHovered((h) => ({ ...h, [cat]: 0 }))}
                    onClick={() => setRatings((r) => ({ ...r, [cat]: s }))}
                  >
                    <Star className={`w-5 h-5 transition-colors ${
                      (hovered[cat] || ratings[cat] || 0) >= s
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Written review */}
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <label className="text-sm font-medium block mb-2">Tell us about your experience</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="What did you love? Any suggestions for the host?"
            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1 text-right">{comment.length}/500</div>
        </div>

        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(ratings).length < categories.length}
          className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit review
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3">Rate all 6 categories to submit</p>
      </main>
    </div>
  );
}
