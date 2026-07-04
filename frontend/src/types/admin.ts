export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  todaySignups: number
  monthlySignups: number
  revenue: number
  membershipRevenue: number
  totalWorkouts: number
  popularWorkout: {
    id: string
    title: string
    slug: string
    imageUrl: string | null
    completions: number
  } | null
  popularMembership: {
    id: string
    name: string
    slug: string
    price: number
    subscribers: number
  } | null
}

export interface AdminChartPoint {
  month: string
  value: number
}

export interface AdminDistributionPoint {
  label: string
  value: number
}

export interface AdminActivityItem {
  id: string
  action: string
  entity: string
  entityId: string | null
  metadata: unknown
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  } | null
}

export interface AdminLoginItem {
  id: string
  email: string | null
  device: string | null
  ipAddress: string | null
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    avatarUrl: string | null
  } | null
}

export interface AdminRegistrationItem {
  id: string
  email: string
  firstName: string
  lastName: string
  status: string
  avatarUrl: string | null
  createdAt: string
}

export interface AdminDashboardOverview {
  stats: AdminDashboardStats
  charts: {
    signupGrowth: AdminChartPoint[]
    revenueGrowth: AdminChartPoint[]
    workoutActivity: AdminChartPoint[]
    membershipDistribution: AdminDistributionPoint[]
  }
  recentActivities: AdminActivityItem[]
  recentLogins: AdminLoginItem[]
  latestRegistrations: AdminRegistrationItem[]
}
