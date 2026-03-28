import type { Metadata } from 'next'
import { TopNav } from '@/components/marketing/TopNav'
import { Footer } from '@/components/marketing/Footer'
import { SectionHeader } from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'FAQ — CompliCore+',
  description:
    'Answers to common questions about CompliCore+ AI workflow automation for property managers.',
}

const sections = [
  {
    title: 'General',
    faqs: [
      {
        q: 'What is CompliCore+?',
        a: 'CompliCore+ is a workflow automation system for residential property managers. It installs active AI agent flows that respond to leasing inquiries, automate follow-up, and route inbound requests continuously.',
      },
      {
        q: 'Who is it for?',
        a: 'Operators managing 50–500 residential units who handle leasing inquiries manually today and want to capture more leads without increasing headcount.',
      },
      {
        q: 'How does it work?',
        a: 'We install and configure your flows during activation. After payment, the system begins running immediately on real inquiries. You manage and monitor everything from your dashboard.',
      },
      {
        q: 'How long does setup take?',
        a: 'Most operators are live within one session after payment. Configuration takes under 30 minutes.',
      },
    ],
  },
  {
    title: 'Product',
    faqs: [
      {
        q: 'What workflows are included?',
        a: 'The three core flows are: Lead Response (instant inquiry replies), Follow-Up (automated re-engagement sequences), and Admin Routing (message classification and routing).',
      },
      {
        q: 'Can I customize the flows?',
        a: 'Yes. During setup we configure flows to match your property types, messaging style, and routing rules.',
      },
      {
        q: 'How do I monitor activity?',
        a: 'Your dashboard shows response time, active flow status, recent activity, and billing state in real time.',
      },
      {
        q: 'What happens when a flow fails?',
        a: 'Flows show an error state in your dashboard. We are notified automatically and will reach out within one business day.',
      },
    ],
  },
  {
    title: 'Billing',
    faqs: [
      {
        q: 'How is pricing structured?',
        a: 'A one-time $1,500 activation fee covers setup and deployment. Monthly billing is $349 per active flow. Additional flows are $249/month each.',
      },
      {
        q: 'Is there a contract?',
        a: 'No long-term contract. Cancel anytime. Flows stop when billing stops.',
      },
      {
        q: 'What if I do not use a flow?',
        a: 'You can pause or deactivate flows at any time. Paused flows do not bill.',
      },
      {
        q: 'Can I add flows later?',
        a: 'Yes. Additional flows are available for $249/month each and can be added from your billing dashboard.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#0B1020]">
      <TopNav />

      <section className="pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="FAQ"
            heading="Frequently asked questions"
            subheading="Everything you need to know before activating."
            className="mb-16"
          />

          <div className="max-w-2xl mx-auto space-y-12">
            {sections.map(({ title, faqs }) => (
              <div key={title}>
                <h2 className="text-xs font-semibold text-brand uppercase tracking-widest mb-6">{title}</h2>
                <div className="divide-y divide-[#25314F]">
                  {faqs.map((faq) => (
                    <details key={faq.q} className="group py-5">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="text-base font-medium text-[#F5F7FB] pr-4">{faq.q}</span>
                        <span className="text-[#8A95B2] text-xl flex-shrink-0 transition-transform duration-[220ms] group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-[#B8C1D9] leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
