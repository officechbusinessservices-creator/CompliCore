import Link from "next/link";
import { CheckCircle2, Calendar, MapPin, Key, Star, ArrowRight, Home } from "lucide-react";

export default function GuestBookingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          CompliCore
        </Link>
        <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">Browse stays</Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Confirmation banner */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Booking confirmed! 🎉</h1>
          <p className="text-muted-foreground">
            Your reservation at <strong className="text-foreground">Ocean View Suite</strong> is confirmed.
            Confirmation sent to <strong className="text-foreground">guest@example.com</strong>.
          </p>
        </div>

        {/* Booking summary */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-semibold mb-4">Booking summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-medium">BK-2026-0042</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property</span>
              <span className="font-medium">Ocean View Suite</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Location</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Miami Beach, FL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check-in</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Feb 20, 2026 · 3:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check-out</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Feb 24, 2026 · 11:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span>2 guests · 4 nights</span>
            </div>
            <div className="flex justify-between font-semibold pt-3 border-t border-border">
              <span>Total paid</span>
              <span>$925</span>
            </div>
          </div>
        </div>

        {/* Check-in instructions */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            Check-in instructions
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">1</div>
              <div>
                <div className="font-medium">Arrive at the property</div>
                <p className="text-muted-foreground mt-0.5">123 Ocean Drive, Miami Beach, FL 33139. Look for the blue door on the left side of the building.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">2</div>
              <div>
                <div className="font-medium">Smart lock code</div>
                <p className="text-muted-foreground mt-0.5">Your unique door code will be sent 1 hour before check-in. Code expires automatically at checkout.</p>
                <div className="mt-2 px-3 py-2 rounded-lg bg-muted font-mono text-lg font-bold tracking-widest text-center">
                  ••••••
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">Code unlocks Feb 20 at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">3</div>
              <div>
                <div className="font-medium">Wifi & amenities</div>
                <p className="text-muted-foreground mt-0.5">Wifi: <strong className="text-foreground">OceanView_5G</strong> · Password in the welcome booklet on the kitchen counter.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leave a review CTA */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="font-semibold">After your stay</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            We&apos;ll send you a review request after checkout. Your feedback helps other guests and rewards great hosts.
          </p>
          <Link
            href="/guest/review"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Write a review
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3">
          <Link href="/search" className="flex-1 text-center py-3 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
            Browse more stays
          </Link>
          <Link href="/guest/review" className="flex-1 text-center py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            Manage booking
          </Link>
        </div>
      </main>
    </div>
  );
}
