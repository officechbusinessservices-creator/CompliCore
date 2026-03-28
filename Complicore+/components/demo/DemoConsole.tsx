'use client'

import { useState, useCallback, useRef } from 'react'
import { Timeline } from './Timeline'
import type { TimelineItemStatus } from './TimelineItem'
import { CTAButton } from '@/components/marketing/CTAButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type DemoPhase = 'idle' | 'simulating' | 'locked' | 'activating' | 'active'

interface TimelineStep {
  step: number
  label: string
  detail: string
  status: TimelineItemStatus
}

// ─── Narrative steps per spec §7 ─────────────────────────────────────────────

const INACTIVE_STEPS: TimelineStep[] = [
  { step: 1, label: 'Account inactive', detail: 'Workspace not yet activated', status: 'locked' },
  { step: 2, label: 'New inquiry simulated', detail: 'Awaiting simulation input', status: 'locked' },
  { step: 3, label: 'Flow execution preview', detail: 'Activate to run live workflows', status: 'locked' },
  { step: 4, label: 'Lead response', detail: 'Locked — activation required', status: 'locked' },
  { step: 5, label: 'Follow-up scheduled', detail: 'Locked — activation required', status: 'locked' },
  { step: 6, label: 'Admin routing', detail: 'Locked — activation required', status: 'locked' },
]

const ACTIVE_STEPS: TimelineStep[] = [
  { step: 1, label: 'Account activated', detail: 'Stripe payment confirmed server-side', status: 'complete' },
  { step: 2, label: 'New inquiry received', detail: '"2BR/2BA available?" — contact@example.com', status: 'complete' },
  { step: 3, label: 'Lead response triggered', detail: 'Workflow: Leasing Lead Response', status: 'complete' },
  { step: 4, label: 'Instant reply sent', detail: 'Response delivered in < 30s', status: 'complete' },
  { step: 5, label: 'Follow-up scheduled', detail: 'Re-engagement in 48h if no reply', status: 'complete' },
  { step: 6, label: 'Routing completed', detail: 'Classified as leasing inquiry → leasing queue', status: 'complete' },
  { step: 7, label: 'KPI recorded', detail: 'Median response time updated in dashboard', status: 'complete' },
]

function buildSimulatingSteps(completedCount: number): TimelineStep[] {
  return [
    { step: 1, label: 'Account inactive', detail: 'Workspace not yet activated', status: 'complete' },
    { step: 2, label: 'New inquiry received', detail: '"2BR/2BA available?" — contact@example.com', status: completedCount >= 2 ? 'complete' : 'running' },
    { step: 3, label: 'Flow execution preview', detail: 'Activate to run live workflows', status: completedCount >= 3 ? 'complete' : completedCount === 2 ? 'running' : 'pending' },
    { step: 4, label: 'Lead response', detail: 'Locked — activation required', status: 'locked' },
    { step: 5, label: 'Follow-up', detail: 'Locked — activation required', status: 'locked' },
    { step: 6, label: 'Admin routing', detail: 'Locked — activation required', status: 'locked' },
  ]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DemoConsole() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [simulatedStep, setSimulatedStep] = useState(0)
  const [inquiryText, setInquiryText] = useState('')
  const [inputError, setInputError] = useState('')
  const isSimulatingRef = useRef(false)

  const handleRunSimulation = useCallback(() => {
    // Debounce: prevent multiple simultaneous simulations
    if (isSimulatingRef.current) return

    if (!inquiryText.trim()) {
      setInquiryText('2BR/2BA available? Looking to move in next month.')
    }
    setInputError('')
    isSimulatingRef.current = true
    setPhase('simulating')
    setSimulatedStep(1)

    // Stagger step completion per motion spec (180ms stagger)
    const delays = [400, 900, 1500]
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setSimulatedStep(i + 2)
        if (i === delays.length - 1) {
          setTimeout(() => {
            setPhase('locked')
            isSimulatingRef.current = false
          }, 300)
        }
      }, delay)
    })
  }, [inquiryText])

  const handleActivate = useCallback(() => {
    // In production: redirect to Stripe checkout via POST /api/stripe/create-checkout
    // Demo mode: simulate transition to active state
    setPhase('activating')
    setTimeout(() => setPhase('active'), 1200)
  }, [])

  const handleReset = useCallback(() => {
    setPhase('idle')
    setSimulatedStep(0)
    setInquiryText('')
  }, [])

  const isActive = phase === 'active'
  const isLocked = phase === 'locked'
  const isSimulating = phase === 'simulating'
  const isActivating = phase === 'activating'

  // Determine timeline to show
  let timelineSteps: TimelineStep[] = INACTIVE_STEPS
  if (isSimulating) timelineSteps = buildSimulatingSteps(simulatedStep)
  if (isLocked) timelineSteps = buildSimulatingSteps(4)
  if (isActivating || isActive) timelineSteps = ACTIVE_STEPS

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        transition: 'border-color var(--motion-slow)',
      }}
    >
      {/* Console header */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface-elevated)',
        }}
      >
        <span style={{ fontSize: 'var(--font-size-12)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Workflow Console
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isActivating && (
            <span style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-warning)' }}>Activating…</span>
          )}
          <span
            aria-live="polite"
            aria-label={`System status: ${isActive ? 'Active' : 'Inactive'}`}
            style={{
              fontSize: 'var(--font-size-12)',
              fontWeight: 600,
              color: isActive ? 'var(--color-success)' : 'var(--color-danger)',
              backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              padding: '2px 10px',
              borderRadius: '4px',
              transition: 'color var(--motion-slow), background-color var(--motion-slow)',
            }}
          >
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
          {(isLocked || isActive) && (
            <button
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-12)',
                cursor: 'pointer',
                padding: '2px 6px',
                minHeight: '28px',
              }}
              aria-label="Reset demo"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        {/* Input form — show when idle or simulating */}
        {(phase === 'idle' || isSimulating) && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              htmlFor="demo-inquiry"
              style={{
                display: 'block',
                fontSize: 'var(--font-size-12)',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
              }}
            >
              Simulate a leasing inquiry
            </label>
            <textarea
              id="demo-inquiry"
              value={inquiryText}
              onChange={e => setInquiryText(e.target.value)}
              placeholder="e.g. 2BR/2BA available? Looking to move in next month."
              disabled={isSimulating}
              rows={3}
              aria-describedby={inputError ? 'demo-error' : undefined}
              aria-invalid={!!inputError}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-surface-elevated)',
                border: `1px solid ${inputError ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-14)',
                padding: '10px 12px',
                resize: 'none',
                fontFamily: 'inherit',
                opacity: isSimulating ? 0.6 : 1,
                boxSizing: 'border-box',
              }}
            />
            {inputError && (
              <p id="demo-error" role="alert" style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-danger)', margin: '4px 0 0' }}>
                {inputError}
              </p>
            )}
            {phase === 'idle' && (
              <button
                onClick={handleRunSimulation}
                style={{
                  marginTop: 'var(--space-2)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#0B1020',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-14)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  minHeight: '44px',
                  width: '100%',
                  transition: 'background-color var(--motion-standard)',
                }}
              >
                Run Simulation
              </button>
            )}
          </div>
        )}

        {/* Timeline */}
        <Timeline items={timelineSteps} />

        {/* Locked state CTA */}
        {isLocked && (
          <div
            role="status"
            style={{
              marginTop: 'var(--space-4)',
              backgroundColor: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-14)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                margin: '0 0 4px',
              }}
            >
              Flows are locked until activation
            </p>
            <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-3)' }}>
              Pay the one-time activation fee to turn workflows live. Status is validated server-side.
            </p>
            <button
              onClick={handleActivate}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#0B1020',
                fontWeight: 600,
                fontSize: 'var(--font-size-14)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 24px',
                cursor: 'pointer',
                minHeight: '44px',
                width: '100%',
                transition: 'background-color var(--motion-standard)',
              }}
            >
              Activate System — $1,500
            </button>
            <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-secondary)', margin: 'var(--space-2) 0 0', textAlign: 'center' }}>
              Demo mode — no real payment processed
            </p>
          </div>
        )}

        {/* Active state — KPI proof */}
        {isActive && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {/* KPI card */}
            <div
              style={{
                backgroundColor: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
              }}
            >
              <p style={{ fontSize: 'var(--font-size-12)', fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                System Active
              </p>
              <p style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-primary)', margin: 0 }}>
                3 workflows executing. Median response time now tracked in dashboard.
              </p>
            </div>

            {/* Add-flow upgrade CTA */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p style={{ fontSize: 'var(--font-size-14)', fontWeight: 500, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                  Add another workflow
                </p>
                <p style={{ fontSize: 'var(--font-size-12)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  $249 / month per additional flow
                </p>
              </div>
              <CTAButton href="/pricing" label="View Plans" variant="secondary" size="sm" />
            </div>
          </div>
        )}

        {/* Activating state */}
        {isActivating && (
          <div
            aria-live="polite"
            style={{
              marginTop: 'var(--space-4)',
              textAlign: 'center',
              padding: 'var(--space-4)',
            }}
          >
            <p style={{ fontSize: 'var(--font-size-14)', color: 'var(--color-text-secondary)' }}>
              Confirming activation…
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
