import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// ── Price IDs — set in .env.local, not hardcoded ─────────────────────────────
// STRIPE_PRICE_ACTIVATION        — one-time $1,500 fee
// STRIPE_PRICE_FLOW_FIRST        — recurring $349/month (first flow)
// STRIPE_PRICE_FLOW_ADDITIONAL   — recurring $249/month (expansion flows)

export const STRIPE_PRICE_IDS = {
  activation: process.env.STRIPE_PRICE_ACTIVATION!,
  flowFirst: process.env.STRIPE_PRICE_FLOW_FIRST!,
  flowAdditional: process.env.STRIPE_PRICE_FLOW_ADDITIONAL!,
} as const
