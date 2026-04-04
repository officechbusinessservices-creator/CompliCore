"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { properties, formatCurrency } from "@/lib/mockData";
import { FavoritesProvider, FavoriteButton } from "@/lib/favorites";
import { fetchModuleData } from "@/lib/modulesApi";

interface MapProperty {
  id: string;
  title: string;
  price: number;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  reviews: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
}

const mapProperties: MapProperty[] = properties.map((p) => ({
  id: p.id,
  title: p.title,
  price: p.pricing.basePrice,
  lat: p.location.coordinates.lat,
  lng: p.location.coordinates.lng,
  image: p.photos[0],
  rating: p.rating,
  reviews: p.reviewCount,
  type: p.type,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
}));

const mapBounds = (items: MapProperty[]) => ({
  minLat: Math.min(...items.map((p) => p.lat)) - 2,
  maxLat: Math.max(...items.map((p) => p.lat)) + 2,
  minLng: Math.min(...items.map((p) => p.lng)) - 5,
  maxLng: Math.max(...items.map((p) => p.lng)) + 5,
});

function MapContent() {
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
  const [showList, setShowList] = useState(true);
  const [mapData, setMapData] = useState<MapProperty[]>(mapProperties);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    propertyType: "",
  });

  useEffect(() => {
    fetchModuleData<MapProperty[]>("/map/properties", mapProperties).then(setMapData);
  }, []);

  const filteredProperties = mapData.filter((p) => {
    const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
    const matchesType = !filters.propertyType || p.type === filters.propertyType;
    return matchesPrice && matchesType;
  });

  // Convert lat/lng to map position (simplified projection)
  const getMarkerPosition = (lat: number, lng: number) => {
    const bounds = mapBounds(mapData.length ? mapData : mapProperties);
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm shrink-0 z-50">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/browse" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Map View</h1>
              <p className="text-xs text-zinc-500">{filteredProperties.length} properties</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="hidden sm:flex items-center gap-3">
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="cabin">Cabin</option>
                <option value="cottage">Cottage</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Max:</span>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                >
                  <option value={100}>$100</option>
                  <option value={200}>$200</option>
                  <option value={300}>$300</option>
                  <option value={500}>$500</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowList(!showList)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors sm:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property List */}
        <div className={`${showList ? "w-full sm:w-96" : "hidden"} sm:block border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto`}>
          <div className="p-4 space-y-4">
            {filteredProperties.map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedProperty?.id === property.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-1">{property.title}</h3>
                    <p className="text-xs text-zinc-500 capitalize mt-0.5">{property.type}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs">{property.rating}</span>
                      <span className="text-xs text-zinc-400">({property.reviews})</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">
                      {formatCurrency(property.price)}
                      <span className="font-normal text-zinc-500"> /night</span>
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className={`${showList ? "hidden sm:block" : "block"} flex-1 relative bg-zinc-200 dark:bg-zinc-800`}>
          {/* Simulated Map Background */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Water/ocean areas */}
              <rect x="0" y="0" width="100" height="100" fill="#e0f2fe" className="dark:fill-zinc-700" />

              {/* Land masses */}
              <path d="M0,30 Q20,20 40,35 T80,25 L100,30 L100,100 L0,100 Z" fill="#dcfce7" className="dark:fill-zinc-600" />
              <path d="M60,0 Q70,15 85,10 L100,0 L100,20 Q80,25 60,15 Z" fill="#dcfce7" className="dark:fill-zinc-600" />

              {/* Roads */}
              <line x1="20" y1="50" x2="80" y2="50" stroke="#d1d5db" strokeWidth="0.5" className="dark:stroke-zinc-500" />
              <line x1="50" y1="30" x2="50" y2="70" stroke="#d1d5db" strokeWidth="0.5" className="dark:stroke-zinc-500" />
              <line x1="30" y1="40" x2="70" y2="60" stroke="#d1d5db" strokeWidth="0.3" className="dark:stroke-zinc-500" />
            </svg>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 2))}
              className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 0.5))}
              className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-lg shadow-lg flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>

          {/* Property Markers */}
          {filteredProperties.map((property) => {
            const pos = getMarkerPosition(property.lat, property.lng);
            const isSelected = selectedProperty?.id === property.id;
            const isHovered = hoveredProperty === property.id;

            return (
              <div
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-full z-20"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <button
                  onClick={() => setSelectedProperty(property)}
                  onMouseEnter={() => setHoveredProperty(property.id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  className={`relative px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg transition-all ${
                    isSelected || isHovered
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 scale-110"
                      : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:scale-105"
                  }`}
                >
                  {formatCurrency(property.price)}
                  <div className={`absolute left-1/2 -bottom-1.5 w-3 h-3 transform -translate-x-1/2 rotate-45 ${
                    isSelected || isHovered
                      ? "bg-zinc-900 dark:bg-white"
                      : "bg-white dark:bg-zinc-900"
                  }`} />
                </button>
              </div>
            );
          })}

          {/* Selected Property Popup */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden z-30">
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-zinc-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <FavoriteButton propertyId={selectedProperty.id} size="sm" />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedProperty.title}</h3>
                    <p className="text-sm text-zinc-500 capitalize">{selectedProperty.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">{selectedProperty.rating}</span>
                    <span className="text-sm text-zinc-400">({selectedProperty.reviews})</span>
                  </div>
                </div>

                <p className="text-sm text-zinc-500 mt-2">
                  {selectedProperty.bedrooms} beds · {selectedProperty.bathrooms} baths
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p>
                    <span className="text-lg font-bold">{formatCurrency(selectedProperty.price)}</span>
                    <span className="text-zinc-500"> /night</span>
                  </p>
                  <Link
                    href={`/property/${selectedProperty.id}`}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Mobile toggle button */}
          <button
            onClick={() => setShowList(!showList)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:hidden px-4 py-2 bg-white dark:bg-zinc-900 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Show List
          </button>
        </div>
      </div>

      {/* Privacy & Data Security */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Privacy & Data Security (Highly Focused)</h2>
              <p className="text-sm text-zinc-500">Our map and listing data is protected by strict privacy controls.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-semibold mb-2">PII Minimization</h3>
              <p className="text-sm text-zinc-500">Exact guest identities and access codes never appear on public map views. Only anonymized listing metadata is displayed.</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-semibold mb-2">Encryption & Access</h3>
              <p className="text-sm text-zinc-500">All sensitive data is encrypted in transit and at rest. Access is gated by roles (host/admin) and audited.</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-semibold mb-2">Regional Compliance</h3>
              <p className="text-sm text-zinc-500">We support GDPR/CCPA-style data requests, retention limits, and redaction for compliance-ready operations.</p>
            </div>
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            Security posture: strict role-based access, audit logging, data minimization, and privacy-first UI exposure.
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MapPage() {
  return (
    <FavoritesProvider>
      <MapContent />
    </FavoritesProvider>
  );
}
