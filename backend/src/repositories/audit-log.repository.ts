import { prisma } from '../config/database.js'
import type { Prisma } from '@prisma/client'

export class AuditLogRepository {
  async create(data: {
    userId?: string
    action: string
    entity: string
    entityId?: string
    metadata?: Prisma.InputJsonValue
    ipAddress?: string
    userAgent?: string
  }) {
    return prisma.auditLog.create({ data })
  }

  async findRecent(limit = 15) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    })
  }
}

export const auditLogRepository = new AuditLogRepository()
