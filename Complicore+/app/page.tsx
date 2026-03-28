import type { Metadata } from 'next'
import Link from 'next/link'
import { CTAButton } from '@/components/marketing/CTAButton'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { FlowCard } from '@/components/marketing/FlowCard'
import { BeforeAfterComparison } from '@/components/marketing/BeforeAfterComparison'
import { FAQAccordion } from '@/components/marketing/FAQAccordion'

export const metadata: Metadata = {
  title: 'AI Workflow Automation for Property Managers',
  description:
    'Respond to leasing inquiries instantly, automate follow-up, and reduce admin work with active agent flows that run continuously.',
  metadataBase: new URL('https://complicore.plus'),
  canonical: 'https://complicore.plus',
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconLightning() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M11 2L4 11h6l-1 7 7-9h-6l1-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 10a6.5 6.5 0 1 1 1.2 3.8M3.5 14.5V10H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconRoute() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 4h4l2 4H6L4 4zM10 8l4 8h2M14 4h2v4h-2V4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FLOWS = [
  {
    title: 'Leasing Lead Response',
    trigger: 'New inquiry arrives',
    outcome: 'Instant reply sent',
    icon: <IconLightning />,
  },
  {
    title: 'Leasing Follow-Up',
    trigger: 'No reply after contact',
    outcome: 'Reminder + re-engagement',
    icon: <IconRefresh />,
  },
  {
    title: 'Admin & Maintenance Routing',
    trigger: 'Inbound message received',
    outcome: 'Classified and routed correctly',
    icon: <IconRoute />,
  },
]

const ACTIVATION_STEPS = [
  { step: '01', label: 'Book a live demo' },
  { step: '02', label: 'Confirm initial flow set' },
  { step: '03', label: 'Activate through Stripe' },
  { step: '04', label: 'Go live with measurable workflow status' },
]

const FAQ_ITEMS = [
  {
    question: 'How does activation work?',
    answer:
      'Book a live demo, confirm your initial workflow set, pay the one-time activation fee through Stripe, and your flows go live. The dashboard immediately reflects active status and begins tracking response time.',
  },
  {
    question: 'What happens before payment?',
    answer:
      'Before activation, you can run the interactive demo to see exactly how each workflow executes. Flows remain in a locked state until the activation fee is paid and validated server-side.',
  },
  {
    question: 'What changes after Stripe activation?',
    answer:
      'After payment is confirmed via webhook, your workspace transitions to active status. Flows begin executing against real inbound volume and the KPI dashboard becomes live.',
  },
  {
    question: 'How is monthly pricing calculated?',
    answer:
      'Monthly billing is $349 per active flow. If you add flows later, each additional flow is $249 per month. There are no hidden setup fees beyond the one-time activation.',
  },
  {
    question: 'Can additional workflows be added later?',
    answer:
      'Yes. From the dashboard you can add flows at any time. Each new flow triggers a prorated billing adjustment through Stripe. No new activation fee is required for expansions.',
  },
]

// ─── Inline section wrapper ───────────────────────────────────────────────────

function Section({
  children,
  id,
  background,
}: {
  children: React.ReactNode
  id?: string
  background?: string
}) {
  return (
    <section
      id={id}
      className="section-padding"
      style={{ backgroundColor: background }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        {children}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── JSON-LD Schema Markup ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "CompliCore+",
            "description": "AI Workflow Automation for Property Managers",
            "applicationCategory": "BusinessApplication",
            "url": "https://complicore.plus",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": "1500",
              "description": "One-time activation fee"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_ITEMS.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://complicore.plus"
              }
            ]
          }),
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--color-canvas)',
          padding: 'var(--space-8) var(--space-4)',
          paddingTop: 'calc(var(--space-8) + var(--space-7))',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-7)',
              alignItems: 'center',
            }}
          >
            {/* Copy */}
            <div style={{ maxWidth: '600px' }}>
              <h1
                className="fade-up"
                style={{
                  fontSize: 'clamp(var(--font-size-30), 5vw, var(--font-size-48))',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: 'var(--space-3)',
                }}
              >
                AI Workflow Automation
                <br />
                <span style={{ color: 'var(--color-primary)' }}>for Property Managers</span>
              </h1>
              <p
                style={{
                  fontSize: 'var(--font-size-18)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: 'var(--space-5)',
                  maxWidth: '520px',
                }}
              >
                Respond to leasing inquiries instantly, automate follow-up, and
                reduce admin work with active agent flows that run continuously.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <CTAButton href="/book-demo" label="Book Live Demo" size="lg" arrow />
                <CTAButton href="/demo" label="See It Work" variant="secondary" size="lg" />
              </div>
            </div>

            {/* Hero demo console preview */}
            <div
              aria-hidden="true"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Mock console header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-3)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: 'var(--font-size-12)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Workflow Console
                </span>
                <span
                  style={{
                    fontSize: 'var(--font-size-12)',
                    fontWeight: 600,
                    color: 'var(--color-danger)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  INACTIVE
                </span>
              </div>
              {/* Mock timeline rows */}
              {[
                { label: 'New inquiry received', status: 'locked' },
                { label: 'Lead response triggered', status: 'locked' },
                { label: 'Follow-up scheduled', status: 'locked' },
                { label: 'Admin routing', status: 'locked' },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: i < 3 ? '1px solid rgba(37,49,79,0.5)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-border)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-secondary)' }}>
                      {row.label}
                    </span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="2" y="5" width="10" height="8" rx="1.5" stroke="var(--color-border)" strokeWidth="1.2" />
                    <path d="M4.5 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="var(--color-border)" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
              ))}
              <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
                <Link
                  href="/demo"
                  style={{
                    fontSize: 'var(--font-size-14)',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Activate to unlock flows →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Before vs After ──────────────────────────────────────────────── */}
      <Section id="before-after" background="var(--color-surface)">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <SectionHeader
            heading="Slow response costs leases. Active workflows recover them."
            body="Manual inboxes delay response, follow-up gets missed, and leasing momentum dies. CompliCore+ installs always-on workflows that respond fast, re-engage prospects, and route inbound work without adding headcount."
            align="center"
          />
        </div>
        <BeforeAfterComparison />
      </Section>

      {/* ── Three core flows ─────────────────────────────────────────────── */}
      <Section id="flows">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <SectionHeader
            heading="Start with the three workflows that remove the most drag"
            align="center"
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {FLOWS.map(flow => (
            <FlowCard key={flow.title} {...flow} />
          ))}
        </div>
      </Section>

      {/* ── How activation works ─────────────────────────────────────────── */}
      <Section id="activation" background="var(--color-surface)">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-7)',
            alignItems: 'center',
          }}
        >
          <div>
            <SectionHeader
              eyebrow="Activation"
              heading="Activation turns the system on"
              body="Book a live demo, confirm the initial flow set, activate through Stripe, and move into a live dashboard with measurable workflow status and response-time visibility."
            />
            <div style={{ marginTop: 'var(--space-5)' }}>
              <CTAButton href="/book-demo" label="Book Live Demo" arrow />
            </div>
          </div>

          <ol
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {ACTIVATION_STEPS.map(({ step, label }) => (
              <li
                key={step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-size-12)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: '0.06em',
                    flexShrink: 0,
                    minWidth: '24px',
                  }}
                >
                  {step}
                </span>
                <span style={{ fontSize: 'var(--font-size-16)', color: 'var(--color-text-primary)' }}>
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── KPI Proof ────────────────────────────────────────────────────── */}
      <Section id="kpi">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-7)',
            alignItems: 'center',
          }}
        >
          {/* KPI visual */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-md)',
            }}
            aria-hidden="true"
          >
            <p
              style={{
                fontSize: 'var(--font-size-12)',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-2)',
              }}
            >
              Median First-Response Time
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <span
                style={{
                  fontSize: 'var(--font-size-48)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                —
              </span>
              <span style={{ fontSize: 'var(--font-size-16)', color: 'var(--color-text-secondary)' }}>
                Tracked live once active
              </span>
            </div>
            <p style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Dashboard updates as workflows execute. No synthetic data.
            </p>
          </div>

          {/* Copy */}
          <div>
            <SectionHeader
              eyebrow="KPI"
              heading="Measure the KPI that changes revenue first"
              body="CompliCore+ tracks median first-response time so operators can see whether leasing speed is improving where it matters."
            />
          </div>
        </div>
      </Section>

      {/* ── Pricing Snapshot ─────────────────────────────────────────────── */}
      <Section id="pricing-snapshot" background="var(--color-surface)">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <SectionHeader
            heading="Start with a fixed activation. Expand flow by flow."
            body="One-time activation fee. Monthly pricing per active flow. Add more automation only when the first workflows are live."
            align="center"
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            maxWidth: '800px',
            margin: '0 auto var(--space-6)',
          }}
        >
          {[
            { label: 'One-time activation', value: '$1,500', note: 'Setup and launch readiness' },
            { label: 'Active flow', value: '$349', note: 'Per flow / per month' },
            { label: 'Additional flow', value: '$249', note: 'Per flow / per month' },
          ].map(({ label, value, note }) => (
            <div
              key={label}
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                {label}
              </p>
              <p style={{ fontSize: 'var(--font-size-36)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                {value}
              </p>
              <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {note}
              </p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CTAButton href="/pricing" label="View Full Pricing" arrow />
          <CTAButton href="/book-demo" label="Book Live Demo" variant="secondary" />
        </div>
      </Section>

      {/* ── Demo CTA ─────────────────────────────────────────────────────── */}
      <Section id="demo-cta">
        <div
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid rgba(110, 168, 254, 0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8) var(--space-6)',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <SectionHeader
            eyebrow="Interactive Demo"
            heading="Watch the workflow execute before you buy"
            body="Run a simulated inquiry, see the timeline fire, activate the system, and watch the flow move from locked to live."
            align="center"
          />
          <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <CTAButton href="/demo" label="Run Simulation" size="lg" arrow />
            <CTAButton href="/pricing" label="View Pricing" variant="secondary" size="lg" />
          </div>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section id="faq" background="var(--color-surface)">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-7)',
          }}
        >
          <div>
            <SectionHeader
              eyebrow="FAQ"
              heading="Clear answers before procurement slows the process"
              body="See exactly how activation, billing, and workflow expansion work."
            />
            <div style={{ marginTop: 'var(--space-4)' }}>
              <CTAButton href="/faq" label="All FAQs" variant="ghost" arrow />
            </div>
          </div>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </Section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <Section id="final-cta">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(var(--font-size-30), 4vw, var(--font-size-48))',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: 'var(--space-5)',
            }}
          >
            Book the live demo and see the system run
          </h2>
          <CTAButton href="/book-demo" label="Book Live Demo" size="lg" arrow />
        </div>
      </Section>
    </>
  )
}
