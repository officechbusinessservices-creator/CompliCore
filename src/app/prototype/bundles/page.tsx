"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { properties, formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface Bundle {
  id: string;
  name: string;
  description: string;
  properties: typeof properties;
  discount: number;
  minNights: number;
  maxGuests: number;
  totalBasePrice: number;
  bundlePrice: number;
  savings: number;
  features: string[];
  image: string;
}

const bundles: Bundle[] = [
  {
    id: "bundle-1",
    name: "Family Reunion Package",
    description: "Perfect for large family gatherings with multiple homes close together. Book all properties for a seamless reunion experience.",
    properties: [properties[0], properties[1]],
    discount: 15,
    minNights: 3,
    maxGuests: 6,
    totalBasePrice: 464,
    bundlePrice: 394,
    savings: 70,
    features: ["Shared outdoor space", "Group messaging", "Flexible check-in", "Priority support"],
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
  },
  {
    id: "bundle-2",
    name: "Corporate Retreat",
    description: "Ideal for team offsites and corporate retreats. Multiple properties with workspace amenities and meeting-ready spaces.",
    properties: [properties[0], properties[2], properties[4]],
    discount: 20,
    minNights: 2,
    maxGuests: 22,
    totalBasePrice: 964,
    bundlePrice: 771,
    savings: 193,
    features: ["Fast WiFi guaranteed", "Meeting spaces", "Catering options", "Team building activities"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
  },
  {
    id: "bundle-3",
    name: "Wedding Weekend",
    description: "Host your wedding party across multiple beautiful properties. Perfect for pre-wedding and post-wedding celebrations.",
    properties: [properties[1], properties[2]],
    discount: 25,
    minNights: 2,
    maxGuests: 12,
    totalBasePrice: 700,
    bundlePrice: 525,
    savings: 175,
    features: ["Event coordination", "Late checkout", "Photo locations", "Group transportation"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
  },
];

export default function BundlesPage() {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);
  const [bundlesData, setBundlesData] = useState<Bundle[]>(bundles);

  useEffect(() => {
    fetchModuleData<Bundle[]>("/bundles", bundles).then(setBundlesData);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Property Bundles</h1>
              <p className="text-xs text-zinc-500">Save on multi-property bookings</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-600 to-teal-700 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Book Multiple Properties, Save More</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
            Perfect for group trips, family reunions, corporate retreats, and weddings.
            Get up to 25% off when you book multiple properties together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="text-2xl font-bold">15-25%</p>
              <p className="text-sm text-emerald-200">Discount</p>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="text-2xl font-bold">3+</p>
              <p className="text-sm text-emerald-200">Bundles Available</p>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm text-emerald-200">Max Guests</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Bundles Grid */}
        <div className="space-y-6">
          {bundlesData.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-0">
                {/* Image */}
                <div className="relative h-48 md:h-auto">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                    Save {bundle.discount}%
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{bundle.name}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{bundle.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-zinc-500 line-through">{formatCurrency(bundle.totalBasePrice)}/night</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(bundle.bundlePrice)}<span className="text-sm font-normal">/night</span></p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Save {formatCurrency(bundle.savings)}/night</p>
                    </div>
                  </div>

                  {/* Properties in bundle */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-zinc-500 mb-2">Includes {bundle.properties.length} properties:</p>
                    <div className="flex flex-wrap gap-2">
                      {bundle.properties.map((property) => (
                        <div key={property.id} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm">
                          <img src={property.photos[0]} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="truncate max-w-[150px]">{property.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bundle.features.map((feature) => (
                      <span key={feature} className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-4">
                    <span>Min {bundle.minNights} nights</span>
                    <span>Up to {bundle.maxGuests} guests</span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setSelectedBundle(selectedBundle?.id === bundle.id ? null : bundle)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {selectedBundle?.id === bundle.id ? "Hide Booking" : "Book This Bundle"}
                  </button>
                </div>
              </div>

              {/* Expanded Booking Form */}
              {selectedBundle?.id === bundle.id && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-800/30">
                  <h4 className="font-semibold mb-4">Complete Your Booking</h4>
                  <div className="grid sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-zinc-500 mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-500 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-500 mb-1">Total Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                      >
                        {Array.from({ length: bundle.maxGuests }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} guest{n !== 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button className="w-full px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Request to Book
                      </button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-white dark:bg-zinc-900 rounded-lg p-4">
                    <h5 className="font-medium mb-3">Price Breakdown (3 nights)</h5>
                    <div className="space-y-2 text-sm">
                      {bundle.properties.map((property) => (
                        <div key={property.id} className="flex justify-between">
                          <span className="text-zinc-500">{property.title}</span>
                          <span>{formatCurrency(property.pricing.basePrice * 3)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <span className="text-zinc-500">Subtotal</span>
                        <span>{formatCurrency(bundle.totalBasePrice * 3)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Bundle Discount ({bundle.discount}%)</span>
                        <span>-{formatCurrency(bundle.savings * 3)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>Cleaning fees</span>
                        <span>{formatCurrency(bundle.properties.reduce((sum, p) => sum + p.pricing.cleaningFee, 0))}</span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>Service fee</span>
                        <span>{formatCurrency(Math.round(bundle.bundlePrice * 3 * 0.12))}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(bundle.bundlePrice * 3 + bundle.properties.reduce((sum, p) => sum + p.pricing.cleaningFee, 0) + Math.round(bundle.bundlePrice * 3 * 0.12))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Custom Bundle */}
        <div className="mt-8 bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950 rounded-xl p-8 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Create Custom Bundle</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Can't find the perfect package? Create your own bundle by selecting any combination of properties.
          </p>
          <Link
            href="/prototype"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Properties
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              { q: "How do bundle discounts work?", a: "When you book multiple properties together, you automatically receive a discount based on the bundle. The more properties you book, the higher the discount." },
              { q: "Can I modify individual bookings in a bundle?", a: "Yes, you can modify check-in/check-out dates for individual properties, but the bundle discount only applies if all properties are booked for overlapping dates." },
              { q: "What happens if I need to cancel?", a: "Bundle bookings follow our standard cancellation policy. If you cancel one property, the bundle discount may be adjusted for the remaining properties." },
            ].map((faq, idx) => (
              <div key={idx} className="pb-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0">
                <p className="font-medium mb-1">{faq.q}</p>
                <p className="text-sm text-zinc-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
