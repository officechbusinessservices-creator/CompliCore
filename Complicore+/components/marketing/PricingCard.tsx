import { CTAButton } from './CTAButton'

interface PricingFeature {
  label: string
  included: boolean
}

export interface PricingCardProps {
  name: string
  description: string
  activationFee: string
  monthlyPrice: string
  flowCount: string
  features: PricingFeature[]
  highlighted?: boolean
  badge?: string
  ctaLabel?: string
  ctaHref?: string
}

export function PricingCard({
  name,
  description,
  activationFee,
  monthlyPrice,
  flowCount,
  features,
  highlighted = false,
  badge,
  ctaLabel = 'Activate System',
  ctaHref = '/book-demo',
}: PricingCardProps) {
  return (
    <article
      style={{
        backgroundColor: highlighted ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
        border: `1px solid ${highlighted ? 'rgba(110,168,254,0.4)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        position: 'relative',
        boxShadow: highlighted ? 'var(--shadow-md)' : 'none',
        transition: 'box-shadow var(--motion-standard), transform var(--motion-standard)',
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-primary)',
            color: '#0B1020',
            fontSize: 'var(--font-size-12)',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}
        >
          {badge}
        </div>
      )}

      {/* Header */}
      <div>
        <h2
          style={{
            fontSize: 'var(--font-size-20)',
            fontWeight: 700,
            color: highlighted ? 'var(--color-primary)' : 'var(--color-text-primary)',
            margin: '0 0 8px',
          }}
        >
          {name}
        </h2>
        <p style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {/* Pricing */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-3) 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span
            style={{
              fontSize: 'var(--font-size-36)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {activationFee}
          </span>
          <span style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-secondary)' }}>
            one-time activation
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: 'var(--font-size-24)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
            {monthlyPrice}
          </span>
          <span style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-secondary)' }}>
            / month · {flowCount}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map(({ label, included }, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: 'var(--font-size-14)',
              color: included ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              opacity: included ? 1 : 0.5,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0, marginTop: '1px', color: included ? 'var(--color-success)' : 'var(--color-text-secondary)' }}
            >
              {included ? (
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M8 8m-5 0a5 5 0 1 0 10 0 5 5 0 0 0-10 0" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
            {label}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <CTAButton
        href={ctaHref}
        label={ctaLabel}
        variant={highlighted ? 'primary' : 'secondary'}
        style={{ width: '100%', justifyContent: 'center' }}
      />
    </article>
  )
}
