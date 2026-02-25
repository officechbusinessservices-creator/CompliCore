import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  LANDING_BRAND_COPY,
  LANDING_PLAN_COPY,
  LANDING_SHARED_COPY,
  portfolioBridgeCopy,
} from "@/lib/landing-copy";

const growthPlans = [
  {
    name: LANDING_PLAN_COPY.hostClub.name,
    price: LANDING_PLAN_COPY.hostClub.priceLabel,
    audience: LANDING_PLAN_COPY.hostClub.summary,
    points: [
      "Unlimited channel connections",
      "Smart lock automation",
      "Cleaning and maintenance scheduling",
    ],
  },
  {
    name: LANDING_PLAN_COPY.hostClubAi.name,
    price: LANDING_PLAN_COPY.hostClubAi.priceLabel,
    audience: "Hosts prioritizing RevPAR growth",
    points: [
      "AI dynamic pricing",
      "Guest screening and risk scoring",
      "Automated upsells and add-ons",
    ],
  },
  {
    name: LANDING_PLAN_COPY.portfolioPro.name,
    price: LANDING_PLAN_COPY.portfolioPro.priceLabel,
    audience: LANDING_PLAN_COPY.portfolioPro.summary,
    points: [
      "Basic team access (up to 3 roles)",
      "Automated owner statements",
      "Advanced portfolio analytics",
    ],
  },
];

export default function HostLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">{LANDING_BRAND_COPY.name}</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/#pricing" className="hover:text-foreground text-muted-foreground transition-colors">
              {LANDING_SHARED_COPY.pricingLinkLabel}
            </Link>
            <Link href="/landing/enterprise" className="hover:text-foreground text-muted-foreground transition-colors">
              {LANDING_SHARED_COPY.enterpriseLinkLabel}
            </Link>
            <Link href="/signup" className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">
              {LANDING_BRAND_COPY.startTrialCta}
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-primary/10 text-primary rounded-full">
            Host Growth Path
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-4 leading-tight">
            Grow your portfolio without pricing shocks.
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Start with Host Club, unlock AI when you need revenue optimization, then move to Portfolio Pro when team workflows and owner reporting become mission-critical.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
              {LANDING_BRAND_COPY.startTrialCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/#pricing" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Compare full pricing</Link>
            <Link href="/landing/enterprise" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Need enterprise controls?</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>{LANDING_SHARED_COPY.noRevenueShareLine}</span>
            <span>{LANDING_SHARED_COPY.monthToMonthLine}</span>
            <span>{LANDING_SHARED_COPY.complianceFirstLine}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold mb-3">Why operators move to Portfolio Pro</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />At {portfolioBridgeCopy.thresholdProperties} properties, {LANDING_PLAN_COPY.hostClubAi.priceLabel} is ${portfolioBridgeCopy.hostClubAiMonthlyAtThreshold}/month. {LANDING_PLAN_COPY.portfolioPro.name} starts at ${portfolioBridgeCopy.portfolioProMonthlyAtThreshold}/month.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Team access for co-hosts, cleaners, and maintenance without enterprise overhead.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />Owner-ready reporting and bulk operations for scaling managers.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 grid md:grid-cols-3 gap-4">
        {growthPlans.map((plan) => (
          <article key={plan.name} className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-1">{plan.name}</h3>
            <p className="text-sm text-primary font-medium mb-1">{plan.price}</p>
            <p className="text-xs text-muted-foreground mb-4">{plan.audience}</p>
            <ul className="space-y-2">
              {plan.points.map((point) => (
                <li key={point} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="p-6 rounded-xl bg-foreground text-background">
          <h3 className="font-semibold text-xl mb-2">Need enterprise-scale controls?</h3>
          <p className="text-sm text-background/80 mb-4">
            {LANDING_PLAN_COPY.enterprise.name} adds advanced governance, custom integrations, and SLA-backed support at {LANDING_PLAN_COPY.enterprise.priceLabel} ({LANDING_PLAN_COPY.enterprise.summary}).
          </p>
          <Link href="/landing/enterprise" className="inline-flex px-4 py-2 bg-background text-foreground rounded-lg font-medium">
            Explore Enterprise
          </Link>
        </div>
      </section>
    </div>
  );
}
