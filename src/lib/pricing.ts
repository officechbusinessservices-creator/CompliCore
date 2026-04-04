export type PlanType =
  | "host-club"
  | "host-club-ai"
  | "portfolio-pro"
  | "enterprise"
  | "corporate-sme";

export const PRICING = {
  hostClubPerProperty: 18,
  hostClubAiPerProperty: 46,
  portfolioProFlat: 399,
  portfolioProIncludedProperties: 15,
  portfolioProAdditionalProperty: 25,
  enterpriseFlat: 888,
  enterpriseRecommendedFromProperties: 25,
  corporateCommissionRate: 0.08,
  marketplaceAddOns: [
    { id: "dynamic-pricing", name: "Dynamic Pricing", price: 35, cadence: "monthly" },
    { id: "insurance", name: "Host Protection", price: 15, cadence: "monthly" },
    { id: "photography", name: "Photography", price: 199, cadence: "one-time" },
    { id: "cleaning-services", name: "Cleaning Services", price: 20, cadence: "per-turnover" },
  ],
};

export function calculateHostClubMonthly(properties: number) {
  return properties * PRICING.hostClubPerProperty;
}

export function calculateHostClubAiMonthly(properties: number) {
  return properties * PRICING.hostClubAiPerProperty;
}

export function calculatePortfolioProMonthly(properties: number) {
  if (properties <= PRICING.portfolioProIncludedProperties) {
    return PRICING.portfolioProFlat;
  }
  return (
    PRICING.portfolioProFlat +
    (properties - PRICING.portfolioProIncludedProperties) *
      PRICING.portfolioProAdditionalProperty
  );
}

export function calculateEnterpriseMonthly() {
  return PRICING.enterpriseFlat;
}

export function calculateCorporateCommission(bookingAmount: number) {
  return bookingAmount * PRICING.corporateCommissionRate;
}

export function calculateMarkupToCoverCommission(bookingAmount: number) {
  const commission = calculateCorporateCommission(bookingAmount);
  return bookingAmount + commission;
}
