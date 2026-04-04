'use client'

import { AlertCircle, Activity, Zap } from 'lucide-react'

interface KPI {
  label: string
  value: string | number
  subtext?: string
}

interface TimelineEvent {
  id: string
  timestamp: string
  type: 'lead_response' | 'follow_up' | 'admin_routing'
  description: string
  leadId?: string
}

interface OverviewPageClientProps {
  subscription: {
    id: string
    workspace_id: string
    plan_name: 'launch' | 'growth' | 'ops_stack'
    status: 'active' | 'past_due' | 'canceled'
    stripe_customer_id: string | null
    activation_fee_paid: boolean
    current_period_end: string
    created_at: string
  }
}

// ── Mock KPI data (pre-API) ────────────────────────────────────────────────
const MOCK_KPIS: KPI[] = [
  {
    label: 'Median Response Time',
    value: '47s',
    subtext: 'vs 8h+ manual average'
  },
  {
    label: 'Active Flows',
    value: '1 / 3',
    subtext: 'Launch plan limit'
  },
  {
    label: 'Leads This Week',
    value: '47',
    subtext: 'Auto-responded'
  },
  {
    label: 'Time Saved',
    value: '9.2h',
    subtext: 'Workflow automation'
  },
]

// ── Mock timeline data (pre-API) ────────────────────────────────────────────
const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 'event-001',
    timestamp: new Date(Date.now() - 300_000).toISOString(),
    type: 'lead_response',
    description: 'Auto-responded to new inquiry from Alex Chen',
    leadId: 'lead-001'
  },
  {
    id: 'event-002',
    timestamp: new Date(Date.now() - 1_200_000).toISOString(),
    type: 'lead_response',
    description: 'Auto-responded to new inquiry from Sarah Williams',
    leadId: 'lead-002'
  },
  {
    id: 'event-003',
    timestamp: new Date(Date.now() - 3_600_000).toISOString(),
    type: 'follow_up',
    description: 'Scheduled follow-up for Marcus Johnson (48h gap)',
    leadId: 'lead-003'
  },
  {
    id: 'event-004',
    timestamp: new Date(Date.now() - 7_200_000).toISOString(),
    type: 'admin_routing',
    description: 'Routed maintenance request from apartment 4B',
    leadId: undefined
  },
]

function formatTimeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString()
}

function getEventIcon(type: TimelineEvent['type']) {
  switch (type) {
    case 'lead_response':
      return <Zap className="w-4 h-4 text-primary" />
    case 'follow_up':
      return <Activity className="w-4 h-4 text-primary" />
    case 'admin_routing':
      return <Activity className="w-4 h-4 text-primary" />
  }
}

export default function OverviewPageClient({ subscription }: OverviewPageClientProps) {
  const isSubscriptionActive = subscription.status === 'active'

  return (
    <>
      {/* Page header */}
      <div className="border-b border-line px-6 py-5">
        <h1 className="text-20 font-bold text-tp">Overview</h1>
        <p className="text-14 text-ts mt-0.5">
          Workflow status, activity, and billing summary.
        </p>
      </div>

      {/* Subscription warning banners */}
      {subscription.status === 'past_due' && (
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Payment Failed</p>
              <p className="text-sm text-amber-800 mt-1">
                Your subscription payment failed. Please update your payment method to resume automation.{' '}
                <a href="/dashboard/billing" className="underline font-medium hover:text-amber-900">
                  Update billing →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {subscription.status === 'canceled' && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Subscription Canceled</p>
              <p className="text-sm text-red-800 mt-1">
                Your subscription was canceled. All workflows are now inactive.{' '}
                <a href="/dashboard/billing" className="underline font-medium hover:text-red-900">
                  Reactivate subscription →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Strip */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="card rounded-lg border border-line bg-canvas p-4"
            >
              <p className="text-12 font-medium text-ts uppercase tracking-wider">
                {kpi.label}
              </p>
              <p className="text-30 font-bold text-tp mt-2">{kpi.value}</p>
              {kpi.subtext && (
                <p className="text-12 text-ts mt-1">{kpi.subtext}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-6 py-5">
        <div className="card rounded-lg border border-line overflow-hidden">
          <div className="bg-surface-elevated px-6 py-4 border-b border-line">
            <h2 className="text-16 font-semibold text-tp">Recent Activity</h2>
          </div>
          <div className="divide-y divide-line">
            {MOCK_TIMELINE.length > 0 ? (
              MOCK_TIMELINE.map((event) => (
                <div key={event.id} className="px-6 py-4 flex gap-4 items-start hover:bg-surface-elevated/30 transition-colors">
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-14 text-tp">{event.description}</p>
                    <p className="text-12 text-ts mt-1">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-14 text-ts">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Billing Summary + Expansion CTA */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Billing card */}
          <div className="lg:col-span-2 card rounded-lg border border-line bg-canvas p-6">
            <h2 className="text-16 font-semibold text-tp">Billing & Subscription</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-14 text-ts">Plan</span>
                <span className="text-14 font-medium text-tp capitalize">
                  {subscription.plan_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-14 text-ts">Status</span>
                <span
                  className={`text-14 font-medium capitalize ${
                    subscription.status === 'active'
                      ? 'text-success'
                      : subscription.status === 'past_due'
                        ? 'text-warning'
                        : 'text-danger'
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-14 text-ts">Period Ends</span>
                <span className="text-14 font-medium text-tp">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            </div>
            <a
              href="/dashboard/billing"
              className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-surface-elevated text-tp text-14 font-medium rounded-lg hover:bg-line transition-colors"
            >
              Manage Billing →
            </a>
          </div>

          {/* Expansion CTA */}
          <div className="card rounded-lg border border-line bg-primary/5 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-16 font-semibold text-tp">Ready to expand?</h2>
              <p className="text-14 text-ts mt-2">
                Add more workflows to your plan and unlock additional automation.
              </p>
            </div>
            <a
              href="/dashboard/flows"
              className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-14 font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Flows →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
