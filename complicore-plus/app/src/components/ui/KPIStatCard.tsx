import { cn } from '@/lib/cn'

interface KPIStatCardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function KPIStatCard({
  label,
  value,
  subtext,
  trend,
  trendValue,
  className,
}: KPIStatCardProps) {
  const trendColor =
    trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-[#8A95B2]'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'

  return (
    <div
      className={cn(
        'bg-[#11182D] border border-[#25314F] rounded-2xl p-6 shadow-card',
        className,
      )}
    >
      <p className="text-sm font-medium text-[#8A95B2] mb-3">{label}</p>
      <p className="text-4xl font-bold text-[#F5F7FB] tabular-nums leading-none">{value}</p>
      {(subtext || trendValue) && (
        <div className="flex items-center gap-2 mt-3">
          {trendValue && (
            <span className={cn('text-sm font-medium', trendColor)}>
              {trendIcon} {trendValue}
            </span>
          )}
          {subtext && <span className="text-sm text-[#8A95B2]">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
