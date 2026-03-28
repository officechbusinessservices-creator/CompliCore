import { cn } from '@/lib/cn'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        'bg-[#11182D] border border-[#25314F] rounded-2xl',
        className,
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-[#16203A] border border-[#25314F] flex items-center justify-center mb-4">
        <span className="text-xl">&#8709;</span>
      </div>
      <h3 className="text-base font-semibold text-[#F5F7FB] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#8A95B2] max-w-xs">{description}</p>}
      {action && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
