import Link from "next/link";
import {
  Shield,
  Zap,
  Globe,
  Star,
  ArrowRight,
  CheckCircle2,
  Users,
  Home,
  Calendar,
  TrendingUp,
  Award,
  Clock3,
  CalendarDays,
  LineChart,
  Briefcase,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { SPLIT, getHeroCopy, getCtaCopy } from "@/lib/split-test";

const features = [
  {
    icon: TrendingUp,
    title: "Recover Lost Revenue & Erase Vacancy Gaps",
    description:
      "Our dynamic pricing engine constantly reads the market. It automatically drops rates to fill empty mid-week gaps and raises rates during high demand so you squeeze every possible dollar out of your calendar—without lifting a finger.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Radical Operational Efficiency",
    description:
      "Eliminate the busywork. We automate your smart locks, coordinate your cleaning schedules, and handle repetitive guest messages so you can manage 25 properties with the time and payroll of managing 5.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Keep 100% of Your Upside",
    description:
      "Most platforms take a 1–3% cut of your hard-earned bookings. We don't. You pay a predictable flat fee and every extra dollar we generate for you goes straight to your bottom line—never ours.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const agitationPoints = [
  {
    emoji: "📉",
    heading: "You're losing revenue to unbooked weekdays",
    body: "Empty mid-week dates bleed your revenue daily while competitors fill their calendars with smarter pricing.",
  },
  {
    emoji: "⏰",
    heading: "You're wasting hours on 2 AM lockouts",
    body: "Chasing cleaning crews, answering repetitive messages, and juggling access codes is eating time you can't get back.",
  },
  {
    emoji: "💸",
    heading: "You're paying commissions that punish success",
    body: "A 1–3% booking cut might sound small—until you do the math on what it costs you across a growing portfolio.",
  },
];

const timelineToRoi = [
  {
    day: "Day 1",
    icon: Clock3,
    title: "Instant Relief.",
    result: "You immediately save 10+ hours a week.",
    description:
      "Connect your channels in one click. Calendars sync, smart locks connect, and guest messaging is automated.",
  },
  {
    day: "Day 14",
    icon: CalendarDays,
    title: "Revenue Leaks Plugged.",
    result: "The software has already paid for itself.",
    description:
      "The pricing engine has adjusted your underpriced weekends and secured 2–3 mid-week bookings you would have otherwise lost.",
  },
  {
    day: "Day 30",
    icon: LineChart,
    title: "Costs Cut.",
    result: "Your overhead drops drastically.",
    description:
      "Cleaning crews are dispatched flawlessly. You eliminate the need for an expensive answering service or a virtual assistant.",
  },
  {
    day: "Day 90",
    icon: Briefcase,
    title: "Profitable Scale.",
    result: "Add properties without adding headcount.",
    description:
      "You see a 10–15% bump in overall revenue and finally have the operational bandwidth to acquire new properties without hiring more staff.",
  },
];

const plans = [
  {
    name: "Host Club",
    price: "$18",
    unit: "/property/month",
    description: "For independent hosts and small portfolios with up to 10 properties.",
    highlight: false,
    badge: "Starter",
    features: [
      "Zero commission. You keep every extra dollar we make you.",
      "Up to 10 properties",
      "Unlimited channel connections",
      "Smart lock automation",
      "Cleaning and maintenance scheduling",
      "Owner payouts and tax reports",
      "24/7 support",
    ],
    cta: "Start free trial",
    href: "/signup",
  },
  {
    name: "Host Club + AI",
    price: "$46",
    unit: "/property/month",
    description: "Everything in Host Club plus AI pricing and screening for growth-focused hosts.",
    highlight: false,
    badge: "Growth",
    features: [
      "Zero commission. You keep every extra dollar we make you.",
      "Everything in Host Club",
      "AI dynamic pricing engine",
      "Guest screening and risk scoring",
      "Sentiment analysis on reviews",
      "Automated upsells and add-ons",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
  },
  {
    name: "Portfolio Pro",
    price: "$399",
    unit: "/month",
    description: "Includes 15 properties, then +$25 per additional property.",
    highlight: true,
    badge: "Best for 10-25 properties",
    features: [
      "Zero commission. You keep every extra dollar we make you.",
      "Everything in Host Club + AI",
      "Basic team access (up to 3 roles)",
      "Automated owner statements",
      "Bulk-edit portfolio updates",
      "Advanced portfolio analytics",
      "Priority phone support",
    ],
    cta: "Upgrade to Portfolio Pro",
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: "$888",
    unit: "/month",
    description: "For operators who need custom integrations, governance, and unlimited scale.",
    highlight: false,
    badge: "Enterprise",
    features: [
      "Zero commission. You keep every extra dollar we make you.",
      "Unlimited properties",
      "Full API access and custom integrations",
      "Advanced RBAC and org controls",
      "Multi-entity accounting",
      "Dedicated onboarding and success manager",
      "SLA-backed support",
    ],
    cta: "Contact sales",
    href: "/landing/enterprise",
  },
];

const pricingFaq = [
  {
    question: "Do you take a percentage of my bookings?",
    answer:
      "No. CompliCore uses predictable flat pricing. We do not take a 1% to 2% cut of your booking revenue.",
  },
  {
    question: "Am I locked into a long-term contract?",
    answer:
      "No. Host Club, Host Club + AI, and Portfolio Pro are month-to-month. You can upgrade, downgrade, or cancel anytime.",
  },
  {
    question: "How does the 14-day free trial work?",
    answer:
      "You get full platform access for 14 days with no credit card required. Test pricing automation, messaging, and operations before committing.",
  },
  {
    question: "Are there setup or onboarding fees?",
    answer:
      "No setup fee on standard plans. Enterprise includes dedicated onboarding and custom integration support.",
  },
  {
    question: "What happens if my portfolio grows or shrinks?",
    answer:
      "CompliCore scales with you. Property changes are prorated and billing updates automatically on the next cycle.",
  },
  {
    question: "Are channel and smart lock integrations included?",
    answer:
      "Yes. Core channel connections and supported smart lock integrations are included across all paid plans.",
  },
];

const testimonials = [
  {
    quote:
      "CompliCore filled our mid-week gaps perfectly. We recovered $2,400 in lost revenue in the first month, and I no longer wake up to angry guest messages. Best switch we ever made.",
    author: "Sarah M.",
    role: "Host, 8 properties · Miami",
    rating: 5,
  },
  {
    quote:
      "Finally a platform that doesn't take a cut of our bookings. The flat-fee pricing means every dollar their AI makes us stays in our pocket. It's paid for itself many times over.",
    author: "James T.",
    role: "Property Manager · London",
    rating: 5,
  },
  {
    quote:
      "We slashed our admin time by 60% in the first month. Automated messaging and cleaning coordination meant I went from managing 12 to 22 properties without adding headcount.",
    author: "Priya K.",
    role: "Operator, 22 properties · Austin",
    rating: 5,
  },
];

const stats = [
  { value: "12,000+", label: "Properties managed" },
  { value: "98.7%", label: "Uptime SLA" },
  { value: "$2.4M", label: "Revenue optimized monthly" },
  { value: "40+", label: "Countries supported" },
];

const integrations = [
  "Airbnb",
  "VRBO",
  "Booking.com",
  "Expedia",
  "August",
  "Yale",
  "Schlage",
  "RemoteLock",
];

export default function LandingPage() {
  const hero = getHeroCopy();
  const cta = getCtaCopy();

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <Link href="/login" className="text-sm px-4 py-2 rounded-md hover:bg-accent transition-colors">
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

      <section className="relative overflow-hidden py-24 md:py-36 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            {hero.headlineTop}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              {hero.headlineHighlight}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-base"
            >
              {hero.primaryCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border hover:bg-accent transition-colors text-base font-medium"
            >
              {hero.secondaryCta}
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {hero.trialLine}
          </p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto rounded-xl border border-border bg-card px-6 py-6">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
            <Globe className="w-3.5 h-3.5" />
            Trusted integrations across channels and smart access
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {integrations.map((name) => (
              <span
                key={name}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-background"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Managing properties shouldn&apos;t mean managing chaos.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              You are losing revenue to unbooked weekdays. You are wasting hours on 2&nbsp;AM guest lockouts and chasing cleaning crews. You are paying high software commissions that punish you for being successful.
            </p>
            <p className="mt-4 text-lg font-semibold">It&apos;s time to stop managing software and start maximizing your margins.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {agitationPoints.map((point) => (
              <div key={point.heading} className="p-5 rounded-xl border border-destructive/25 bg-destructive/5">
                <div className="text-3xl mb-3">{point.emoji}</div>
                <h3 className="font-semibold mb-2 text-sm">{point.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-4">
              <Zap className="w-3 h-3" /> Business outcomes
            </div>
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale, bundled into one flat fee.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We translate what the platform does into a direct financial or operational benefit—because outcomes are the only thing that matter.
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

      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Path to a Fully Booked, Frictionless Portfolio</h2>
            <p className="text-muted-foreground">Here is exactly what happens when you plug your properties into CompliCore.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {timelineToRoi.map((item) => (
              <div key={item.day} className="relative">
                <div className="text-4xl font-bold text-muted/40 mb-4 select-none">{item.day}</div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{item.description}</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Result: {item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-4">
              <Award className="w-3 h-3" /> Predictable pricing
            </div>
            <h2 className="text-4xl font-bold mb-4">Predictable Costs for Unstoppable Growth</h2>
            <p className="text-muted-foreground">We don&apos;t punish you for being successful. Keep 100% of your booking revenue with our flat-fee structure.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                    Most strategic value
                  </div>
                )}
                <div className="mb-6">
                  <div className={`inline-flex text-[11px] px-2 py-1 rounded-full mb-3 ${plan.highlight ? "bg-white/15" : "bg-muted"}`}>
                    {plan.badge}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
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
          <p className="text-sm text-muted-foreground text-center mt-8">
            Managing 15 properties? Portfolio Pro starts at $399/month instead of $690/month at $46 per property.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pricing FAQ</h2>
            <p className="text-muted-foreground">Clear answers before you commit.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {pricingFaq.map((item) => (
              <article key={item.question} className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/10 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-4">
              <Users className="w-3 h-3" /> Customer stories
            </div>
            <h2 className="text-4xl font-bold mb-4">Trusted by operators who demand results.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 text-muted-foreground">&quot;{t.quote}&quot;</p>
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {cta.headline}
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            {cta.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-base"
            >
              {cta.primaryCta}
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
            {cta.bullets.map((b) => (
              <span key={b} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {b}</span>
            ))}
          </div>
        </div>
      </section>

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
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Demo</Link></li>
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
            {SPLIT.isBeta && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-600 border border-amber-500/20">
                β {SPLIT.branch}
              </span>
            )}
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
