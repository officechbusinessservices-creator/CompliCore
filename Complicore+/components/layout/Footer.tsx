import Link from 'next/link'

// ─── Link structure ───────────────────────────────────────────────────────────

const FOOTER_COLS: { group: string; links: { href: string; label: string }[] }[] = [
  {
    group: 'Product',
    links: [
      { href: '/demo',       label: 'Interactive Demo' },
      { href: '/pricing',    label: 'Pricing'          },
      { href: '/dashboard',  label: 'Dashboard'        },
    ],
  },
  {
    group: 'Solutions',
    links: [
      { href: '/lead-response-automation',       label: 'Lead Response'   },
      { href: '/leasing-follow-up-automation',   label: 'Leasing Follow-Up' },
      { href: '/admin-routing-automation',       label: 'Admin Routing'   },
    ],
  },
  {
    group: 'Company',
    links: [
      { href: '/property-management-ai', label: 'Property Management AI' },
      { href: '/case-studies',           label: 'Case Studies'           },
      { href: '/compare/virtual-assistant-vs-ai-workflows', label: 'VS Virtual Assistants' },
      { href: '/faq',                    label: 'FAQ'                    },
      { href: '/contact',                label: 'Contact'                },
    ],
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-surface border-t border-line"
    >
      {/* Main footer body */}
      <div className="site-container py-12">
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>

          {/* Brand column */}
          <div>
            <Link
              href="/"
              aria-label="CompliCore+ — home"
              className="text-18 font-bold text-tp tracking-tight hover:opacity-90 transition-opacity duration-180 inline-block mb-3"
            >
              CompliCore<span className="text-primary">+</span>
            </Link>
            <p className="text-14 text-ts leading-relaxed max-w-[200px]">
              AI workflow automation for residential property managers.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ group, links }) => (
            <div key={group}>
              <p className="eyebrow mb-3">{group}</p>
              <ul className="flex flex-col gap-2.5 list-none p-0">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-14 text-ts hover:text-tp transition-colors duration-180"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal row */}
      <div className="border-t border-line">
        <div className="site-container py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-12 text-ts">
            © {new Date().getFullYear()} CompliCore+. All rights reserved.
          </p>
          <nav aria-label="Legal navigation" className="flex gap-4">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms',   label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-12 text-ts hover:text-tp transition-colors duration-180"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
