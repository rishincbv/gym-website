import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { Role } from '@prisma/client'

export interface AccessTokenPayload {
  sub: string
  email: string
  role: Role
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, env.jwtAccessSecret, options)
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload
}

export function getRefreshTokenExpiry(rememberMe = false): Date {
  const duration = rememberMe ? '30d' : env.jwtRefreshExpiresIn
  const match = duration.match(/^(\d+)([dhms])$/)
  if (!match?.[1] || !match[2]) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }

  const value = Number(match[1])
  const unit = match[2]
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  const multiplier = multipliers[unit] ?? 24 * 60 * 60 * 1000
  return new Date(Date.now() + value * multiplier)
}
