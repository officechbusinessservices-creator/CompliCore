'use client';

import { useState } from 'react';
import SubscriptionSummary from '@/components/dashboard/SubscriptionSummary';
import PaymentMethod from '@/components/dashboard/PaymentMethod';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import AddFlowUpgradeCard from '@/components/dashboard/AddFlowUpgradeCard';

export interface Invoice {
  id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  issued_at: string;
  invoice_url: string;
}

export interface Subscription {
  id: string;
  plan_name: 'launch' | 'growth' | 'ops_stack';
  status: 'active' | 'past_due' | 'canceled';
  activation_fee_paid: boolean;
  current_period_end: string;
  monthly_price: number;
  active_flow_count: number;
}

// Mock subscription data
const MOCK_SUBSCRIPTION: Subscription = {
  id: 'sub-001',
  plan_name: 'launch',
  status: 'active',
  activation_fee_paid: true,
  current_period_end: '2026-04-25T00:00:00Z',
  monthly_price: 349,
  active_flow_count: 1,
};

// Mock invoices data
const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    stripe_invoice_id: 'in_1234567890',
    amount: 1849,
    currency: 'usd',
    status: 'paid',
    issued_at: '2026-02-25T00:00:00Z',
    invoice_url: 'https://invoice.stripe.com/i/test1',
  },
  {
    id: 'inv-002',
    stripe_invoice_id: 'in_0987654321',
    amount: 1849,
    currency: 'usd',
    status: 'paid',
    issued_at: '2026-01-25T00:00:00Z',
    invoice_url: 'https://invoice.stripe.com/i/test2',
  },
  {
    id: 'inv-003',
    stripe_invoice_id: 'in_5555555555',
    amount: 349,
    currency: 'usd',
    status: 'paid',
    issued_at: '2025-12-25T00:00:00Z',
    invoice_url: 'https://invoice.stripe.com/i/test3',
  },
];

export default function BillingPage() {
  const [subscription] = useState<Subscription>(MOCK_SUBSCRIPTION);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);

  // Map plan names to allowed flow counts
  const planLimits: Record<Subscription['plan_name'], number> = {
    launch: 1,
    growth: 3,
    ops_stack: 10,
  };

  const planLimit = planLimits[subscription.plan_name];
  const canAddMore = subscription.status === 'active';

  return (
    <div className="flex flex-col gap-24">
      {/* Page header */}
      <div>
        <h1 className="text-h2 font-semibold text-text-primary">Billing</h1>
        <p className="text-body text-text-secondary mt-8">Manage subscription, payment methods, and invoices</p>
      </div>

      {/* Subscription summary */}
      <SubscriptionSummary subscription={subscription} />

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-24">
        {/* Left column: payment method + invoices */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-24">
          {/* Payment method section */}
          <PaymentMethod />

          {/* Invoices section */}
          <InvoiceTable invoices={invoices} />
        </div>

        {/* Right column: upgrade card */}
        <div className="col-span-12 lg:col-span-4">
          <AddFlowUpgradeCard
            currentFlows={subscription.active_flow_count}
            planLimit={planLimit}
            canAddMore={canAddMore}
          />
        </div>
      </div>
    </div>
  );
}
