import type { Prisma } from '@prisma/client'
import { auditLogRepository } from '../repositories/audit-log.repository.js'

export interface AuditContext {
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export class AuditService {
  async log(
    action: string,
    entity: string,
    context: AuditContext,
    entityId?: string,
    metadata?: Prisma.InputJsonValue,
  ): Promise<void> {
    await auditLogRepository.create({
      userId: context.userId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    })
  }
}

export const auditService = new AuditService()
