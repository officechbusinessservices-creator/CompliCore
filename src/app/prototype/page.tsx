"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { properties, formatCurrency } from "@/lib/mockData";
import { apiGet } from "@/lib/api";
import { LanguageSelector, I18nProvider } from "@/lib/i18n";
import { FavoritesProvider, useFavorites, FavoriteButton, WishlistBadge } from "@/lib/favorites";
import { AppDownloadButton } from "@/components/MobileAppPrompt";

function PrototypeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    propertyType: "",
    instantBook: false,
  });
  const [propertyList, setPropertyList] = useState(properties);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { favoritesCount } = useFavorites();

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  useEffect(() => {
    apiGet<any>("/properties")
      .then((data) => {
        if (data?.data) {
          // map API shape to mock shape for display
          const mapped = data.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            location: { city: p.address?.city || "City", state: p.address?.state || "" },
            pricing: { basePrice: p.pricing?.basePrice || 150 },
            type: p.propertyType || "apartment",
            instantBook: p.instantBook || false,
            maxGuests: p.maxGuests || 2,
            bedrooms: p.bedrooms || 1,
            bathrooms: p.bathrooms || 1,
            rating: p.rating || 4.8,
            reviewCount: p.reviewCount || 0,
            photos: p.photos?.length ? p.photos.map((ph: any) => ph.url) : ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"],
            host: { superhost: false },
          }));
          setPropertyList(mapped);
        }
      })
      .catch(() => null);
  }, []);

  const filteredProperties = propertyList.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGuests = property.maxGuests >= guests;
    const matchesPrice =
      property.pricing.basePrice >= filters.minPrice &&
      property.pricing.basePrice <= filters.maxPrice;
    const matchesType =
      !filters.propertyType || property.type === filters.propertyType;
    const matchesInstant = !filters.instantBook || property.instantBook;

    return matchesSearch && matchesGuests && matchesPrice && matchesType && matchesInstant;
  });

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-semibold text-base sm:text-lg">Rental Platform</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            <Link
              href="/prototype/wishlist"
              className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white rounded-full px-1">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Write Review */}
            <Link
              href="/prototype/write-review"
              className="hidden sm:flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Write a Review"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </Link>

            <AppDownloadButton />
            <LanguageSelector />

            {/* Accessibility */}
            <Link
              href="/prototype/accessibility"
              className="hidden sm:flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Accessibility Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>

            <span className="hidden lg:inline-block text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Prototype
            </span>
            {/* Map View */}
            <Link
              href="/prototype/map"
              className="hidden sm:flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Map View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </Link>

            <Link
              href="/prototype/dashboard"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Host Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Find your perfect stay</h1>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm text-zinc-500 mb-1.5">Location</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-sm text-zinc-500 mb-1.5">Check in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm text-zinc-500 mb-1.5">Check out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm text-zinc-500 mb-1.5">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full mt-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 sm:hidden flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Filters */}
            <div className={`${showMobileFilters ? "block" : "hidden"} sm:block mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800`}>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-sm text-zinc-500 whitespace-nowrap">Price:</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="25"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: Number(e.target.value) })
                    }
                    className="flex-1 sm:w-32"
                  />
                  <span className="text-sm whitespace-nowrap">Up to {formatCurrency(filters.maxPrice)}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-sm text-zinc-500">Type:</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                  >
                    <option value="">All types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="cabin">Cabin</option>
                    <option value="cottage">Cottage</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.instantBook}
                    onChange={(e) =>
                      setFilters({ ...filters, instantBook: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Instant Book only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="sticky top-[57px] sm:top-[65px] z-40 bg-emerald-600 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm">
              {compareList.length} propert{compareList.length === 1 ? "y" : "ies"} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareList([])}
                className="text-sm px-3 py-1 hover:bg-emerald-700 rounded transition-colors"
              >
                Clear
              </button>
              <Link
                href={`/prototype/compare?ids=${compareList.join(",")}`}
                className="text-sm px-4 py-1.5 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">
            {filteredProperties.length} properties available
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href="/prototype/wishlist"
              className="text-sm px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
              {favoritesCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 bg-rose-500 text-white rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/prototype/bundles"
              className="text-sm px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Bundles
            </Link>
            <Link
              href="/prototype/referrals"
              className="hidden sm:flex text-sm px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Refer
            </Link>
            <Link
              href="/prototype/compare"
              className="text-sm px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Compare
            </Link>
            <select className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              {/* Image */}
              <Link href={`/prototype/property/${property.id}`} className="block">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton propertyId={property.id} />
                  </div>
                  {property.instantBook && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                      Instant Book
                    </span>
                  )}
                  {property.host.superhost && (
                    <span className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-900 dark:text-white text-xs font-medium rounded-full border border-zinc-200 dark:border-zinc-700">
                      Superhost
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/prototype/property/${property.id}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-zinc-500">
                        {property.location.city}, {property.location.state}
                      </p>
                      <h3 className="font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm shrink-0">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-zinc-400">({property.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-500 mb-3">
                    {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""} · {property.bathrooms} bath · Up to {property.maxGuests} guests
                  </p>
                </Link>

                <div className="flex items-center justify-between">
                  <p>
                    <span className="font-semibold">{formatCurrency(property.pricing.basePrice)}</span>
                    <span className="text-zinc-500 text-sm"> / night</span>
                  </p>
                  <button
                    onClick={() => toggleCompare(property.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      compareList.includes(property.id)
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                    title={compareList.includes(property.id) ? "Remove from compare" : "Add to compare"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-1">No properties found</h3>
            <p className="text-zinc-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function PrototypePage() {
  return (
    <I18nProvider>
      <FavoritesProvider>
        <PrototypeContent />
      </FavoritesProvider>
    </I18nProvider>
  );
}
