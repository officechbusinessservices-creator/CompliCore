import { Subscription } from '@/app/dashboard/billing/page';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SubscriptionSummaryProps {
  subscription: Subscription;
}

export default function SubscriptionSummary({ subscription }: SubscriptionSummaryProps) {
  const planLabels: Record<Subscription['plan_name'], string> = {
    launch: 'Launch Plan',
    growth: 'Growth Plan',
    ops_stack: 'Ops Stack Plan',
  };

  const statusConfig = {
    active: { label: 'Active', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', icon: CheckCircle },
    past_due: { label: 'Past Due', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', icon: AlertCircle },
    canceled: { label: 'Canceled', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', icon: AlertCircle },
  };

  const config = statusConfig[subscription.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-surface rounded-16 border border-border p-24 lg:p-32">
      <div className="grid grid-cols-12 gap-24 lg:gap-32">
        {/* Plan info */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-8">
          <p className="text-small font-semibold text-text-secondary uppercase tracking-wide">Plan</p>
          <h3 className="text-label-large font-semibold text-text-primary">{planLabels[subscription.plan_name]}</h3>
        </div>

        {/* Status */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-8">
          <p className="text-small font-semibold text-text-secondary uppercase tracking-wide">Status</p>
          <div className={`flex items-center gap-8 w-fit px-12 py-8 rounded-8 ${config.bg}`}>
            <StatusIcon className={`w-16 h-16 ${config.color}`} />
            <span className={`text-small font-medium ${config.color}`}>{config.label}</span>
          </div>
        </div>

        {/* Monthly cost */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-8">
          <p className="text-small font-semibold text-text-secondary uppercase tracking-wide">Monthly Cost</p>
          <div className="text-label-large font-semibold text-text-primary">
            ${(subscription.monthly_price / 100).toFixed(2)}/mo
          </div>
        </div>

        {/* Active flows */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-8">
          <p className="text-small font-semibold text-text-secondary uppercase tracking-wide">Active Flows</p>
          <div className="text-label-large font-semibold text-text-primary">{subscription.active_flow_count}</div>
        </div>
      </div>

      {/* Renewal notice */}
      <div className="mt-24 pt-24 border-t border-border">
        <p className="text-small text-text-secondary">
          Your subscription renews on{' '}
          <span className="font-medium text-text-primary">
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  );
}
