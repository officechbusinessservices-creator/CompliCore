'use client'

import { useState } from 'react'
import { TopNav } from '@/components/marketing/TopNav'
import { Footer } from '@/components/marketing/Footer'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function BookDemoPage() {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setError(null)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      portfolio_size: (form.elements.namedItem('portfolio_size') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setState('success')
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col">
        <TopNav />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="h-16 w-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-[#F5F7FB] mb-4">Demo booked</h1>
            <p className="text-[#B8C1D9] leading-relaxed">
              We will reach out within 24 hours to confirm your demo time.
              Expect a 15-minute session showing the system running on your workflow.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <TopNav />

      <section className="pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: context */}
            <div className="pt-4">
              <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-4">Book a demo</p>
              <h1 className="text-5xl font-bold text-[#F5F7FB] leading-tight mb-6">
                See CompliCore+ running on your workflow
              </h1>
              <p className="text-lg text-[#B8C1D9] leading-relaxed mb-10">
                15 minutes. We will show the system responding to a real inquiry, scheduling follow-up, and routing a request. Live.
              </p>

              <div className="space-y-4">
                {[
                  'Real simulation on your workflow type',
                  'Response time demonstration',
                  'Activation walkthrough if you are ready',
                  'No pressure, no fluff',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[#B8C1D9] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-[#F5F7FB] mb-6">Book your 15-minute demo</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#B8C1D9] mb-2">
                      Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jordan Mitchell"
                      className="w-full h-11 px-4 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors placeholder:text-[#8A95B2]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#B8C1D9] mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full h-11 px-4 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors placeholder:text-[#8A95B2]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#B8C1D9] mb-2">
                    Company name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Urban Property Management"
                    className="w-full h-11 px-4 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors placeholder:text-[#8A95B2]"
                  />
                </div>

                <div>
                  <label htmlFor="portfolio_size" className="block text-sm font-medium text-[#B8C1D9] mb-2">
                    Portfolio size
                  </label>
                  <select
                    id="portfolio_size"
                    name="portfolio_size"
                    className="w-full h-11 px-4 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors"
                  >
                    <option value="">Select portfolio size</option>
                    <option value="10-50">10–50 units</option>
                    <option value="50-100">50–100 units</option>
                    <option value="100-250">100–250 units</option>
                    <option value="250-500">250–500 units</option>
                    <option value="500+">500+ units</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#B8C1D9] mb-2">
                    What is your biggest pain point?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Slow response times, missed follow-ups, manual routing..."
                    className="w-full px-4 py-3 bg-[#0B1020] border border-[#25314F] focus:border-brand rounded-xl text-sm text-[#F5F7FB] outline-none transition-colors resize-none placeholder:text-[#8A95B2]"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={state === 'submitting'}
                  size="lg"
                  className="w-full"
                >
                  Book Demo <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-[#8A95B2]">
                  We will respond within 24 hours to confirm your time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
