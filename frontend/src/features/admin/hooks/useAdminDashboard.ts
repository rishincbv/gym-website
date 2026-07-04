import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: () => adminApi.getDashboardOverview(),
    staleTime: 30_000,
  })
}
