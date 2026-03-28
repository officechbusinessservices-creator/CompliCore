'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { FlowList, type Flow } from '@/components/dashboard/FlowList'
import { FlowDrawer } from '@/components/dashboard/FlowDrawer'
import { AddFlowCard } from '@/components/dashboard/AddFlowCard'

// ── Mock flows (pre-API) ───────────────────────────────────────────────────────
// These will be replaced with real data from /api/flows once backend is complete.

const MOCK_FLOWS: Omit<Flow, 'status'>[] = [
  {
    id: 'flow-lead-response',
    name: 'Leasing Lead Response',
    type: 'lead_response',
    runsThisWeek: 47,
    lastRunAt: new Date(Date.now() - 1_200_000).toISOString(),
    description: 'Auto-responds to new inquiries within 60 seconds across all listing sources.',
  },
  {
    id: 'flow-follow-up',
    name: 'Follow-Up Automation',
    type: 'follow_up',
    runsThisWeek: 0,
    lastRunAt: new Date(Date.now() - 172_800_000).toISOString(),
    description: 'Re-engages prospects who have not replied in 48 hours.',
  },
  {
    id: 'flow-admin-routing',
    name: 'Admin Routing',
    type: 'admin_routing',
    runsThisWeek: 0,
    lastRunAt: null,
    description: 'Routes maintenance requests, renewal reminders, and compliance tasks to the right team member.',
  },
]

interface FlowsPageClientProps {
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

export default function FlowsPageClient({ subscription }: FlowsPageClientProps) {
  // ── Plan limits ────────────────────────────────────────────────────────────
  const planLimits: Record<string, number> = {
    launch: 1,
    growth: 3,
    ops_stack: 10,
  }

  const planLimit = planLimits[subscription.plan_name] || 1
  const isSubscriptionActive = subscription.status === 'active'

  // ── Calculate flow statuses ────────────────────────────────────────────────
  // First flow (Lead Response) is always available if subscription exists.
  // Additional flows are locked based on plan limit or subscription status.

  const flows: Flow[] = MOCK_FLOWS.map((flow, index) => {
    let status: 'active' | 'paused' | 'locked' = 'paused'

    if (!isSubscriptionActive) {
      // Subscription inactive (past_due, canceled) — all flows except first are locked
      status = index === 0 ? 'active' : 'locked'
    } else if (index === 0) {
      // First flow always active when subscription is active
      status = 'active'
    } else if (index < planLimit) {
      // Within plan limit — available to activate (but paused by default)
      status = 'paused'
    } else {
      // Beyond plan limit — locked, show upgrade CTA
      status = 'locked'
    }

    return {
      ...flow,
      status,
    }
  })

  // ── State management ───────────────────────────────────────────────────────
  const [flowState, setFlows] = useState<Flow[]>(flows)
  const [selectedFlow, setSelected] = useState<Flow | null>(null)

  function handleToggle(id: string, active: boolean) {
    const flow = flowState.find((f) => f.id === id)

    // Prevent toggling locked flows or when subscription is not active
    if (!flow || flow.status === 'locked' || !isSubscriptionActive) {
      return
    }

    setFlows((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: active ? 'active' : 'paused' } : f
      )
    )

    // Reflect toggle in drawer if it's the open flow
    setSelected((prev) =>
      prev?.id === id
        ? { ...prev, status: active ? 'active' : 'paused' }
        : prev
    )
  }

  return (
    <>
      {/* Page header */}
      <div className="border-b border-line px-6 py-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-20 font-bold text-tp">Flows</h1>
          <p className="text-14 text-ts mt-0.5">
            Active automation flows for your workspace.
          </p>
        </div>
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
                Your subscription was canceled. All flows are now inactive.{' '}
                <a href="/dashboard/billing" className="underline font-medium hover:text-red-900">
                  Reactivate subscription →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Flow list */}
      <div className="px-0">
        <div className="card rounded-none border-x-0 border-t-0 overflow-hidden">
          <FlowList
            flows={flowState}
            onSelect={setSelected}
            onToggle={handleToggle}
          />
        </div>
      </div>

      {/* Add flow CTA */}
      <div className="px-6 py-5">
        <AddFlowCard />
      </div>

      {/* Detail drawer */}
      <FlowDrawer
        flow={selectedFlow}
        onClose={() => setSelected(null)}
        onToggle={handleToggle}
      />
    </>
  )
}
