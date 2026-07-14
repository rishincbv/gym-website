import { prisma } from '../config/database.js'
import type { AuthProvider, User, Role } from '@prisma/client'

export type UserWithProfile = User & {
  profile: { avatarUrl: string | null } | null
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithProfile | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: { select: { avatarUrl: true } } },
    })
  }

  async findByGoogleId(googleId: string): Promise<UserWithProfile | null> {
    return prisma.user.findUnique({
      where: { googleId },
      include: { profile: { select: { avatarUrl: true } } },
    })
  }

  async findById(id: string): Promise<UserWithProfile | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: { select: { avatarUrl: true } } },
    })
  }

  async create(data: {
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: Role
    googleId?: string
    provider?: AuthProvider
    isVerified?: boolean
    avatarUrl?: string | null
  }): Promise<UserWithProfile> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        googleId: data.googleId,
        provider: data.provider,
        isVerified: data.isVerified,
        profile: { create: { avatarUrl: data.avatarUrl ?? undefined } },
        settings: { create: {} },
      },
      include: { profile: { select: { avatarUrl: true } } },
    })
  }

  async linkGoogleAccount(
    userId: string,
    googleId: string,
    provider: AuthProvider,
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleId,
        provider,
        isVerified: true,
      },
    })
  }

  async updateGoogleId(userId: string, googleId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { googleId, isVerified: true, provider: 'EMAIL_GOOGLE' },
    })
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    await prisma.profile.update({
      where: { userId },
      data: { avatarUrl },
    })
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  }

  async updateRememberMe(userId: string, rememberMe: boolean): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { rememberMe },
    })
  }
}

export const userRepository = new UserRepository()
