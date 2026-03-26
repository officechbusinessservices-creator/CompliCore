'use client'

import { ArrowRight, CheckCircle, Zap, Settings, BarChart3, AlertCircle } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'CRM Automation vs CompliCore+ | AI Workflows for Property Managers',
  description: 'Why property-management-first automation beats generic CRM workflows. Compare setup, intelligence, integration, and speed.',
  openGraph: {
    title: 'CRM Automation vs CompliCore+ | AI Workflows for Property Managers',
    description: 'CRM Automation vs CompliCore+: which works better for residential property management?',
    url: 'https://complicore.ai/compare/crm-automation-vs-complicore-plus',
    type: 'website',
  },
}

const comparisonRows = [
  {
    category: 'Setup Time',
    metric: 'Days to first automated response',
    crm: '5–14 days (design workflows, map fields, train team)',
    complicoreplus: 'Same day (pre-built for property management)',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Property Management IQ',
    metric: 'Understands lease terms, units, availability',
    crm: 'Generic. Requires custom field mapping and manual rules.',
    complicoreplus: 'Built-in. Syncs with Yardi, AppFolio, Rent Manager in real-time.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Inquiry Routing',
    metric: 'Accuracy of unit matching',
    crm: 'Manual rule-based (~75% accuracy without heavy customization)',
    complicoreplus: '99.2% accuracy. Learns inquiry patterns, availability, lease terms.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Data Synchronization',
    metric: 'Real-time PMS sync',
    crm: 'API integrations required (custom setup, maintenance burden)',
    complicoreplus: 'Native PMS integrations (no setup required)',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Workflow Maintenance',
    metric: 'Ongoing updates and optimization',
    crm: 'Ongoing. Broken rules require manual fixes. Updates need IT involvement.',
    complicoreplus: 'Zero maintenance. Learns and adapts autonomously.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Cost per Workflow',
    metric: 'Monthly cost for lead response + follow-up',
    crm: '$500–2,000/mo CRM + additional integrations + custom development',
    complicoreplus: '$698/mo (2 workflows) + $1,500 one-time',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Scalability',
    metric: 'Cost to handle 3x inquiry volume',
    crm: 'No cost increase, but workflows may degrade. Custom optimization likely needed.',
    complicoreplus: 'No cost increase. Handles volume automatically.',
    advantage: 'ComplicoreAI',
  },
  {
    category: 'Multi-workflow Management',
    metric: 'Managing lead response + follow-up + admin routing',
    crm: 'Three separate workflow sets to design and maintain',
    complicoreplus: '$249/mo per additional workflow. All run autonomously in parallel.',
    advantage: 'ComplicoreAI',
  },
]

const crmLimits = [
  {
    title: 'Generic workflows for specific problems',
    description: 'CRMs are built for sales pipelines, not residential property management. Lease terms, unit availability, turnover dates—these require custom field mapping that breaks when your PMS updates.',
  },
  {
    title: 'Setup complexity = hidden costs',
    description: 'CRM automation requires a consultant or IT resource. Even "no-code" workflows demand field mapping, rule testing, and integration work. The real cost is in setup time, not the platform itself.',
  },
  {
    title: 'Maintenance burden scales with volume',
    description: 'As inquiry volume grows, generic CRM rules break. Routing accuracy drops. You\'re back to manual overrides and exceptions, defeating the purpose of automation.',
  },
  {
    title: 'Data sync delays = missed context',
    description: 'CRM workflows work on stale data. Unit becomes unavailable in your PMS, but CRM workflows still send it for 4 hours. CompliCore+ syncs in real-time.',
  },
]

const crmUseCases = [
  'If you\'re already deep in a CRM ecosystem (HubSpot, Salesforce, Pipedrive) AND willing to invest in custom development',
  'If your property management workflow is highly non-standard or involves complex custom business logic',
  'If you need to combine property management automation with broader sales/customer success workflows in one platform',
  'If you have an in-house technical team to maintain and optimize CRM automation over time',
]

export default function CRMComparison() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              CRM Automation vs. Property Management AI
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              CRMs solve sales. CompliCore+ solves property management. One requires weeks of setup. The other runs on day one.
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
                      CRM Automation
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
                      <td className="py-4 px-4 text-14 text-ts">{row.crm}</td>
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
                      <p className="text-12 text-ts font-semibold mb-1">CRM Automation</p>
                      <p className="text-14 text-ts">{row.crm}</p>
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

      {/* Why CRM Automation Falls Short */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="The CRM Problem"
            heading="CRMs weren't built for property management"
            subheading="They optimize for sales pipelines, not leasing workflows."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {crmLimits.map((item, idx) => (
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

      {/* Speed & Intelligence */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-30 font-bold text-tp mb-6">
                Speed and intelligence working together
              </h2>
              <p className="text-16 text-ts mb-4">
                CompliCore+ isn't just fast—it's built to understand property management context from day one. It knows lease terms, unit availability, inquiry patterns, and turnover schedules. No field mapping. No custom rules. No consultant required.
              </p>
              <p className="text-16 text-ts mb-6">
                CRM automation requires you to teach it how property management works. CompliCore+ already knows.
              </p>
              <div className="space-y-3">
                {[
                  'Real-time PMS sync (not polling)',
                  'Learns your property patterns automatically',
                  'Handles multi-unit, multi-lease complexity',
                  'No maintenance required',
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-14 text-tp">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-8">
              <h3 className="text-18 font-semibold text-tp mb-6">Setup Timeline</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-12 text-ts font-semibold mb-2">CRM Automation</p>
                  <div className="space-y-1">
                    <p className="text-13 text-ts">Day 1-2: Scope and planning</p>
                    <p className="text-13 text-ts">Day 3-7: Custom field mapping</p>
                    <p className="text-13 text-ts">Day 8-14: Workflow design and testing</p>
                    <p className="text-13 text-warning font-semibold">Total: 2-3 weeks</p>
                  </div>
                </div>
                <div className="border-t border-line pt-4">
                  <p className="text-12 text-primary font-semibold mb-2">CompliCore+ AI Workflows</p>
                  <div className="space-y-1">
                    <p className="text-13 text-primary">Day 1: Sign up and connect PMS</p>
                    <p className="text-13 text-primary">Day 1: Customize messaging (optional)</p>
                    <p className="text-13 text-success font-semibold">Live within hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Model */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <h2 className="text-28 font-bold text-tp mb-8">The real cost: implementation + operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                scenario: 'Single workflow (lead response)',
                crm: 'CRM platform + consulting + integrations: $2,000–4,000 setup + $500–1,000/mo',
                complicore: '$1,500 one-time + $349/mo',
                savings: 'Save $500–2,500 upfront, $150–7,650/year',
              },
              {
                scenario: 'Two workflows (response + follow-up)',
                crm: '$3,000–6,000 setup + $800–1,500/mo + ongoing maintenance',
                complicore: '$1,500 one-time + $698/mo (all 2 workflows)',
                savings: 'Save $1,500–4,500 upfront, $1,200–9,600/year',
              },
              {
                scenario: 'Three workflows (response + follow-up + admin)',
                crm: '$4,000–8,000 setup + $1,200–2,000/mo + complexity overhead',
                crm2: '+Custom development for each workflow',
                complicore: '$1,500 one-time + $947/mo (all 3 workflows)',
                savings: 'Save $2,500–6,500 upfront, $2,400–13,800/year',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-surface p-6">
                <p className="text-14 font-semibold text-ts mb-4">{item.scenario}</p>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-12 text-ts mb-1">CRM Automation</p>
                    <p className="text-15 text-ts">{item.crm}</p>
                    {item.crm2 && <p className="text-13 text-warning mt-1">{item.crm2}</p>}
                  </div>
                  <div>
                    <p className="text-12 text-primary mb-1">CompliCore+ Workflows</p>
                    <p className="text-15 font-semibold text-primary">{item.complicore}</p>
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

      {/* When CRM Might Make Sense */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto">
          <h2 className="text-28 font-bold text-tp mb-8">When CRM automation might make sense</h2>
          <div className="space-y-4">
            {crmUseCases.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-4 rounded-lg bg-canvas border border-line">
                <CheckCircle className="w-5 h-5 text-ts flex-shrink-0 mt-0.5" />
                <p className="text-14 text-ts">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-14 text-ts mt-8 p-6 rounded-lg bg-canvas border border-line">
            But if you need to respond to leasing inquiries in seconds, integrate with your PMS in real-time, and scale without consulting or custom development? CompliCore+ is purpose-built to win.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="Questions"
            heading="About this comparison"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                q: 'Can I use both CRM automation and CompliCore+ together?',
                a: 'Yes. Use CompliCore+ to handle leasing inquiry automation and response (the heavy lifting). Your CRM stays focused on pipeline management and customer relationships.',
              },
              {
                q: 'What if I already use HubSpot/Salesforce for property management?',
                a: 'CompliCore+ integrates with your PMS directly. Your CRM can sync data with CompliCore+ via webhook if needed, but the leasing workflow is optimized specifically for residential property management.',
              },
              {
                q: 'Does CompliCore+ work without a CRM?',
                a: 'Absolutely. Many property managers run CompliCore+ standalone—no CRM needed. You get leasing automation without the platform bloat.',
              },
              {
                q: 'What about CRM migration later?',
                a: 'CompliCore+ is independent. If you move CRM platforms, your workflows keep running. No data loss, no re-setup required.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-surface p-6">
                <h3 className="text-16 font-semibold text-tp mb-3">{faq.q}</h3>
                <p className="text-14 text-ts">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Purpose-built for property management
          </h2>
          <p className="text-16 text-ts mt-4">
            See how CompliCore+ automates leasing workflows faster, smarter, and at lower cost than retrofitting a generic CRM.
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
