import { motion } from 'framer-motion'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  trend?: string
  trendUp?: boolean
  accent?: 'primary' | 'secondary' | 'tertiary'
  delay?: number
}

const accentMap = {
  primary: 'text-primary bg-primary-container/15 border-primary/20',
  secondary: 'text-secondary bg-secondary-container/15 border-secondary-container/20',
  tertiary: 'text-tertiary bg-tertiary-container/15 border-tertiary-container/20',
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp = true,
  accent = 'primary',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="glass-card rounded-2xl border border-outline-variant/20 p-5"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={cn('rounded-xl border p-3', accentMap[accent])}>
          <MaterialIcon name={icon} />
        </div>
        {trend && (
          <span
            className={cn(
              'text-label-sm font-semibold',
              trendUp ? 'text-secondary' : 'text-error',
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
      <p className="text-headline-md mt-1 font-bold text-on-surface">{value}</p>
    </motion.div>
  )
}
