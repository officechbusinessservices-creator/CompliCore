'use client'

import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-[#0B1020] font-semibold hover:bg-brand-hover active:bg-brand-active shadow-sm',
  secondary:
    'bg-[#16203A] text-[#F5F7FB] font-medium border border-[#25314F] hover:border-[#33426A] hover:bg-[#1c2a47]',
  ghost:
    'bg-transparent text-[#B8C1D9] font-medium hover:text-[#F5F7FB] hover:bg-[#16203A]',
  danger:
    'bg-red-500/10 text-red-400 font-medium border border-red-500/20 hover:bg-red-500/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-xl',
  md: 'h-11 px-6 text-base rounded-xl',
  lg: 'h-12 px-8 text-base rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-[180ms] cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
