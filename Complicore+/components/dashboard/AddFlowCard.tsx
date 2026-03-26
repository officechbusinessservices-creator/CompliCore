import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * AddFlowCard — upgrade prompt to add an additional flow.
 *
 * Rendered below FlowList on /dashboard/flows.
 * Spec: revenue model — $249/additional flow/month.
 * No synthetic billing state: routes to /dashboard/billing for upgrade.
 */

export function AddFlowCard() {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center gap-5',
        'px-5 py-5 rounded-lg',
        'border border-dashed border-line',
        'bg-surface/50'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-surface-elevated border border-line flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="text-primary">
          <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Copy */}
      <div className="flex-1 min-w-0">
        <p className="text-14 font-semibold text-tp leading-snug">Add another flow</p>
        <p className="text-13 text-ts mt-0.5 leading-relaxed">
          Automate review responses, content workflows, or admin routing.
          Additional flows are <span className="text-tp font-medium">$249/month</span>.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/billing"
        className={cn(
          'flex-shrink-0 inline-flex items-center justify-center',
          'text-14 font-semibold',
          'min-h-touch px-5 rounded-sm',
          'border border-line text-tp',
          'hover:border-primary hover:text-primary',
          'transition-colors duration-180',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
        )}
      >
        View billing
      </Link>
    </div>
  )
}
