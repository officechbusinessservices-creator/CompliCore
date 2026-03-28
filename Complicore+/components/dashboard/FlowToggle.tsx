'use client'

import { cn } from '@/lib/utils'

/**
 * FlowToggle — accessible on/off switch for flow active/paused state.
 * Spec: 02_DESIGN_SYSTEM.md — status transitions, standard 180ms duration.
 * WCAG 2.2 AA: role="switch", aria-checked, 44px touch target.
 */

interface FlowToggleProps {
  checked:   boolean
  onChange:  (checked: boolean) => void
  disabled?: boolean
  label:     string   // accessible label — describes what is being toggled
  size?:     'sm' | 'md'
}

export function FlowToggle({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
}: FlowToggleProps) {
  const sm = size === 'sm'

  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      aria-label={`${label}: ${checked ? 'active — click to pause' : 'paused — click to activate'}`}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        // Touch target wrapper
        'inline-flex items-center justify-center',
        'min-h-touch min-w-touch -m-2 p-2',   // negative margin offsets visual padding
        'rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        'transition-opacity duration-180',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {/* Track */}
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex flex-shrink-0 rounded-full',
          'transition-colors duration-180',
          sm ? 'h-5 w-9' : 'h-6 w-11',
          checked ? 'bg-primary' : 'bg-line'
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            'absolute top-0.5 inline-block rounded-full bg-white shadow-sm',
            'transition-transform duration-180',
            sm
              ? cn('h-4 w-4', checked ? 'translate-x-4' : 'translate-x-0.5')
              : cn('h-5 w-5', checked ? 'translate-x-5' : 'translate-x-0.5')
          )}
        />
      </span>
    </button>
  )
}
