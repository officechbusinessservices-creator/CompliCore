'use client'

/**
 * TopNav — sticky marketing header.
 *
 * Motion spec (02_DESIGN_SYSTEM.md):
 *   - Default height 80px → scrolled 64px over 300ms
 *   - Page load: fade-in over 250ms
 *   - Mobile drawer: slide from left over 240ms
 *
 * Accessibility: WCAG 2.2 AA — visible focus states, keyboard-complete,
 * semantic <header>/<nav>, aria-current on active route, aria-expanded
 * on mobile toggle.
 *
 * Hover states use Tailwind CSS classes, not imperative DOM mutation.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Nav structure ─────────────────────────────────────────────────────────────

const PRIMARY_NAV: { href: string; label: string }[] = [
  { href: '/pricing',                 label: 'Pricing'  },
  { href: '/demo',                    label: 'Demo'     },
  { href: '/property-management-ai',  label: 'Product'  },
  { href: '/faq',                     label: 'FAQ'      },
]

// ─── Wordmark ──────────────────────────────────────────────────────────────────

function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="CompliCore+ — home"
      className="text-18 font-bold text-tp tracking-tight hover:opacity-90 transition-opacity duration-180 focus-visible:rounded-sm"
    >
      CompliCore<span className="text-primary">+</span>
    </Link>
  )
}

// ─── Desktop nav link ──────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'text-14 font-medium transition-colors duration-180 min-h-touch flex items-center px-1 rounded-sm',
        active
          ? 'text-tp'
          : 'text-ts hover:text-tp'
      )}
    >
      {label}
    </Link>
  )
}

// ─── Mobile drawer nav link ────────────────────────────────────────────────────

function DrawerLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'text-16 font-medium min-h-touch flex items-center py-2',
        'transition-colors duration-180',
        active ? 'text-tp' : 'text-ts hover:text-tp'
      )}
    >
      {label}
    </Link>
  )
}

// ─── Hamburger icon ────────────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      {open ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        />
      ) : (
        <>
          <rect x="2" y="5"  width="16" height="1.5" rx="0.75" />
          <rect x="2" y="9.25" width="16" height="1.5" rx="0.75" />
          <rect x="2" y="13.5" width="16" height="1.5" rx="0.75" />
        </>
      )}
    </svg>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function TopNav() {
  const pathname      = usePathname()
  const [scrolled,    setScrolled]    = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const drawerRef     = useRef<HTMLDivElement>(null)
  const toggleRef     = useRef<HTMLButtonElement>(null)

  // Scroll-aware height transition (80px → 64px)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  // Trap focus inside open drawer; close on Escape
  useEffect(() => {
    if (!drawerOpen) return
    const el = drawerRef.current
    if (!el) return

    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    first?.focus()
    return () => document.removeEventListener('keydown', handleKey)
  }, [drawerOpen])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 bg-canvas border-b border-line',
          'transition-all duration-300 animate-fade-in',
          scrolled ? 'h-16' : 'h-20'
        )}
        role="banner"
      >
        <div className="site-container h-full flex items-center justify-between gap-4">

          <Wordmark />

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-4"
          >
            {PRIMARY_NAV.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                active={pathname === href || pathname.startsWith(href + '/')}
              />
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="text-14 font-medium text-ts hover:text-tp transition-colors duration-180 min-h-touch flex items-center px-3 rounded-sm"
            >
              Log in
            </Link>
            <Link
              href="/book-demo"
              className={cn(
                'text-14 font-semibold text-canvas bg-primary',
                'min-h-touch flex items-center px-5 rounded-sm',
                'transition-colors duration-180 hover:bg-primary-hover',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
              )}
            >
              Book Demo
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setDrawerOpen(v => !v)}
            className={cn(
              'md:hidden flex items-center justify-center',
              'min-h-touch min-w-touch rounded-sm',
              'text-tp transition-colors duration-180',
              'hover:bg-surface focus-visible:bg-surface'
            )}
          >
            <HamburgerIcon open={drawerOpen} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw]',
          'bg-surface border-r border-line',
          'flex flex-col pt-4 pb-6 px-4',
          'md:hidden',
          drawerOpen ? 'animate-slide-in-left' : 'hidden'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between mb-6">
          <Wordmark />
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="min-h-touch min-w-touch flex items-center justify-center text-ts hover:text-tp transition-colors duration-180 rounded-sm"
          >
            <HamburgerIcon open={true} />
          </button>
        </div>

        {/* Drawer links */}
        <nav aria-label="Mobile navigation" className="flex flex-col border-t border-line pt-2">
          {PRIMARY_NAV.map(({ href, label }) => (
            <DrawerLink
              key={href}
              href={href}
              label={label}
              active={pathname === href}
              onClick={() => setDrawerOpen(false)}
            />
          ))}
        </nav>

        {/* Drawer CTAs */}
        <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-line">
          <Link
            href="/login"
            onClick={() => setDrawerOpen(false)}
            className="text-14 font-medium text-ts hover:text-tp transition-colors duration-180 min-h-touch flex items-center"
          >
            Log in
          </Link>
          <Link
            href="/book-demo"
            onClick={() => setDrawerOpen(false)}
            className="text-14 font-semibold text-canvas bg-primary hover:bg-primary-hover min-h-touch flex items-center justify-center rounded-sm transition-colors duration-180"
          >
            Book Demo
          </Link>
        </div>
      </div>
    </>
  )
}
