import { ArrowRight, CheckCircle, AlertCircle, Target, Calendar } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Leasing Follow-Up Automation | CompliCore+',
  description: 'Automated follow-up that closes gaps and keeps prospects warm. CompliCore+ schedules and sends the next move before leads go cold.',
  openGraph: {
    title: 'Leasing Follow-Up Automation | CompliCore+',
    description: 'Keep leads warm with automated follow-up scheduled before prospects disappear.',
    url: 'https://complicore.ai/leasing-follow-up-automation',
    type: 'website',
  },
}

export default function LeasingFollowUpAutomationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Leasing Follow-Up Automation that closes the gap after the first inquiry
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              Most follow-up fails because it depends on manual consistency. CompliCore+ schedules and sends the next move before the lead goes cold.
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

      {/* The problem: Manual follow-up dies */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="The problem"
            heading="Manual follow-up falls apart"
            subheading="Consistency requires memory and time. Leads disappear while humans debate next steps."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line p-6">
              <AlertCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Prospects go cold fast</h3>
              <p className="text-14 text-ts mt-3">
                A prospect decides within 48 hours. No follow-up in that window = no lease. Manual reminder systems miss the deadline.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <Calendar className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Humans forget</h3>
              <p className="text-14 text-ts mt-3">
                Follow-up is a calendar problem, not a judgment problem. Leasing teams can't hold 50 prospects in their heads at once.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <Target className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Wrong message at the wrong time</h3>
              <p className="text-14 text-ts mt-3">
                Generic follow-up emails feel like spam. Prospects get the same message as everyone else. No signal, no conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How CompliCore+ works */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="How it works"
            heading="Follow-up that's smart and consistent"
            subheading="CompliCore+ knows when to send the next message and personalizes it based on what the prospect asked about."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Step 1 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  1
                </div>
                <h3 className="text-16 font-semibold text-tp">Track the inquiry</h3>
              </div>
              <p className="text-14 text-ts">
                When a prospect inquires, CompliCore+ captures what they asked about—unit type, lease term, move-in date, special requests.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  2
                </div>
                <h3 className="text-16 font-semibold text-tp">Schedule the follow-up</h3>
              </div>
              <p className="text-14 text-ts">
                System schedules a follow-up message 48 hours later (or on a timeline you define). The timing is automatic.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  3
                </div>
                <h3 className="text-16 font-semibold text-tp">Send personalized message</h3>
              </div>
              <p className="text-14 text-ts">
                Follow-up message references the original inquiry. Prospect sees continuity, not spam. Engagement jumps.
              </p>
            </div>
          </div>

          {/* Key capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-4">Timing</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Default 48-hour window:</strong> When prospects decide
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Customizable schedules:</strong> Adjust for your business
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Never misses a deadline:</strong> System runs 24/7
                  </span>
                </div>
              </div>
            </div>

            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-4">Personalization</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Context-aware:</strong> References the original inquiry
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Unit-specific:</strong> Sends info about the unit they asked about
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Feels human:</strong> Not template spam—genuinely relevant
                  </span>
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
            label="How to activate"
            heading="Add follow-up to your lead response flow"
            subheading="If you already have lead response running, follow-up is a single workflow addition."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            {[
              {
                step: '1',
                title: 'Book Demo',
                description: 'See how follow-up schedules automatically after response.'
              },
              {
                step: '2',
                title: 'Set Schedule',
                description: 'Choose your follow-up timing (48h default, or custom).'
              },
              {
                step: '3',
                title: 'Activate',
                description: 'Add to your subscription. Billing updates immediately.'
              },
              {
                step: '4',
                title: 'Monitor',
                description: 'Watch re-engagement metrics and conversion lift.'
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
            heading="Same transparent structure"
            subheading="Add follow-up as a second workflow. Already activated? Add it for $349/mo."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Follow-Up Workflow</p>
              <p className="text-24 font-bold text-tp mt-2">$349/mo</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">With Lead Response</p>
              <p className="text-24 font-bold text-tp mt-2">$698/mo</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Both Workflows</p>
              <p className="text-24 font-bold text-tp mt-2">
                <span className="line-through opacity-50">$698</span> $699/mo*
              </p>
            </div>
          </div>
          <p className="text-12 text-ts mt-4">*Bundle discount when activated together</p>
          <CTAButton href="/pricing" className="mt-8">
            See Full Pricing <ArrowRight className="w-4 h-4" />
          </CTAButton>
        </div>
      </section>

      {/* Impact section */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="What changes"
            heading="Follow-up that actually converts"
            subheading="When prospects hear back at the right time with the right message, conversion rates jump."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">68%</p>
              <p className="text-14 text-ts mt-2">Re-engagement on second touch</p>
              <p className="text-13 text-ts mt-3">Prospect re-opens and engages with follow-up</p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">2.3x</p>
              <p className="text-14 text-ts mt-2">Higher conversion rate</p>
              <p className="text-13 text-ts mt-3">Follow-up touches move more prospects to lease</p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">48h</p>
              <p className="text-14 text-ts mt-2">No more cold leads</p>
              <p className="text-13 text-ts mt-3">Follow-up stays in the decision window</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Stop losing leads to silence
          </h2>
          <p className="text-16 text-ts mt-4">
            See how follow-up scheduling works in the demo. Then activate and watch your re-engagement metrics improve.
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
      </section>
    </>
  )
}
