import Link from "next/link";
import { ReactNode } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/listings", label: "Listings" },
  { href: "/bookings", label: "Bookings" },
  { href: "/pricing", label: "Pricing" },
  { href: "/messaging", label: "Messaging" },
  { href: "/ops", label: "Operations" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-[240px_1fr]">
      <aside className="border-r border-border p-4 space-y-6">
        <div className="text-lg font-semibold">Host Console</div>
        <nav className="space-y-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6 space-y-4">
        <header className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Breadcrumbs / Page</div>
          <div className="text-xs text-muted-foreground">User · Org</div>
        </header>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm min-h-[60vh]">{children}</div>
      </main>
    </div>
  );
}
