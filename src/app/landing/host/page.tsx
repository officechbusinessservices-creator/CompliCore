import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield,
  Clock3,
  CalendarDays,
  LineChart,
  Briefcase,
  Star,
  Home,
} from "lucide-react";
import {
  LANDING_BRAND_COPY,
  LANDING_PLAN_COPY,
  LANDING_SHARED_COPY,
  portfolioBridgeCopy,
} from "@/lib/landing-copy";

const outcomes = [
  {
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "Recover Lost Revenue & Erase Vacancy Gaps",
    body: "Our dynamic pricing engine constantly reads the market. It automatically drops rates to fill empty mid-week gaps and raises rates during high demand.",
    result: "You squeeze every possible dollar out of your calendar.",
  },
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Radical Operational Efficiency",
    body: "Eliminate the busywork. We automate your smart locks, coordinate your cleaning schedules, and handle repetitive guest messages.",
    result: "Manage 25 properties with the time and payroll of managing 5.",
  },
  {
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Keep 100% of Your Upside",
    body: "Most platforms take a 1–3% cut of your hard-earned bookings. We don't. You pay a predictable flat fee.",
    result: "Every extra dollar we generate goes straight to your bottom line.",
  },
];

const timelineItems = [
  {
    day: "Day 1",
    icon: Clock3,
    title: "Instant Relief.",
    body: "You connect your channels in one click. Calendars sync, smart locks connect, and guest messaging is automated.",
    result: "You immediately save 10+ hours a week.",
  },
  {
    day: "Day 14",
    icon: CalendarDays,
    title: "Revenue Leaks Plugged.",
    body: "The pricing engine has adjusted your underpriced weekends and secured 2–3 mid-week bookings you would have otherwise lost.",
    result: "The software has already paid for itself.",
  },
  {
    day: "Day 30",
    icon: LineChart,
    title: "Costs Cut.",
    body: "Cleaning crews are dispatched flawlessly. You eliminate the need for an expensive answering service or a virtual assistant.",
    result: "Your overhead drops drastically.",
  },
  {
    day: "Day 90",
    icon: Briefcase,
    title: "Profitable Scale.",
    body: "You see a 10–15% bump in overall revenue and finally have the operational bandwidth to acquire new properties.",
    result: "Add properties without adding headcount.",
  },
];

const testimonials = [
  {
    quote:
      "CompliCore filled our mid-week gaps perfectly. We recovered $2,400 in lost revenue in the first month, and I no longer wake up to angry guest messages. Best switch we ever made.",
    author: "Sarah M.",
    detail: "8 Properties · Miami",
    rating: 5,
  },
  {
    quote:
      "Finally a platform that doesn't take a cut of our bookings. The flat-fee pricing means every dollar their AI makes us stays in our pocket. It's paid for itself many times over.",
    author: "James T.",
    detail: "Property Manager · London",
    rating: 5,
  },
];

const growthPlans = [
  {
    name: LANDING_PLAN_COPY.hostClub.name,
    price: LANDING_PLAN_COPY.hostClub.priceLabel,
    audience: LANDING_PLAN_COPY.hostClub.summary,
    highlight: false,
    points: [
      "Unlimited channel connections",
      "Smart lock automation",
      "Cleaning and maintenance scheduling",
      "Zero commission on bookings",
    ],
  },
  {
    name: LANDING_PLAN_COPY.hostClubAi.name,
    price: LANDING_PLAN_COPY.hostClubAi.priceLabel,
    audience: "Hosts prioritizing RevPAR growth",
    highlight: true,
    points: [
      "AI dynamic pricing engine",
      "Guest screening and risk scoring",
      "Automated upsells and add-ons",
      "Zero commission on bookings",
    ],
  },
  {
    name: LANDING_PLAN_COPY.portfolioPro.name,
    price: LANDING_PLAN_COPY.portfolioPro.priceLabel,
    audience: LANDING_PLAN_COPY.portfolioPro.summary,
    highlight: false,
    points: [
      "Basic team access (up to 3 roles)",
      "Automated owner statements",
      "Advanced portfolio analytics",
      "Zero commission on bookings",
    ],
  },
];

export default function HostLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            {LANDING_BRAND_COPY.name}
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/#pricing" className="hover:text-foreground text-muted-foreground transition-colors hidden sm:block">
              {LANDING_SHARED_COPY.pricingLinkLabel}
            </Link>
            <Link href="/landing/enterprise" className="hover:text-foreground text-muted-foreground transition-colors hidden sm:block">
              {LANDING_SHARED_COPY.enterpriseLinkLabel}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              Get Your Free Revenue Audit
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted text-xs text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Built for growth-focused property managers
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Fill Your Calendar. Lower Your Costs.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              Put Your Properties on Autopilot.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop leaving money on the table with empty mid-week dates. CompliCore automatically fills your vacancy gaps, slashes your admin time by 60%, and maximizes your booking revenue—all without taking a percentage of your profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-base"
            >
              Get Your Free 14-Day Revenue Audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-border hover:bg-accent transition-colors text-base font-medium"
            >
              See a Live Demo
            </Link>
          </div>
          {/* Trust banner */}
          <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Setup takes 10 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% flat-fee pricing
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Pain / Agitation ── */}
      <section className="py-20 px-6 border-y border-border bg-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Managing properties shouldn&apos;t mean managing chaos.
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12">
            You are losing revenue to unbooked weekdays. You are wasting hours on 2&nbsp;AM guest lockouts and chasing cleaning crews. You are paying high software commissions that punish you for being successful. It&apos;s time to stop managing software and start maximizing your margins.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
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
            ].map((point) => (
              <div key={point.heading} className="p-5 rounded-xl border border-destructive/25 bg-destructive/5">
                <div className="text-3xl mb-3">{point.emoji}</div>
                <h3 className="font-semibold mb-2 text-sm">{point.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Core Outcomes ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale, bundled into one flat fee.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We translate what the platform does into a direct financial or operational benefit—because outcomes are the only thing that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {outcomes.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow flex flex-col"
              >
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{item.body}</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-t border-border pt-3">
                  Outcome: {item.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Timeline to ROI ── */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Path to a Fully Booked, Frictionless Portfolio</h2>
            <p className="text-muted-foreground">Here is exactly what happens when you plug your properties into CompliCore.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {timelineItems.map((item) => (
              <div key={item.day} className="relative">
                <div className="text-4xl font-bold text-muted/40 mb-4 select-none">{item.day}</div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{item.body}</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Result: {item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Social Proof ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Trusted by operators who demand results.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
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
                  <div className="text-xs text-muted-foreground">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Growth Plans ── */}
      <section className="py-16 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Predictable Costs for Unstoppable Growth</h2>
            <p className="text-muted-foreground">We don&apos;t punish you for being successful. Keep 100% of your booking revenue.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {growthPlans.map((plan) => (
              <article
                key={plan.name}
                className={`p-6 rounded-xl border flex flex-col ${
                  plan.highlight
                    ? "border-primary bg-primary text-primary-foreground shadow-xl scale-[1.02]"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <div className="text-[11px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full self-start mb-3">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`}>
                  {plan.price}
                </p>
                <p className={`text-xs mb-5 ${plan.highlight ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                  {plan.audience}
                </p>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.points.map((point) => (
                    <li key={point} className="text-sm flex items-start gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-emerald-300" : "text-emerald-500"}`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`w-full text-center py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 ${
                    plan.highlight ? "bg-white text-primary" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {LANDING_BRAND_COPY.startTrialCta}
                </Link>
              </article>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-sm text-muted-foreground text-center">
            <CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-1.5" />
            At {portfolioBridgeCopy.thresholdProperties} properties, {LANDING_PLAN_COPY.hostClubAi.name} costs $
            {portfolioBridgeCopy.hostClubAiMonthlyAtThreshold}/month. {LANDING_PLAN_COPY.portfolioPro.name} starts at $
            {portfolioBridgeCopy.portfolioProMonthlyAtThreshold}/month and includes team access, owner reporting, and bulk operations.
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to maximize your revenue and get your time back?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join 12,000+ properties using CompliCore to run perfectly optimized, fully compliant operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-base"
            >
              Start Your Free Revenue Audit Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/landing/enterprise"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-border hover:bg-accent transition-colors text-base font-medium"
            >
              {LANDING_SHARED_COPY.enterpriseLinkLabel}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {LANDING_SHARED_COPY.noRevenueShareLine}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {LANDING_SHARED_COPY.monthToMonthLine}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
