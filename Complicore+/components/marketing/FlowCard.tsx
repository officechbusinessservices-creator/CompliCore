interface FlowCardProps {
  title: string
  trigger: string
  outcome: string
  icon: React.ReactNode
}

export function FlowCard({ title, trigger, outcome, icon }: FlowCardProps) {
  return (
    <article
      style={{
        backgroundColor: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        transition: 'transform var(--motion-standard), box-shadow var(--motion-standard)',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(110, 168, 254, 0.1)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: 'var(--font-size-18)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h3>

      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
          <dt
            style={{
              fontSize: 'var(--font-size-12)',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}
          >
            Trigger
          </dt>
          <dd
            style={{
              fontSize: 'var(--font-size-14)',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            {trigger}
          </dd>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
          <dt
            style={{
              fontSize: 'var(--font-size-12)',
              fontWeight: 600,
              color: 'var(--color-success)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}
          >
            Outcome
          </dt>
          <dd
            style={{
              fontSize: 'var(--font-size-14)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {outcome}
          </dd>
        </div>
      </dl>
    </article>
  )
}
