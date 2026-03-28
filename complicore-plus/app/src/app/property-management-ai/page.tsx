import type { Metadata } from 'next'
import Link from 'next/link'
import { TopNav } from '@/components/marketing/TopNav'
import { Footer } from '@/components/marketing/Footer'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Automation for Property Managers | CompliCore+',
  description:
    'Automate leasing communication, follow-up, and admin workflows for residential property managers. Respond instantly, route correctly, reduce admin work.',
}

export default function PropertyManagementAIPage() {
  return (
    <div className="min-h-screen bg-[#0B1020]">
      <TopNav />

      <section className="pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Hero */}
          <div className="max-w-3xl mb-20">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">Property Management AI</p>
            <h1 className="text-5xl font-bold text-[#F5F7FB] leading-tight mb-6">
              AI automation for property managers
            </h1>
            <p className="text-xl text-[#B8C1D9] leading-relaxed mb-10">
              Automate leasing communication, follow-up, and admin workflows without increasing staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo">
                <Button size="lg">Book Live Demo <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg">See It Work</Button>
              </Link>
            </div>
          </div>

          {/* Problem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">The problem</p>
              <h2 className="text-3xl font-bold text-[#F5F7FB] mb-6">
                Leasing breaks when response slows
              </h2>
              <div className="space-y-4">
                {[
                  'Prospects move on after 30 minutes of no response',
                  'Manual follow-up never happens consistently',
                  'Maintenance requests and leasing inquiries get mixed',
                  'Staff capacity bottlenecks at peak inquiry volume',
                ].map((p) => (
                  <div key={p} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs">—</span>
                    </span>
                    <span className="text-[#B8C1D9] text-sm leading-relaxed">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8">
              <p className="text-sm text-[#8A95B2] mb-4">Average cost of a missed leasing inquiry</p>
              <p className="text-5xl font-bold text-[#F5F7FB] mb-2">$2,400+</p>
              <p className="text-sm text-[#8A95B2]">
                One missed 1BR unit at market rates. CompliCore+ activation pays for itself on the first captured lead.
              </p>
            </div>
          </div>

          {/* Solution */}
          <div className="mb-20">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4 text-center">The solution</p>
            <h2 className="text-3xl font-bold text-[#F5F7FB] text-center mb-12">Install automated workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Instant responses',
                  desc: 'Every leasing inquiry receives a contextual reply within seconds. No delays, no gaps.',
                },
                {
                  title: 'Structured follow-up',
                  desc: 'Automated re-engagement sequences run until the prospect responds or is closed.',
                },
                {
                  title: 'Clean routing',
                  desc: 'Inbound messages are classified and routed to the correct team without manual sorting.',
                },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8">
                  <h3 className="text-base font-semibold text-[#F5F7FB] mb-3">{title}</h3>
                  <p className="text-sm text-[#B8C1D9] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-12 text-center mb-20">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">The outcome</p>
            <h2 className="text-3xl font-bold text-[#F5F7FB] mb-6">Capture more demand</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { value: '< 18s', label: 'Response time' },
                { value: '100%', label: 'Inquiry capture rate' },
                { value: '12h/wk', label: 'Admin hours saved' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-4xl font-bold text-[#F5F7FB] mb-1">{value}</p>
                  <p className="text-sm text-[#8A95B2]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who it is for */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-[#F5F7FB] text-center mb-12">Built for your operation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  fit: true,
                  label: 'Best fit',
                  items: [
                    '50–500 residential units',
                    'Manual inquiry handling today',
                    'Leasing team with response time pressure',
                    'No current automation stack',
                  ],
                },
                {
                  fit: false,
                  label: 'Not a fit',
                  items: [
                    'Under 20 units',
                    'Fully automated already',
                    'No leasing inquiry volume',
                    'Shopping for one-off tools',
                  ],
                },
              ].map(({ fit, label, items }) => (
                <div
                  key={label}
                  className={`border rounded-2xl p-8 ${
                    fit ? 'bg-green-500/5 border-green-500/15' : 'bg-[#11182D] border-[#25314F]'
                  }`}
                >
                  <h3 className={`text-base font-semibold mb-4 ${fit ? 'text-green-400' : 'text-[#8A95B2]'}`}>
                    {label}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        {fit ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="h-5 w-5 rounded-full bg-[#25314F] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#8A95B2] text-xs">—</span>
                          </span>
                        )}
                        <span className="text-sm text-[#B8C1D9]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#F5F7FB] mb-4">Start capturing every inquiry</h2>
            <p className="text-[#B8C1D9] mb-8">
              Book a 15-minute demo. We will show the system running on your workflow.
            </p>
            <Link href="/book-demo">
              <Button size="lg">Book Live Demo <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
