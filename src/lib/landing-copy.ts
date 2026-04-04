import { PRICING } from "@/lib/pricing";

const usd = (amount: number) => `$${amount}`;

export const LANDING_BRAND_COPY = {
  name: "CompliCore",
  valueProposition: "Maximum Revenue. Zero Compliance Headaches.",
  startTrialCta: "Start free trial",
} as const;

export const LANDING_PLAN_COPY = {
  hostClub: {
    id: "host_club",
    name: "Host Club",
    priceLabel: `${usd(PRICING.hostClubPerProperty)}/property/month`,
    summary: "Up to 10 properties",
  },
  hostClubAi: {
    id: "host_club_ai",
    name: "Host Club + AI",
    priceLabel: `${usd(PRICING.hostClubAiPerProperty)}/property/month`,
    summary: "AI pricing and guest risk scoring for revenue growth",
  },
  portfolioPro: {
    id: "portfolio_pro",
    name: "Portfolio Pro",
    priceLabel: `${usd(PRICING.portfolioProFlat)}/month`,
    summary: `Includes ${PRICING.portfolioProIncludedProperties} properties, +${usd(
      PRICING.portfolioProAdditionalProperty,
    )} each additional`,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    priceLabel: `${usd(PRICING.enterpriseFlat)}/month`,
    summary: `Best fit for ${PRICING.enterpriseRecommendedFromProperties}+ properties and multi-entity operations`,
  },
} as const;

export const LANDING_SHARED_COPY = {
  pricingLinkLabel: "Pricing",
  hostsLinkLabel: "For Hosts",
  enterpriseLinkLabel: "Enterprise",
  guestPortalLabel: "Guest Portal",
  corporatePortalLabel: "Corporate Portal",
  noRevenueShareLine: "No revenue-share fees",
  monthToMonthLine: "Month-to-month plans",
  complianceFirstLine: "Compliance-first workflows included",
} as const;

const hostClubAiAtPortfolioThreshold =
  PRICING.hostClubAiPerProperty * PRICING.portfolioProIncludedProperties;

export const portfolioBridgeCopy = {
  thresholdProperties: PRICING.portfolioProIncludedProperties,
  hostClubAiMonthlyAtThreshold: hostClubAiAtPortfolioThreshold,
  portfolioProMonthlyAtThreshold: PRICING.portfolioProFlat,
  savingsAtThreshold:
    hostClubAiAtPortfolioThreshold - PRICING.portfolioProFlat,
} as const;
