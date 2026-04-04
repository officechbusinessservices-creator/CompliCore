import { ArrowRight, CheckCircle, AlertCircle, Inbox, Clock } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Admin Routing Automation | CompliCore+',
  description: 'Classify and route maintenance, renewals, and compliance tasks automatically. CompliCore+ triage eliminates manual inbox sorting.',
  openGraph: {
    title: 'Admin Routing Automation | CompliCore+',
    description: 'Classify and route maintenance, renewals, and compliance tasks automatically.',
    url: 'https://complicore.ai/admin-routing-automation',
    type: 'website',
  },
}

export default function AdminRoutingAutomationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Admin Routing Automation that classifies and routes in seconds
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              Maintenance requests, lease renewals, and compliance tasks pile up in inbox purgatory. CompliCore+ classifies them and routes to the right person automatically.
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

      {/* The problem: Admin chaos kills operational velocity */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="The problem"
            heading="Admin intake drowns in triage"
            subheading="Maintenance calls, renewal notices, and compliance escalations all land in the same inbox. Humans sort. Humans delay. Humans forget."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line p-6">
              <Inbox className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Inbox becomes a junkyard</h3>
              <p className="text-14 text-ts mt-3">
                Maintenance requests, renewals, notices, and escalations land in one place. No priority. No categorization. Teams dig through chaos.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Routing takes hours or days</h3>
              <p className="text-14 text-ts mt-3">
                Triage requires judgment. Maintenance goes to ops. Renewals to leasing. Compliance to legal. Humans handle it when they have time.
              </p>
            </div>
            <div className="card rounded-lg border border-line p-6">
              <AlertCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Critical tasks fall through cracks</h3>
              <p className="text-14 text-ts mt-3">
                Compliance escalations get lost. Maintenance emergencies sit. Renewal deadlines pass. Admin bottleneck becomes operational risk.
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
            heading="Classify once. Route automatically. Eliminate triage."
            subheading="CompliCore+ reads each intake request, classifies it, and sends it to the right team member with context already attached."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Step 1 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  1
                </div>
                <h3 className="text-16 font-semibold text-tp">Intake arrives</h3>
              </div>
              <p className="text-14 text-ts">
                Maintenance request, renewal notice, or compliance escalation arrives via email, phone, or form. System captures the full message.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  2
                </div>
                <h3 className="text-16 font-semibold text-tp">System classifies</h3>
              </div>
              <p className="text-14 text-ts">
                CompliCore+ reads the request and classifies it: maintenance, renewal, lease escalation, compliance, or other. Assigns priority based on urgency signals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-16">
                  3
                </div>
                <h3 className="text-16 font-semibold text-tp">Routes with context</h3>
              </div>
              <p className="text-14 text-ts">
                Task is sent to the right team (ops, leasing, legal, etc.). Full request context is attached. Receiver acts immediately without re-reading.
              </p>
            </div>
          </div>

          {/* Key capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-4">Classification</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Maintenance:</strong> Plumbing, HVAC, appliance repairs
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Renewals:</strong> Lease renewal notices and reminders
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Compliance:</strong> Regulatory notices and legal escalations
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Smart priority:</strong> Emergency flags identified automatically
                  </span>
                </div>
              </div>
            </div>

            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-4">Routing Rules</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Role-based assignment:</strong> Right person every time
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Custom routing rules:</strong> You define the workflow
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Zero manual triage:</strong> No human decision required
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-14 text-ts">
                    <strong>Dashboard visibility:</strong> Track every routed task
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
            heading="Add admin routing to your workflow stack"
            subheading="Define your routing rules once, then let the system handle intake forever."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            {[
              {
                step: '1',
                title: 'Book Demo',
                description: 'See how routing classification works with your real intake types.'
              },
              {
                step: '2',
                title: 'Define Rules',
                description: 'Set up routing rules for maintenance, renewals, compliance, and custom categories.'
              },
              {
                step: '3',
                title: 'Activate',
                description: 'Add to your subscription. System begins classifying and routing immediately.'
              },
              {
                step: '4',
                title: 'Monitor',
                description: 'Watch triage time drop. Track routing accuracy. Refine rules over time.'
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
            subheading="Add admin routing as another workflow. Already activated? Add it for $349/mo."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">Admin Routing Workflow</p>
              <p className="text-24 font-bold text-tp mt-2">$349/mo</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">With Response + Follow-Up</p>
              <p className="text-24 font-bold text-tp mt-2">$1,047/mo</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <p className="text-14 text-ts">All Three Workflows</p>
              <p className="text-24 font-bold text-tp mt-2\">
                <span className="line-through opacity-50\">$1,047</span> $999/mo*
              </p>
            </div>
          </div>
          <p className="text-12 text-ts mt-4\">*Stacking discount for 3+ workflows</p>
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
            heading="Admin work stops being a bottleneck"
            subheading="When intake is classified and routed instantly, operations move faster."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">90%</p>
              <p className="text-14 text-ts mt-2">Triage time eliminated</p>
              <p className="text-13 text-ts mt-3">No human sorting—system classifies and routes</p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">4h</p>
              <p className="text-14 text-ts mt-2">Avg task resolution faster</p>
              <p className="text-13 text-ts mt-3">Right person gets it immediately with context</p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <p className="text-24 font-bold text-primary">0</p>
              <p className="text-14 text-ts mt-2">Tasks fall through cracks</p>
              <p className="text-13 text-ts mt-3">Every intake is classified and routed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Stop routing requests manually
          </h2>
          <p className="text-16 text-ts mt-4">
            See how classification and routing works in the demo. Then activate and watch triage disappear from your workflow.
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
