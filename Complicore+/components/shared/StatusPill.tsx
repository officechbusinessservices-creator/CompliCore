import { cn } from '@/lib/utils'

/**
 * StatusPill — compact status badge.
 *
 * Used for: flow status, subscription status, flow-run status.
 * Colour semantics map directly to design-token status colours.
 *
 * Variants mirror the flow_status and subscription_status DB enums.
 */

export type PillVariant =
  | 'active'
  | 'inactive'
  | 'paused'
  | 'error'
  | 'pending'
  | 'locked'
  | 'past_due'
  | 'cancelled'
  | 'running'
  | 'complete'

interface StatusPillProps {
  variant: PillVariant
  label?:  string   // overrides default label
  dot?:    boolean  // show animated dot for live states
  size?:   'sm' | 'md'
}

// ── Config ─────────────────────────────────────────────────────────────────────

type PillConfig = {
  bg:    string
  text:  string
  label: string
  live:  boolean   // animate dot
}

const CONFIG: Record<PillVariant, PillConfig> = {
  active:    { bg: 'bg-success/10',  text: 'text-success', label: 'Active',    live: true  },
  running:   { bg: 'bg-success/10',  text: 'text-success', label: 'Running',   live: true  },
  complete:  { bg: 'bg-success/10',  text: 'text-success', label: 'Complete',  live: false },
  pending:   { bg: 'bg-warning/10',  text: 'text-warning', label: 'Pending',   live: true  },
  past_due:  { bg: 'bg-danger/10',   text: 'text-danger',  label: 'Past Due',  live: false },
  error:     { bg: 'bg-danger/10',   text: 'text-danger',  label: 'Error',     live: false },
  cancelled: { bg: 'bg-ts/10',       text: 'text-ts',      label: 'Cancelled', live: false },
  inactive:  { bg: 'bg-line/40',     text: 'text-ts',      label: 'Inactive',  live: false },
  paused:    { bg: 'bg-warning/10',  text: 'text-warning', label: 'Paused',    live: false },
  locked:    { bg: 'bg-line/40',     text: 'text-ts',      label: 'Locked',    live: false },
}

// ── Component ──────────────────────────────────────────────────────────────────

export function StatusPill({
  variant,
  label,
  dot    = true,
  size   = 'md',
}: StatusPillProps) {
  const config = CONFIG[variant]
  const showDot = dot && config.live

  return (
    <span
      role="status"
      aria-label={label ?? config.label}
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide rounded-full',
        config.bg,
        config.text,
        size === 'sm' ? 'text-12 px-2 py-0.5' : 'text-12 px-3 py-1'
      )}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={cn(
            'block rounded-full flex-shrink-0',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5',
            'bg-current animate-pulse-dot'
          )}
        />
      )}
      {label ?? config.label}
    </span>
  )
}
