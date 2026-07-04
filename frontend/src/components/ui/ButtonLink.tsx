import { Link } from 'react-router'
import { cn } from '@/lib/utils'

interface ButtonLinkProps {
  to: string
  variant?: 'default' | 'ghost' | 'outline' | 'glass'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children: React.ReactNode
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:brightness-110',
  ghost: 'text-foreground hover:bg-glass',
  outline: 'border border-border bg-transparent hover:bg-glass',
  glass: 'border border-border/60 bg-glass backdrop-blur-md hover:bg-white/10',
} as const

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-6',
  icon: 'size-10',
} as const

export function ButtonLink({
  to,
  variant = 'default',
  size = 'default',
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Link>
  )
}
