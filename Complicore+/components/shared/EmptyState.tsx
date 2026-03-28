import { cn } from '@/lib/utils'

/**
 * EmptyState — zero-content placeholder.
 *
 * Used in: LeadInboxList, FlowList, InvoiceTable when data is empty.
 * Design: minimal, no decorative illustration per spec ("Avoid decorative
 * graphics that do not support product proof").
 */

interface EmptyStateProps {
  icon?:        React.ReactNode
  heading:      string
  body?:        string
  action?:      React.ReactNode
  /** Constrain height */
  compact?:     boolean
  className?:   string
}

// ── Default icon ───────────────────────────────────────────────────────────────

function DefaultIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="text-ts"
    >
      <rect x="4" y="8"  width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 13h24"   stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 18h4"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 22h8"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  heading,
  body,
  action,
  compact  = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'rounded-lg border border-line border-dashed',
        compact ? 'py-8 px-6' : 'py-16 px-8',
        className
      )}
    >
      <div className="mb-4 opacity-50">
        {icon ?? <DefaultIcon />}
      </div>

      <p className="text-16 font-medium text-tp mb-1">
        {heading}
      </p>

      {body && (
        <p className="text-14 text-ts max-w-[280px] leading-relaxed mb-5">
          {body}
        </p>
      )}

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
