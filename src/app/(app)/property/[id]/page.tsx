"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  properties,
  formatCurrency,
  amenityLabels,
  calculateNights,
} from "@/lib/mockData";
import { apiGet, apiPost } from "@/lib/api";

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<any>(properties.find((p) => p.id === params.id));
  const [quote, setQuote] = useState<any | null>(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);

  const pricing = useMemo(() => {
    if (!checkIn || !checkOut || !property) return null;

    const nights = calculateNights(checkIn, checkOut);
    if (nights <= 0) return null;

    const subtotal = property.pricing.basePrice * nights;
    const serviceFee = Math.round(subtotal * 0.12);
    const taxes = Math.round((subtotal + serviceFee) * 0.09);
    const total = subtotal + property.pricing.cleaningFee + serviceFee + taxes;

    return {
      nights,
      nightlyRate: property.pricing.basePrice,
      subtotal,
      cleaningFee: property.pricing.cleaningFee,
      serviceFee,
      taxes,
      total,
    };
  }, [checkIn, checkOut, property]);

  useEffect(() => {
    apiGet<any>(`/properties/${params.id}`)
      .then((data) => {
        if (data?.id) {
          setProperty({
            ...property,
            id: data.id,
            title: data.title,
            description: data.description || property?.description,
          });
        }
      })
      .catch(() => null);
  }, [params.id]);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    apiPost<any>(`/properties/${params.id}/quote`, { checkIn, checkOut, guests })
      .then((data) => setQuote(data))
      .catch(() => null);
  }, [params.id, checkIn, checkOut, guests]);

  if (!property) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property not found</h1>
          <Link href="/prototype" className="text-emerald-400 hover:underline">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    setShowBookingConfirm(true);
    if (pricing) {
      apiPost<any>("/bookings", {
        propertyId: params.id,
        checkIn,
        checkOut,
        guests,
      }).catch(() => null);
    }
  };

  const photos = Array.isArray(property.photos) ? property.photos : [];
  const heroPhoto = photos[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200";
  const galleryPhotos = photos.length > 0 ? photos : [heroPhoto];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/prototype" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Rental Platform</span>
          </Link>
          <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Prototype
          </span>
        </div>
      </header>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden h-[400px]">
          <div className="col-span-2 row-span-2">
            <img
              src={heroPhoto}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {galleryPhotos.slice(1, 3).map((photo, idx) => (
            <div key={photo} className="col-span-1">
              <img
                src={photo}
                alt={`${property.title} ${idx + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {galleryPhotos.length > 3 ? (
            <div className="col-span-1 relative">
              <img
                src={galleryPhotos[2]}
                alt={`${property.title} more`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium">+{galleryPhotos.length - 3} more</span>
              </div>
            </div>
          ) : (
            <div className="col-span-1 bg-zinc-800" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Title & Host */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-white">{property.rating}</span>
                    <span>({property.reviewCount} reviews)</span>
                  </span>
                  <span>{property.location.city}, {property.location.state}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{property.host.name}</p>
                  {property.host.superhost && (
                    <p className="text-xs text-emerald-400">Superhost</p>
                  )}
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex items-center gap-6 py-4 border-y border-zinc-800 mb-6">
              <div className="text-center">
                <p className="font-semibold">{property.maxGuests}</p>
                <p className="text-sm text-zinc-400">guests</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{property.bedrooms}</p>
                <p className="text-sm text-zinc-400">bedrooms</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{property.beds}</p>
                <p className="text-sm text-zinc-400">beds</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{property.bathrooms}</p>
                <p className="text-sm text-zinc-400">baths</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">About this place</h2>
              <p className="text-zinc-400 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">What this place offers</h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={amenityLabels[amenity]?.icon || "M5 13l4 4L19 7"} />
                    </svg>
                    <span className="text-sm">{amenityLabels[amenity]?.label || amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">House rules</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <p className="text-sm text-zinc-400">Check-in</p>
                  <p className="font-medium">After {property.houseRules.checkInTime}</p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <p className="text-sm text-zinc-400">Check-out</p>
                  <p className="font-medium">Before {property.houseRules.checkOutTime}</p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg flex items-center gap-2">
                  {property.houseRules.smokingAllowed ? (
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm">Smoking {property.houseRules.smokingAllowed ? "allowed" : "not allowed"}</span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg flex items-center gap-2">
                  {property.houseRules.petsAllowed ? (
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm">Pets {property.houseRules.petsAllowed ? "allowed" : "not allowed"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold">{formatCurrency(property.pricing.basePrice)}</span>
                <span className="text-zinc-400">/ night</span>
              </div>

              {/* Date inputs */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">CHECK-IN</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">CHECK-OUT</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-4">
                <label className="block text-xs text-zinc-400 mb-1">GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book button */}
              <button
                type="button"
                onClick={handleBook}
                disabled={!pricing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors mb-4"
              >
                {property.instantBook ? "Reserve" : "Request to book"}
              </button>

              {/* Pricing breakdown */}
              {pricing && (
                <div className="space-y-2 pt-4 border-t border-zinc-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">
                      {formatCurrency(pricing.nightlyRate)} x {pricing.nights} nights
                    </span>
                    <span>{formatCurrency(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Cleaning fee</span>
                    <span>{formatCurrency(pricing.cleaningFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Service fee</span>
                    <span>{formatCurrency(pricing.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Taxes</span>
                    <span>{formatCurrency(pricing.taxes)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-zinc-800">
                    <span>Total</span>
                    <span>{formatCurrency(pricing.total)}</span>
                  </div>
                </div>
              )}

              {quote?.pricing?.total && (
                <p className="text-xs text-zinc-500 mt-2">Quote total: {formatCurrency(quote.pricing.total)}</p>
              )}

              {!pricing && (
                <p className="text-center text-sm text-zinc-500">
                  Select dates to see pricing
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingConfirm && pricing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Booking Confirmed!</h3>
            <p className="text-zinc-400 text-center mb-6">
              This is a prototype demo. In production, this would process your payment and confirm your reservation.
            </p>
            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <p className="font-medium mb-2">{property.title}</p>
              <div className="text-sm text-zinc-400 space-y-1">
                <p>Check-in: {checkIn}</p>
                <p>Check-out: {checkOut}</p>
                <p>Guests: {guests}</p>
                <p className="font-medium text-white pt-2">Total: {formatCurrency(pricing.total)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBookingConfirm(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <Link
                href="/prototype"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium text-center transition-colors"
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
