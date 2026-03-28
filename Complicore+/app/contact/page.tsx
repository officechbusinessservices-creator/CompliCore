'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Mail, Phone, MapPin } from 'lucide-react'
import CTAButton from '@/components/CTAButton'
import SectionHeader from '@/components/SectionHeader'

export const metadata = {
  title: 'Contact CompliCore+ | Sales Inquiry',
  description: 'Get in touch with the CompliCore+ team to learn how AI workflow automation can transform your property management operations.',
  openGraph: {
    title: 'Contact CompliCore+ | Sales Inquiry',
    description: 'Reach out to discuss how CompliCore+ automates your leasing and admin workflows.',
    url: 'https://complicore.ai/contact',
    type: 'website',
  },
}

type FormStep = 'inquiry' | 'submitted'

interface InquiryData {
  name: string
  email: string
  phone: string
  company: string
  unitCount: string
  currentPMS: string
  message: string
  agreedToFollowUp: boolean
}

const PMS_OPTIONS = [
  { id: 'yardi', label: 'Yardi' },
  { id: 'appfolio', label: 'AppFolio' },
  { id: 'rentmanager', label: 'Rent Manager' },
  { id: 'other', label: 'Other PMS' },
  { id: 'none', label: 'Not using PMS yet' },
]

const UNIT_RANGES = [
  { id: '50-150', label: '50-150 units' },
  { id: '150-300', label: '150-300 units' },
  { id: '300-500', label: '300-500 units' },
  { id: '500+', label: '500+ units' },
]

export default function ContactPage() {
  const [step, setStep] = useState<FormStep>('inquiry')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<InquiryData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    unitCount: '',
    currentPMS: '',
    message: '',
    agreedToFollowUp: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.company && formData.unitCount && formData.currentPMS) {
      setLoading(true)
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to submit inquiry')
        }

        setStep('submitted')
      } catch (error) {
        console.error('Submission error:', error)
        alert('Error submitting inquiry. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-canvas py-24 px-6 border-b border-line">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-48 font-bold text-tp leading-tight">
              Let's talk about your workflow challenges
            </h1>
            <p className="text-18 text-ts mt-6 leading-relaxed">
              Tell us about your property management operation. Our team will discuss whether CompliCore+ is a fit and walk you through the next steps.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      {step === 'inquiry' && (
        <section className="section-y bg-surface border-b border-line">
          <div className="site-container max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Your Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 placeholder-ts focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 placeholder-ts focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 placeholder-ts focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Company / Property Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Riverside Gardens"
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 placeholder-ts focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Unit Count */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Total Units Under Management <span className="text-danger">*</span>
                </label>
                <select
                  name="unitCount"
                  value={formData.unitCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a range</option>
                  {UNIT_RANGES.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current PMS */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Current PMS or Property Management Tool <span className="text-danger">*</span>
                </label>
                <select
                  name="currentPMS"
                  value={formData.currentPMS}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select your system</option>
                  {PMS_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-14 font-semibold text-tp mb-2">
                  Tell us about your workflow challenges
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What leasing or admin workflows are slowing you down? What would it mean to automate them?"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-canvas text-tp text-14 placeholder-ts focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Checkbox */}
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  name="agreedToFollowUp"
                  id="agreedToFollowUp"
                  checked={formData.agreedToFollowUp}
                  onChange={handleInputChange}
                  className="w-4 h-4 mt-1 rounded border border-line bg-canvas text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <label htmlFor="agreedToFollowUp" className="text-14 text-ts cursor-pointer">
                  Yes, I'd like the CompliCore+ team to follow up about my workflows. I can be reached by email or phone.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 rounded-lg bg-primary text-canvas font-semibold text-16 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-13 text-ts text-center pt-4">
                We respect your privacy. We'll only use your information to discuss CompliCore+ and your specific workflow needs.
              </p>
            </form>
          </div>
        </section>
      )}

      {/* Confirmation */}
      {step === 'submitted' && (
        <section className="section-y bg-surface border-b border-line">
          <div className="site-container max-w-2xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </div>
            <h2 className="text-30 font-bold text-tp mb-4">
              Thanks for reaching out
            </h2>
            <p className="text-16 text-ts mb-8">
              We've received your inquiry. Our team will review your workflow details and reach out within 24 hours to discuss next steps.
            </p>
            <div className="bg-canvas border border-line rounded-lg p-8 mb-8">
              <p className="text-14 text-ts mb-4">
                While you wait, you can:
              </p>
              <div className="space-y-3">
                {[
                  'Watch a demo of the workflow automation',
                  'Read case studies from similar properties',
                  'Check out our FAQ for common questions',
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 justify-center">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-14 text-tp">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/demo" variant="primary">
                Watch Demo <ArrowRight className="w-4 h-4" />
              </CTAButton>
              <CTAButton href="/" variant="secondary">
                Back to Home <ArrowRight className="w-4 h-4" />
              </CTAButton>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-y bg-canvas border-b border-line">
        <div className="site-container">
          <SectionHeader
            label="Questions"
            heading="About contacting us"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                q: 'How quickly will I hear back?',
                a: 'Our sales team reviews all inquiries within 24 hours and reaches out via email or phone (whichever you prefer). Most response comes within business hours on the same day.',
              },
              {
                q: 'Is there an obligation to talk?',
                a: 'No. We talk to understand if CompliCore+ fits your workflow. If it doesn\'t, we\'ll tell you honestly. This is a discovery conversation.',
              },
              {
                q: 'What happens after we talk?',
                a: 'If there\'s a fit, we schedule a live 20-minute demo customized to your property type and workflows. Then you decide whether to book a full activation.',
              },
              {
                q: 'Can I request a specific time to talk?',
                a: 'Yes. During our first outreach, we\'ll offer a few time slots. If none work, we\'ll find what does. You control the schedule.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-surface p-6">
                <h3 className="text-16 font-semibold text-tp mb-3">{faq.q}</h3>
                <p className="text-14 text-ts">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="section-y bg-surface border-b border-line">
        <div className="site-container">
          <h2 className="text-28 font-bold text-tp mb-12 text-center">Other ways to get in touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-line bg-canvas p-8 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-16 font-semibold text-tp mb-2">Email</h3>
              <p className="text-14 text-ts mb-4">Direct message to our sales team</p>
              <a href="mailto:sales@complicore.ai" className="text-primary text-14 font-semibold hover:text-primary-hover">
                sales@complicore.ai
              </a>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-8 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-16 font-semibold text-tp mb-2">Phone</h3>
              <p className="text-14 text-ts mb-4">Talk to a team member directly</p>
              <a href="tel:+1234567890" className="text-primary text-14 font-semibold hover:text-primary-hover">
                +1 (844) COMPLICORE
              </a>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-8 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-16 font-semibold text-tp mb-2">Schedule a time</h3>
              <p className="text-14 text-ts mb-4">Book a live demo directly</p>
              <a href="/book-demo" className="text-primary text-14 font-semibold hover:text-primary-hover">
                Book Live Demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
