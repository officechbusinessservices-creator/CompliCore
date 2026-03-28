'use client'

import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from '@/lib/constants'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'h-16 bg-[#0B1020]/95 backdrop-blur-md border-b border-[#25314F]'
            : 'h-20 bg-transparent',
        )}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-xs font-bold text-[#0B1020]">C+</span>
            </div>
            <span className="font-bold text-base text-[#F5F7FB]">
              CompliCore<span className="text-brand">+</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#B8C1D9] hover:text-[#F5F7FB] rounded-xl transition-colors duration-[180ms]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/book-demo">
              <Button size="sm">Book Demo</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#B8C1D9]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0F1528] border-r border-[#25314F] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-[#F5F7FB]">
                CompliCore<span className="text-brand">+</span>
              </span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-[#B8C1D9]" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-[#B8C1D9] hover:text-[#F5F7FB] rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-6 border-t border-[#25314F]">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full">Log in</Button>
              </Link>
              <Link href="/book-demo" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Book Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
