import Link from 'next/link';
import { Plus, CheckCircle } from 'lucide-react';

interface AddFlowUpgradeCardProps {
  currentFlows: number;
  planLimit: number;
  canAddMore: boolean;
}

export default function AddFlowUpgradeCard({
  currentFlows,
  planLimit,
  canAddMore,
}: AddFlowUpgradeCardProps) {
  if (currentFlows < planLimit && canAddMore) {
    // Can add more flows under current plan
    return (
      <div className="h-full flex flex-col bg-surface rounded-16 border border-border p-24 lg:p-32 items-center justify-center text-center">
        <CheckCircle className="w-48 h-48 text-[#22C55E] mb-16" />

        <h3 className="text-label-large font-semibold text-text-primary mb-8">
          Flows Available
        </h3>

        <p className="text-small text-text-secondary mb-24">
          You can add {planLimit - currentFlows} more flow{planLimit - currentFlows !== 1 ? 's' : ''} under your current plan.
        </p>

        <div className="mb-24">
          <div className="inline-block px-12 py-8 bg-[#22C55E]/10 rounded-8 text-[#22C55E] text-label-large font-semibold">
            No additional cost
          </div>
        </div>

        <Link
          href="/dashboard/flows"
          className="w-full px-16 py-12 bg-primary hover:bg-primary/90 text-white text-body font-medium rounded-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Add Flow
        </Link>

        <p className="text-caption text-text-secondary mt-16">
          Activate your new workflow instantly.
        </p>
      </div>
    );
  }

  // Plan limit reached, show upgrade option
  return (
    <div className="h-full flex flex-col bg-surface rounded-16 border border-dashed border-border p-24 lg:p-32 items-center justify-center text-center">
      <Plus className="w-48 h-48 text-primary/40 mb-16" />

      <h3 className="text-label-large font-semibold text-text-primary mb-8">
        Upgrade to Add More Flows
      </h3>

      <p className="text-small text-text-secondary mb-24">
        You've reached the {planLimit} flow limit for your plan. Expand your
        automation with additional workflows.
      </p>

      <div className="mb-24">
        <div className="inline-block px-12 py-8 bg-primary/10 rounded-8 text-primary text-label-large font-semibold">
          $249/month
        </div>
      </div>

      <p className="text-caption text-text-secondary mb-24">Per additional flow</p>

      <button className="w-full px-16 py-12 bg-primary hover:bg-primary/90 text-white text-body font-medium rounded-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
        Upgrade Plan
      </button>

      <p className="text-caption text-text-secondary mt-16">
        Upgrade your plan anytime. Billing prorated daily.
      </p>
    </div>
  );
}
