import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, MessageSquare, WalletCards } from "lucide-react";
import {
  LANDING_BRAND_COPY,
  LANDING_SHARED_COPY,
} from "@/lib/landing-copy";

const trustPillars = [
  {
    title: "Verified stays",
    desc: "Listings and hosts are screened with identity and quality checks before guests book.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent pricing",
    desc: "See nightly rates, fees, and taxes up front before checkout. No hidden surprises.",
    icon: WalletCards,
  },
  {
    title: "Unified support",
    desc: "Message hosts and support in one thread, with trip details and receipts in a single view.",
    icon: MessageSquare,
  },
];

export default function GuestLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">{LANDING_BRAND_COPY.name}</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/browse" className="hover:text-foreground text-muted-foreground transition-colors">Explore stays</Link>
            <Link href="/landing/host" className="hover:text-foreground text-muted-foreground transition-colors">{LANDING_SHARED_COPY.hostsLinkLabel}</Link>
            <Link href="/portal/guest" className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">{LANDING_SHARED_COPY.guestPortalLabel}</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-primary/10 text-primary rounded-full">
            Guest Experience
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-4 leading-tight">
            Verified stays. Transparent pricing. Zero booking surprises.
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Book short-, mid-, or long-term stays with confidence. {LANDING_BRAND_COPY.name} combines trusted host verification, clear total pricing, and responsive support from search to checkout.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/browse" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
              Search stays
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/portal/guest" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Manage your trips</Link>
            <Link href="/landing/host" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Host a property</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Trusted by 2,400+ travelers</span>
            <span>4.9★ average stay rating</span>
            <span>24/7 guest support</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold mb-3">Every booking includes</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Clear checkout totals before payment</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Verified host and listing trust signals</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Unified messaging and support escalation</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Secure check-in flows and trip receipts</li>
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            Browse for free. Book with flexible policies and transparent terms.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 grid md:grid-cols-3 gap-4">
        {trustPillars.map((item) => (
          <article key={item.title} className="p-5 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <article className="p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-2">Designed for repeat travel</h3>
            <p className="text-sm text-muted-foreground mb-4">
              One account manages your upcoming stays, guest messages, itineraries, and receipts across every destination.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>Smart trip timeline</div>
              <div>Shared itineraries</div>
              <div>Receipt tracking</div>
              <div>Fast rebooking flow</div>
            </div>
          </article>

          <article className="p-6 rounded-xl bg-foreground text-background">
            <h3 className="font-semibold mb-2">Ready for your next stay?</h3>
            <p className="text-sm text-background/80 mb-4">
              Explore curated properties for business trips, weekend getaways, and longer stays.
            </p>
            <Link href="/browse" className="inline-flex px-4 py-2 bg-background text-foreground rounded-lg font-medium">
              Explore stays
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
