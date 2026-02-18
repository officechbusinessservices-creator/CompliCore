"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Heart,
  SlidersHorizontal,
  Wifi,
  Car,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Wind,
} from "lucide-react";

const listings = [
  {
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
    amenities: ["Wifi", "Pool", "Kitchen", "AC"],
    tag: "Guest favourite",
    tagColor: "bg-rose-500",
  },
  {
    id: "2",
    name: "Downtown Loft",
    location: "Austin, TX",
    type: "Entire loft",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    price: 143,
    rating: 4.85,
    reviews: 31,
    amenities: ["Wifi", "Gym", "Kitchen"],
    tag: null,
    tagColor: "",
  },
  {
    id: "3",
    name: "Mountain Cabin",
    location: "Asheville, NC",
    type: "Entire cabin",
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    price: 223,
    rating: 4.97,
    reviews: 22,
    amenities: ["Wifi", "Kitchen", "Parking"],
    tag: "Superhost",
    tagColor: "bg-emerald-500",
  },
  {
    id: "4",
    name: "City Studio",
    location: "New York, NY",
    type: "Private room",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    price: 98,
    rating: 4.78,
    reviews: 67,
    amenities: ["Wifi", "AC"],
    tag: null,
    tagColor: "",
  },
  {
    id: "5",
    name: "Beachfront Bungalow",
    location: "Santa Monica, CA",
    type: "Entire bungalow",
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    price: 312,
    rating: 4.95,
    reviews: 89,
    amenities: ["Wifi", "Pool", "Parking", "Kitchen"],
    tag: "Guest favourite",
    tagColor: "bg-rose-500",
  },
  {
    id: "6",
    name: "Historic Townhouse",
    location: "Charleston, SC",
    type: "Entire townhouse",
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    price: 198,
    rating: 4.88,
    reviews: 41,
    amenities: ["Wifi", "Kitchen", "Parking", "AC"],
    tag: null,
    tagColor: "",
  },
];

const amenityIcons: Record<string, typeof Wifi> = {
  Wifi,
  Pool: Waves,
  Kitchen: UtensilsCrossed,
  Parking: Car,
  Gym: Dumbbell,
  AC: Wind,
};

const categories = [
  "All", "Beach", "Mountains", "City", "Cabins", "Pools", "Trending", "Farms", "Luxury",
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/" className="font-bold text-base flex-shrink-0">CompliCore</Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-center gap-0 rounded-full border border-border bg-background shadow-sm overflow-hidden">
              <div className="flex-1 px-4 py-2.5 border-r border-border">
                <div className="text-[10px] font-semibold text-foreground">Where</div>
                <input
                  type="text"
                  defaultValue="Miami Beach, FL"
                  className="w-full text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="px-4 py-2.5 border-r border-border hidden sm:block">
                <div className="text-[10px] font-semibold text-foreground">Check in</div>
                <div className="text-sm text-muted-foreground">Feb 20</div>
              </div>
              <div className="px-4 py-2.5 border-r border-border hidden sm:block">
                <div className="text-[10px] font-semibold text-foreground">Check out</div>
                <div className="text-sm text-muted-foreground">Feb 24</div>
              </div>
              <div className="px-4 py-2.5 hidden md:block">
                <div className="text-[10px] font-semibold text-foreground">Guests</div>
                <div className="text-sm text-muted-foreground">2 guests</div>
              </div>
              <button className="m-1.5 p-2.5 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/login" className="text-sm hover:underline hidden md:block">Sign in</Link>
            <Link href="/signup" className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Sign up
            </Link>
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((c, i) => (
            <button
              key={c}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                i === 0
                  ? "bg-foreground text-background"
                  : "border border-border hover:bg-accent text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-accent transition-colors">
              <SlidersHorizontal className="w-3 h-3" />
              Filters
            </button>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground mb-6">
          <span className="font-semibold text-foreground">{listings.length} stays</span> · Feb 20–24 · 2 guests
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <Link key={l.id} href={`/property/${l.id}`} className="group block">
              {/* Image placeholder */}
              <div className="relative aspect-[4/3] rounded-2xl bg-muted overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground/40" />
                </div>
                {l.tag && (
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-semibold text-white ${l.tagColor}`}>
                    {l.tag}
                  </div>
                )}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{l.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {l.location}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {l.type} · {l.bedrooms} bed · {l.guests} guests
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {l.amenities.slice(0, 3).map((a) => {
                      const Icon = amenityIcons[a] || Wifi;
                      return (
                        <span key={a} className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Icon className="w-3 h-3" />
                          {a}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-0.5 text-xs mb-1 justify-end">
                    <Star className="w-3 h-3 fill-foreground text-foreground" />
                    <span className="font-medium">{l.rating}</span>
                    <span className="text-muted-foreground">({l.reviews})</span>
                  </div>
                  <div className="font-semibold text-sm">${l.price}</div>
                  <div className="text-xs text-muted-foreground">/ night</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
