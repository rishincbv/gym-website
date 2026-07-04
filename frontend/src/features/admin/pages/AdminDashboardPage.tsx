import { motion } from 'framer-motion'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import { getApiErrorMessage } from '@/api/client'
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard'
import { StatCard } from '@/features/admin/components/StatCard'
import { AdminLineChart } from '@/features/admin/components/AdminLineChart'
import { AdminPieChart } from '@/features/admin/components/AdminPieChart'
import { AdminDashboardSkeleton } from '@/features/admin/components/AdminSkeleton'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatAction(action: string): string {
  return action
    .split('.')
    .map((part) => part.replaceAll('_', ' '))
    .join(' · ')
}

export function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard()

  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="glass-card rounded-2xl border border-error/20 p-8 text-center">
        <p className="mb-4 text-error">
          {isError ? getApiErrorMessage(error) : 'Failed to load dashboard'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl bg-primary-container px-6 py-3 font-semibold text-on-primary-container"
        >
          Retry
        </button>
      </div>
    )
  }

  const { stats, charts, recentActivities, recentLogins, latestRegistrations } = data

  return (
    <div className="space-y-stack-lg">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden rounded-3xl border border-outline-variant/20 p-8"
      >
        <div className="glow-overlay absolute inset-0 opacity-40" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-label-bold tracking-[0.25em] text-primary uppercase">
              Operations Overview
            </p>
            <h2 className="text-headline-lg font-bold text-on-surface">
              Platform performance at a glance
            </h2>
            <p className="text-body-md mt-2 max-w-2xl text-on-surface-variant">
              Real-time metrics across users, memberships, workouts, and revenue.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-secondary-container/30 bg-secondary-container/15 px-4 py-2 text-secondary">
              <span className="text-label-bold font-semibold">
                {stats.todaySignups} signups today
              </span>
            </div>
            <div className="rounded-full border border-primary/30 bg-primary-container/15 px-4 py-2 text-primary">
              <span className="text-label-bold font-semibold">
                {formatCurrency(stats.revenue)} lifetime revenue
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-stack-md sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon="group" delay={0.05} />
        <StatCard
          label="Active Users"
          value={stats.activeUsers}
          icon="verified"
          accent="secondary"
          delay={0.1}
        />
        <StatCard
          label="Inactive Users"
          value={stats.inactiveUsers}
          icon="person_off"
          accent="tertiary"
          delay={0.15}
        />
        <StatCard
          label="Monthly Signups"
          value={stats.monthlySignups}
          icon="person_add"
          trend={`+${stats.todaySignups} today`}
          delay={0.2}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          icon="payments"
          delay={0.25}
        />
        <StatCard
          label="Membership Revenue"
          value={formatCurrency(stats.membershipRevenue)}
          icon="card_membership"
          accent="secondary"
          delay={0.3}
        />
        <StatCard
          label="Workouts Completed"
          value={stats.totalWorkouts}
          icon="fitness_center"
          accent="tertiary"
          delay={0.35}
        />
        <StatCard
          label="Popular Workout"
          value={stats.popularWorkout?.title ?? '—'}
          icon="star"
          trend={
            stats.popularWorkout
              ? `${stats.popularWorkout.completions} completions`
              : undefined
          }
          delay={0.4}
        />
      </section>

      <section className="grid grid-cols-1 gap-stack-lg xl:grid-cols-2">
        <AdminLineChart
          title="User Growth"
          subtitle="Monthly member signups"
          data={charts.signupGrowth}
          color="#b4c5ff"
        />
        <AdminLineChart
          title="Revenue Growth"
          subtitle="Completed payments by month"
          data={charts.revenueGrowth}
          color="#4ae176"
        />
        <AdminLineChart
          title="Workout Activity"
          subtitle="Completed workouts by month"
          data={charts.workoutActivity}
          color="#ffb596"
        />
        <AdminPieChart
          title="Membership Distribution"
          data={charts.membershipDistribution}
        />
      </section>

      <section className="grid grid-cols-1 gap-stack-lg xl:grid-cols-3">
        <div className="glass-card rounded-2xl border border-outline-variant/20 p-5 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-headline-md font-semibold text-on-surface">Recent Activity</h3>
            <MaterialIcon name="history" className="text-outline" />
          </div>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No activity logged yet.</p>
            ) : (
              recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-outline-variant/20 bg-surface-container-high/50 p-3"
                >
                  <p className="text-sm font-semibold text-on-surface">
                    {formatAction(item.action)}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {item.user
                      ? `${item.user.firstName} ${item.user.lastName}`
                      : 'System'}{' '}
                    · {formatDate(item.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-outline-variant/20 p-5 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-headline-md font-semibold text-on-surface">Recent Logins</h3>
            <MaterialIcon name="login" className="text-outline" />
          </div>
          <div className="space-y-3">
            {recentLogins.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-high/50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {item.user
                      ? `${item.user.firstName} ${item.user.lastName}`
                      : item.email}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {item.device ?? 'Unknown device'} · {formatDate(item.createdAt)}
                  </p>
                </div>
                <MaterialIcon name="chevron_right" className="text-outline" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-outline-variant/20 p-5 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-headline-md font-semibold text-on-surface">
              Latest Registrations
            </h3>
            <MaterialIcon name="person_add" className="text-outline" />
          </div>
          <div className="space-y-3">
            {latestRegistrations.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-high/50 p-3"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-container/20 text-sm font-bold text-primary">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-label-sm text-on-surface-variant">
                    {user.email}
                  </p>
                </div>
                <span className="text-label-sm text-outline">{user.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
