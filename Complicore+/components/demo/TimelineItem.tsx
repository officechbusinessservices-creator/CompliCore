export type TimelineItemStatus = 'pending' | 'running' | 'complete' | 'locked'

export interface TimelineItemProps {
  step: number
  label: string
  detail?: string
  status: TimelineItemStatus
  isLast?: boolean
}

const STATUS_CONFIG: Record<
  TimelineItemStatus,
  { dotColor: string; dotBg: string; labelColor: string }
> = {
  pending: {
    dotColor: 'var(--color-border)',
    dotBg: 'transparent',
    labelColor: 'var(--color-text-secondary)',
  },
  running: {
    dotColor: 'var(--color-primary)',
    dotBg: 'rgba(110,168,254,0.15)',
    labelColor: 'var(--color-text-primary)',
  },
  complete: {
    dotColor: 'var(--color-success)',
    dotBg: 'rgba(34,197,94,0.12)',
    labelColor: 'var(--color-text-primary)',
  },
  locked: {
    dotColor: 'var(--color-border)',
    dotBg: 'transparent',
    labelColor: 'var(--color-text-secondary)',
  },
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <rect x="1.5" y="4" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3 4V3a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5.5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpinnerDot() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        animation: 'pulse 1.2s ease-in-out infinite',
      }}
    />
  )
}

export function TimelineItem({ step, label, detail, status, isLast }: TimelineItemProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        position: 'relative',
      }}
      aria-label={`Step ${step}: ${label} — ${status}`}
    >
      {/* Connector line */}
      {!isLast && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '15px',
            top: '28px',
            bottom: 0,
            width: '1px',
            backgroundColor: 'var(--color-border)',
          }}
        />
      )}

      {/* Dot */}
      <div
        aria-hidden="true"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: config.dotBg,
          border: `1px solid ${config.dotColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: config.dotColor,
          transition: 'background-color var(--motion-standard), border-color var(--motion-standard)',
          zIndex: 1,
          position: 'relative',
        }}
      >
        {status === 'complete' ? (
          <CheckIcon />
        ) : status === 'locked' ? (
          <LockIcon />
        ) : status === 'running' ? (
          <SpinnerDot />
        ) : (
          <span style={{ fontSize: '10px', fontWeight: 600, color: config.dotColor }}>
            {step}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          paddingBottom: isLast ? 0 : 'var(--space-3)',
          flex: 1,
          paddingTop: '6px',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-14)',
            fontWeight: 500,
            color: config.labelColor,
            margin: '0 0 2px',
            transition: 'color var(--motion-standard)',
          }}
        >
          {label}
        </p>
        {detail && (
          <p
            style={{
              fontSize: 'var(--font-size-12)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {detail}
          </p>
        )}
      </div>
    </div>
  )
}
