/**
 * /dashboard/demo — internal demo console for authenticated users.
 *
 * Spec: 01_ARCHITECTURE_SPEC.md — demo page template.
 * Allows users to run a simulated workflow and understand the activation process.
 */

import { getWorkspaceSubscription } from '@/lib/workspace'
import DemoPageClient from './demo-page-client'

export default async function DemoPage() {
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

  return <DemoPageClient subscription={subscription} />
}
