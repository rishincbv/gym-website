import type { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { AppError } from '../utils/app-error.js'
import { isStaffRole } from '../constants/roles.js'

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Authentication required'))
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, 'Insufficient permissions'))
      return
    }

    next()
  }
}

export function requireStaff() {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Authentication required'))
      return
    }

    if (!isStaffRole(req.user.role)) {
      next(new AppError(403, 'Admin access required'))
      return
    }

    next()
  }
}
