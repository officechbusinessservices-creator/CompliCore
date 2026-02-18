"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  LayoutDashboard, Home, Calendar, DollarSign, MessageSquare,
  Wrench, LogOut, Settings, Bell, ChevronRight, Globe, TrendingUp, Map, Search,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { ToastProvider } from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Listings", icon: Home },
  { href: "/bookings", label: "Bookings", icon: Calendar },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/messaging", label: "Messaging", icon: MessageSquare },
  { href: "/ops", label: "Operations", icon: Wrench },
  { href: "/channels", label: "Channels", icon: Globe },
  { href: "/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r border-border bg-card">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          CompliCore
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Host Console
        </p>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              {!active && <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />}
            </Link>
          );
        })}
        <div className="pt-2 border-t border-border mt-2">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Help
          </p>
          <Link
            href="/nav-guide"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
              pathname === "/nav-guide"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Map className="w-4 h-4 flex-shrink-0" />
            Navigation guide
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </Link>
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Link>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            JD
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">Jane Demo</div>
            <div className="text-xs text-muted-foreground truncate">Host Club</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <CommandPalette />
      <div className="min-h-screen bg-background text-foreground flex">
        <SidebarContent pathname={pathname} />

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            {/* Mobile logo */}
            <Link href="/" className="flex md:hidden items-center gap-2 font-bold text-base">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              CompliCore
            </Link>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium capitalize">
                {pathname.split("/").filter(Boolean)[0] || "Console"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Command palette trigger */}
              <button
                onClick={() => {
                  const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
                  window.dispatchEvent(e);
                }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Search…
                <kbd className="ml-1 px-1 py-0.5 rounded bg-muted font-mono text-[10px]">⌘K</kbd>
              </button>
              <ThemeToggle />
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </Link>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary cursor-pointer">
                JD
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto pb-20 md:pb-6">
            {children}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>
    </ToastProvider>
  );
}
