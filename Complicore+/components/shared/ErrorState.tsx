'use client'

import { cn } from '@/lib/utils'

/**
 * ErrorState — surface-level error with optional retry.
 *
 * Follows the spec rule: hard fail on billing inconsistency (never soft).
 * All other errors show this component with a retry affordance.
 */

interface ErrorStateProps {
  heading?:     string
  body?:        string
  /** Called when user clicks retry */
  onRetry?:     () => void
  retryLabel?:  string
  /** Render as critical (billing / auth errors) — no retry */
  critical?:    boolean
  compact?:     boolean
  className?:   string
}

// ── Icon ───────────────────────────────────────────────────────────────────────

function ErrorIcon({ critical }: { critical: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={critical ? 'text-danger' : 'text-warning'}
    >
      <circle
        cx="16" cy="16" r="13"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16 10v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="21.5" r="1.25" fill="currentColor" />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ErrorState({
  heading     = 'Something went wrong',
  body,
  onRetry,
  retryLabel  = 'Try again',
  critical    = false,
  compact     = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'rounded-lg border',
        critical
          ? 'border-danger/30 bg-danger/5'
          : 'border-warning/30 bg-warning/5',
        compact ? 'py-8 px-6' : 'py-16 px-8',
        className
      )}
    >
      <div className="mb-4">
        <ErrorIcon critical={critical} />
      </div>

      <p className="text-16 font-medium text-tp mb-1">
        {heading}
      </p>

      {body && (
        <p className="text-14 text-ts max-w-[320px] leading-relaxed">
          {body}
        </p>
      )}

      {onRetry && !critical && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'mt-5 text-14 font-semibold',
            'min-h-touch px-5 rounded-sm',
            'border border-line text-tp',
            'hover:border-primary hover:text-primary',
            'transition-colors duration-180',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
          )}
        >
          {retryLabel}
        </button>
      )}

      {critical && (
        <p className="mt-4 text-12 text-ts">
          Contact support if this problem persists.
        </p>
      )}
    </div>
  )
}
