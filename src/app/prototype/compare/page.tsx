"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { properties } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

interface CompareProperty {
  id: string;
  title: string;
  image: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  type: string;
  superhost: boolean;
}

const compareProperties: CompareProperty[] = properties.slice(0, 4).map((p) => ({
  id: p.id,
  title: p.title,
  image: p.photos[0],
  location: `${p.location.city}, ${p.location.country}`,
  price: p.pricing.basePrice,
  rating: p.rating,
  reviews: p.reviewCount,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  maxGuests: p.maxGuests,
  amenities: p.amenities.slice(0, 8),
  type: p.type,
  superhost: p.host.superhost,
}));

const allAmenities = [
  "WiFi", "Kitchen", "Pool", "Parking", "Air Conditioning", "Heating",
  "Washer", "Dryer", "Workspace", "TV", "Hot Tub", "Gym",
  "Beach Access", "Mountain View", "Pet Friendly", "Fireplace"
];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [availableProperties, setAvailableProperties] = useState<CompareProperty[]>(compareProperties);

  useEffect(() => {
    fetchModuleData<CompareProperty[]>("/compare/properties", compareProperties).then(setAvailableProperties);
  }, []);

  // Load from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids")?.split(",") || [];
    if (ids.length > 0) {
      setSelected(ids.filter(id => availableProperties.some(p => p.id === id)));
    }
  }, [availableProperties]);

  const toggleProperty = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedProperties = availableProperties.filter((p) => selected.includes(p.id));

  const getLowestPrice = () => {
    if (selectedProperties.length === 0) return null;
    return Math.min(...selectedProperties.map((p) => p.price));
  };

  const getHighestRating = () => {
    if (selectedProperties.length === 0) return null;
    return Math.max(...selectedProperties.map((p) => p.rating));
  };

  const lowestPrice = getLowestPrice();
  const highestRating = getHighestRating();

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Compare Properties</h1>
              <p className="text-xs text-zinc-500">Select up to 4 properties to compare</p>
            </div>
          </div>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Property Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Properties to Compare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableProperties.map((property) => (
              <button
                key={property.id}
                onClick={() => toggleProperty(property.id)}
                disabled={!selected.includes(property.id) && selected.length >= 4}
                className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                  selected.includes(property.id)
                    ? "border-emerald-500 bg-emerald-500/5"
                    : selected.length >= 4
                    ? "border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {selected.includes(property.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <p className="font-medium text-sm line-clamp-1">{property.title}</p>
                <p className="text-xs text-zinc-500">${property.price}/night</p>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedProperties.length > 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Property Headers */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800">
                <span className="font-medium text-sm">Property</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800">
                  <div className="relative">
                    <button
                      onClick={() => toggleProperty(property.id)}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{property.title}</h3>
                    <p className="text-xs text-zinc-500">{property.location}</p>
                    {property.superhost && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full">
                        Superhost
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                <span className="font-medium text-sm">Price per Night</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center">
                  <span className={`text-lg font-bold ${property.price === lowestPrice ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                    ${property.price}
                  </span>
                  {property.price === lowestPrice && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                      Lowest
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Rating */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                <span className="font-medium text-sm">Rating</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className={`font-semibold ${property.rating === highestRating ? "text-amber-600 dark:text-amber-400" : ""}`}>
                    {property.rating}
                  </span>
                  <span className="text-sm text-zinc-500">({property.reviews})</span>
                  {property.rating === highestRating && (
                    <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                      Top Rated
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Type */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                <span className="font-medium text-sm">Property Type</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center">
                  <span className="capitalize">{property.type}</span>
                </div>
              ))}
            </div>

            {/* Bedrooms */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                <span className="font-medium text-sm">Bedrooms</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center">
                  <span>{property.bedrooms}</span>
                </div>
              ))}
            </div>

            {/* Bathrooms */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                <span className="font-medium text-sm">Bathrooms</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center">
                  <span>{property.bathrooms}</span>
                </div>
              ))}
            </div>

            {/* Max Guests */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                <span className="font-medium text-sm">Max Guests</span>
              </div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center">
                  <span>{property.maxGuests}</span>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {allAmenities.slice(0, 10).map((amenity) => (
              <div key={amenity} className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-r border-zinc-200 dark:border-zinc-800 flex items-center">
                  <span className="text-sm">{amenity}</span>
                </div>
                {selectedProperties.map((property) => (
                  <div key={property.id} className="p-4 border-b border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                    {property.amenities.includes(amenity) ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Book Now Buttons */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-r border-zinc-200 dark:border-zinc-800" />
              {selectedProperties.map((property) => (
                <div key={property.id} className="p-4 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800">
                  <Link
                    href={`/prototype/property/${property.id}`}
                    className="block w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-center rounded-lg font-medium transition-colors"
                  >
                    View Property
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">No properties selected</p>
            <p className="text-sm text-zinc-500 mt-1">Select up to 4 properties above to compare them</p>
          </div>
        )}
      </div>
    </div>
  );
}
