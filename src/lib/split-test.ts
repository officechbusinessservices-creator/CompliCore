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
    badge: "Now live · 12,000+ properties trust CompliCore",
    headlineTop: "Maximum Revenue.",
    headlineHighlight: "Zero Compliance Headaches.",
    subheadline:
      "CompliCore is the only rental platform that combines AI-powered dynamic pricing with built-in regulatory compliance so you can scale your portfolio safely.",
    primaryCta: "Start free trial",
    secondaryCta: "View live demo",
    trialLine: "No credit card required · Flat-fee pricing · Cancel anytime",
  },
  beta: {
    badge: "Trusted by 12,000+ properties across 40 countries",
    headlineTop: "Grow Faster.",
    headlineHighlight: "Stay Compliant Automatically.",
    subheadline:
      "The all-in-one rental OS that automates pricing, operations, and regulatory workflows — so you can add properties without adding headcount.",
    primaryCta: "Try free for 21 days",
    secondaryCta: "See it in action",
    trialLine: "No credit card · 21-day trial · Flat monthly fee",
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
    headline: "Ready to scale with confidence?",
    subheadline:
      "Join 12,000+ properties using CompliCore to improve revenue and stay compliant, without revenue-share pricing.",
    primaryCta: "Start free trial",
    bullets: [
      "14-day free trial",
      "No credit card",
      "Flat-fee pricing",
      "Compliance-ready workflows",
    ],
  },
  beta: {
    headline: "Your next property shouldn't mean your next headache.",
    subheadline:
      "Join 12,000+ operators who scaled their portfolios with AI pricing and automatic compliance workflows.",
    primaryCta: "Start 21-day free trial",
    bullets: [
      "21-day free trial",
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
