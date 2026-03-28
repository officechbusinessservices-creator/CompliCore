'use client'

import { ArrowRight, CheckCircle, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Virtual Assistant vs AI Workflows | CompliCore+',
  description: 'Why AI-powered workflow automation outpaces virtual assistants for property management. Compare cost, speed, scalability, and reliability.',
  openGraph: {
    title: 'Virtual Assistant vs AI Workflows | CompliCore+',
    description: 'Virtual Assistant vs AI Workflows: which approach works for property managers?',
    url: 'https://complicore.ai/compare/virtual-assistant-vs-ai-workflows',
    type: 'website',
  },
}

const comparisonRows = [
  {
    category: 'Response Time',
    metric: 'First-response to new inquiry',
    virtualAssistant: '2–4 hours (business hours only)',
    complicoreplus: 'Under 60 seconds (24/7)',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Availability',
    metric: 'Coverage',
    virtualAssistant: 'Business hours + time off, vacations, sick days',
    complicoreplus: 'Always on. Weekends, nights, holidays, no exceptions.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Scalability',
    metric: 'Cost to handle 2x inquiry volume',
    virtualAssistant: 'Hire another VA ($2,500–3,500/mo)',
    complicoreplus: 'No additional cost ($349/mo flat)',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Cost',
    metric: 'Monthly for lead response + follow-up',
    virtualAssistant: '$2,500–4,000 (+ benefits, taxes, overhead)',
    complicoreplus: '$698/month (2 workflows) + $1,500 one-time',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Data Integration',
    metric: 'Real-time availability syncing',
    virtualAssistant: 'Manual update of spreadsheets or PMS',
    complicoreplus: 'Automatic PMS sync (Yardi, AppFolio, Rent Manager)',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Accuracy',
    metric: 'Consistent lease-term matching',
    virtualAssistant: 'Human error rate ~2–5% (wrong unit type, lease term)',
    complicoreplus: '99.2% routing accuracy. Learns your patterns.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Management Overhead',
    metric: 'Training, feedback, QA',
    virtualAssistant: 'Ongoing (hiring, training, performance reviews, turnover)',
    complicoreplus: 'Zero. Configure once, runs autonomously.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Inquiry Handling',
    metric: 'Multi-channel (email, web form, SMS, phone)',
    virtualAssistant: 'Limited to manual channels',
    complicoreplus: 'Captures and responds to all inquiry sources',
    advantage: 'ComplicoreAI',
  },
]

const virtualAssistantLimits = [
  {
    title: 'Single person = single speed',
    description: 'When your VA is busy, inquiries wait. When they take PTO, you lose coverage. Hiring more staff means linear cost growth.',
  },
  {
    title: 'Manual process = human error',
    description: 'VAs forget to check availability updates, misread lease terms, send wrong unit info. Automation eliminates this entirely.',
  },
  {
    title: 'Context switching kills efficiency',
    description: 'VAs spend time switching between tools, emails, PMS, spreadsheets. Workflow automation handles intake → classify → respond in under 60 seconds.',
  },
  {
    title: 'Turnover is expensive',
    description: 'Training a new VA takes 4–6 weeks. CompliCore+ never quits, never retires, doesn\'t require health insurance.',
  },
]

export default function VirtualAssistantComparison() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Virtual Assistants vs. AI Workflow Automation
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              Both can handle lead response. Only one scales without hiring, responds in seconds, and integrates with your PMS.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <div className="mb-12">
            <h2 className="text-28 font-bold text-tp mb-8">Head-to-head comparison</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-4 px-4 text-14 font-semibold text-ts bg-canvas">
                      Category
                    </th>
                    <th className="text-left py-4 px-4 text-14 font-semibold text-ts bg-canvas">
                      Virtual Assistant
                    </th>
                    <th className="text-left py-4 px-4 text-14 font-semibold text-primary bg-canvas">
                      CompliCore+ AI Workflows
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-line ${idx % 2 === 0 ? 'bg-surface' : 'bg-canvas'}`}
                    >
                      <td className="py-4 px-4">
                        <p className="text-14 font-semibold text-tp">{row.category}</p>
                        <p className="text-12 text-ts mt-1">{row.metric}</p>
                      </td>
                      <td className="py-4 px-4 text-14 text-ts">{row.virtualAssistant}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-14 text-tp">{row.complicoreplus}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-line bg-canvas p-6"
                >
                  <p className="text-14 font-semibold text-tp mb-1">{row.category}</p>
                  <p className="text-12 text-ts mb-4">{row.metric}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-12 text-ts font-semibold mb-1">Virtual Assistant</p>
                      <p className="text-14 text-ts">{row.virtualAssistant}</p>
                    </div>
                    <div className="pt-3 border-t border-line">
                      <p className="text-12 text-primary font-semibold mb-1 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        CompliCore+ AI Workflows
                      </p>
                      <p className="text-14 text-tp">{row.complicoreplus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why VAs Fail at Scale */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="The VA Problem"
            heading="Virtual assistants work until they don't"
            subheading="They scale linearly by cost, not by coverage."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {virtualAssistantLimits.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-surface p-6">
                <div className="flex gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <h3 className="text-16 font-semibold text-tp">{item.title}</h3>
                </div>
                <p className="text-14 text-ts">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Model */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <h2 className="text-28 font-bold text-tp mb-8">The math: cost at different scales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                scenario: 'Single property (50–150 units)',
                va: '$2,500–3,500/mo',
                complicore: '$698–999/mo + $1,500 one-time',
                savings: 'Save ~$20–35k/year',
              },
              {
                scenario: 'Multi-property (300–600 units)',
                va: '$5,000–7,000/mo (2–3 VAs)',
                complicore: '$1,047–1,396/mo + $1,500 one-time',
                savings: 'Save ~$50–75k/year',
              },
              {
                scenario: 'Portfolio (800+ units)',
                va: '$10,000+/mo (3–4 VAs)',
                complicore: '$1,396–1,645/mo + $1,500 one-time',
                savings: 'Save ~$100–120k/year',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-canvas p-6">
                <p className="text-14 font-semibold text-ts mb-4">{item.scenario}</p>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-12 text-ts mb-1">Virtual Assistant</p>
                    <p className="text-16 font-semibold text-ts">{item.va}</p>
                  </div>
                  <div>
                    <p className="text-12 text-primary mb-1">CompliCore+ Workflows</p>
                    <p className="text-16 font-semibold text-primary">{item.complicore}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="text-13 font-semibold text-success">{item.savings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to use VAs */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container max-w-2xl mx-auto">
          <h2 className="text-28 font-bold text-tp mb-8">When a VA might make sense</h2>
          <div className="space-y-4">
            {[
              'Complex negotiation (VA can build relationships with repeat prospects)',
              'Hyper-personalized outreach (VA can add warmth/nuance beyond automation)',
              'Non-leasing admin (maintenance triage, compliance routing)',
              'Legacy systems (some PMS integrations unavailable)',
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 p-4 rounded-lg bg-surface border border-line">
                <CheckCircle className="w-5 h-5 text-ts flex-shrink-0 mt-0.5" />
                <p className="text-14 text-ts">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-14 text-ts mt-8 p-6 rounded-lg bg-surface border border-line">
            But for instant lead response, follow-up sequencing, and admin routing? AI workflows beat VAs on speed, cost, and reliability every time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="Questions"
            heading="About this comparison"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                q: 'Can I use CompliCore+ AND a virtual assistant together?',
                a: 'Yes. CompliCore+ handles lead response and follow-up (instant), freeing your VA to focus on relationship-building or complex negotiations. Many properties run both.',
              },
              {
                q: 'What if I already have a virtual assistant?',
                a: 'Great. Use CompliCore+ to handle the volume they can\'t keep up with during hours they\'re unavailable. They handle exceptions and complex prospects; CompliCore+ handles the inbox.',
              },
              {
                q: 'Does CompliCore+ work with international VAs?',
                a: 'Yes. But international VAs add complexity: time zone coordination, communication delays, currency and tax overhead. CompliCore+ eliminates these entirely.',
              },
              {
                q: 'What about VA agencies?',
                a: 'VA agencies solve hiring but increase cost ($4,000–5,000/mo) and add middleman complexity. CompliCore+ is direct integration without agency markup.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-canvas p-6">
                <h3 className="text-16 font-semibold text-tp mb-3">{faq.q}</h3>
                <p className="text-14 text-ts">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Ready to see the difference?
          </h2>
          <p className="text-16 text-ts mt-4">
            Book a demo and see how response automation outpaces manual approaches—whether that's VAs, staff, or mixed teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <CTAButton href="/demo" variant="primary">
              See It Work <ArrowRight className="w-4 h-4" />
            </CTAButton>
            <CTAButton href="/book-demo" variant="secondary">
              Book Live Demo <ArrowRight className="w-4 h-4" />
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  )
}
