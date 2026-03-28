import Link from 'next/link'

const links = [
  { label: 'Product', href: '/property-management-ai' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Demo', href: '/demo' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#25314F] bg-[#0F1528]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-xs font-bold text-[#0B1020]">C+</span>
              </div>
              <span className="font-bold text-[#F5F7FB]">
                CompliCore<span className="text-brand">+</span>
              </span>
            </div>
            <p className="text-sm text-[#8A95B2] leading-relaxed">
              AI workflow automation for property managers. Respond instantly, follow up automatically, route correctly.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-[#8A95B2] uppercase tracking-widest">Product</p>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-[#B8C1D9] hover:text-[#F5F7FB] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-[#8A95B2] uppercase tracking-widest">Legal</p>
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-[#B8C1D9] hover:text-[#F5F7FB] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#25314F] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#8A95B2]">
            &copy; {new Date().getFullYear()} CompliCore+. All rights reserved.
          </p>
          <p className="text-sm text-[#8A95B2]">
            Built for property managers who cannot afford missed leads.
          </p>
        </div>
      </div>
    </footer>
  )
}
