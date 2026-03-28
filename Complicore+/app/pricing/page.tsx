import type { Metadata } from 'next'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { PricingCardClient } from '@/components/pricing/PricingCardClient'
import { FAQSectionClient } from '@/components/pricing/FAQSectionClient'

export const metadata: Metadata = {
  title: 'Simple, Transparent Pricing — CompliCore+',
  description:
    'Choose the plan that fits your property management needs. Launch at $349/month, Growth at $899/month, or enterprise Ops Stack. No hidden fees. Free trial available.',
  canonical: '/pricing',
}

interface PricingTier {
  name: string
  monthlyPrice: number
  activationFee: number
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
  plan_name: 'launch' | 'growth' | 'ops_stack'
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Launch',
    monthlyPrice: 349,
    activationFee: 499,
    period: '/month',
    description: 'Perfect for property managers getting started with automation.',
    features: [
      'Leasing Lead Response flow',
      'Up to 100 contacts per month',
      'Email-based automation',
      'Basic reporting & analytics',
      'Community support',
    ],
    cta: 'Start Free Trial',
    plan_name: 'launch',
  },
  {
    name: 'Growth',
    monthlyPrice: 899,
    activationFee: 999,
    period: '/month',
    description: 'For mid-market teams scaling their operations.',
    features: [
      'All Launch features',
      'Follow-Up Automation flow',
      'Up to 500 contacts per month',
      'Multi-user access (up to 5)',
      'Priority email support',
      'Advanced reporting & workflows',
      'Custom integrations',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
    plan_name: 'growth',
  },
  {
    name: 'Ops Stack',
    monthlyPrice: 2499,
    activationFee: 1999,
    period: '/month',
    description: 'For enterprise teams managing complex operations.',
    features: [
      'All Growth features',
      'Admin Routing & task management',
      'Unlimited contacts',
      'Unlimited users',
      '24/7 priority phone & email support',
      'Custom workflows & automations',
      'Dedicated success manager',
      'API access & webhooks',
      'White-label options',
      'Custom SLAs',
    ],
    cta: 'Contact Sales',
    plan_name: 'ops_stack',
  },
]


interface FAQItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! All plans come with a 14-day free trial. No credit card required to get started.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) and ACH bank transfers for enterprise customers.',
  },
  {
    question: 'Is there an annual billing option?',
    answer: 'Yes. Annual billing is available for all plans with a 20% discount. Contact our sales team for more details.',
  },
  {
    question: 'What if I need more than the flow limits?',
    answer: 'The Ops Stack plan includes custom workflows. For custom needs beyond that, contact our enterprise team at sales@complicore.ai.',
  },
  {
    question: 'Do I have to pay the activation fee upfront?',
    answer: 'Yes, the activation fee is charged as part of your first payment along with the first month of service. This covers setup, configuration, and onboarding support.',
  },
]

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'CompliCore+',
            description:
              'Autonomous compliance AI agent platform for property management automation. Instantly respond to leasing inquiries, manage follow-ups, and route inbound communications.',
            applicationCategory: 'BusinessApplication',
            url: 'https://complicore.ai/pricing',
            offers: [
              {
                '@type': 'Offer',
                name: 'Launch Plan',
                price: '349',
                priceCurrency: 'USD',
                priceValidUntil: '2027-12-31',
                availability: 'https://schema.org/InStock',
                description:
                  'Perfect for property managers getting started with automation. Includes Leasing Lead Response flow, up to 100 contacts per month, email-based automation, basic reporting, and community support.',
              },
              {
                '@type': 'Offer',
                name: 'Growth Plan',
                price: '899',
                priceCurrency: 'USD',
                priceValidUntil: '2027-12-31',
                availability: 'https://schema.org/InStock',
                description:
                  'For mid-market teams scaling their operations. All Launch features plus Follow-Up Automation flow, up to 500 contacts per month, multi-user access (5 users), priority support, and advanced reporting.',
              },
              {
                '@type': 'Offer',
                name: 'Ops Stack Plan',
                price: '2499',
                priceCurrency: 'USD',
                priceValidUntil: '2027-12-31',
                availability: 'https://schema.org/InStock',
                description:
                  'For enterprise teams managing complex operations. All Growth features plus Admin Routing, unlimited contacts and users, 24/7 support, custom workflows, dedicated success manager, API access, and white-label options.',
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://complicore.ai',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Pricing',
                item: 'https://complicore.ai/pricing',
              },
            ],
          }),
        }}
      />

      <div className="flex flex-col gap-32 py-24 px-6">
        {/* Page header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-text-primary mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-text-secondary mb-8">
            Choose the plan that fits your property management needs. No hidden fees.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
              Start Free Trial
            </button>
            <button className="px-6 py-3 border border-line rounded-lg font-medium text-text-primary hover:bg-neutral-50">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          {PRICING_TIERS.map((tier) => (
            <PricingCardClient key={tier.name} tier={tier} />
          ))}
        </div>

        {/* Info banner */}
        <div className="max-w-3xl mx-auto w-full bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4 items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">All plans include:</p>
              <p className="text-sm text-blue-800">
                Unlimited projects • Cloud-based storage • Mobile app access • Regular security updates • 99.9% uptime SLA
              </p>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div>
          <FAQSectionClient items={FAQ_ITEMS} />
        </div>

        {/* CTA Footer */}
        <div className="bg-primary text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your operations?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join leading property management teams already using CompliCore+ to automate their workflows.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
