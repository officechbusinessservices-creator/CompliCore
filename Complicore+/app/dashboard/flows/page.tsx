/**
 * /dashboard/flows — active flow list, flow detail drawer, toggle states.
 *
 * Spec: 01_ARCHITECTURE_SPEC.md — flows page template, core flows.
 * Three core flows: Leasing Lead Response, Follow-Up Automation, Admin Routing.
 *
 * Subscription-locked flows:
 * - Launch plan: 1 flow (Leasing Lead Response only)
 * - Growth plan: 3 flows (+ Follow-Up Automation)
 * - Ops Stack: 10 flows (all flows available + future extensions)
 *
 * Flows beyond the plan limit are marked status='locked' and show upgrade CTA.
 * If subscription is not active (past_due, canceled), all flows except first are locked.
 */

import { getWorkspaceSubscription } from '@/lib/workspace'
import FlowsPageClient from './flows-page-client'

export default async function FlowsPage() {
  const subscription = await getWorkspaceSubscription()

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-800">
            Unable to load your subscription. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  return <FlowsPageClient subscription={subscription} />
}
