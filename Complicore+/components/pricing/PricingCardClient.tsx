'use client'

interface PricingTier {
  name: string
  monthlyPrice: number
  activationFee: number
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
  plan_name: 'launch' | 'growth' | 'ops_stack'
}

interface PricingCardClientProps {
  tier: PricingTier
}

export function PricingCardClient({ tier }: PricingCardClientProps) {
  const handleCTA = async () => {
    if (tier.plan_name === 'ops_stack') {
      window.location.href = '/book-demo'
      return
    }

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  return (
    <div
      className={`flex flex-col gap-6 rounded-lg border p-8 transition-all ${
        tier.highlighted
          ? 'border-primary bg-primary/5 shadow-lg ring-1 ring-primary'
          : 'border-line bg-surface'
      }`}
    >
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-text-primary">{tier.name}</h3>
        <p className="text-sm text-text-secondary mt-3">{tier.description}</p>
      </div>

      {/* Pricing */}
      <div className="py-6 border-t border-b border-line">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-text-primary">
            ${tier.monthlyPrice}
          </span>
          <span className="text-text-secondary">{tier.period}</span>
        </div>
        <p className="text-sm text-text-secondary mt-3">
          Activation fee: ${tier.activationFee} one-time
        </p>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-3">
        {tier.features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-text-secondary"
          >
            <svg
              className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={handleCTA}
        className={`mt-auto w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          tier.highlighted
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-surface-elevated text-text-primary border border-line hover:bg-surface'
        }`}
      >
        {tier.cta}
      </button>
    </div>
  )
}
