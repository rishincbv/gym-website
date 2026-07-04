import type { Request } from 'express'

export function getClientIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim()
  }
  return req.ip
}

export function getUserAgent(req: Request): string | undefined {
  const agent = req.headers['user-agent']
  return typeof agent === 'string' ? agent : undefined
}

export function parseDevice(userAgent?: string): string | undefined {
  if (!userAgent) return undefined
  if (/mobile/i.test(userAgent)) return 'Mobile'
  if (/tablet|ipad/i.test(userAgent)) return 'Tablet'
  return 'Desktop'
}
