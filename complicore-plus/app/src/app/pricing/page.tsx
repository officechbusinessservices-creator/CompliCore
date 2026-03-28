import type { Metadata } from 'next'
import Link from 'next/link'
import { TopNav } from '@/components/marketing/TopNav'
import { Footer } from '@/components/marketing/Footer'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PRICING } from '@/lib/constants'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — CompliCore+',
  description:
    'Simple pricing tied to active workflows. Pay only for automations that are running and creating value.',
}

const billingFaqs = [
  { q: 'Is there a contract?', a: 'No long-term contract required. Cancel anytime.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Flows stop when billing stops. No data is lost.' },
  { q: 'Are there hidden fees?', a: 'No. Activation is one-time. Monthly covers active flows only.' },
  { q: 'What does activation include?', a: 'Full setup, mapping, configuration, and deployment of your selected flows.' },
  { q: 'Can I add flows later?', a: 'Yes. Additional flows are $249/month each and can be activated at any time.' },
  { q: 'How is billing calculated?', a: 'By the number of active flows, billed monthly. No per-seat or per-user charges.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B1020]">
      <TopNav />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-5xl font-bold text-[#F5F7FB] mb-6">
            Simple pricing tied to active workflows
          </h1>
          <p className="text-xl text-[#B8C1D9] max-w-2xl mx-auto">
            Pay only for workflows that are running and creating value. Activation is one-time. Monthly billing covers active automations.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-[#11182D] border rounded-2xl p-8 ${
                  pkg.popular
                    ? 'border-brand shadow-[0_0_0_1px_rgba(110,168,254,0.3),0_16px_40px_rgba(0,0,0,0.28)]'
                    : 'border-[#25314F]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-brand text-[#0B1020] text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#F5F7FB] mb-2">{pkg.name}</h2>
                  <p className="text-sm text-[#8A95B2]">{pkg.description}</p>
                </div>

                <div className="mb-8 p-4 bg-[#0B1020] rounded-xl border border-[#25314F]">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-[#F5F7FB]">${pkg.monthly.toLocaleString()}</span>
                    <span className="text-sm text-[#8A95B2]">/month</span>
                  </div>
                  <p className="text-sm text-[#8A95B2]">
                    + ${pkg.activation.toLocaleString()} one-time activation
                  </p>
                  <p className="text-xs text-brand mt-2">{pkg.flows} active {pkg.flows === 1 ? 'flow' : 'flows'} included</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#B8C1D9]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/checkout?package=${pkg.id}`}>
                  <Button
                    variant={pkg.popular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    Activate System <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Add-on */}
          <div className="mt-6 bg-[#11182D] border border-[#25314F] rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-[#F5F7FB] mb-1">Additional Active Flow</h3>
              <p className="text-sm text-[#8A95B2]">Add automation coverage after your initial activation. Each additional flow runs continuously.</p>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-[#F5F7FB]">$249<span className="text-sm font-normal text-[#8A95B2]">/mo</span></p>
                <p className="text-xs text-[#8A95B2] mt-0.5">per additional flow</p>
              </div>
              <Link href="/dashboard/billing">
                <Button variant="secondary">Add Flow</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How billing works */}
      <section className="py-16 border-t border-[#25314F] bg-[#0F1528]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="Billing logic"
            heading="Billing follows execution"
            subheading="No payment. No activation. No flows running. No billing."
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', label: 'Activate', desc: 'One-time $1,500 unlocks your system and deploys your flows.' },
              { step: '2', label: 'Run', desc: 'Active flows run continuously, responding to real inquiries.' },
              { step: '3', label: 'Measure', desc: 'Dashboard tracks response time, lead capture, and activity.' },
              { step: '4', label: 'Expand', desc: 'Add flows as your automation coverage grows.' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="bg-[#11182D] border border-[#25314F] rounded-2xl p-6">
                <div className="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-brand">{step}</span>
                </div>
                <h3 className="text-base font-semibold text-[#F5F7FB] mb-2">{label}</h3>
                <p className="text-sm text-[#8A95B2] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader heading="Billing questions" className="mb-12" />
          <div className="max-w-2xl mx-auto divide-y divide-[#25314F]">
            {billingFaqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base font-medium text-[#F5F7FB] pr-4">{faq.q}</span>
                  <span className="text-[#8A95B2] text-xl transition-transform duration-[220ms] group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-[#B8C1D9] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[#25314F]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#F5F7FB] mb-4">Not ready to activate?</h2>
          <p className="text-[#B8C1D9] mb-8">Book a live demo first. We will show the system running in 15 minutes.</p>
          <Link href="/book-demo">
            <Button size="lg">Book Live Demo <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
