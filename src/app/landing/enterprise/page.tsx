import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  LANDING_BRAND_COPY,
  LANDING_PLAN_COPY,
  LANDING_SHARED_COPY,
} from "@/lib/landing-copy";

const enterpriseCapabilities = [
  {
    title: "Governance & Compliance",
    desc: "Advanced RBAC, approval chains, audit trails, and regional policy controls for high-stakes operations.",
  },
  {
    title: "Integrations & Data",
    desc: "Full API access, custom workflows, and system integration support for finance, BI, and internal platforms.",
  },
  {
    title: "Scale Operations",
    desc: "Multi-entity accounting, portfolio-wide automation, and SLA-backed support with a dedicated success lead.",
  },
];

export default function EnterpriseLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">{LANDING_BRAND_COPY.name}</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/#pricing" className="hover:text-foreground text-muted-foreground transition-colors">
              {LANDING_SHARED_COPY.pricingLinkLabel}
            </Link>
            <Link href="/landing/host" className="hover:text-foreground text-muted-foreground transition-colors">
              {LANDING_SHARED_COPY.hostsLinkLabel}
            </Link>
            <Link href="/portal/corporate" className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">
              {LANDING_SHARED_COPY.corporatePortalLabel}
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-primary/10 text-primary rounded-full">
            Enterprise & Corporate
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-4 leading-tight">
            Enterprise control for complex rental portfolios.
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {LANDING_BRAND_COPY.name} Enterprise is built for operators who need governance, deep integration, and compliance confidence across markets and teams.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/portal/corporate" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
              Enter corporate portal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/#pricing" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Compare all plans</Link>
            <Link href="/landing/host" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Start with Host plans</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>{LANDING_PLAN_COPY.enterprise.priceLabel} flat</span>
            <span>{LANDING_PLAN_COPY.enterprise.summary}</span>
            <span>Dedicated onboarding and success support</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold mb-3">When to move to Enterprise</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />You manage large portfolios or multiple legal entities.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />You need custom API integrations, policy enforcement, and governance controls.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />You require SLA-backed support and enterprise onboarding.</li>
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            Not ready yet? {LANDING_PLAN_COPY.portfolioPro.name} bridges the gap at {LANDING_PLAN_COPY.portfolioPro.priceLabel} ({LANDING_PLAN_COPY.portfolioPro.summary}).
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 grid md:grid-cols-3 gap-4">
        {enterpriseCapabilities.map((item) => (
          <article key={item.title} className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <article className="p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-2">Corporate travel distribution</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage corporate channels with policy-aware listings, compliance checks, and negotiated discount controls.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>Rate caps + approvals</div>
              <div>Discount guardrails</div>
              <div>Audit-ready exports</div>
              <div>ESG and duty-of-care logs</div>
            </div>
          </article>

          <article className="p-6 rounded-xl bg-foreground text-background">
            <h3 className="font-semibold mb-2">Need a custom rollout plan?</h3>
            <p className="text-sm text-background/80 mb-4">
              We map onboarding, migration, and governance controls to your portfolio structure before launch.
            </p>
            <Link href="/portal/corporate" className="inline-flex px-4 py-2 bg-background text-foreground rounded-lg font-medium">
              Talk to Enterprise Team
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
