"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Calendar, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Listings", icon: Home },
  { href: "/bookings", label: "Bookings", icon: Calendar },
  { href: "/messaging", label: "Messages", icon: MessageSquare },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Bottom tab bar — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{t.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-background flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="font-bold text-lg">Menu</span>
            <button onClick={() => setMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/listings", label: "Listings" },
              { href: "/bookings", label: "Bookings" },
              { href: "/pricing", label: "Pricing" },
              { href: "/messaging", label: "Messaging" },
              { href: "/ops", label: "Operations" },
              { href: "/settings", label: "Settings" },
              { href: "/onboarding", label: "Add property" },
              { href: "/search", label: "Browse stays" },
              { href: "/", label: "Home" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-border">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center py-3 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
              Sign out
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
