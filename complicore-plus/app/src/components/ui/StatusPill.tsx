import { cn } from '@/lib/cn'

type Status = 'active' | 'inactive' | 'locked' | 'paused' | 'pending' | 'past_due' | 'error'

interface StatusPillProps {
  status: Status
  className?: string
}

const config: Record<Status, { label: string; classes: string; dot: string }> = {
  active: {
    label: 'Active',
    classes: 'bg-green-500/10 text-green-400 border-green-500/20',
    dot: 'bg-green-400',
  },
  inactive: {
    label: 'Inactive',
    classes: 'bg-[#25314F]/60 text-[#B8C1D9] border-[#25314F]',
    dot: 'bg-[#8A95B2]',
  },
  locked: {
    label: 'Locked',
    classes: 'bg-[#25314F]/60 text-[#8A95B2] border-[#25314F]',
    dot: 'bg-[#8A95B2]',
  },
  paused: {
    label: 'Paused',
    classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    dot: 'bg-yellow-400',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  past_due: {
    label: 'Past Due',
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-400',
  },
  error: {
    label: 'Error',
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-400',
  },
}

export function StatusPill({ status, className }: StatusPillProps) {
  const { label, classes, dot } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border text-xs font-medium px-2.5 py-1 rounded-full',
        classes,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
