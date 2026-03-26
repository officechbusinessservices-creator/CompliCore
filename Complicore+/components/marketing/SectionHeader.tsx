import { cn } from '@/lib/utils'

/**
 * SectionHeader — eyebrow + heading + optional body text.
 *
 * Typography scale from design-tokens.json:
 *   h1 → text-48 | h2 → text-36 | h3 → text-30
 *
 * Responsive scaling (02_DESIGN_SYSTEM.md §Typography scaling):
 *   H1: 48 / 40 / 30  (desktop / tablet / mobile)
 *   H2: 36 / 30 / 24
 */

type HeadingLevel = 'h1' | 'h2' | 'h3'
type Align        = 'left' | 'center'

interface SectionHeaderProps {
  eyebrow?:      string
  heading:       string
  body?:         string
  as?:           HeadingLevel
  align?:        Align
  maxBodyWidth?: string  // e.g. '520px' for tight prose
  className?:    string
}

// Responsive font-size classes — desktop / tablet / mobile via Tailwind breakpoints
const HEADING_CLASSES: Record<HeadingLevel, string> = {
  h1: 'text-30 md:text-36 xl:text-48 font-bold tracking-tight leading-tight',
  h2: 'text-24 md:text-30 xl:text-36 font-bold tracking-tight leading-tight',
  h3: 'text-20 md:text-24 xl:text-30 font-bold tracking-tight',
}

export function SectionHeader({
  eyebrow,
  heading,
  body,
  as: Tag = 'h2',
  align  = 'left',
  maxBodyWidth,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === 'center' && 'text-center mx-auto',
        className
      )}
      style={align === 'center' ? { maxWidth: '720px' } : undefined}
    >
      {eyebrow && (
        <p className="eyebrow mb-2">{eyebrow}</p>
      )}

      <Tag className={cn(HEADING_CLASSES[Tag], 'text-tp', body ? 'mb-3' : '')}>
        {heading}
      </Tag>

      {body && (
        <p
          className="text-18 text-ts leading-relaxed"
          style={maxBodyWidth ? { maxWidth: maxBodyWidth } : undefined}
        >
          {body}
        </p>
      )}
    </div>
  )
}
