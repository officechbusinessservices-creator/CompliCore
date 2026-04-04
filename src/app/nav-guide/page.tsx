import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

const sections = [
  {
    title: "🌐 Public / Guest",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600",
    routes: [
      { path: "/", label: "Landing page", desc: "Hero, features, pricing, testimonials, CTA" },
      { path: "/search", label: "Search & browse", desc: "Listing grid, filters, category pills" },
      { path: "/property/1", label: "Property detail", desc: "Photos, amenities, reviews, booking card" },
      { path: "/guest/booking", label: "Booking confirmation", desc: "Summary, check-in instructions, smart lock code" },
      { path: "/guest/review", label: "Leave a review", desc: "6-category star ratings + written review" },
    ],
  },
  {
    title: "🔐 Auth",
    color: "border-purple-500/30 bg-purple-500/5",
    badge: "bg-purple-500/10 text-purple-600",
    routes: [
      { path: "/login", label: "Sign in", desc: "Email/password login with remember me" },
      { path: "/signup", label: "Create account", desc: "Role-based signup → onboarding or search" },
      { path: "/onboarding", label: "Host onboarding wizard", desc: "6-step: type → location → details → amenities → pricing → done" },
    ],
  },
  {
    title: "🏠 Host Console",
    color: "border-emerald-500/30 bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-600",
    routes: [
      { path: "/dashboard", label: "Dashboard", desc: "KPIs, upcoming bookings, tasks, analytics chart" },
      { path: "/listings", label: "Listings", desc: "Property cards, status, quick actions" },
      { path: "/bookings", label: "Bookings", desc: "Booking table with filters and status" },
      { path: "/pricing", label: "Pricing", desc: "AI pricing rules, seasonal overrides" },
      { path: "/messaging", label: "Messaging", desc: "Unified inbox, AI-assisted replies" },
      { path: "/ops", label: "Operations", desc: "Cleaning, maintenance, smart lock management" },
      { path: "/channels", label: "Channel Manager", desc: "Connect Airbnb, VRBO, Booking.com, Expedia" },
      { path: "/revenue", label: "Revenue & Forecasting", desc: "YTD metrics, 6-month AI forecast, top properties" },
      { path: "/notifications", label: "Notifications", desc: "Filterable notification center with read/dismiss" },
      { path: "/settings", label: "Settings", desc: "Profile, billing, integrations, compliance" },
    ],
  },
  {
    title: "🏢 Landing / Marketing",
    color: "border-amber-500/30 bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-600",
    routes: [
      { path: "/landing/host", label: "For Hosts", desc: "Host-focused feature page" },
      { path: "/landing/guest", label: "For Guests", desc: "Guest-focused feature page" },
      { path: "/landing/enterprise", label: "Enterprise", desc: "Enterprise / corporate travel page" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          CompliCore
        </Link>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Go to dashboard →
        </Link>
        {/* Note: this page is at /nav-guide (not /sitemap which is reserved by Next.js) */}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Navigation Guide</h1>
          <p className="text-muted-foreground">Every page in CompliCore — what it does and how to get there.</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className={`rounded-xl border p-6 ${section.color}`}>
              <h2 className="font-bold text-lg mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-background/60 hover:bg-background transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${section.badge}`}>
                          {route.path}
                        </span>
                      </div>
                      <div className="font-medium text-sm">{route.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{route.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-xl border border-border bg-card text-sm text-muted-foreground">
          <strong className="text-foreground block mb-1">💡 Quick navigation tips</strong>
          <ul className="space-y-1 list-disc list-inside">
            <li>On desktop: use the left sidebar in the host console to navigate between pages</li>
            <li>On mobile: use the bottom tab bar (Dashboard, Listings, Bookings, Messages) or tap "More"</li>
            <li>Theme toggle (☀️/🌙) is in the top-right of every page</li>
            <li>Guests start at <code className="bg-muted px-1 rounded">/search</code> → property → booking → review</li>
            <li>New hosts: <code className="bg-muted px-1 rounded">/signup</code> → <code className="bg-muted px-1 rounded">/onboarding</code> → <code className="bg-muted px-1 rounded">/dashboard</code></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
