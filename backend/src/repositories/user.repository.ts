import { prisma } from '../config/database.js'
import type { User, Role } from '@prisma/client'

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
  }): Promise<UserWithProfile> {
    return prisma.user.create({
      data: {
        ...data,
        profile: { create: {} },
        settings: { create: {} },
      },
      include: { profile: { select: { avatarUrl: true } } },
    })
  }
}

export const userRepository = new UserRepository()
