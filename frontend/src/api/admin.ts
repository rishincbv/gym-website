import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { AdminDashboardOverview } from '@/types/admin'

export const adminApi = {
  async getDashboardOverview(): Promise<AdminDashboardOverview> {
    const { data } = await apiClient.get<ApiResponse<AdminDashboardOverview>>(
      '/admin/dashboard/overview',
    )
    return data.data
  },
}
