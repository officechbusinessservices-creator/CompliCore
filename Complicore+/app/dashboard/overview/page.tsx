/**
 * /dashboard/overview — workspace KPI strip, activity timeline, billing state, expansion CTA.
 *
 * Spec: 01_ARCHITECTURE_SPEC.md — dashboard overview template.
 * Displays: KPI strip (response time, active flows, leads this week, time saved),
 * Recent activity timeline, subscription status, period end date, and expansion CTA.
 */

import { getWorkspaceSubscription } from '@/lib/workspace'
import OverviewPageClient from './overview-page-client'

export default async function OverviewPage() {
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

  return <OverviewPageClient subscription={subscription} />
}
