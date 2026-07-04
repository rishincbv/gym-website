import type { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { prisma } from '../config/database.js'
import { AppError } from '../utils/app-error.js'
import type { PermissionKey } from '../constants/permissions.js'

export function requirePermission(permissionKey: PermissionKey) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      next(new AppError(401, 'Authentication required'))
      return
    }

    if (req.user.role === Role.SUPER_ADMIN) {
      next()
      return
    }

    const permission = await prisma.permission.findUnique({
      where: { key: permissionKey },
      select: {
        rolePermissions: {
          where: { role: req.user.role },
          select: { id: true },
        },
      },
    })

    if (!permission || permission.rolePermissions.length === 0) {
      next(new AppError(403, `Missing permission: ${permissionKey}`))
      return
    }

    next()
  }
}
