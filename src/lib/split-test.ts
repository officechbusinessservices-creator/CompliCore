/**
 * Split-test utilities for Netlify branch-based A/B testing.
 *
 * Netlify Split Testing serves different branch deploys to different users
 * via a sticky `nf_ab` cookie. Each branch is built with a distinct
 * `NEXT_PUBLIC_SPLIT_BRANCH` env var so we can fork copy, layout,
 * or features at the component level without maintaining two codebases.
 *
 * Usage:
 *   import { SPLIT } from "@/lib/split-test";
 *   const headline = SPLIT.isBeta ? "Alternate headline" : "Control headline";
 *
 * @see https://docs.netlify.com/site-deploys/split-testing/
 */

const branch = process.env.NEXT_PUBLIC_SPLIT_BRANCH ?? "main";

export const SPLIT = {
  /** Current branch name injected at build time */
  branch,

  /** True when running the beta branch deploy */
  isBeta: branch === "beta",

  /** True when running the main (control) branch deploy */
  isControl: branch === "main",
} as const;

/* ------------------------------------------------------------------ */
/*  Hero / CTA copy variants                                          */
/* ------------------------------------------------------------------ */

export const HERO_VARIANTS = {
  control: {
    badge: "Built for growth-focused property managers",
    headlineTop: "Fill Your Calendar. Lower Your Costs.",
    headlineHighlight: "Put Your Properties on Autopilot.",
    subheadline:
      "Stop leaving money on the table with empty mid-week dates. CompliCore automatically fills your vacancy gaps, slashes your admin time by 60%, and maximizes your booking revenue—all without taking a percentage of your profits.",
    primaryCta: "Get Your Free 14-Day Revenue Audit",
    secondaryCta: "See How Much You Can Save",
    trialLine: "Setup takes 10 minutes · No credit card required · 100% Flat-fee pricing",
  },
  beta: {
    badge: "Built for growth-focused property managers",
    headlineTop: "Fill Your Calendar. Lower Your Costs.",
    headlineHighlight: "Put Your Properties on Autopilot.",
    subheadline:
      "Stop leaving money on the table with empty mid-week dates. CompliCore automatically fills your vacancy gaps, slashes your admin time by 60%, and maximizes your booking revenue—all without taking a percentage of your profits.",
    primaryCta: "Get Your Free 14-Day Revenue Audit",
    secondaryCta: "See How Much You Can Save",
    trialLine: "Setup takes 10 minutes · No credit card required · 100% Flat-fee pricing",
  },
} as const;

/** Returns the hero copy for the active branch */
export function getHeroCopy() {
  return SPLIT.isBeta ? HERO_VARIANTS.beta : HERO_VARIANTS.control;
}

/* ------------------------------------------------------------------ */
/*  CTA section variants (bottom of page)                             */
/* ------------------------------------------------------------------ */

export const CTA_VARIANTS = {
  control: {
    headline: "Ready to maximize your revenue and get your time back?",
    subheadline:
      "Join 12,000+ properties using CompliCore to run perfectly optimized, fully compliant operations.",
    primaryCta: "Start Your Free Revenue Audit Now",
    bullets: [
      "14-day free trial",
      "No credit card required",
      "100% flat-fee pricing",
      "Setup in 10 minutes",
    ],
  },
  beta: {
    headline: "Ready to maximize your revenue and get your time back?",
    subheadline:
      "Join 12,000+ operators who scaled their portfolios with AI pricing and zero revenue-share fees.",
    primaryCta: "Start Your Free Revenue Audit Now",
    bullets: [
      "14-day free trial",
      "No credit card",
      "No revenue-share fees",
      "Cancel anytime",
    ],
  },
} as const;

/** Returns the bottom CTA copy for the active branch */
export function getCtaCopy() {
  return SPLIT.isBeta ? CTA_VARIANTS.beta : CTA_VARIANTS.control;
}
