const BEFORE_ITEMS = [
  'Manual inbox delays first response by hours',
  'Follow-up depends on individual memory',
  'Inbound requests misrouted or lost',
  'Leasing momentum dies between touchpoints',
]

const AFTER_ITEMS = [
  'Instant reply to every new inquiry',
  'Automated follow-up on a fixed schedule',
  'Inbound classified and routed immediately',
  'Active workflows maintain leasing speed',
]

export function BeforeAfterComparison() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {/* Before */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-danger)',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: 'var(--font-size-14)',
              fontWeight: 600,
              color: 'var(--color-danger)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Without CompliCore+
          </p>
        </div>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {BEFORE_ITEMS.map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start',
                fontSize: 'var(--font-size-15)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-danger)' }}
              >
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* After */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid rgba(110, 168, 254, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: 'var(--font-size-14)',
              fontWeight: 600,
              color: 'var(--color-success)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            With CompliCore+
          </p>
        </div>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {AFTER_ITEMS.map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start',
                fontSize: 'var(--font-size-15)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.5,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-success)' }}
              >
                <path
                  d="M3 8l3.5 3.5L13 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
