import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, useAuthStore } from '@/store/auth-store'
import type { ApiResponse, AuthSession } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<(success: boolean) => void> = []

function processRefreshQueue(success: boolean): void {
  refreshQueue.forEach((callback) => callback(success))
  refreshQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password')
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((success) => {
          if (success) {
            resolve(apiClient(originalRequest))
          } else {
            reject(error)
          }
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await apiClient.post<ApiResponse<AuthSession>>('/auth/refresh')
      useAuthStore.getState().setSession(data.data.user, data.data.accessToken)
      processRefreshQueue(true)
      return apiClient(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().logout()
      processRefreshQueue(false)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong'
}
