"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "location" | "property" | "experience";
  title: string;
  subtitle: string;
  image?: string;
}

const popularDestinations: SearchResult[] = [
  { id: "loc-1", type: "location", title: "San Francisco, CA", subtitle: "United States" },
  { id: "loc-2", type: "location", title: "Lake Tahoe, CA", subtitle: "United States" },
  { id: "loc-3", type: "location", title: "Santa Cruz, CA", subtitle: "United States" },
  { id: "loc-4", type: "location", title: "Austin, TX", subtitle: "United States" },
  { id: "loc-5", type: "location", title: "Orlando, FL", subtitle: "United States" },
];

const properties: SearchResult[] = [
  { id: "prop-1", type: "property", title: "Modern Downtown Loft", subtitle: "San Francisco, CA", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100" },
  { id: "prop-2", type: "property", title: "Cozy Beachfront Cottage", subtitle: "Santa Cruz, CA", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=100" },
  { id: "prop-3", type: "property", title: "Luxury Mountain Cabin", subtitle: "Lake Tahoe, CA", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100" },
];

const RECENT_SEARCHES_KEY = "rental_platform_recent_searches";
const MAX_RECENT_SEARCHES = 5;

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Where are you going?",
  className = "",
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent searches:", e);
    }
  }, []);

  // Filter results based on query
  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const query = value.toLowerCase();
    const matchedLocations = popularDestinations.filter(
      (d) => d.title.toLowerCase().includes(query) || d.subtitle.toLowerCase().includes(query)
    );
    const matchedProperties = properties.filter(
      (p) => p.title.toLowerCase().includes(query) || p.subtitle.toLowerCase().includes(query)
    );

    setResults([...matchedLocations, ...matchedProperties].slice(0, 8));
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToRecent = (result: SearchResult) => {
    const updated = [result, ...recentSearches.filter((r) => r.id !== result.id)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent search:", e);
    }
  };

  const handleSelect = (result: SearchResult) => {
    onChange(result.title);
    saveToRecent(result);
    setIsOpen(false);
    onSelect?.(result);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "location":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "property":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50">
          {/* Recent Searches */}
          {!value && recentSearches.length > 0 && (
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-500 uppercase">Recent Searches</span>
                <button onClick={clearRecentSearches} className="text-xs text-zinc-400 hover:text-zinc-600">
                  Clear
                </button>
              </div>
              {recentSearches.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="text-xs text-zinc-500">{result.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {value && results.length > 0 && (
            <div className="p-3">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {result.image ? (
                    <img src={result.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      {getIcon(result.type)}
                    </div>
                  )}
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="text-xs text-zinc-500">{result.subtitle}</p>
                  </div>
                  <span className="text-xs text-zinc-400 capitalize">{result.type}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Destinations */}
          {!value && recentSearches.length === 0 && (
            <div className="p-3">
              <span className="text-xs font-medium text-zinc-500 uppercase block mb-2">Popular Destinations</span>
              {popularDestinations.slice(0, 5).map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleSelect(dest)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    {getIcon(dest.type)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{dest.title}</p>
                    <p className="text-xs text-zinc-500">{dest.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {value && results.length === 0 && (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-zinc-500">No results found for "{value}"</p>
              <p className="text-xs text-zinc-400 mt-1">Try searching for a city or property name</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
