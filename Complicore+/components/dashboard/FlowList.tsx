'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { StatusPill, type PillVariant } from '@/components/shared/StatusPill'
import { FlowToggle } from '@/components/dashboard/FlowToggle'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonList } from '@/components/shared/SkeletonLoader'

/**
 * FlowList — renders the full list of workspace flows.
 *
 * Spec: 01_ARCHITECTURE_SPEC.md — flows page template, core flows.
 * Three core flows: Leasing Lead Response, Follow-Up Automation, Admin Routing.
 * Locked flows show lock icon + upgrade prompt instead of toggle.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export type FlowType =
  | 'lead_response'
  | 'follow_up'
  | 'admin_routing'
  | 'review'
  | 'content'

export type FlowStatus = 'active' | 'inactive' | 'paused' | 'error' | 'locked'

export interface Flow {
  id:           string
  name:         string
  type:         FlowType
  status:       FlowStatus
  runsThisWeek: number
  lastRunAt:    string | null   // ISO string or null
  description:  string
}

interface FlowListProps {
  flows:      Flow[]
  loading?:   boolean
  onSelect:   (flow: Flow) => void
  onToggle:   (id: string, active: boolean) => void
}

// ── Type label map ──────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<FlowType, string> = {
  lead_response:  'Lead Response',
  follow_up:      'Follow-Up',
  admin_routing:  'Admin Routing',
  review:         'Review',
  content:        'Content',
}

// ── Row icon ────────────────────────────────────────────────────────────────────

function FlowIcon({ type }: { type: FlowType }) {
  const paths: Record<FlowType, React.ReactNode> = {
    lead_response: (
      <>
        <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 16c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M14 8l1.5 1.5L18 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    follow_up: (
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    admin_routing: (
      <>
        <path d="M3 6h14M3 10h10M3 14h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M16 12l3 2-3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    review: (
      <>
        <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
    content: (
      <>
        <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-ts">
      {paths[type]}
    </svg>
  )
}

// ── Lock icon ───────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-ts">
      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// ── Relative time helper ────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── FlowRow ─────────────────────────────────────────────────────────────────────

interface FlowRowProps {
  flow:      Flow
  onSelect:  (flow: Flow) => void
  onToggle:  (id: string, active: boolean) => void
}

function FlowRow({ flow, onSelect, onToggle }: FlowRowProps) {
  const locked   = flow.status === 'locked'
  const isActive = flow.status === 'active'

  return (
    <li className="group">
      <div
        className={cn(
          'flex items-center gap-4 px-5 py-4',
          'border-b border-line last:border-0',
          'transition-colors duration-180',
          !locked && 'hover:bg-surface-elevated cursor-pointer'
        )}
        onClick={() => !locked && onSelect(flow)}
        role={locked ? undefined : 'button'}
        tabIndex={locked ? undefined : 0}
        aria-label={locked ? undefined : `Open ${flow.name} details`}
        onKeyDown={(e) => {
          if (!locked && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onSelect(flow)
          }
        }}
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-sm bg-surface-elevated border border-line flex items-center justify-center">
          <FlowIcon type={flow.type} />
        </div>

        {/* Name + type */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              'text-14 font-semibold truncate',
              locked ? 'text-ts' : 'text-tp'
            )}>
              {flow.name}
            </span>
            {locked && <LockIcon />}
          </div>
          <span className="text-12 text-ts">{TYPE_LABEL[flow.type]}</span>
        </div>

        {/* Stats — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-12 text-ts">Runs this week</p>
            <p className={cn(
              'text-14 font-semibold tabular-nums',
              locked ? 'text-ts' : 'text-tp'
            )}>
              {locked ? '—' : flow.runsThisWeek}
            </p>
          </div>
          <div className="text-right">
            <p className="text-12 text-ts">Last run</p>
            <p className={cn(
              'text-14 font-medium tabular-nums',
              locked ? 'text-ts' : 'text-tp'
            )}>
              {locked || !flow.lastRunAt ? '—' : relativeTime(flow.lastRunAt)}
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className="flex-shrink-0 hidden sm:block">
          <StatusPill variant={flow.status as PillVariant} size="sm" />
        </div>

        {/* Toggle / locked indicator */}
        <div
          className="flex-shrink-0 flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {locked ? (
            <span className="text-12 text-ts px-3 py-1 rounded-full bg-line/30">
              Upgrade
            </span>
          ) : (
            <FlowToggle
              checked={isActive}
              label={flow.name}
              size="sm"
              onChange={(val) => onToggle(flow.id, val)}
            />
          )}
        </div>
      </div>
    </li>
  )
}

// ── FlowList ────────────────────────────────────────────────────────────────────

export function FlowList({ flows, loading, onSelect, onToggle }: FlowListProps) {
  if (loading) {
    return <SkeletonList rows={3} className="px-0" />
  }

  if (flows.length === 0) {
    return (
      <EmptyState
        heading="No flows configured"
        body="Flows automate your leasing, follow-up, and admin workflows. Contact your account manager to activate your first flow."
        compact
      />
    )
  }

  return (
    <ul className="divide-y-0 list-none p-0 m-0" aria-label="Flows">
      {flows.map((flow) => (
        <FlowRow
          key={flow.id}
          flow={flow}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}
