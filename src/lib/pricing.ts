export type PlanType = "host-club" | "enterprise" | "corporate-sme";

export const PRICING = {
  hostClubPerProperty: 18,
  enterpriseFlat: 888,
  corporateCommissionRate: 0.08,
  aiPowerUp: 28,
  marketplaceAddOns: [
    { id: "ai-power-up", name: "AI Power-Up", price: 28, cadence: "monthly" },
    { id: "dynamic-pricing", name: "Dynamic Pricing", price: 35, cadence: "monthly" },
    { id: "insurance", name: "Host Protection", price: 15, cadence: "monthly" },
    { id: "photography", name: "Photography", price: 199, cadence: "one-time" },
    { id: "cleaning-services", name: "Cleaning Services", price: 20, cadence: "per-turnover" },
  ],
};

export function calculateHostClubMonthly(properties: number) {
  return properties * PRICING.hostClubPerProperty;
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
