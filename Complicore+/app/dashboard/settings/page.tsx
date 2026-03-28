/**
 * /dashboard/settings — workspace, team, and preference management.
 *
 * Spec: 01_ARCHITECTURE_SPEC.md — dashboard settings template.
 * Displays: workspace name, workspace ID, team member list, notification preferences.
 */

import { getWorkspaceSubscription } from '@/lib/workspace'
import SettingsPageClient from './settings-page-client'

export default async function SettingsPage() {
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

  return <SettingsPageClient subscription={subscription} />
}
