/**
 * Marketing route group layout.
 * Wraps all public marketing pages with TopNav + Footer.
 *
 * Pages in this group (URL paths unchanged):
 *   /             → (marketing)/page.tsx
 *   /pricing      → (marketing)/pricing/page.tsx
 *   /demo         → (marketing)/demo/page.tsx
 *   /book-demo    → (marketing)/book-demo/page.tsx
 *   /faq          → (marketing)/faq/page.tsx
 *   /property-management-ai, /lead-response-automation, etc.
 *   /case-studies, /compare/*, /contact
 */
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
