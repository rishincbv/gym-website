import { prisma } from '../config/database.js'

export class LoginHistoryRepository {
  async create(data: {
    userId?: string
    email?: string
    ipAddress?: string
    userAgent?: string
    device?: string
    success: boolean
    failReason?: string
  }) {
    return prisma.loginHistory.create({ data })
  }

  async findRecent(limit = 10) {
    return prisma.loginHistory.findMany({
      where: { success: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    })
  }
}

export const loginHistoryRepository = new LoginHistoryRepository()
