import Link from "next/link";
import {
  Building2,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Star,
  ArrowRight,
  CheckCircle2,
  Users,
  Home,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  {
    icon: Building2,
    title: "Multi-Property Management",
    description:
      "Manage unlimited listings across Airbnb, VRBO, and Booking.com from a single dashboard. Sync calendars, rates, and availability in real time.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "AI-Powered Pricing",
    description:
      "Dynamic pricing engine analyzes market demand, seasonality, and competitor rates to maximize your revenue automatically.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Compliance by Design",
    description:
      "Built-in GDPR, CCPA, and local STR regulation compliance. Automated tax reporting, permit tracking, and audit trails.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "Unified Messaging",
    description:
      "All guest communications in one inbox. AI-assisted replies, automated check-in instructions, and smart templates.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "Deep insights into occupancy, ADR, RevPAR, and booking trends. Forecast revenue and benchmark against local markets.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Lock,
    title: "Smart Lock Automation",
    description:
      "Auto-generate unique access codes per booking. Integrate with August, Schlage, Yale, and 20+ smart lock brands.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const plans = [
  {
    name: "Host Club",
    price: "$18",
    unit: "/property/month",
    description: "Perfect for independent hosts with up to 10 properties.",
    highlight: false,
    features: [
      "Up to 10 properties",
      "Calendar sync & channel manager",
      "Smart lock automation",
      "Cleaning & maintenance scheduling",
      "Owner payouts & tax reports",
      "24/7 support",
    ],
    cta: "Start free trial",
    href: "/signup",
  },
  {
    name: "Host Club + AI",
    price: "$46",
    unit: "/property/month",
    description: "Everything in Host Club plus AI-powered pricing and screening.",
    highlight: true,
    features: [
      "Everything in Host Club",
      "AI dynamic pricing engine",
      "Guest screening & risk scoring",
      "Sentiment analysis on reviews",
      "Automated upsells & add-ons",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: "$888",
    unit: "/month",
    description: "For property management companies with 10+ properties.",
    highlight: false,
    features: [
      "Unlimited properties",
      "Full API access",
      "Team management & RBAC",
      "Multi-entity accounting",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
    href: "/landing/enterprise",
  },
];

const testimonials = [
  {
    quote:
      "CompliCore cut our operations time by 60%. The AI pricing alone paid for itself in the first month.",
    author: "Sarah M.",
    role: "Host, 8 properties · Miami",
    rating: 5,
  },
  {
    quote:
      "Finally a platform that takes compliance seriously. The GDPR tools and audit trails are exactly what we needed.",
    author: "James T.",
    role: "Property Manager · London",
    rating: 5,
  },
  {
    quote:
      "The channel manager is flawless. Zero double-bookings since we switched. Our guests love the automated check-in flow.",
    author: "Priya K.",
    role: "Host, 3 properties · Austin",
    rating: 5,
  },
];

const stats = [
  { value: "12,000+", label: "Properties managed" },
  { value: "98.7%", label: "Uptime SLA" },
  { value: "$2.4M", label: "Revenue optimized monthly" },
  { value: "40+", label: "Countries supported" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            CompliCore
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/landing/host" className="hover:text-foreground transition-colors">For Hosts</Link>
            <Link href="/landing/guest" className="hover:text-foreground transition-colors">For Guests</Link>
            <Link href="/landing/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-36 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now live · 12,000+ properties trust CompliCore
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            The smarter way to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              manage rentals
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            CompliCore is the compliance-first rental platform built for hosts and property managers who want AI-powered automation, global channel sync, and privacy by design — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-base"
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/prototype/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border hover:bg-accent transition-colors text-base font-medium"
            >
              View live demo
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border bg-muted/30 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-4">
              <Zap className="w-3 h-3" /> Platform features
            </div>
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From a single vacation rental to a 500-property portfolio, CompliCore grows with you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-muted-foreground">Three steps to a fully automated rental business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Home,
                title: "Connect your listings",
                desc: "Import from Airbnb, VRBO, or Booking.com in one click. Or create new listings with our guided wizard.",
              },
              {
                step: "02",
                icon: Calendar,
                title: "Automate operations",
                desc: "Set pricing rules, cleaning schedules, smart lock codes, and guest messaging — all automated.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Watch revenue grow",
                desc: "AI pricing and analytics surface opportunities. Track performance across all channels in real time.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-muted/30 mb-4 select-none">{item.step}</div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-4">
              <Award className="w-3 h-3" /> Simple pricing
            </div>
            <h2 className="text-4xl font-bold mb-4">Pay only for what you use</h2>
            <p className="text-muted-foreground">No hidden fees. No long-term contracts. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-xl border flex flex-col ${
                  plan.highlight
                    ? "border-primary bg-primary text-primary-foreground shadow-xl scale-[1.02]"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {plan.unit}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlight ? "text-emerald-300" : "text-emerald-500"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`w-full text-center py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 ${
                    plan.highlight
                      ? "bg-white text-primary"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-4">
              <Users className="w-3 h-3" /> Customer stories
            </div>
            <h2 className="text-4xl font-bold mb-4">Loved by hosts worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 text-muted-foreground">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to grow your rental business?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join 12,000+ properties already using CompliCore. Start your free 14-day trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-base"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-border hover:bg-accent transition-colors text-base font-medium"
            >
              Sign in to your account
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> GDPR compliant</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Home className="w-4 h-4 text-primary-foreground" />
                </div>
                CompliCore
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                The compliance-first rental platform for modern property managers and hosts.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3">Product</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/prototype/dashboard" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3">Solutions</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/landing/host" className="hover:text-foreground transition-colors">For Hosts</Link></li>
                <li><Link href="/landing/guest" className="hover:text-foreground transition-colors">For Guests</Link></li>
                <li><Link href="/landing/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link></li>
                <li><Link href="/portal/corporate" className="hover:text-foreground transition-colors">Corporate Travel</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3">Company</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>© 2026 CompliCore. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
