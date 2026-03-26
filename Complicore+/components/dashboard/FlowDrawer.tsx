'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { StatusPill, type PillVariant } from '@/components/shared/StatusPill'
import { FlowToggle } from '@/components/dashboard/FlowToggle'
import type { Flow } from '@/components/dashboard/FlowList'

/**
 * FlowDrawer — slide-in detail panel for a selected flow.
 *
 * Spec: 02_DESIGN_SYSTEM.md — panels (radius-16), shadow-lg, slide-in-left anim.
 * WCAG 2.2 AA: aria-modal, aria-labelledby, focus trap, Escape to close.
 * Animation: slide-in-left per globals.css (respects prefers-reduced-motion).
 */

// ── Mock run history ─────────────────────────────────────────────────────────

type RunStatus = 'complete' | 'error' | 'running'

interface FlowRun {
  id:         string
  status:     RunStatus
  triggeredAt: string   // ISO
  durationMs: number | null
  summary:    string
}

function getMockRuns(flowId: string): FlowRun[] {
  // Mock data keyed to flow — no real API yet
  const base: FlowRun[] = [
    {
      id:          `${flowId}-r1`,
      status:      'complete',
      triggeredAt: new Date(Date.now() - 1_200_000).toISOString(),
      durationMs:  1_340,
      summary:     'Responded to new lead inquiry from Zillow listing',
    },
    {
      id:          `${flowId}-r2`,
      status:      'complete',
      triggeredAt: new Date(Date.now() - 5_400_000).toISOString(),
      durationMs:  980,
      summary:     'Sent follow-up to prospect — no reply in 48h',
    },
    {
      id:          `${flowId}-r3`,
      status:      'error',
      triggeredAt: new Date(Date.now() - 25_200_000).toISOString(),
      durationMs:  null,
      summary:     'Missing contact email — run halted',
    },
    {
      id:          `${flowId}-r4`,
      status:      'complete',
      triggeredAt: new Date(Date.now() - 86_400_000).toISOString(),
      durationMs:  1_120,
      summary:     'Routed maintenance request to property admin',
    },
  ]
  return base
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  if (mins < 60)  return `${mins}m ago`
  const hrs   = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatDuration(ms: number): string {
  if (ms < 1_000) return `${ms}ms`
  return `${(ms / 1_000).toFixed(1)}s`
}

// ── Run status icon ───────────────────────────────────────────────────────────

function RunStatusIcon({ status }: { status: RunStatus }) {
  if (status === 'complete') {
    return (
      <span className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-success" />
        </svg>
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="w-5 h-5 rounded-full bg-danger/15 flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-danger" />
        </svg>
      </span>
    )
  }
  return (
    <span className="w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0">
      <span className="w-2 h-2 rounded-full bg-warning animate-pulse" aria-hidden="true" />
    </span>
  )
}

// ── Close icon ────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── FlowDrawer ────────────────────────────────────────────────────────────────

interface FlowDrawerProps {
  flow:      Flow | null
  onClose:   () => void
  onToggle:  (id: string, active: boolean) => void
}

export function FlowDrawer({ flow, onClose, onToggle }: FlowDrawerProps) {
  const drawerRef    = useRef<HTMLDivElement>(null)
  const closeRef     = useRef<HTMLButtonElement>(null)
  const headingId    = 'flow-drawer-heading'
  const open         = flow !== null

  // Focus trap
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const drawer = drawerRef.current
      if (!drawer) return
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const runs = flow ? getMockRuns(flow.id) : []

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity duration-220',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={cn(
          'fixed inset-y-0 right-0 z-40 w-full max-w-md',
          'bg-surface border-l border-line shadow-lg',
          'flex flex-col',
          'transition-transform duration-220',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {flow && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-line flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2
                  id={headingId}
                  className="text-18 font-bold text-tp leading-snug truncate"
                >
                  {flow.name}
                </h2>
                <p className="text-13 text-ts mt-0.5">{flow.description}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close flow details"
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center',
                  'text-ts hover:text-tp hover:bg-surface-elevated',
                  'transition-colors duration-180',
                  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
                )}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">

              {/* Status + toggle */}
              <section className="px-6 py-5 border-b border-line">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-12 text-ts uppercase tracking-wide font-semibold mb-2">Status</p>
                    <StatusPill variant={flow.status as PillVariant} />
                  </div>
                  {flow.status !== 'locked' && (
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-12 text-ts">
                        {flow.status === 'active' ? 'Pause flow' : 'Activate flow'}
                      </p>
                      <FlowToggle
                        checked={flow.status === 'active'}
                        label={flow.name}
                        onChange={(val) => onToggle(flow.id, val)}
                      />
                    </div>
                  )}
                  {flow.status === 'locked' && (
                    <a
                      href="/dashboard/billing"
                      className={cn(
                        'text-14 font-semibold text-primary',
                        'hover:text-primary-hover transition-colors duration-180',
                        'focus-visible:outline-none focus-visible:underline'
                      )}
                    >
                      Upgrade to activate →
                    </a>
                  )}
                </div>
              </section>

              {/* Stats */}
              {flow.status !== 'locked' && (
                <section className="px-6 py-5 border-b border-line">
                  <p className="text-12 text-ts uppercase tracking-wide font-semibold mb-3">Activity</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card p-4">
                      <p className="text-12 text-ts mb-1">Runs this week</p>
                      <p className="text-24 font-bold text-tp tabular-nums">{flow.runsThisWeek}</p>
                    </div>
                    <div className="card p-4">
                      <p className="text-12 text-ts mb-1">Last run</p>
                      <p className="text-18 font-bold text-tp">
                        {flow.lastRunAt ? relativeTime(flow.lastRunAt) : '—'}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Recent runs */}
              {flow.status !== 'locked' && (
                <section className="px-6 py-5">
                  <p className="text-12 text-ts uppercase tracking-wide font-semibold mb-3">Recent runs</p>
                  <ul className="flex flex-col gap-0 list-none p-0 m-0 divide-y divide-line">
                    {runs.map((run) => (
                      <li key={run.id} className="flex items-start gap-3 py-3">
                        <RunStatusIcon status={run.status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-13 text-tp leading-snug">{run.summary}</p>
                          <p className="text-12 text-ts mt-0.5">
                            {relativeTime(run.triggeredAt)}
                            {run.durationMs !== null && (
                              <span className="mx-1.5 text-line">·</span>
                            )}
                            {run.durationMs !== null && formatDuration(run.durationMs)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Locked placeholder */}
              {flow.status === 'locked' && (
                <section className="px-6 py-8 flex flex-col items-center text-center">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="text-ts mb-4 opacity-50">
                    <rect x="8" y="18" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13 18v-5a7 7 0 0114 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-14 font-semibold text-tp mb-1">Flow locked</p>
                  <p className="text-13 text-ts max-w-[240px] leading-relaxed">
                    Add this flow to your plan to activate automation.
                    Each additional flow is $249/month.
                  </p>
                  <a
                    href="/dashboard/billing"
                    className={cn(
                      'mt-5 inline-flex items-center justify-center',
                      'text-14 font-semibold text-canvas bg-primary',
                      'min-h-touch px-6 rounded-sm',
                      'hover:bg-primary-hover transition-colors duration-180',
                      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
                    )}
                  >
                    Upgrade plan
                  </a>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
