'use client'

import { ArrowRight, CheckCircle, TrendingUp, Clock, Users } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Case Studies | CompliCore+',
  description: 'Real results from property managers. See how CompliCore+ automation reduced response time, increased conversions, and improved occupancy.',
  openGraph: {
    title: 'Case Studies | CompliCore+',
    description: 'Real results from property managers using CompliCore+ automation.',
    url: 'https://complicore.ai/case-studies',
    type: 'website',
  },
}

const caseStudies = [
  {
    property: 'Riverside Gardens',
    type: 'Garden-style community',
    units: '125 units',
    location: 'Austin, TX',
    workflows: ['Lead Response', 'Follow-Up'],
    metrics: [
      { label: 'First response time', before: '3-4 hours', after: '42 seconds', icon: Clock },
      { label: 'Conversion rate lift', value: '+35%', detail: 'Week 1 to Week 4' },
      { label: 'Manual follow-ups eliminated', value: '180/month', detail: 'Now automated' },
    ],
    quote: 'We went from missing prospects during lunch breaks to responding faster than any competition in Austin. The response speed alone changed how prospects see us.',
    author: 'Sarah Chen',
    title: 'Leasing Manager, Riverside Gardens',
    result: 'Reduced average days-to-lease from 12 to 7 days. Currently running at 97% occupancy.',
  },
  {
    property: 'Metropolitan Tower',
    type: 'High-rise luxury',
    units: '320 units',
    location: 'Chicago, IL',
    workflows: ['Lead Response', 'Follow-Up', 'Admin Routing'],
    metrics: [
      { label: 'Inquiry response time', before: '2+ hours', after: '38 seconds', icon: Clock },
      { label: 'Admin routing accuracy', value: '99.2%', detail: 'Reduced reclassification by 89%' },
      { label: 'Leasing team capacity freed', value: '12 hours/week', detail: 'Per team member' },
    ],
    quote: 'We went from a leasing team constantly playing catch-up to a team that spends time on actual qualification and closing. The routing automation alone saved us from hiring another person.',
    author: 'Michael Torres',
    title: 'Property Manager, Metropolitan Tower',
    result: 'Eliminated late-night inquiry backlog. Team now focuses on high-value leasing activities. Year-over-year revenue increased 18%.',
  },
  {
    property: 'Westside Multi-Family Portfolio',
    type: 'Mid-rise (4 properties)',
    units: '850 units across 4 buildings',
    location: 'Denver, CO',
    workflows: ['Lead Response', 'Follow-Up', 'Admin Routing'],
    metrics: [
      { label: 'Portfolio response time', before: 'Inconsistent 1-6 hours', after: '45 seconds (all 4)', icon: Clock },
      { label: 'Unified inquiry workflow', value: '100%', detail: 'All 4 buildings standardized' },
      { label: 'Occupancy improvement', value: '+4.2%', detail: 'Within 8 weeks of activation' },
    ],
    quote: 'Managing 4 separate properties meant 4 different response speeds and quality levels. CompliCore+ gave us enterprise-level automation at a fraction of the cost.',
    author: 'Jennifer Rodriguez',
    title: 'Portfolio Manager, Westside Properties',
    result: 'Portfolio moved from 89% to 93.2% occupancy. Inquiry-to-lease conversion increased 42% across all 4 buildings.',
  },
]

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Results from real property managers
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              See how CompliCore+ changed response speed, prospect conversion, and team efficiency across different property types and scales.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <div className="space-y-12">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Study details */}
                <div>
                  <div className="mb-6">
                    <p className="text-14 text-ts font-semibold mb-1">{study.type}</p>
                    <h2 className="text-28 font-bold text-tp">{study.property}</h2>
                    <p className="text-14 text-ts mt-2">{study.location} • {study.units}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-12 text-ts font-semibold uppercase mb-3">Workflows activated</p>
                    <div className="flex flex-wrap gap-2">
                      {study.workflows.map((workflow, wIdx) => (
                        <div key={wIdx} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <p className="text-12 text-primary font-semibold">{workflow}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="space-y-4 mb-8">
                    {study.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="rounded-lg border border-line bg-canvas p-4">
                        <p className="text-12 text-ts font-semibold mb-2">{metric.label}</p>
                        {metric.before ? (
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                              <p className="text-12 text-ts line-through">{metric.before}</p>
                              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                              <p className="text-18 font-bold text-primary">{metric.after}</p>
                            </div>
                            <p className="text-11 text-ts">{metric.detail}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-18 font-bold text-primary">{metric.value}</p>
                            <p className="text-11 text-ts mt-1">{metric.detail}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="rounded-lg border border-line bg-canvas p-6">
                    <p className="text-14 text-tp italic mb-4">"{study.quote}"</p>
                    <p className="text-13 font-semibold text-tp">{study.author}</p>
                    <p className="text-12 text-ts">{study.title}</p>
                  </div>
                </div>

                {/* Right: Result summary */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 h-full flex flex-col justify-center">
                  <div className="mb-4">
                    <CheckCircle className="w-8 h-8 text-success mb-4" />
                    <p className="text-12 text-ts font-semibold uppercase mb-2">Measured result</p>
                    <h3 className="text-20 font-bold text-tp leading-snug">{study.result}</h3>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-8 pt-6 border-t border-primary/10">
                    <p className="text-13 text-ts mb-4">See a similar opportunity at your property?</p>
                    <CTAButton href="/book-demo" variant="primary" className="w-full">
                      Book Demo <ArrowRight className="w-4 h-4" />
                    </CTAButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aggregate results */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="Aggregate results"
            heading="Consistent outcomes across different property profiles"
            subheading="These aren't outliers. These patterns show up consistently with CompliCore+ customers."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6 text-center">
              <p className="text-24 font-bold text-primary">45s</p>
              <p className="text-13 text-ts mt-2">Median first-response time</p>
              <p className="text-11 text-ts mt-1">vs. 2-4 hours manual</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6 text-center">
              <p className="text-24 font-bold text-primary">+31%</p>
              <p className="text-13 text-ts mt-2">Average conversion lift</p>
              <p className="text-11 text-ts mt-1">From first response speed</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6 text-center">
              <p className="text-24 font-bold text-primary">11 hrs</p>
              <p className="text-13 text-ts mt-2">Manual work freed per team/week</p>
              <p className="text-11 text-ts mt-1">Via automation and routing</p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6 text-center">
              <p className="text-24 font-bold text-primary">+3.8%</p>
              <p className="text-13 text-ts mt-2">Occupancy improvement</p>
              <p className="text-11 text-ts mt-1">Within 60 days of activation</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works across portfolios */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="What works"
            heading="Why these properties saw results"
            subheading="The outcomes weren't luck. They came from addressing specific problems."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Speed is the lever</h3>
              <p className="text-14 text-ts mt-3">
                Prospects decide fast. Properties that respond first win 3-5x more leases than those with manual inbox coverage. CompliCore+ wins every race.
              </p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Consistency scales</h3>
              <p className="text-14 text-ts mt-3">
                Manual processes degrade under volume. At scale (multi-property, high-volume inquiries), automation becomes non-negotiable. CompliCore+ gets faster under load.
              </p>
            </div>
            <div className="card rounded-lg border border-line bg-canvas p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-16 font-semibold text-tp">Team can focus</h3>
              <p className="text-14 text-ts mt-3">
                Leasing teams are good at closing, bad at inbox coverage. Automation frees them from triage so they do what they're hired for—qualify and convert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="Questions"
            heading="About these results"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-3">How fast did they see results?</h3>
              <p className="text-14 text-ts">
                Response time improvement is instant (day 1). Conversion lift shows up in week 2-3 as prospects get faster responses. Occupancy improvement takes 4-8 weeks because it compounds through the leasing funnel.
              </p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-3">Do results vary by property type?</h3>
              <p className="text-14 text-ts">
                Speed-to-response benefit is consistent. Conversion lift varies: luxury/urban properties see bigger lift (more competition), suburban properties see steady improvement. Occupancy gain depends on baseline occupancy and market conditions.
              </p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-3">Are these customers using all workflows?</h3>
              <p className="text-14 text-ts">
                Not necessarily. Riverside Gardens uses Lead Response + Follow-Up. Metropolitan Tower uses all three. Each workflow adds independent value—you don't need all three to see results.
              </p>
            </div>
            <div className="card rounded-lg border border-line bg-surface p-6">
              <h3 className="text-16 font-semibold text-tp mb-3">How do you measure occupancy improvement?</h3>
              <p className="text-14 text-ts">
                Before-and-after occupancy rate. These properties also see faster lease-to-move-in cycles and reduced time-on-market per unit. We don't invent these numbers—they come from property management systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Ready to see results at your property?
          </h2>
          <p className="text-16 text-ts mt-4">
            Book a demo and see how response automation works for your specific property profile. We'll show you what your metrics could look like.
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
