import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  eyebrow?: string
  heading: string
  subheading?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  heading,
  subheading,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && (
        <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl font-bold text-[#F5F7FB] leading-tight">{heading}</h2>
      {subheading && (
        <p className="mt-4 text-lg text-[#B8C1D9] max-w-2xl mx-auto leading-relaxed">
          {subheading}
        </p>
      )}
    </div>
  )
}
