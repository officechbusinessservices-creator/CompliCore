import Link from "next/link";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Wind,
  Shield,
  ChevronLeft,
  Users,
  BedDouble,
  Bath,
  CheckCircle2,
} from "lucide-react";

const property = {
  id: "1",
  name: "Ocean View Suite",
  location: "Miami Beach, FL",
  type: "Entire apartment",
  bedrooms: 2,
  bathrooms: 1,
  guests: 4,
  price: 187,
  rating: 4.92,
  reviews: 48,
  host: "Sarah M.",
  hostSince: "2019",
  superhost: true,
  description:
    "Wake up to stunning ocean views from this beautifully designed 2-bedroom apartment in the heart of Miami Beach. Steps from the sand, world-class restaurants, and vibrant nightlife. The space features floor-to-ceiling windows, a fully equipped kitchen, and a private balcony overlooking the Atlantic.",
  amenities: [
    { label: "Wifi", icon: Wifi },
    { label: "Pool", icon: Waves },
    { label: "Kitchen", icon: UtensilsCrossed },
    { label: "Parking", icon: Car },
    { label: "Gym", icon: Dumbbell },
    { label: "AC", icon: Wind },
  ],
  highlights: [
    "Self check-in with smart lock",
    "Superhost with 4.92 avg rating",
    "Free cancellation before Feb 15",
    "GDPR-compliant booking process",
  ],
};

const reviews = [
  { author: "Alex J.", rating: 5, date: "January 2026", text: "Absolutely stunning views and a perfectly equipped apartment. Sarah was incredibly responsive. Will definitely be back!" },
  { author: "Priya K.", rating: 5, date: "December 2025", text: "The location is unbeatable. Woke up to the ocean every morning. Smart lock made check-in seamless." },
  { author: "Tom W.", rating: 4, date: "November 2025", text: "Great place, very clean and modern. The pool was a bonus. Parking was a bit tricky but manageable." },
];

export default function PropertyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/search" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to search
          </Link>
          <Link href="/" className="font-bold text-base">CompliCore</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm hover:underline hidden md:block">Sign in</Link>
            <Link href="/signup" className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{property.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="font-medium text-foreground">{property.rating}</span>
              ({property.reviews} reviews)
            </span>
            {property.superhost && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Shield className="w-3.5 h-3.5" /> Superhost
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {property.location}
            </span>
          </div>
        </div>

        {/* Photo grid placeholder */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden mb-8 h-80">
          <div className="col-span-2 row-span-2 bg-muted flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/70 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-muted-foreground/20" />
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Left */}
          <div>
            {/* Host + quick stats */}
            <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
              <div>
                <h2 className="font-semibold text-lg">
                  {property.type} hosted by {property.host}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {property.guests} guests</span>
                  <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {property.bedrooms} bedrooms</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms} bath</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {property.host.split(" ").map((n) => n[0]).join("")}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-3 pb-6 border-b border-border mb-6">
              {property.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-border mb-6">
              <h3 className="font-semibold mb-3">About this space</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="pb-6 border-b border-border mb-6">
              <h3 className="font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((a) => (
                  <div key={a.label} className="flex items-center gap-3 text-sm">
                    <a.icon className="w-5 h-5 text-muted-foreground" />
                    {a.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-foreground text-foreground" />
                <span className="font-semibold text-lg">{property.rating}</span>
                <span className="text-muted-foreground">· {property.reviews} reviews</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((r) => (
                  <div key={r.author}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {r.author.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{r.author}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Booking card */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold">${property.price}</span>
                <span className="text-muted-foreground text-sm">/ night</span>
              </div>

              {/* Date picker */}
              <div className="rounded-xl border border-border overflow-hidden mb-3">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Check-in</div>
                    <div className="text-sm font-medium">Feb 20, 2026</div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Check-out</div>
                    <div className="text-sm font-medium">Feb 24, 2026</div>
                  </div>
                </div>
                <div className="border-t border-border p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Guests</div>
                  <div className="text-sm font-medium">2 guests</div>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full block text-center py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mb-4"
              >
                Reserve
              </Link>

              <p className="text-xs text-muted-foreground text-center mb-4">You won't be charged yet</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">${property.price} × 4 nights</span>
                  <span>${property.price * 4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cleaning fee</span>
                  <span>$65</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>$112</span>
                </div>
                <div className="flex justify-between font-semibold pt-3 border-t border-border">
                  <span>Total</span>
                  <span>${property.price * 4 + 65 + 112}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> GDPR compliant</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Secure payment</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
