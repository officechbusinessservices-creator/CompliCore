import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

/**
 * CTAButton — primary interactive element.
 *
 * Variants: primary | secondary | ghost
 * Sizes: sm | md | lg
 *
 * Implemented as a Next.js <Link> to support client-side routing with
 * correct <a> semantics. All colours use design tokens from tailwind.config.ts.
 *
 * Arrow animation: shifts right 4px on hover per motion spec.
 */

type Variant = 'primary' | 'secondary' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface CTAButtonProps {
  href: string
  label: string
  variant?: Variant
  size?: Size
  arrow?: boolean
  external?: boolean
  className?: string
  style?: CSSProperties
}

// ── Variant classes ────────────────────────────────────────────────────────────

const VARIANT_BASE: Record<Variant, string> = {
  primary:   'bg-primary hover:bg-primary-hover text-canvas font-semibold',
  secondary: 'bg-transparent border border-line text-tp hover:border-primary hover:text-primary font-semibold',
  ghost:     'bg-transparent text-primary hover:text-primary-hover font-medium',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'text-14 px-3 h-9 min-h-9',
  md: 'text-14 px-5 min-h-touch',
  lg: 'text-16 px-7 min-h-[52px]',
}

// ── Arrow icon ─────────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0 transition-transform duration-160 group-hover:translate-x-1"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CTAButton({
  href,
  label,
  variant = 'primary',
  size    = 'md',
  arrow   = false,
  external = false,
  className,
  style,
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={cn(
        // Base
        'group inline-flex items-center gap-2',
        'rounded-sm transition-colors duration-180',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        'whitespace-nowrap',
        // Variant
        VARIANT_BASE[variant],
        // Size
        SIZE_CLASSES[size],
        className
      )}
      style={style}
    >
      {label}
      {arrow && <ArrowIcon />}
    </Link>
  )
}
