import type { User } from '@/types/user'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[] | undefined>
}

export interface AuthSession {
  user: User
  accessToken: string
}
