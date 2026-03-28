import type { Metadata } from 'next'
import Link from 'next/link'
import { TopNav } from '@/components/marketing/TopNav'
import { Footer } from '@/components/marketing/Footer'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FLOWS, PRICING } from '@/lib/constants'
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  GitBranch,
  Zap,
  Clock,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'CompliCore+ — AI Workflows for Property Managers',
  description:
    'Respond to leasing inquiries instantly, automate follow-up, and reduce admin work with active agent flows that run continuously.',
}

const FLOW_ICONS = {
  MessageSquare,
  RefreshCw,
  GitBranch,
}

const beforeItems = [
  'Inquiries sit unanswered for hours',
  'Follow-ups never happen',
  'Messages get lost or misrouted',
  'Admin work piles up daily',
  'Qualified leads go cold',
]

const afterItems = [
  'Every inquiry answered in seconds',
  'Follow-ups run automatically',
  'Messages routed to the right person',
  'Workflows run without manual input',
  'Leads stay warm and engaged',
]

const howItWorksSteps = [
  { step: '01', label: 'Inquiry received', icon: MessageSquare },
  { step: '02', label: 'Response sent instantly', icon: Zap },
  { step: '03', label: 'Follow-up scheduled', icon: Clock },
  { step: '04', label: 'Request routed', icon: GitBranch },
]

const faqs = [
  {
    q: 'What does CompliCore+ replace?',
    a: 'Manual lead response, follow-up, and routing workflows that your team currently handles by hand.',
  },
  {
    q: 'How fast does it respond?',
    a: 'Within seconds of receiving an inquiry. There is no delay and no manual input required.',
  },
  {
    q: 'Do I need technical setup?',
    a: 'No. The system is installed and configured for you during activation. Your team does not need technical skills.',
  },
  {
    q: 'What happens after payment?',
    a: 'Flows activate immediately and begin running on real inquiries. You will see activity in your dashboard.',
  },
  {
    q: 'Can I add more workflows later?',
    a: 'Yes. Additional flows can be activated at any time for $249/month each.',
  },
  {
    q: 'What if payment fails?',
    a: 'Flows pause until billing is resolved. No data is lost and reactivation is instant.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1020]">
      <TopNav />

      {/* === HERO === */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="text-sm font-medium text-brand">AI workflow automation for property managers</span>
            </div>

            <h1 className="text-5xl md:text-[56px] font-bold text-[#F5F7FB] leading-[1.08] tracking-tight mb-6 animate-fade-up-delay-1">
              AI workflows that respond instantly
            </h1>

            <p className="text-xl text-[#B8C1D9] leading-relaxed max-w-xl mb-10 animate-fade-up-delay-2">
              Automate leasing responses, follow-ups, and routing so no inquiry is ever missed again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
              <Link href="/book-demo">
                <Button size="lg">
                  Book Live Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg">
                  See It Work
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 animate-fade-up-delay-3">
              {[
                { value: '<18s', label: 'Avg response time' },
                { value: '3', label: 'Active flows' },
                { value: '0', label: 'Missed inquiries' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[#F5F7FB]">{stat.value}</p>
                  <p className="text-xs text-[#8A95B2] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === BEFORE VS AFTER === */}
      <section className="py-24 border-y border-[#25314F]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="The problem"
            heading="Stop losing leads to slow response"
            subheading="Every hour of delay reduces conversion. Qualified prospects move on."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">&#10005;</span>
                </div>
                <h3 className="text-base font-semibold text-[#F5F7FB]">Before CompliCore+</h3>
              </div>
              <ul className="space-y-4">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs">—</span>
                    </span>
                    <span className="text-[#B8C1D9] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-[#F5F7FB]">After CompliCore+</h3>
              </div>
              <ul className="space-y-4">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[#F5F7FB] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* === CORE FLOWS === */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="Three flows"
            heading="Workflows that replace hours of manual work"
            subheading="Each flow is a self-contained automation that runs continuously without manual input."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FLOWS.map((flow) => {
              const Icon = FLOW_ICONS[flow.icon as keyof typeof FLOW_ICONS]
              return (
                <div
                  key={flow.id}
                  className="group bg-[#11182D] border border-[#25314F] hover:border-[#33426A] rounded-2xl p-8 transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="h-10 w-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-6">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F5F7FB] mb-3">{flow.name}</h3>
                  <p className="text-sm text-[#B8C1D9] leading-relaxed mb-6">{flow.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8A95B2] font-medium w-14">Trigger</span>
                      <span className="text-xs text-[#F5F7FB]">{flow.trigger}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8A95B2] font-medium w-14">Outcome</span>
                      <span className="text-xs text-green-400 font-medium">{flow.outcome}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* === KPI PROOF === */}
      <section className="py-24 bg-[#0F1528] border-y border-[#25314F]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">
                The only KPI that matters
              </p>
              <h2 className="text-4xl font-bold text-[#F5F7FB] leading-tight mb-6">
                Measured by one metric: response time
              </h2>
              <p className="text-lg text-[#B8C1D9] leading-relaxed mb-8">
                Reduce response time from hours to seconds. Capture more leads without increasing headcount.
              </p>
              <Link href="/demo">
                <Button size="lg">
                  See response time live <TrendingUp className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg response time', value: '< 18s', sub: 'was 4+ hours', trend: 'up' as const },
                { label: 'Inquiries captured', value: '100%', sub: 'zero missed', trend: 'up' as const },
                { label: 'Follow-ups sent', value: 'Auto', sub: 'no manual work', trend: 'neutral' as const },
                { label: 'Admin hours saved', value: '12+/wk', sub: 'per operator', trend: 'up' as const },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#11182D] border border-[#25314F] rounded-2xl p-6"
                >
                  <p className="text-sm text-[#8A95B2] mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#F5F7FB] mb-1">{stat.value}</p>
                  <p className="text-xs text-green-400">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="How it works"
            heading="From inquiry to outcome automatically"
            subheading="No manual steps. No delays. No missed leads."
            className="mb-16"
          />

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px bg-gradient-to-r from-transparent via-[#25314F] to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {howItWorksSteps.map(({ step, label, icon: Icon }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="relative h-16 w-16 rounded-2xl bg-[#11182D] border border-[#25314F] flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-brand" />
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-brand text-[#0B1020] text-xs font-bold flex items-center justify-center">
                      {step.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#F5F7FB]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === PRICING SNAPSHOT === */}
      <section className="py-24 bg-[#0F1528] border-y border-[#25314F]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="Simple pricing"
            heading="Pay only for what runs"
            subheading="Activation unlocks your flows. Monthly billing covers active automations only."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {PRICING.PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-[#11182D] border rounded-2xl p-8 transition-all duration-[180ms] ${
                  pkg.popular
                    ? 'border-brand shadow-[0_0_0_1px_rgba(110,168,254,0.3),0_16px_40px_rgba(0,0,0,0.28)]'
                    : 'border-[#25314F] hover:border-[#33426A]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-brand text-[#0B1020] text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-base font-semibold text-[#F5F7FB] mb-1">{pkg.name}</h3>
                <p className="text-sm text-[#8A95B2] mb-6">{pkg.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#F5F7FB]">${pkg.monthly.toLocaleString()}</span>
                    <span className="text-sm text-[#8A95B2]">/mo</span>
                  </div>
                  <p className="text-xs text-[#8A95B2] mt-1">+${pkg.activation.toLocaleString()} activation</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#B8C1D9]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/pricing">
                  <Button
                    variant={pkg.popular ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Activate System
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[#8A95B2]">
            No contract required. Cancel anytime. Flows stop when billing stops.
          </p>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="FAQ"
            heading="Questions"
            className="mb-16"
          />

          <div className="max-w-2xl mx-auto divide-y divide-[#25314F]">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base font-medium text-[#F5F7FB] pr-4">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-[#8A95B2] flex-shrink-0 transition-transform duration-[220ms] group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-[#B8C1D9] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="py-24 border-t border-[#25314F]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">Ready to stop missing leads?</p>
            <h2 className="text-4xl font-bold text-[#F5F7FB] mb-6">
              Your AI workflows can start Monday
            </h2>
            <p className="text-lg text-[#B8C1D9] mb-10">
              Book a live demo. We will show the system running on your actual workflow in 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-demo">
                <Button size="lg">
                  Book Live Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
