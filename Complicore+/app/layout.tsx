/**
 * Root layout — html / body / fonts only.
 *
 * Navigation and footer live in route-group layouts so they are NOT
 * injected into /dashboard/* routes (which use a separate shell).
 *
 *   app/(marketing)/layout.tsx  → TopNav + Footer
 *   app/(auth)/layout.tsx       → Minimal centred auth shell
 *   app/dashboard/layout.tsx    → SideNav + DashboardHeader
 */
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor: '#0B1020',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://complicoreplus.com'
  ),
  title: {
    default: 'CompliCore+ — AI Workflow Automation for Property Managers',
    template: '%s | CompliCore+',
  },
  description:
    'Respond to leasing inquiries instantly, automate follow-up, and reduce admin work with active agent flows that run continuously.',
  openGraph: {
    type: 'website',
    siteName: 'CompliCore+',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'CompliCore+' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* Skip-nav link — WCAG 2.2 AA */}
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-canvas focus:px-3 focus:py-2 focus:text-tp focus:text-14 focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
