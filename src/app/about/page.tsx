import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Built by Hosts, for Operators",
  description:
    "Learn how CompliCore was built by industry operators to turn compliance nightmares into confident, revenue-integrity growth.",
};

const responsibilityStats = [
  {
    value: "12,000+",
    label: "Properties managed",
    detail:
      "A responsibility to protect real owners, guests, and teams with every compliance workflow.",
  },
  {
    value: "40+",
    label: "Countries supported",
    detail:
      "Regulatory coverage built for operators scaling across markets with different legal realities.",
  },
  {
    value: "98.7%",
    label: "Uptime SLA",
    detail:
      "Reliability designed for operations that cannot afford downtime during check-ins or audits.",
  },
] as const;

const coreValues = [
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Flat-fee pricing with no hidden percentages, so your booking revenue remains yours.",
    href: "/#pricing",
    cta: "See flat-fee pricing",
  },
  {
    icon: Zap,
    title: "Compliance-First Innovation",
    description:
      "We optimize revenue and operations without sacrificing permit controls, audit trails, or regulatory guardrails.",
    href: "/#features",
    cta: "Explore compliance-first features",
  },
  {
    icon: TrendingUp,
    title: "Revenue Integrity",
    description:
      "Growth should be durable. We protect long-term portfolio health while helping operators maximize RevPAR.",
    href: "/signup",
    cta: "Start your 14-day trial",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-1.5"
        >
          ← Back to CompliCore
        </Link>

        <section className="max-w-4xl mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-primary/10 text-primary rounded-full">
            Built by Hosts, for Operators
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4 leading-tight">
            We built CompliCore after living the compliance nightmare ourselves.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CompliCore did not start as a generic software project. It started when industry
            veterans managing real properties hit the same wall: regulations changing faster than
            teams could react, revenue opportunities slipping through manual workflows, and growth
            creating more risk instead of more confidence. We built the platform we needed — one
            that bridges deep technical innovation with day-to-day human pressure.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mb-14">
          {responsibilityStats.map((stat) => (
            <article key={stat.label} className="rounded-xl border border-border bg-card p-6">
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <h2 className="font-semibold mb-2">{stat.label}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-8 mb-14">
          <article className="rounded-2xl border border-border bg-card p-7">
            <h2 className="text-2xl font-semibold mb-3">The spreadsheet that broke</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Before CompliCore, our operations lived in fragmented spreadsheets, tax reminders,
              permit trackers, and late-night pricing edits. Every new listing increased revenue
              potential, but also multiplied legal and operational exposure.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We searched for a platform that could combine enterprise-grade compliance with
              practical AI revenue automation. It did not exist in the form operators actually
              needed, so we built it ourselves.
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-card p-7">
            <h2 className="text-2xl font-semibold mb-3">From one portfolio to global scale</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              What started as an internal operating system now supports more than 12,000+
              properties across 40+ countries. We still treat every account with the same
              principle that built the company: growth must be safe, measurable, and defensible.
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />
                Compliance automation that helps teams stay ahead of local regulation changes.
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />
                AI-powered pricing and operational tooling built for real occupancy pressure.
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />
                98.7% uptime reliability for teams that need an always-on command center.
              </li>
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-8 mb-14">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Mission statement
          </p>
          <h2 className="text-3xl font-bold mb-3">
            Democratizing enterprise-level compliance for every host.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            Whether you manage one listing or one thousand, you deserve the same class of
            compliance intelligence and revenue tooling used by large hospitality groups.
            CompliCore provides those guardrails so operators can grow with confidence, protect
            trust, and preserve long-term revenue integrity.
          </p>
        </section>

        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            Core values that guide every product decision
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {coreValues.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {value.description}
                  </p>
                  <Link
                    href={value.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                  >
                    {value.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-foreground text-background p-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to protect your portfolio and scale with confidence?
          </h2>
          <p className="text-background/80 mb-6 max-w-3xl">
            Start your 14-day free trial to experience compliance-first operations, AI-powered
            revenue optimization, and flat-fee pricing with no hidden percentages.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background text-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-background/20 text-background hover:bg-background/10 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </section>

        <div className="pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/signup" className="hover:text-foreground transition-colors">
            Start trial
          </Link>
        </div>
      </div>
    </div>
  );
}
