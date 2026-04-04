'use client'

/**
 * Dashboard layout — SideNav + DashboardHeader.
 * No TopNav or Footer from the marketing layout; this is its own shell.
 * Auth guard is enforced in middleware.ts (not yet built — see file tree).
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// ─── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: '/dashboard/overview',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    href: '/dashboard/flows',
    label: 'Flows',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="13" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M13 7.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/leads',
    label: 'Leads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1 14c0-3 2-5 5-5s5 2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M11 7l1.5 1.5L15 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/billing',
    label: 'Billing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3" />
        <rect x="3" y="9.5" width="4" height="1.5" rx="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/dashboard/demo',
    label: 'Demo Console',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4 14h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M8 12v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M5 6.5l2 1.5-2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1"
          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
]

// ─── SideNav ───────────────────────────────────────────────────────────────────

function SideNav() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col w-56 flex-shrink-0 bg-surface border-r border-line h-screen sticky top-0"
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-line flex-shrink-0">
        <Link href="/" className="text-16 font-bold text-tp tracking-tight hover:opacity-80 transition-opacity duration-180">
          CompliCore<span className="text-primary">+</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="flex flex-col gap-0.5 list-none p-0">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-sm text-14 font-medium',
                    'transition-colors duration-180 min-h-touch',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-ts hover:bg-surface-elevated hover:text-tp'
                  )}
                >
                  <span className="flex-shrink-0">{icon}</span>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: user stub */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-sm">
          <div className="w-7 h-7 rounded-full bg-surface-elevated border border-line flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" className="text-ts" />
              <path d="M1.5 12c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-ts" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-12 font-medium text-tp truncate">Dashboard</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Layout ────────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-canvas min-h-screen">
      <SideNav />
      <div className="flex-1 min-w-0 flex flex-col">
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
