'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TopNav } from '@/components/marketing/TopNav'
import { Footer } from '@/components/marketing/Footer'
import { Button } from '@/components/ui/Button'
import { StatusPill } from '@/components/ui/StatusPill'
import { ArrowRight, Play, MessageSquare, Zap, Clock, GitBranch, Lock } from 'lucide-react'

type TimelineEvent = {
  id: string
  label: string
  detail: string
  icon: React.ElementType
  color: string
  delay: number
}

const EVENTS: TimelineEvent[] = [
  {
    id: 'received',
    label: 'Inquiry received',
    detail: '"Is the 2BR unit still available for April 1st?"',
    icon: MessageSquare,
    color: 'text-brand',
    delay: 0,
  },
  {
    id: 'response',
    label: 'Response sent',
    detail: 'Contextual reply dispatched in 4 seconds',
    icon: Zap,
    color: 'text-green-400',
    delay: 800,
  },
  {
    id: 'followup',
    label: 'Follow-up scheduled',
    detail: 'Reminder queued for 24h if no reply',
    icon: Clock,
    color: 'text-yellow-400',
    delay: 1600,
  },
  {
    id: 'routing',
    label: 'Request routed',
    detail: 'Classified as leasing inquiry → assigned to leasing team',
    icon: GitBranch,
    color: 'text-brand',
    delay: 2400,
  },
]

type SimState = 'idle' | 'running' | 'done'

export default function DemoPage() {
  const [simState, setSimState] = useState<SimState>('idle')
  const [visibleEvents, setVisibleEvents] = useState<string[]>([])
  const [isActivated, setIsActivated] = useState(false)

  function runSimulation() {
    if (simState === 'running') return
    setSimState('running')
    setVisibleEvents([])

    EVENTS.forEach((evt) => {
      setTimeout(() => {
        setVisibleEvents((prev) => [...prev, evt.id])
        if (evt.id === EVENTS[EVENTS.length - 1].id) {
          setSimState('done')
        }
      }, evt.delay + 300)
    })
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <TopNav />

      <section className="pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">Live demo</p>
            <h1 className="text-5xl font-bold text-[#F5F7FB] mb-6">
              See the system run in real time
            </h1>
            <p className="text-xl text-[#B8C1D9] max-w-2xl mx-auto">
              Simulate an inquiry and watch the workflow execute instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Control panel */}
            <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-[#F5F7FB]">Simulate a leasing inquiry</h2>
                <StatusPill status={isActivated ? 'active' : 'locked'} />
              </div>

              {!isActivated && (
                <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl mb-6">
                  <Lock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <p className="text-sm text-yellow-300">
                    This is a preview. Activate your system to run live workflows on real inquiries.
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#B8C1D9] mb-2">Prospect name</label>
                  <input
                    type="text"
                    defaultValue="Jordan Mitchell"
                    className="w-full h-11 px-4 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors placeholder:text-[#8A95B2]"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8C1D9] mb-2">Message</label>
                  <textarea
                    rows={3}
                    defaultValue="Hi, is the 2BR unit at Oak Street still available for April 1st move-in?"
                    className="w-full px-4 py-3 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors resize-none placeholder:text-[#8A95B2]"
                    readOnly
                  />
                </div>
              </div>

              <Button
                onClick={runSimulation}
                loading={simState === 'running'}
                disabled={simState === 'running'}
                size="lg"
                className="w-full mb-4"
              >
                <Play className="h-4 w-4" />
                {simState === 'idle' ? 'Run Simulation' : simState === 'running' ? 'Running...' : 'Run Again'}
              </Button>

              {simState === 'done' && !isActivated && (
                <div className="mt-4 p-4 bg-brand/5 border border-brand/20 rounded-xl text-center">
                  <p className="text-sm text-[#B8C1D9] mb-3">
                    This is what runs on every real inquiry after activation.
                  </p>
                  <Link href="/pricing">
                    <Button className="w-full" size="lg">
                      Activate System <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-[#F5F7FB]">Workflow execution</h2>
                {simState !== 'idle' && (
                  <span className={`text-xs font-medium ${
                    simState === 'running' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {simState === 'running' ? 'Running…' : 'Completed'}
                  </span>
                )}
              </div>

              {simState === 'idle' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-[#16203A] border border-[#25314F] flex items-center justify-center mb-4">
                    <Play className="h-5 w-5 text-[#8A95B2]" />
                  </div>
                  <p className="text-sm text-[#8A95B2]">Run the simulation to see the workflow execute</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {EVENTS.map((evt) => {
                    const visible = visibleEvents.includes(evt.id)
                    const Icon = evt.icon
                    return (
                      <div
                        key={evt.id}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
                          visible ? 'opacity-100 translate-y-0 bg-[#16203A]' : 'opacity-0 translate-y-2'
                        }`}
                        style={{ transitionDelay: visible ? '0ms' : `${evt.delay}ms` }}
                      >
                        <div className={`h-8 w-8 rounded-lg bg-[#0B1020] border border-[#25314F] flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-4 w-4 ${evt.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#F5F7FB]">{evt.label}</p>
                          <p className="text-xs text-[#8A95B2] mt-0.5">{evt.detail}</p>
                        </div>
                        {visible && (
                          <span className="ml-auto text-xs text-green-400 font-medium flex-shrink-0">✓</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="py-16 border-t border-[#25314F] bg-[#0F1528]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'No delay', desc: 'Responses are sent in seconds, not hours.' },
              { label: 'No manual input', desc: 'Every step executes without your team touching it.' },
              { label: 'No missed steps', desc: 'Follow-up and routing happen even when you are not watching.' },
            ].map(({ label, desc }) => (
              <div key={label} className="text-center">
                <h3 className="text-base font-semibold text-[#F5F7FB] mb-2">{label}</h3>
                <p className="text-sm text-[#B8C1D9] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[#25314F]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#F5F7FB] mb-4">This is what runs on every real inquiry</h2>
          <p className="text-[#B8C1D9] mb-8 max-w-lg mx-auto">
            Activate your system and every leasing inquiry gets this treatment automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg">Activate System <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/book-demo">
              <Button variant="secondary" size="lg">Book a Live Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
