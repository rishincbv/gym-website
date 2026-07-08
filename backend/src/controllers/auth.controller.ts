import type { Request, Response } from 'express'
import { env } from '../config/env.js'
import { authService } from '../services/auth.service.js'
import { AppError } from '../utils/app-error.js'
import { getClientIp, getUserAgent } from '../utils/request-meta.js'

const REFRESH_COOKIE = 'refreshToken'

function setRefreshCookie(res: Response, token: string, rememberMe?: boolean): void {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge,
  })
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' })
}

function getRequestMeta(req: Request) {
  return {
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
  }
}

export async function registerController(req: Request, res: Response): Promise<void> {
  const session = await authService.register(req.body, getRequestMeta(req))
  setRefreshCookie(res, session.refreshToken, session.rememberMe)
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: session.user,
      accessToken: session.accessToken,
    },
  })
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const session = await authService.login(req.body, getRequestMeta(req))
  setRefreshCookie(res, session.refreshToken, session.rememberMe)
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: session.user,
      accessToken: session.accessToken,
    },
  })
}

export async function refreshController(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies[REFRESH_COOKIE] as string | undefined
  if (!refreshToken) {
    throw new AppError(401, 'Refresh token not found')
  }

  const session = await authService.refresh(refreshToken, getRequestMeta(req))
  setRefreshCookie(res, session.refreshToken, session.rememberMe)
  res.json({
    success: true,
    message: 'Token refreshed',
    data: {
      user: session.user,
      accessToken: session.accessToken,
    },
  })
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies[REFRESH_COOKIE] as string | undefined
  await authService.logout(refreshToken, getRequestMeta(req))
  clearRefreshCookie(res)
  res.json({ success: true, message: 'Logged out successfully' })
}

export async function meController(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }

  const user = await authService.getMe(req.user.id)
  res.json({
    success: true,
    message: 'Profile fetched',
    data: { user },
  })
}

export async function forgotPasswordController(req: Request, res: Response): Promise<void> {
  const message = await authService.forgotPassword(req.body.email, getRequestMeta(req))
  res.json({
    success: true,
    message,
  })
}

export async function resetPasswordController(req: Request, res: Response): Promise<void> {
  await authService.resetPassword(req.body, getRequestMeta(req))
  res.json({
    success: true,
    message: 'Password reset successful',
  })
}
