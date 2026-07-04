import { Role, UserStatus, PaymentStatus } from '@prisma/client'
import { prisma } from '../config/database.js'
import { auditLogRepository } from '../repositories/audit-log.repository.js'
import { loginHistoryRepository } from '../repositories/login-history.repository.js'

function startOfDay(date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date = new Date()): Date {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function monthsAgo(count: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - count)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export class AdminDashboardService {
  async getOverview() {
    const now = new Date()
    const todayStart = startOfDay(now)
    const monthStart = startOfMonth(now)
    const sixMonthsAgo = monthsAgo(5)

    const memberFilter = {
      role: Role.USER,
      deletedAt: null,
    }

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      todaySignups,
      monthlySignups,
      revenueAgg,
      membershipRevenueAgg,
      totalWorkouts,
      popularWorkout,
      popularMembership,
      recentActivities,
      recentLogins,
      latestRegistrations,
      monthlySignupsSeries,
      monthlyRevenueSeries,
      membershipDistribution,
      workoutCompletionsSeries,
    ] = await Promise.all([
      prisma.user.count({ where: memberFilter }),
      prisma.user.count({ where: { ...memberFilter, status: UserStatus.ACTIVE } }),
      prisma.user.count({
        where: {
          ...memberFilter,
          status: { in: [UserStatus.INACTIVE, UserStatus.SUSPENDED, UserStatus.BANNED] },
        },
      }),
      prisma.user.count({
        where: { ...memberFilter, createdAt: { gte: todayStart } },
      }),
      prisma.user.count({
        where: { ...memberFilter, createdAt: { gte: monthStart } },
      }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED, membershipId: { not: null } },
        _sum: { amount: true },
      }),
      prisma.workoutHistory.count(),
      prisma.workoutHistory.groupBy({
        by: ['workoutPlanId'],
        _count: { workoutPlanId: true },
        orderBy: { _count: { workoutPlanId: 'desc' } },
        take: 1,
      }),
      prisma.userMembership.groupBy({
        by: ['planId'],
        _count: { planId: true },
        orderBy: { _count: { planId: 'desc' } },
        take: 1,
      }),
      auditLogRepository.findRecent(12),
      loginHistoryRepository.findRecent(8),
      prisma.user.findMany({
        where: memberFilter,
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          createdAt: true,
          profile: { select: { avatarUrl: true } },
        },
      }),
      prisma.$queryRaw<Array<{ month: Date; count: bigint }>>`
        SELECT date_trunc('month', created_at) AS month, COUNT(*)::bigint AS count
        FROM users
        WHERE role = 'USER' AND deleted_at IS NULL AND created_at >= ${sixMonthsAgo}
        GROUP BY 1
        ORDER BY 1 ASC
      `,
      prisma.$queryRaw<Array<{ month: Date; total: number | null }>>`
        SELECT date_trunc('month', paid_at) AS month, SUM(amount)::float AS total
        FROM payments
        WHERE status = 'COMPLETED' AND paid_at IS NOT NULL AND paid_at >= ${sixMonthsAgo}
        GROUP BY 1
        ORDER BY 1 ASC
      `,
      prisma.userMembership.groupBy({
        by: ['planId'],
        _count: { planId: true },
      }),
      prisma.$queryRaw<Array<{ month: Date; count: bigint }>>`
        SELECT date_trunc('month', completed_at) AS month, COUNT(*)::bigint AS count
        FROM workout_history
        WHERE completed_at >= ${sixMonthsAgo}
        GROUP BY 1
        ORDER BY 1 ASC
      `,
    ])

    const popularWorkoutEntry = popularWorkout[0]
    const popularMembershipEntry = popularMembership[0]

    const popularWorkoutPlan =
      popularWorkoutEntry != null
        ? await prisma.workoutPlan.findUnique({
            where: { id: popularWorkoutEntry.workoutPlanId },
            select: { id: true, title: true, slug: true, imageUrl: true },
          })
        : null

    const popularMembershipPlan =
      popularMembershipEntry != null
        ? await prisma.membershipPlan.findUnique({
            where: { id: popularMembershipEntry.planId },
            select: { id: true, name: true, slug: true, price: true },
          })
        : null

    const planIds = membershipDistribution.map((item) => item.planId)
    const plans =
      planIds.length > 0
        ? await prisma.membershipPlan.findMany({
            where: { id: { in: planIds } },
            select: { id: true, name: true },
          })
        : []
    const planNameById = new Map(plans.map((plan) => [plan.id, plan.name]))

    return {
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        todaySignups,
        monthlySignups,
        revenue: revenueAgg._sum.amount ?? 0,
        membershipRevenue: membershipRevenueAgg._sum.amount ?? 0,
        totalWorkouts,
        popularWorkout: popularWorkoutPlan && popularWorkoutEntry
          ? {
              ...popularWorkoutPlan,
              completions: popularWorkoutEntry._count.workoutPlanId,
            }
          : null,
        popularMembership: popularMembershipPlan && popularMembershipEntry
          ? {
              ...popularMembershipPlan,
              subscribers: popularMembershipEntry._count.planId,
            }
          : null,
      },
      charts: {
        signupGrowth: monthlySignupsSeries.map((row) => ({
          month: row.month.toISOString(),
          value: Number(row.count),
        })),
        revenueGrowth: monthlyRevenueSeries.map((row) => ({
          month: row.month.toISOString(),
          value: row.total ?? 0,
        })),
        workoutActivity: workoutCompletionsSeries.map((row) => ({
          month: row.month.toISOString(),
          value: Number(row.count),
        })),
        membershipDistribution: membershipDistribution.map((row) => ({
          label: planNameById.get(row.planId) ?? 'Unknown',
          value: row._count.planId,
        })),
      },
      recentActivities: recentActivities.map((item) => ({
        id: item.id,
        action: item.action,
        entity: item.entity,
        entityId: item.entityId,
        metadata: item.metadata,
        createdAt: item.createdAt.toISOString(),
        user: item.user
          ? {
              id: item.user.id,
              email: item.user.email,
              firstName: item.user.firstName,
              lastName: item.user.lastName,
              avatarUrl: item.user.profile?.avatarUrl ?? null,
            }
          : null,
      })),
      recentLogins: recentLogins.map((item) => ({
        id: item.id,
        email: item.email,
        device: item.device,
        ipAddress: item.ipAddress,
        createdAt: item.createdAt.toISOString(),
        user: item.user
          ? {
              id: item.user.id,
              email: item.user.email,
              firstName: item.user.firstName,
              lastName: item.user.lastName,
              role: item.user.role,
              avatarUrl: item.user.profile?.avatarUrl ?? null,
            }
          : null,
      })),
      latestRegistrations: latestRegistrations.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        avatarUrl: user.profile?.avatarUrl ?? null,
        createdAt: user.createdAt.toISOString(),
      })),
    }
  }
}

export const adminDashboardService = new AdminDashboardService()
