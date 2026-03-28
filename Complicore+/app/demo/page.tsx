import type { Metadata } from 'next'
import { DemoConsole } from '@/components/demo/DemoConsole'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { CTAButton } from '@/components/marketing/CTAButton'

export const metadata: Metadata = {
  title: 'Interactive Demo — See the Workflow Run',
  description:
    'Run a simulated inquiry, watch the lead-response timeline append, activate the system through Stripe, and replay the flow in an active state.',
  canonical: '/demo',
}

// ─── Demo narrative steps display ─────────────────────────────────────────────

const NARRATIVE_STEPS = [
  'Account starts inactive',
  'New inquiry is simulated',
  'Timeline shows what would run',
  'Locked state explains activation is required',
  'Activation turns the system on',
  'Lead response executes',
  'Follow-up schedules',
  'Routing completes',
  'KPI becomes visible',
  'Expansion option appears',
]

function Section({
  children,
  background,
  id,
}: {
  children: React.ReactNode
  background?: string
  id?: string
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

export default function DemoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'CompliCore+ Interactive Demo',
            description:
              'See the autonomous compliance AI agent workflow in action. Simulate a leasing inquiry, watch the lead-response timeline execute, and understand how CompliCore+ transforms your property management operations.',
            applicationCategory: 'BusinessApplication',
            url: 'https://complicore.ai/demo',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free interactive demo — no activation required to view.',
            },
            featureList: [
              'Inactive state proof — flows locked until payment',
              'Active state proof — payment confirmation triggers workflows',
              'Inquiry simulation — test with custom inquiry text',
              'Response timeline — watch lead response execute in real-time',
              'Follow-up scheduling — see re-engagement logic in action',
              'Admin routing — observe inquiry classification and routing',
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://complicore.ai',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Interactive Demo',
                item: 'https://complicore.ai/demo',
              },
            ],
          }),
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: 'var(--color-canvas)',
          padding: 'var(--space-8) var(--space-4)',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-7)',
              alignItems: 'start',
            }}
          >
            {/* Copy + narrative */}
            <div>
              <SectionHeader
                eyebrow="Interactive Demo"
                heading="See the workflow run before activation"
                body="Run a simulated inquiry, watch the lead-response timeline append, activate the system through Stripe, and replay the flow in an active state."
                headingSize="h1"
              />

              <div style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
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
                  What you'll see
                </p>
                <ol
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {NARRATIVE_STEPS.map((step, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: 'var(--font-size-14)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(110,168,254,0.08)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <CTAButton href="/book-demo" label="Activate System" arrow />
                <CTAButton href="/pricing" label="View Pricing" variant="secondary" />
              </div>
            </div>

            {/* Demo console */}
            <div>
              <DemoConsole />
            </div>
          </div>
        </div>
      </section>

      {/* ── What the demo proves ─────────────────────────────────────────── */}
      <Section id="what-it-proves" background="var(--color-surface)">
        <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <SectionHeader
            eyebrow="Proof points"
            heading="The demo proves six things before you buy"
            align="center"
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-3)',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          {[
            { label: 'Inactive before payment', icon: '🔒', description: 'Flows stay locked until activation is confirmed.' },
            { label: 'Active after payment', icon: '✓', description: 'Activation transitions workspace to live state.' },
            { label: 'Inquiry enters', icon: '→', description: 'Simulated inquiry triggers workflow execution.' },
            { label: 'Response sends', icon: '⚡', description: 'Lead response fires immediately on trigger.' },
            { label: 'Follow-up schedules', icon: '⏱', description: 'Re-engagement queued if no reply received.' },
            { label: 'Routing happens', icon: '⬆', description: 'Inbound classified and directed correctly.' },
          ].map(({ label, icon, description }) => (
            <div
              key={label}
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: 'var(--font-size-20)',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {icon}
              </span>
              <p style={{ fontSize: 'var(--font-size-14)', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
                {label}
              </p>
              <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <Section id="cta">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(var(--font-size-24), 3vw, var(--font-size-36))',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-5)',
            }}
          >
            Ready to book the live demo?
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <CTAButton href="/book-demo" label="Book Live Demo" size="lg" arrow />
            <CTAButton href="/pricing" label="View Pricing" variant="secondary" size="lg" />
          </div>
        </div>
      </Section>
    </>
  )
}
