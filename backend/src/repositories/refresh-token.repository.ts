import { prisma } from '../config/database.js'

export class RefreshTokenRepository {
  async create(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    })
  }

  async findValid(token: string) {
    return prisma.refreshToken.findFirst({
      where: {
        token,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { profile: { select: { avatarUrl: true } } },
        },
      },
    })
  }

  async revoke(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }
}

export const refreshTokenRepository = new RefreshTokenRepository()
