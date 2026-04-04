'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Lock } from 'lucide-react'
import CTAButton from '@/components/CTAButton'

export const metadata = {
  title: 'Book a Live Demo | CompliCore+',
  description: 'Schedule a personalized demo of CompliCore+ automation workflows. See how property managers capture more leads and automate follow-up in real-time.',
  openGraph: {
    title: 'Book a Live Demo | CompliCore+',
    description: 'Schedule your 20-minute live demo of CompliCore+ automation.',
    url: 'https://complicore.ai/book-demo',
    type: 'website',
  },
}

type FormStep = 'qualify' | 'contact' | 'confirm'

interface FormData {
  // Qualification step
  propertyType: string
  unitCount: string
  currentTools: string[]
  infoSource: string
  // Contact step
  name: string
  email: string
  phone: string
  propertyName: string
  // Confirmation
  demoBoooked: boolean
}

const PROPERTY_TYPES = [
  { id: 'garden', label: 'Garden-style apartments (1-3 stories)' },
  { id: 'mid-rise', label: 'Mid-rise (4-8 stories)' },
  { id: 'high-rise', label: 'High-rise (9+ stories)' },
  { id: 'mixed', label: 'Mixed-use or portfolio' },
]

const UNIT_RANGES = [
  { id: '50-100', label: '50-100 units' },
  { id: '100-250', label: '100-250 units' },
  { id: '250-500', label: '250-500 units' },
  { id: '500+', label: '500+ units' },
]

const CURRENT_TOOLS = [
  { id: 'yardi', label: 'Yardi' },
  { id: 'appfolio', label: 'AppFolio' },
  { id: 'rentmanager', label: 'Rent Manager' },
  { id: 'other-pms', label: 'Other PMS' },
  { id: 'spreadsheet', label: 'Spreadsheets/Manual' },
]

const INFO_SOURCES = [
  { id: 'google', label: 'Google search' },
  { id: 'referral', label: 'Friend or colleague referral' },
  { id: 'conference', label: 'Industry conference or event' },
  { id: 'social', label: 'LinkedIn or social media' },
  { id: 'other', label: 'Other' },
]

export default function BookDemoPage() {
  const [step, setStep] = useState<FormStep>('qualify')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    unitCount: '',
    currentTools: [],
    infoSource: '',
    name: '',
    email: '',
    phone: '',
    propertyName: '',
    demoBoooked: false,
  })

  const handleQualifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.propertyType && formData.unitCount && formData.currentTools.length > 0) {
      setStep('contact')
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.phone && formData.propertyName) {
      setLoading(true)
      try {
        const response = await fetch('/api/book-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            propertyName: formData.propertyName,
            propertyType: formData.propertyType,
            unitCount: formData.unitCount,
            currentTools: formData.currentTools,
            infoSource: formData.infoSource,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to book demo')
        }

        setFormData({ ...formData, demoBoooked: true })
        setStep('confirm')
      } catch (error) {
        console.error('Booking error:', error)
        alert('Error booking demo. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleToolToggle = (toolId: string) => {
    setFormData({
      ...formData,
      currentTools: formData.currentTools.includes(toolId)
        ? formData.currentTools.filter(id => id !== toolId)
        : [...formData.currentTools, toolId]
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              See CompliCore+ in action
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              Watch your first automated response happen live. Schedule a 20-minute demo with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-surface border-b border-line py-12 px-6">
        <div className="site-container">
          <p className="text-14 text-ts text-center mb-8">Trusted by property managers nationwide</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {/* Certification: SOC 2 */}
            <div className="flex flex-col items-center">
              <Lock className="w-6 h-6 text-primary mb-2" />
              <span className="text-12 text-ts text-center">SOC 2<br />Certified</span>
            </div>
            {/* Certification: GDPR */}
            <div className="flex flex-col items-center">
              <CheckCircle className="w-6 h-6 text-success mb-2" />
              <span className="text-12 text-ts text-center">GDPR<br />Compliant</span>
            </div>
            {/* Integration: Yardi */}
            <div className="flex flex-col items-center">
              <div className="text-12 font-semibold text-tp">Yardi</div>
              <span className="text-11 text-ts text-center">Integrated</span>
            </div>
            {/* Integration: AppFolio */}
            <div className="flex flex-col items-center">
              <div className="text-12 font-semibold text-tp">AppFolio</div>
              <span className="text-11 text-ts text-center">Integrated</span>
            </div>
            {/* Integration: Rent Manager */}
            <div className="flex flex-col items-center">
              <div className="text-12 font-semibold text-tp">Rent Manager</div>
              <span className="text-11 text-ts text-center">Integrated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container max-w-2xl">
          <div className="card rounded-lg border border-line p-8 bg-surface">
            {/* Step Indicator */}
            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full ${step === 'qualify' || step === 'contact' || step === 'confirm' ? 'bg-primary' : 'bg-border'}`} />
              <div className={`h-1 flex-1 rounded-full ${step === 'contact' || step === 'confirm' ? 'bg-primary' : 'bg-border'}`} />
              <div className={`h-1 flex-1 rounded-full ${step === 'confirm' ? 'bg-primary' : 'bg-border'}`} />
            </div>

            {/* Qualification Step */}
            {step === 'qualify' && (
              <form onSubmit={handleQualifySubmit}>
                <h2 className="text-28 font-bold text-tp mb-2">Let's qualify your property</h2>
                <p className="text-14 text-ts mb-8">Help us understand your setup so we can show the right demo.</p>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-14 font-semibold text-tp mb-3">Property type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {PROPERTY_TYPES.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, propertyType: type.id })}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.propertyType === type.id
                            ? 'border-primary bg-primary/10 text-tp'
                            : 'border-line bg-canvas text-ts hover:border-primary/30'
                        }`}
                      >
                        <span className="text-14 font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unit Count */}
                <div className="mb-6">
                  <label className="block text-14 font-semibold text-tp mb-3">How many units?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {UNIT_RANGES.map(range => (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, unitCount: range.id })}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.unitCount === range.id
                            ? 'border-primary bg-primary/10 text-tp'
                            : 'border-line bg-canvas text-ts hover:border-primary/30'
                        }`}
                      >
                        <span className="text-14 font-medium">{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Tools */}
                <div className="mb-8">
                  <label className="block text-14 font-semibold text-tp mb-3">What systems do you use? (select all)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {CURRENT_TOOLS.map(tool => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleToolToggle(tool.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.currentTools.includes(tool.id)
                            ? 'border-primary bg-primary/10 text-tp'
                            : 'border-line bg-canvas text-ts hover:border-primary/30'
                        }`}
                      >
                        <span className="text-14 font-medium">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold text-14 hover:bg-primary/90 transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </form>
            )}

            {/* Contact Step */}
            {step === 'contact' && (
              <form onSubmit={handleContactSubmit}>
                <h2 className="text-28 font-bold text-tp mb-2">Your information</h2>
                <p className="text-14 text-ts mb-8">We'll send demo details and activation pricing to this email.</p>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-14 font-semibold text-tp mb-2">Your name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Property Name */}
                <div className="mb-4">
                  <label className="block text-14 font-semibold text-tp mb-2">Property name</label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    placeholder="Riverside Apartments"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-14 font-semibold text-tp mb-2">Work email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@riverside.com"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Phone */}
                <div className="mb-8">
                  <label className="block text-14 font-semibold text-tp mb-2">Phone number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('qualify')}
                    className="flex-1 py-3 px-6 bg-canvas border border-line text-tp rounded-lg font-semibold text-14 hover:border-primary/30 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-primary text-white rounded-lg font-semibold text-14 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Booking...' : 'Confirm & See Pricing'}
                  </button>
                </div>
              </form>
            )}

            {/* Confirmation Step */}
            {step === 'confirm' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-28 font-bold text-tp mb-3">Demo confirmed</h2>
                <p className="text-16 text-ts mb-8">
                  Check your email for next steps. Our team will contact you within 24 hours to schedule your live demo.
                </p>
                <div className="bg-canvas border border-line rounded-lg p-6 mb-8 text-left">
                  <p className="text-12 text-ts uppercase tracking-wide font-semibold mb-3">Next: Activation pricing</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-36 font-bold text-primary">$1,500</span>
                    <span className="text-16 text-ts">one-time activation</span>
                  </div>
                  <p className="text-14 text-ts leading-relaxed mb-4">
                    This covers setup, PMS integration, team routing configuration, and 30 days of onboarding. After activation, you'll pay $349/month per active workflow.
                  </p>
                  <div className="flex gap-3">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-14 text-tp">No per-inquiry or per-unit charges</span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-14 text-tp">Month-to-month billing—cancel anytime</span>
                  </div>
                </div>
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold text-14 hover:bg-primary/90 transition-colors"
                >
                  Back to home
                </a>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          {step !== 'confirm' && (
            <div className="mt-12 p-8 rounded-lg border border-line bg-surface">
              <h3 className="text-18 font-bold text-tp mb-6">Before your demo</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-14 font-semibold text-tp mb-2">What's included in the demo?</h4>
                  <p className="text-14 text-ts">
                    Live walkthrough of all three workflows (lead response, follow-up, routing), integration overview, pricing breakdown, and timeline for go-live.
                  </p>
                </div>
                <div>
                  <h4 className="text-14 font-semibold text-tp mb-2">How long does it take?</h4>
                  <p className="text-14 text-ts">
                    20 minutes for the demo. Our onboarding specialist will walk you through setup and answer questions specific to your property.
                  </p>
                </div>
                <div>
                  <h4 className="text-14 font-semibold text-tp mb-2">What do I need?</h4>
                  <p className="text-14 text-ts">
                    Just a Zoom call and your PMS credentials (we handle the technical setup). No prep work needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {step === 'confirm' && (
        <section className="section-y bg-surface border-b border-line">
          <div className="site-container max-w-2xl mx-auto text-center">
            <h2 className="text-30 font-bold text-tp mb-4">
              Want to see workflows in action first?
            </h2>
            <p className="text-16 text-ts mb-8">
              Try an interactive demo before committing. No form, no email required.
            </p>
            <CTAButton href="/demo" variant="secondary" className="inline-flex items-center">
              Try Interactive Demo <ArrowRight className="w-4 h-4 ml-2" />
            </CTAButton>
          </div>
        </section>
      )}
    </>
  )
}
