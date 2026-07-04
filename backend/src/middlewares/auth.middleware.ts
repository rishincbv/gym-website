import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { AppError } from '../utils/app-error.js'

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'Authentication required'))
    return
  }

  try {
    const token = header.slice(7)
    const payload = verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired access token'))
  }
}
