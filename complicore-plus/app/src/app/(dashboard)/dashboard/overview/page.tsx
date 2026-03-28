'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { KPIStatCard } from '@/components/ui/KPIStatCard'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowRight, Zap, Clock, GitBranch, MessageSquare } from 'lucide-react'

type OverviewData = {
  workspace: { id: string; name: string; status: string }
  metrics: {
    median_first_response_time_seconds: number | null
    active_flow_count: number
    leads_responded_30d: number
    total_leads_30d: number
  }
  billing: {
    status: string
    total_entitled_flows: number
    current_period_end: string | null
  }
  flows: Array<{ id: string; name: string; status: string; billing_state: string }>
  recent_activity: Array<{ id: string; event_type: string; created_at: string }>
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  lead_received: MessageSquare,
  response_sent: Zap,
  follow_up_scheduled: Clock,
  routed: GitBranch,
}

const EVENT_LABELS: Record<string, string> = {
  lead_received: 'Inquiry received',
  response_sent: 'Response sent',
  follow_up_scheduled: 'Follow-up scheduled',
  routed: 'Request routed',
  closed: 'Lead closed',
  failed: 'Flow error',
}

function formatResponseTime(seconds: number | null): string {
  if (seconds === null) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${Math.round(seconds / 3600)}h`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const workspaceId = localStorage.getItem('workspace_id')
    if (!workspaceId) return

    fetch(`/api/dashboard/overview?workspace_id=${workspaceId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[#11182D] rounded-2xl border border-[#25314F] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <EmptyState
          title="Could not load dashboard"
          description="Try refreshing the page."
          action={{ label: 'Refresh', onClick: () => window.location.reload() }}
        />
      </div>
    )
  }

  const isInactive = data.workspace.status === 'inactive'
  const isPastDue = data.workspace.status === 'past_due'

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">{data.workspace.name}</h1>
          <p className="text-sm text-[#8A95B2] mt-1">Dashboard overview</p>
        </div>
        <StatusPill status={data.workspace.status as 'active' | 'inactive' | 'past_due'} />
      </div>

      {/* Activation banner */}
      {isInactive && (
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#F5F7FB] mb-1">Activate your system</h3>
            <p className="text-sm text-[#B8C1D9]">
              Your flows are locked until you activate. Payment takes 60 seconds.
            </p>
          </div>
          <Link href="/pricing">
            <Button>
              Activate System <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {isPastDue && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-red-400 mb-1">Payment past due</h3>
            <p className="text-sm text-[#B8C1D9]">Your flows are paused. Update billing to resume.</p>
          </div>
          <Link href="/dashboard/billing">
            <Button variant="danger">Update Billing</Button>
          </Link>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          label="Median response time"
          value={formatResponseTime(data.metrics.median_first_response_time_seconds)}
          subtext="Last 30 days"
          trend={data.metrics.median_first_response_time_seconds !== null ? 'up' : 'neutral'}
          trendValue={data.metrics.median_first_response_time_seconds !== null ? '↓ vs manual' : undefined}
        />
        <KPIStatCard
          label="Active flows"
          value={data.metrics.active_flow_count}
          subtext={`of ${data.billing.total_entitled_flows} entitled`}
        />
        <KPIStatCard
          label="Leads responded"
          value={data.metrics.leads_responded_30d}
          subtext="Last 30 days"
        />
        <KPIStatCard
          label="Total leads"
          value={data.metrics.total_leads_30d}
          subtext="Last 30 days"
        />
      </div>

      {/* Active flows */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#F5F7FB]">Active flows</h2>
          <Link href="/dashboard/flows" className="text-sm text-brand hover:text-brand-hover transition-colors">
            View all
          </Link>
        </div>

        {data.flows.length === 0 ? (
          <EmptyState
            title="No flows yet"
            description="Activate your system to unlock automated workflows."
            action={{ label: 'Activate', onClick: () => { window.location.href = '/pricing' } }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.flows.map((flow) => (
              <div
                key={flow.id}
                className="bg-[#11182D] border border-[#25314F] rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#F5F7FB]">{flow.name}</p>
                  <p className="text-xs text-[#8A95B2] mt-1">{flow.billing_state === 'billing' ? 'Billing active' : 'Not billing'}</p>
                </div>
                <StatusPill status={flow.status as 'active' | 'inactive' | 'locked' | 'paused'} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#F5F7FB]">Recent activity</h2>
          <Link href="/dashboard/leads" className="text-sm text-brand hover:text-brand-hover transition-colors">
            View leads
          </Link>
        </div>

        {data.recent_activity.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Activity will appear here once your flows start processing inquiries."
          />
        ) : (
          <div className="bg-[#11182D] border border-[#25314F] rounded-2xl divide-y divide-[#25314F]">
            {data.recent_activity.map((evt) => {
              const Icon = EVENT_ICONS[evt.event_type] || MessageSquare
              return (
                <div key={evt.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-8 w-8 rounded-lg bg-[#16203A] flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F5F7FB]">
                      {EVENT_LABELS[evt.event_type] || evt.event_type}
                    </p>
                  </div>
                  <span className="text-xs text-[#8A95B2] flex-shrink-0">
                    {formatDate(evt.created_at)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
