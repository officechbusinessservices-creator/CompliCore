'use client'

import { useState } from 'react'
import { AlertCircle, Check } from 'lucide-react'

interface SettingsPageClientProps {
  subscription: {
    id: string
    workspace_id: string
    plan_name: 'launch' | 'growth' | 'ops_stack'
    status: 'active' | 'past_due' | 'canceled'
  }
}

export default function SettingsPageClient({ subscription }: SettingsPageClientProps) {
  const [workspaceName, setWorkspaceName] = useState('My Property Management')
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  const handleSaveWorkspaceName = () => {
    setShowSaveConfirm(true)
    setTimeout(() => setShowSaveConfirm(false), 3000)
  }

  return (
    <>
      {/* Page header */}
      <div className="border-b border-line px-6 py-5">
        <h1 className="text-20 font-bold text-tp">Settings</h1>
        <p className="text-14 text-ts mt-0.5">
          Manage workspace, team, and preferences.
        </p>
      </div>

      {/* Settings sections */}
      <div className="px-6 py-5 space-y-8">
        {/* Workspace Settings */}
        <section>
          <h2 className="text-16 font-semibold text-tp mb-4">Workspace</h2>
          <div className="card rounded-lg border border-line bg-canvas p-6 space-y-6">
            {/* Workspace Name */}
            <div>
              <label className="block text-14 font-medium text-tp mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-4 py-2 text-14 bg-surface border border-line rounded-lg text-tp focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-12 text-ts mt-2">
                This name appears in your dashboard header and shared invitations.
              </p>
            </div>

            {/* Workspace ID */}
            <div>
              <label className="block text-14 font-medium text-tp mb-2">
                Workspace ID
              </label>
              <div className="px-4 py-2 text-14 bg-surface-elevated border border-line rounded-lg text-ts font-mono">
                {subscription.workspace_id}
              </div>
              <p className="text-12 text-ts mt-2">
                This ID is used in API calls and integrations.
              </p>
            </div>

            {/* Save button */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveWorkspaceName}
                className="px-4 py-2 bg-primary text-white text-14 font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
              {showSaveConfirm && (
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span className="text-14">Saved</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Team & Access */}
        <section>
          <h2 className="text-16 font-semibold text-tp mb-4">Team & Access</h2>
          <div className="card rounded-lg border border-line bg-canvas p-6 space-y-4">
            {/* Current user */}
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <p className="text-14 font-medium text-tp">your@email.com</p>
                <p className="text-12 text-ts">Owner</p>
              </div>
              <span className="text-12 font-medium text-ts bg-surface-elevated px-3 py-1 rounded">
                You
              </span>
            </div>

            {/* Team info */}
            <div className="bg-surface-elevated rounded-lg p-4">
              <p className="text-14 text-ts">
                Team management coming soon. For now, contact{' '}
                <a href="mailto:support@complicore.ai" className="text-primary hover:underline">
                  support@complicore.ai
                </a>
                {' '}to add team members.
              </p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-16 font-semibold text-tp mb-4">Preferences</h2>
          <div className="card rounded-lg border border-line bg-canvas p-6 space-y-6">
            {/* Email notifications */}
            <div className="flex items-center justify-between pb-6 border-b border-line">
              <div>
                <p className="text-14 font-medium text-tp">Activity Notifications</p>
                <p className="text-12 text-ts mt-1">
                  Get emails when workflows complete or errors occur
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-primary"
                />
              </label>
            </div>

            {/* Weekly digest */}
            <div className="flex items-center justify-between pb-6 border-b border-line">
              <div>
                <p className="text-14 font-medium text-tp">Weekly Summary</p>
                <p className="text-12 text-ts mt-1">
                  Receive a weekly summary of workflow metrics and response times
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-primary"
                />
              </label>
            </div>

            {/* Billing alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-14 font-medium text-tp">Billing Alerts</p>
                <p className="text-12 text-ts mt-1">
                  Get notified about upcoming billing dates and payment issues
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-primary"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border-t border-line pt-8">
          <h2 className="text-16 font-semibold text-danger mb-4">Danger Zone</h2>
          <div className="card rounded-lg border border-danger/20 bg-danger/5 p-6 space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-14 font-medium text-danger">Delete Workspace</p>
                <p className="text-12 text-ts mt-1">
                  Permanently delete this workspace and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-danger text-white text-14 font-medium rounded-lg hover:bg-danger/90 transition-colors">
              Delete Workspace
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
