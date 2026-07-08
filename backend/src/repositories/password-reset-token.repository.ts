import { prisma } from '../config/database.js'

export class PasswordResetTokenRepository {
  async create(userId: string, token: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    })
  }

  async findValid(token: string) {
    return prisma.passwordResetToken.findFirst({
      where: {
        token,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { profile: { select: { avatarUrl: true } } },
        },
      },
    })
  }

  async markUsed(token: string): Promise<void> {
    await prisma.passwordResetToken.updateMany({
      where: { token },
      data: { usedAt: new Date() },
    })
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    })
  }
}

export const passwordResetTokenRepository = new PasswordResetTokenRepository()
