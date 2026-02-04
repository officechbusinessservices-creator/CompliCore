"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

// Parsed API endpoints from the OpenAPI spec
const apiEndpoints = {
  Authentication: [
    {
      method: "POST",
      path: "/auth/register",
      summary: "Register new user",
      description: "Create a new user account with email, password, and profile information.",
      requestBody: {
        email: "string (required)",
        password: "string (min 12 chars)",
        firstName: "string (required)",
        lastName: "string (required)",
        phone: "string (optional)",
      },
      responses: {
        201: "User registered successfully",
        400: "Invalid request",
        409: "Email already registered",
      },
    },
    {
      method: "POST",
      path: "/auth/login",
      summary: "Authenticate user",
      description: "Login with email and password to receive access tokens.",
      requestBody: {
        email: "string (required)",
        password: "string (required)",
      },
      responses: {
        200: "Login successful - returns access and refresh tokens",
        401: "Invalid credentials",
      },
    },
    {
      method: "POST",
      path: "/auth/refresh",
      summary: "Refresh access token",
      description: "Get a new access token using a valid refresh token.",
      auth: true,
      responses: {
        200: "Token refreshed",
        401: "Invalid or expired refresh token",
      },
    },
  ],
  Users: [
    {
      method: "GET",
      path: "/users/me",
      summary: "Get current user profile",
      description: "Retrieve the authenticated user's profile information.",
      auth: true,
      responses: {
        200: "User profile returned",
        401: "Not authenticated",
      },
    },
    {
      method: "PATCH",
      path: "/users/me",
      summary: "Update current user profile",
      description: "Update profile fields for the authenticated user.",
      auth: true,
      requestBody: {
        firstName: "string",
        lastName: "string",
        displayName: "string",
        phone: "string",
      },
      responses: {
        200: "User updated",
        400: "Invalid request",
      },
    },
  ],
  Properties: [
    {
      method: "GET",
      path: "/properties",
      summary: "Search properties",
      description: "Search for available properties with filters.",
      parameters: {
        location: "string - Location search query",
        checkIn: "date - Check-in date",
        checkOut: "date - Check-out date",
        guests: "integer - Number of guests",
        minPrice: "number - Minimum price",
        maxPrice: "number - Maximum price",
        propertyType: "array - Property types to include",
        amenities: "array - Required amenities",
        cursor: "string - Pagination cursor",
        limit: "integer - Results per page (max 100)",
      },
      responses: {
        200: "Search results with pagination",
      },
    },
    {
      method: "POST",
      path: "/properties",
      summary: "Create new property listing",
      description: "Create a new property listing (hosts only).",
      auth: true,
      requestBody: {
        title: "string (required, max 100)",
        description: "string (max 5000)",
        propertyType: "enum (required)",
        roomType: "enum",
        address: "object (required)",
        bedrooms: "integer (required)",
        beds: "integer (required)",
        bathrooms: "number (required)",
        maxGuests: "integer (required)",
        amenities: "array",
      },
      responses: {
        201: "Property created",
        400: "Invalid request",
        403: "Not authorized as host",
      },
    },
    {
      method: "GET",
      path: "/properties/{propertyId}",
      summary: "Get property details",
      description: "Retrieve full details for a specific property.",
      parameters: {
        propertyId: "uuid (required) - Property ID",
      },
      responses: {
        200: "Property details",
        404: "Property not found",
      },
    },
    {
      method: "GET",
      path: "/properties/{propertyId}/availability",
      summary: "Get property availability",
      description: "Retrieve availability calendar for a date range.",
      auth: false,
      parameters: {
        propertyId: "uuid (required)",
        startDate: "date (required)",
        endDate: "date (required)",
      },
      responses: {
        200: "Availability calendar with daily status and prices",
      },
    },
    {
      method: "POST",
      path: "/properties/{propertyId}/quote",
      summary: "Get booking quote",
      description: "Calculate pricing for a potential booking.",
      requestBody: {
        checkIn: "date (required)",
        checkOut: "date (required)",
        guests: "integer (required)",
      },
      responses: {
        200: "Price quote with breakdown",
        400: "Invalid dates or guests",
      },
    },
  ],
  Bookings: [
    {
      method: "GET",
      path: "/bookings",
      summary: "List user's bookings",
      description: "Get all bookings for the authenticated user (as guest or host).",
      auth: true,
      parameters: {
        status: "enum - Filter by booking status",
        role: "enum - Filter by role (guest/host)",
        cursor: "string - Pagination cursor",
        limit: "integer - Results per page",
      },
      responses: {
        200: "List of bookings",
      },
    },
    {
      method: "POST",
      path: "/bookings",
      summary: "Create new booking",
      description: "Create a new booking reservation.",
      auth: true,
      requestBody: {
        propertyId: "uuid (required)",
        checkIn: "date (required)",
        checkOut: "date (required)",
        guests: "integer (required)",
        specialRequests: "string",
        paymentMethodId: "string",
      },
      responses: {
        201: "Booking created",
        400: "Invalid request",
        409: "Dates not available",
      },
    },
    {
      method: "GET",
      path: "/bookings/{bookingId}",
      summary: "Get booking details",
      description: "Retrieve full details for a specific booking.",
      auth: true,
      responses: {
        200: "Booking details",
        403: "Not authorized",
        404: "Booking not found",
      },
    },
    {
      method: "POST",
      path: "/bookings/{bookingId}/cancel",
      summary: "Cancel booking",
      description: "Cancel an existing booking and process refund per policy.",
      auth: true,
      requestBody: {
        reason: "string - Cancellation reason",
      },
      responses: {
        200: "Booking cancelled with refund details",
        400: "Cannot cancel",
      },
    },
  ],
  Payments: [
    {
      method: "GET",
      path: "/payments/methods",
      summary: "List saved payment methods",
      description: "Get all saved payment methods for the user.",
      auth: true,
      responses: {
        200: "List of payment methods",
      },
    },
    {
      method: "POST",
      path: "/payments/checkout",
      summary: "Process payment for booking",
      description: "Process payment to confirm a booking.",
      auth: true,
      requestBody: {
        bookingId: "uuid (required)",
        paymentMethodId: "string",
      },
      responses: {
        200: "Payment processed successfully",
        400: "Payment failed",
      },
    },
  ],
  Messages: [
    {
      method: "GET",
      path: "/messages/threads",
      summary: "List message threads",
      description: "Get all message threads for the user.",
      auth: true,
      responses: {
        200: "List of message threads",
      },
    },
    {
      method: "GET",
      path: "/messages/threads/{threadId}",
      summary: "Get messages in thread",
      description: "Retrieve all messages in a conversation thread.",
      auth: true,
      responses: {
        200: "Thread with messages",
      },
    },
    {
      method: "POST",
      path: "/messages/send",
      summary: "Send message",
      description: "Send a new message to another user.",
      auth: true,
      requestBody: {
        recipientId: "uuid (required)",
        bookingId: "uuid",
        content: "string (required, max 5000)",
      },
      responses: {
        201: "Message sent",
        400: "Invalid request",
      },
    },
  ],
  Reviews: [
    {
      method: "POST",
      path: "/reviews",
      summary: "Submit review",
      description: "Submit a review for a completed booking.",
      auth: true,
      requestBody: {
        bookingId: "uuid (required)",
        overallRating: "integer 1-5 (required)",
        categoryRatings: "object",
        comment: "string 50-2000 chars (required)",
      },
      responses: {
        201: "Review submitted",
        400: "Invalid request",
      },
    },
    {
      method: "GET",
      path: "/properties/{propertyId}/reviews",
      summary: "Get property reviews",
      description: "Get all reviews for a property with ratings.",
      parameters: {
        cursor: "string - Pagination cursor",
        limit: "integer - Results per page",
      },
      responses: {
        200: "Reviews with average rating",
      },
    },
  ],
  AI: [
    {
      method: "GET",
      path: "/ai/pricing/suggestions",
      summary: "Get AI pricing suggestions",
      description: "Get AI-powered pricing suggestions for a property and date range.",
      auth: true,
      parameters: {
        propertyId: "uuid (required)",
        startDate: "date (required)",
        endDate: "date (required)",
      },
      responses: {
        200: "Pricing suggestions with confidence scores and factors",
      },
    },
    {
      method: "POST",
      path: "/ai/listing/optimize",
      summary: "Get listing optimization suggestions",
      description: "Get AI suggestions to improve listing title, description, and photos.",
      auth: true,
      requestBody: {
        propertyId: "uuid (required)",
        aspects: "array - title, description, photos",
      },
      responses: {
        200: "Optimization suggestions with confidence",
      },
    },
  ],
  Analytics: [
    {
      method: "GET",
      path: "/analytics/dashboard",
      summary: "Get dashboard metrics",
      description: "Get aggregated analytics for the host dashboard.",
      auth: true,
      parameters: {
        startDate: "date",
        endDate: "date",
      },
      responses: {
        200: "Dashboard metrics including bookings, revenue, occupancy",
      },
    },
  ],
};

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500",
  POST: "bg-blue-500",
  PATCH: "bg-amber-500",
  PUT: "bg-amber-500",
  DELETE: "bg-rose-500",
};

interface Endpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  auth?: boolean;
  parameters?: Record<string, string>;
  requestBody?: Record<string, string>;
  responses: Record<string | number, string>;
}

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Authentication");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Object.keys(apiEndpoints);

  const filteredEndpoints = searchQuery
    ? Object.entries(apiEndpoints).flatMap(([category, endpoints]) =>
        endpoints
          .filter(
            (e) =>
              e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.summary.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((e) => ({ ...e, category }))
      )
    : null;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-lg">API Documentation</span>
              <p className="text-xs text-zinc-500">OpenAPI 3.1 Specification</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints..."
              className="px-4 py-2 w-64 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <ThemeToggle />
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
              Back to Docs
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold">Endpoints</h3>
              </div>
              <div className="p-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedEndpoint(null);
                      setSearchQuery("");
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      selectedCategory === category && !searchQuery
                        ? "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-xs text-zinc-400">
                        {apiEndpoints[category as keyof typeof apiEndpoints].length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search Results or Category Endpoints */}
            {(filteredEndpoints || apiEndpoints[selectedCategory as keyof typeof apiEndpoints]).map(
              (endpoint, idx: number) => {
                const ep = endpoint as Endpoint & { category?: string };
                return (
                <div
                  key={`${ep.path}-${idx}`}
                  className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedEndpoint(
                        selectedEndpoint?.path === ep.path ? null : ep
                      )
                    }
                    className="w-full p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs font-mono font-bold text-white rounded ${
                          methodColors[ep.method]
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                        {ep.path}
                      </code>
                      {ep.auth && (
                        <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                          Auth Required
                        </span>
                      )}
                      {ep.category && (
                        <span className="ml-auto text-xs text-zinc-400">
                          {ep.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {ep.summary}
                    </p>
                  </button>

                  {/* Expanded Details */}
                  {selectedEndpoint?.path === ep.path && (
                    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/30">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        {ep.description}
                      </p>

                      {ep.parameters && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-zinc-100 dark:bg-zinc-800">
                                <tr>
                                  <th className="px-3 py-2 text-left font-medium">Name</th>
                                  <th className="px-3 py-2 text-left font-medium">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                {Object.entries(ep.parameters).map(([name, desc]) => (
                                  <tr key={name}>
                                    <td className="px-3 py-2 font-mono text-violet-600 dark:text-violet-400">
                                      {name}
                                    </td>
                                    <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{desc}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {ep.requestBody && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                            <pre className="text-emerald-400">
                              {JSON.stringify(ep.requestBody, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Responses</h4>
                        <div className="space-y-2">
                          {Object.entries(ep.responses).map(([code, desc]) => (
                            <div
                              key={code}
                              className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700"
                            >
                              <span
                                className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                                  String(code).startsWith("2")
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                    : String(code).startsWith("4")
                                    ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"
                                }`}
                              >
                                {code}
                              </span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
