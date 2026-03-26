import { cn } from '@/lib/utils'

/**
 * AppShell — page-level content container.
 *
 * Applies site-container (max-w + horizontal padding) and optional
 * section-y (vertical rhythm). Used to wrap the content of marketing pages.
 *
 * Usage:
 *   <AppShell>…</AppShell>
 *   <AppShell section background="surface">…</AppShell>
 */

interface AppShellProps {
  children: React.ReactNode
  /** Also applies section-y vertical padding */
  section?: boolean
  /** Background token shorthand */
  background?: 'canvas' | 'surface' | 'elevated'
  /** HTML id — useful for skip-nav targets */
  id?: string
  className?: string
  as?: 'div' | 'section' | 'article'
}

const BG_MAP: Record<string, string> = {
  canvas:   'bg-canvas',
  surface:  'bg-surface',
  elevated: 'bg-surface-elevated',
}

export function AppShell({
  children,
  section = false,
  background,
  id,
  className,
  as: Tag = 'div',
}: AppShellProps) {
  return (
    <Tag
      id={id}
      className={cn(
        background && BG_MAP[background],
        section && 'section-y',
        className
      )}
    >
      <div className="site-container">{children}</div>
    </Tag>
  )
}
