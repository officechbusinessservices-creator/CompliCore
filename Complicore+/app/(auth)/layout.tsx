/**
 * Auth route group layout — /login, /signup, /reset-password.
 * Minimal centred shell: no TopNav, no Footer, no SideNav.
 */
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Minimal header — wordmark only */}
      <header className="h-16 flex items-center px-4 border-b border-line">
        <Link
          href="/"
          aria-label="CompliCore+ — back to home"
          className="text-18 font-bold text-tp tracking-tight"
        >
          CompliCore<span className="text-primary">+</span>
        </Link>
      </header>

      {/* Centred auth content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex items-center justify-center px-4 py-12"
      >
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="h-12 flex items-center justify-center px-4 border-t border-line">
        <p className="text-12 text-ts">
          © {new Date().getFullYear()} CompliCore+
          <span className="mx-2 opacity-40">·</span>
          <Link href="/privacy" className="hover:text-tp transition-colors duration-180">
            Privacy
          </Link>
          <span className="mx-2 opacity-40">·</span>
          <Link href="/terms" className="hover:text-tp transition-colors duration-180">
            Terms
          </Link>
        </p>
      </footer>
    </div>
  )
}
