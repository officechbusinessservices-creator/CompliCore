import { ArrowRight, CheckCircle, Zap } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Property Management AI | CompliCore+',
  description: 'Property management AI that installs active operational workflows. Not generic AI—purpose-built automation for property managers.',
  openGraph: {
    title: 'Property Management AI | CompliCore+',
    description: 'Property management AI that installs active operational workflows.',
    url: 'https://complicore.ai/property-management-ai',
    type: 'website',
  },
}

export default function PropertyManagementAIPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Property Management AI that installs active operational workflows
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              CompliCore+ does not sell generic AI. It installs response, follow-up, and routing workflows that cut admin drag and protect leasing speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <CTAButton href="/book-demo" variant="primary">
                Book Live Demo <ArrowRight className="w-4 h-4" />
              </CTAButton>
              <CTAButton href="/demo" variant="secondary">
                See It Work <ArrowRight className="w-4 h-4" />
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="The problem"
            heading="Property managers use AI wrong (or not at all)"
            subheading="Most AI tools are built for knowledge workers. Property leasing is different."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line p-6">
              <h3 className="text-16 font-semibold text-tp">Generic chatbots miss context</h3>
              <p className="text-14 text-ts mt-3">
                Off-the-shelf AI doesn't understand leasing cycles, availability rules, or unit-level operations. Responses are generic or wrong.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <h3 className="text-16 font-semibold text-tp">Automation without workflows fails</h3>
              <p className="text-14 text-ts mt-3">
                Task automation without integrated workflows means humans still decide what happens next. No real leverage.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <h3 className="text-16 font-semibold text-tp">Speed matters, but ops need control</h3>
              <p className="text-14 text-ts mt-3">
                Fast response wins leases. But property teams need visibility and handoff points, not just a black box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How CompliCore+ is different */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="How we're different"
            heading="Purpose-built workflows for property teams"
            subheading="CompliCore+ doesn't sell AI. It installs three operational workflows that property managers asked for."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Workflow 1 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0" />
                <h3 className="text-16 font-semibold text-tp">Lead Response Automation</h3>
              </div>
              <p className="text-14 text-ts">
                Responds to new inquiries in under 60 seconds. Understands availability, unit types, and leasing terms. Routes hot leads to the right person.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Sub-60s response time</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Unit & lease-aware replies</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Lead routing to team</span>
                </div>
              </div>
            </div>

            {/* Workflow 2 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0" />
                <h3 className="text-16 font-semibold text-tp">Follow-Up Automation</h3>
              </div>
              <p className="text-14 text-ts">
                Schedules the next move when prospects go quiet. Follows up on agreed timelines, not guesses. Keeps leads warm until lease signed.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">48h follow-up default</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Re-engagement messaging</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Lead loss prevention</span>
                </div>
              </div>
            </div>

            {/* Workflow 3 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0" />
                <h3 className="text-16 font-semibold text-tp">Admin Routing</h3>
              </div>
              <p className="text-14 text-ts">
                Classifies maintenance requests, renewal reminders, and compliance tasks. Routes to the right team member. Removes manual triage.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Intake classification</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Rule-based routing</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-13 text-ts">Admin work eliminated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activation process */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="How it works"
            heading="Activation is fast. Results are immediate."
            subheading="Book a demo, confirm the workflow setup, activate through Stripe, and go live."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            {[
              {
                step: '1',
                title: 'Book Demo',
                description: 'See the workflows in action with a live walkthrough.'
              },
              {
                step: '2',
                title: 'Confirm Setup',
                description: 'Verify your leasing terms, availability, and team routing.'
              },
              {
                step: '3',
                title: 'Activate via Stripe',
                description: 'Pay activation fee + first month. System goes live immediately.'
              },
              {
                step: '4',
                title: 'Monitor & Expand',
                description: 'Watch KPIs, add workflows as they prove value.'
              }
            ].map((item) => (
              <div key={item.step} className="card rounded-lg border border-line bg-canvas p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-16 font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-14 font-semibold text-tp mt-4">{item.title}</h3>
                <p className="text-13 text-ts mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing snippet */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <SectionHeader
            label="Pricing"
            heading="Transparent pricing. No surprises."
            subheading="One-time activation. Monthly per active workflow. Add more only when the system proves value."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">One-time Activation</p>
              <p className="text-24 font-bold text-tp mt-2">$1,500</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Per Active Workflow</p>
              <p className="text-24 font-bold text-tp mt-2">$349/mo</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Plans Available</p>
              <p className="text-24 font-bold text-tp mt-2">1–10 flows</p>
            </div>
          </div>
          <CTAButton href="/pricing" className="mt-8">
            See Full Pricing <ArrowRight className="w-4 h-4" />
          </CTAButton>
        </div>
      </section>

      {/* CTA section */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Watch the workflow execute before you activate
          </h2>
          <p className="text-16 text-ts mt-4">
            Run a simulated inquiry, see the timeline fire, understand how activation works.
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
