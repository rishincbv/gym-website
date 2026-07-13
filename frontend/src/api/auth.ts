import { apiClient } from '@/api/client'
import type { ApiResponse, AuthSession } from '@/types/api'
import type { User } from '@/types/user'
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput, GoogleLoginInput } from '@/types/auth'

export const authApi = {
  async login(payload: LoginInput): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>(
      '/auth/login',
      payload,
    )
    return data.data
  },

  async loginWithGoogle(accessToken: string): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>(
      '/auth/google',
      { accessToken } satisfies GoogleLoginInput,
    )
    return data.data
  },

  async register(payload: RegisterInput): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>(
      '/auth/register',
      payload,
    )
    return data.data
  },

  async refresh(): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>('/auth/refresh')
    return data.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
    return data.data.user
  },

  async forgotPassword(email: string): Promise<string> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email } satisfies ForgotPasswordInput,
    )
    return data.message
  },

  async resetPassword(payload: ResetPasswordInput): Promise<void> {
    await apiClient.post('/auth/reset-password', payload)
  },
}
