import { cn } from '@/lib/utils'

/**
 * SkeletonLoader — shimmer loading placeholder.
 *
 * Composes Skeleton blocks to represent expected content layout.
 * Animation: shimmer sweep per globals.css animate-shimmer.
 *
 * Usage:
 *   // Single bar
 *   <Skeleton width="60%" height={20} />
 *
 *   // Composite card skeleton
 *   <SkeletonCard />
 *
 *   // KPI strip skeleton
 *   <SkeletonKPIStrip count={3} />
 */

// ── Atom ───────────────────────────────────────────────────────────────────────

interface SkeletonProps {
  width?:    string | number
  height?:   string | number
  rounded?:  'sm' | 'md' | 'full'
  className?: string
}

export function Skeleton({
  width    = '100%',
  height   = 16,
  rounded  = 'sm',
  className,
}: SkeletonProps) {
  const roundedClass = {
    sm:   'rounded-sm',
    md:   'rounded-md',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      aria-hidden="true"
      className={cn('animate-shimmer', roundedClass, className)}
      style={{
        width:  typeof width  === 'number' ? `${width}px`  : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

// ── Card skeleton ──────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  lines?:    number
  className?: string
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading…"
      className={cn('card p-4 flex flex-col gap-3', className)}
    >
      <Skeleton width="40%" height={12} rounded="full" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '65%' : '100%'}
          height={14}
          rounded="full"
        />
      ))}
    </div>
  )
}

// ── KPI strip skeleton ─────────────────────────────────────────────────────────

interface SkeletonKPIStripProps {
  count?:    number
  className?: string
}

export function SkeletonKPIStrip({ count = 3, className }: SkeletonKPIStripProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading metrics…"
      className={cn(
        'grid gap-3',
        className
      )}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 flex flex-col gap-2">
          <Skeleton width="55%"  height={10} rounded="full" />
          <Skeleton width="70%"  height={32} />
          <Skeleton width="40%"  height={10} rounded="full" />
        </div>
      ))}
    </div>
  )
}

// ── List skeleton ──────────────────────────────────────────────────────────────

interface SkeletonListProps {
  rows?:     number
  className?: string
}

export function SkeletonList({ rows = 4, className }: SkeletonListProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading list…"
      className={cn('flex flex-col divide-y divide-line', className)}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton width={36} height={36} rounded="md" className="flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton width="50%"  height={12} rounded="full" />
            <Skeleton width="30%"  height={10} rounded="full" />
          </div>
          <Skeleton width={60} height={24} rounded="full" className="flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
