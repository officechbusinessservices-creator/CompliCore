import { ArrowRight, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Leasing Lead Response Automation | CompliCore+',
  description: 'Respond to property inquiries in under 60 seconds. CompliCore+ lead response automation eliminates manual inbox lag and protects leasing speed.',
  openGraph: {
    title: 'Leasing Lead Response Automation | CompliCore+',
    description: 'Respond to property inquiries in under 60 seconds with AI-powered automation.',
    url: 'https://complicore.ai/lead-response-automation',
    type: 'website',
  },
}

export default function LeadResponseAutomationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Leasing Lead Response Automation for property managers
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              New inquiries lose value fast. CompliCore+ responds instantly so prospects stop waiting on manual inbox coverage.
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
        </div>
      </section>

      {/* The problem: Manual response kills leasing speed */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="The problem"
            heading="Manual inbox coverage kills leasing momentum"
            subheading="Inquiries are only valuable in the first 5 minutes. After that, prospects disappear."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line p-6">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Speed decides leases</h3>
              <p className="text-14 text-ts mt-3">
                Prospects shopping multiple properties don't wait. The first response wins the lease. Manual inbox coverage can't keep up.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Team scaling is hard</h3>
              <p className="text-14 text-ts mt-3">
                Hiring more leasing staff solves the problem linearly. One response per person. Automation responds to all inquiries instantly.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Lost leads compound</h3>
              <p className="text-14 text-ts mt-3">
                Each missed response doesn't just lose one lease. It reduces overall occupancy, extends vacancy, and breaks revenue targets.
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
            heading="Respond instantly. Convert faster. Repeat."
            subheading="CompliCore+ watches for new inquiries and responds in under 60 seconds with availability-aware, lease-term-smart replies."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Step 1 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  1
                </div>
                <h3 className="text-16 font-semibold text-tp">Prospect inquires</h3>
              </div>
              <p className="text-14 text-ts">
                A new lead submits an inquiry through your website, phone, or email. The inquiry arrives at the system.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  2
                </div>
                <h3 className="text-16 font-semibold text-tp">System responds</h3>
              </div>
              <p className="text-14 text-ts">
                CompliCore+ checks availability, lease terms, and unit types in real-time. Generates and queues a response instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  3
                </div>
                <h3 className="text-16 font-semibold text-tp">Routes to team</h3>
              </div>
              <p className="text-14 text-ts">
                The response is sent. The prospect gets a qualified answer in under 60 seconds. The lead routes to your leasing team for next steps.
              </p>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-4">Response time</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Manual inbox:</strong> 2–4 hours to first response
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>CompliCore+:</strong> Under 60 seconds, always-on
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Impact:</strong> Respond before the lead moves on
                  </span>
                </div>
              </div>
            </div>

            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-4">Response quality</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Aware of availability:</strong> Only shows what&rsquo;s actually open
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Lease-term smart:</strong> Matches prospect&rsquo;s needs (6mo, 12mo, etc.)
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Personal:</strong> Not generic—context-aware for your property
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
            heading="Live in minutes, not weeks"
            subheading="Book a demo, map your availability and leasing terms, activate through Stripe, and respond to real inquiries."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            {[
              {
                step: '1',
                title: 'Book Demo',
                description: 'See the response workflow in action with a live walkthrough.'
              },
              {
                step: '2',
                title: 'Map Setup',
                description: 'Share your unit types, availability, and leasing terms.'
              },
              {
                step: '3',
                title: 'Activate via Stripe',
                description: 'Pay activation fee + first month. System goes live immediately.'
              },
              {
                step: '4',
                title: 'Monitor KPIs',
                description: 'Watch response time, conversion metrics, and expand workflows.'
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
            heading="Simple. Transparent. No surprises."
            subheading="One-time activation. Monthly for the lead response workflow. Add more workflows as your strategy grows."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">One-time Activation</p>
              <p className="text-24 font-bold text-tp mt-2">$1,500</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Lead Response Workflow</p>
              <p className="text-24 font-bold text-tp mt-2">$349/mo</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Typical First Month</p>
              <p className="text-24 font-bold text-tp mt-2">$1,849</p>
            </div>
          </div>
          <CTAButton href="/pricing" className="mt-8">
            See Full Pricing <ArrowRight className="w-4 h-4" />
          </CTAButton>
        </div>
      </section>

      {/* Results section */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="What changes"
            heading="Leasing speed compounds"
            subheading="The first response matters most. CompliCore+ wins that race every time."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">47s</p>
              <p className="text-14 text-ts mt-2">Median first-response time</p>
              <p className="text-13 text-ts mt-3">vs. 2–4 hours with manual coverage</p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">3x</p>
              <p className="text-14 text-ts mt-2">More inquiries converted</p>
              <p className="text-13 text-ts mt-3">Speed to response is the dominant lever</p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">100%</p>
              <p className="text-14 text-ts mt-2">No inquiry missed</p>
              <p className="text-13 text-ts mt-3">System runs continuously, even after hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Start responding instantly
          </h2>
          <p className="text-16 text-ts mt-4">
            See the workflow execute before you activate. Run a simulated inquiry and understand how the system works.
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
