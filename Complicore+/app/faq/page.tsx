import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'FAQ | CompliCore+',
  description: 'Common questions about CompliCore+ automation workflows. Learn how AI-powered lead response, follow-up, and routing works for property managers.',
  openGraph: {
    title: 'FAQ | CompliCore+',
    description: 'Common questions about CompliCore+ automation workflows.',
    url: 'https://complicore.ai/faq',
    type: 'website',
  },
}

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How long does activation take?',
        a: 'Live in minutes, not weeks. After you book a demo and confirm your unit setup, activation happens through Stripe. You\'ll see your first automated response within an hour of going live.'
      },
      {
        q: 'Do I need technical setup?',
        a: 'No. We handle all the technical integration with your existing systems. You define your unit types, availability, and leasing terms once—CompliCore+ handles the rest.'
      },
      {
        q: 'What if I only want to try one workflow?',
        a: 'Start with any workflow you want. Lead Response is the most common starting point ($349/mo + $1,500 activation), but Follow-Up and Admin Routing work independently. Add more as they prove value.'
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. Month-to-month billing means you\'re never locked in. Cancel anytime from your dashboard.'
      }
    ]
  },
  {
    category: 'Lead Response Automation',
    questions: [
      {
        q: 'Will prospects know they\'re talking to AI?',
        a: 'No. The response feels human because it\'s context-aware. It references the unit they asked about, understands lease terms, and includes specific availability. Prospects see a qualified reply from your property—not a bot.'
      },
      {
        q: 'What if availability changes during the day?',
        a: 'CompliCore+ checks your system in real-time. If a unit leases up, the next inquiry won\'t include it. Your property management system is the source of truth.'
      },
      {
        q: 'Can I customize the response message?',
        a: 'You set a message template once. CompliCore+ personalizes it based on the inquiry (unit type, lease term, move-in date, special requests). You maintain control—nothing goes out without your approval framework.'
      },
      {
        q: 'What inquiries does it handle?',
        a: 'Email, web form, SMS, and phone. Wherever prospects come in, CompliCore+ catches the inquiry and responds. If it\'s from your tracking, we automate it.'
      },
      {
        q: 'Does it kill my leasing team\'s job?',
        a: 'No. It frees them from inbox coverage. Your team qualifies prospects, negotiates, and closes—exactly what they\'re good at. CompliCore+ handles the response wait time that currently costs you deals.'
      }
    ]
  },
  {
    category: 'Follow-Up Automation',
    questions: [
      {
        q: 'Why is 48 hours the default?',
        a: 'Research shows prospects decide within 48 hours of first contact. If they haven\'t heard back by then, they shop elsewhere. Follow-up in that window catches them during active decision-making.'
      },
      {
        q: 'What if the prospect already signed a lease?',
        a: 'CompliCore+ tracks lease status. If the prospect already moved forward elsewhere, we don\'t send follow-up. The system respects the decision state.'
      },
      {
        q: 'Can I customize the follow-up message?',
        a: 'Yes. You design the follow-up template. CompliCore+ personalizes it—references the original inquiry, mentions specific units, includes new availability. It feels like a human follow-up, because it is one.'
      },
      {
        q: 'How many follow-ups can I schedule?',
        a: 'As many as you want. Some properties do 48h, then 7-day, then 14-day sequences. You define the schedule. We execute it consistently.'
      },
      {
        q: 'What if I miss a prospect manually—can I retroactively add them?',
        a: 'Yes. If a prospect contacted you three days ago and nobody followed up, you can manually trigger a follow-up sequence from your dashboard. It works for existing leads, not just new ones.'
      }
    ]
  },
  {
    category: 'Admin Routing Automation',
    questions: [
      {
        q: 'What counts as maintenance, renewal, or compliance?',
        a: 'Maintenance is repairs and operational issues (plumbing, HVAC, appliances). Renewals are lease renewal notices and reminders. Compliance is regulatory notices and legal escalations. CompliCore+ classifies based on keywords and urgency signals in the message.'
      },
      {
        q: 'Can I create custom categories?',
        a: 'Yes. You define what categories matter for your team. Routing rules adapt to your workflow—maintenance, renewals, compliance, plus custom categories you add.'
      },
      {
        q: 'What if something is misclassified?',
        a: 'Misclassification happens rarely (CompliCore+ learns your patterns). When it does, you reclassify from the dashboard. The system learns and improves routing accuracy over time.'
      },
      {
        q: 'Does it replace my property management system?',
        a: 'No. It works alongside your PMS. CompliCore+ pulls intake data, classifies it, and routes it—then the right person handles it in your existing workflow.'
      },
      {
        q: 'What about urgent escalations?',
        a: 'You set priority flags (emergency maintenance, legal holds, etc.). When CompliCore+ detects urgency signals, it routes to the right person immediately—no delay.'
      }
    ]
  },
  {
    category: 'Integration & Data',
    questions: [
      {
        q: 'Does CompliCore+ integrate with my PMS?',
        a: 'Yes. We integrate with Yardi, AppFolio, Rent Manager, and most major systems via API. During activation, we map your unit data, availability, and team structure.'
      },
      {
        q: 'Is my data secure?',
        a: 'Enterprise-grade security. SOC 2 Type II compliance, encrypted data in transit and at rest, regular security audits. Your property data never leaves your control.'
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'You own your data. When you cancel, all data exports on request and remains available for 90 days. We don\'t retain it after cancellation.'
      },
      {
        q: 'Can I export my response history?',
        a: 'Yes. Full audit trail of every response sent, follow-up scheduled, and routing decision. Exports as CSV for your records.'
      },
      {
        q: 'How do you handle GDPR/compliance requirements?',
        a: 'CompliCore+ is GDPR compliant. We handle data subject requests within 30 days. If you need to retain call recordings or email archives for regulatory reasons, we preserve full audit trails.'
      }
    ]
  },
  {
    category: 'Performance & Metrics',
    questions: [
      {
        q: 'How do you measure success?',
        a: 'Lead Response: response time (target: under 60 seconds) and conversion impact (measure against your baseline). Follow-Up: re-engagement rate (how many prospects re-open). Admin Routing: triage time and task resolution speed. We provide a dashboard for all metrics.'
      },
      {
        q: 'How long until I see results?',
        a: 'Lead Response shows impact in week one (response speed is immediate). Follow-Up shows impact in week two (re-engagement on second touch). Admin Routing impact varies by volume, but most properties see 50%+ triage time reduction within 30 days.'
      },
      {
        q: 'What if my leasing velocity doesn\'t improve?',
        a: 'It will. Speed to first response is the single biggest lever in leasing. But if your conversion doesn\'t improve within 90 days, we\'ll audit your activation. No excuses.'
      },
      {
        q: 'Can I see how other properties are doing?',
        a: 'You see your own metrics and benchmarks (anonymized peer comparison). We don\'t share other properties\' data.'
      }
    ]
  },
  {
    category: 'Pricing & Billing',
    questions: [
      {
        q: 'Why is there a $1,500 activation fee?',
        a: 'Activation includes setup (mapping your units, availability, lease terms), integration with your PMS, team routing configuration, and personalized onboarding. It\'s a one-time investment in your setup being right.'
      },
      {
        q: 'Do you offer annual discounts?',
        a: 'Month-to-month is our standard. If you want to commit annually, contact sales—we offer 10-15% discounts for annual prepay.'
      },
      {
        q: 'What\'s the stacking discount for multiple workflows?',
        a: 'Single workflow: $349/mo. Two workflows: 5% discount ($663/mo). All three workflows: 15% discount ($999/mo). The discount applies if you activate multiple workflows together.'
      },
      {
        q: 'Is there a minimum contract length?',
        a: 'No. Pure month-to-month. You pay activation once, then $349/mo per active workflow, cancel anytime from your dashboard.'
      },
      {
        q: 'Do you charge per inquiry or per unit?',
        a: 'No per-inquiry charges, no per-unit charges. You pay one flat monthly fee per workflow, regardless of volume. Respond to 100 inquiries or 1,000—same price.'
      },
      {
        q: 'What if I add a second property?',
        a: 'Each property is a separate subscription. So if you activate Lead Response at Property A ($349/mo), then add Property B ($349/mo), you pay $698/mo for both. Multi-property discount available—contact sales.'
      }
    ]
  },
  {
    category: 'Support & Training',
    questions: [
      {
        q: 'What kind of support do I get?',
        a: 'Email support (responses within 24 hours) and a dedicated onboarding specialist during the first 30 days. Paid tiers get phone and Slack support.'
      },
      {
        q: 'Do you offer training for my team?',
        a: 'Yes. Initial onboarding covers the dashboard, workflow configuration, and metric interpretation. Quarterly webinars for all customers. Custom training available for enterprise.'
      },
      {
        q: 'What if something breaks?',
        a: 'We monitor uptime 24/7. If CompliCore+ fails to respond to an inquiry, we notify you immediately and restore service within 1 hour. SLA is 99.9% uptime.'
      },
      {
        q: 'Can I change my setup after activation?',
        a: 'Yes. You can update unit types, availability, leasing terms, and team routing rules from your dashboard anytime. No additional fees.'
      }
    ]
  },
  {
    category: 'Competitive Questions',
    questions: [
      {
        q: 'Why not just hire more leasing staff?',
        a: 'Hiring costs money and takes time. A leasing agent costs $35-50k/year + benefits + ramp-up time. CompliCore+ is $349/mo and works day one. Plus, staff members have off-days and availability windows. CompliCore+ runs 24/7.'
      },
      {
        q: 'Why is this better than a chatbot or chatGPT?',
        a: 'Generic AI doesn\'t understand property leasing. ChatGPT would respond with generic apartment info, not your specific units and terms. CompliCore+ is trained on leasing workflows, integrated with your PMS, and routes prospects to your team. It\'s designed for one job—closing leads fast.'
      },
      {
        q: 'What about my CRM or existing automation tools?',
        a: 'CompliCore+ works alongside your CRM. We pull inquiry data, classify/respond/route it, then it lands in your CRM or team\'s inbox. We don\'t replace your tools—we extend them.'
      },
      {
        q: 'What if my PMS already has automation?',
        a: 'Most PMS automation handles accounting and reminders. CompliCore+ handles lead response and routing, which your PMS doesn\'t. They work together.'
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Questions about CompliCore+ automation workflows
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              Answers to common questions about lead response, follow-up scheduling, admin routing, pricing, and integration.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          {faqs.map((category, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-28 font-bold text-tp mb-8">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIdx) => (
                  <details
                    key={qIdx}
                    className="group border border-line rounded-lg bg-canvas hover:border-primary/30 transition-colors"
                  >
                    <summary className="flex items-center justify-between w-full p-6 cursor-pointer">
                      <h3 className="text-16 font-semibold text-tp text-left">
                        {faq.q}
                      </h3>
                      <ChevronDown className="w-5 h-5 text-ts flex-shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6 border-t border-line">
                      <p className="text-14 text-ts leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container max-w-2xl mx-auto text-center">
          <h2 className="text-30 font-bold text-tp">
            Didn't find your answer?
          </h2>
          <p className="text-16 text-ts mt-4">
            Talk to our team. Book a demo and ask anything about workflows, integration, or pricing.
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
