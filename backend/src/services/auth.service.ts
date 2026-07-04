import bcrypt from 'bcrypt'
import { UserStatus, type Role } from '@prisma/client'
import { AppError } from '../utils/app-error.js'
import { generateRefreshToken, toPublicUser } from '../utils/auth.js'
import { signAccessToken, getRefreshTokenExpiry } from '../utils/jwt.js'
import { userRepository } from '../repositories/user.repository.js'
import { refreshTokenRepository } from '../repositories/refresh-token.repository.js'
import { loginHistoryRepository } from '../repositories/login-history.repository.js'
import { auditService } from './audit.service.js'
import { parseDevice } from '../utils/request-meta.js'

const BCRYPT_ROUNDS = 12

export interface AuthRequestMeta {
  ipAddress?: string
  userAgent?: string
}

export class AuthService {
  async register(
    input: {
      email: string
      password: string
      firstName: string
      lastName: string
    },
    meta?: AuthRequestMeta,
  ) {
    const existing = await userRepository.findByEmail(input.email.toLowerCase())
    if (existing) {
      throw new AppError(409, 'Email is already registered')
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)
    const user = await userRepository.create({
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    })

    await auditService.log('user.registered', 'user', {
      userId: user.id,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    }, user.id)

    return this.issueSession(user, false)
  }

  async login(
    input: { email: string; password: string; rememberMe?: boolean },
    meta?: AuthRequestMeta,
  ) {
    const email = input.email.toLowerCase()
    const user = await userRepository.findByEmail(email)

    if (!user) {
      await loginHistoryRepository.create({
        email,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        device: parseDevice(meta?.userAgent),
        success: false,
        failReason: 'invalid_credentials',
      })
      throw new AppError(401, 'Invalid email or password')
    }

    if (user.status === UserStatus.SUSPENDED) {
      await this.logFailedLogin(user.id, email, meta, 'account_suspended')
      throw new AppError(403, 'Your account has been suspended')
    }

    if (user.status === UserStatus.BANNED) {
      await this.logFailedLogin(user.id, email, meta, 'account_banned')
      throw new AppError(403, 'Your account has been banned')
    }

    if (user.status === UserStatus.INACTIVE) {
      await this.logFailedLogin(user.id, email, meta, 'account_inactive')
      throw new AppError(403, 'Your account is inactive')
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) {
      await this.logFailedLogin(user.id, email, meta, 'invalid_credentials')
      throw new AppError(401, 'Invalid email or password')
    }

    await loginHistoryRepository.create({
      userId: user.id,
      email,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
      device: parseDevice(meta?.userAgent),
      success: true,
    })

    await auditService.log('user.login', 'user', {
      userId: user.id,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    }, user.id, { rememberMe: Boolean(input.rememberMe) })

    return this.issueSession(user, Boolean(input.rememberMe))
  }

  async refresh(refreshToken: string, meta?: AuthRequestMeta) {
    const record = await refreshTokenRepository.findValid(refreshToken)
    if (!record) {
      throw new AppError(401, 'Invalid or expired refresh token')
    }

    if (record.user.status !== UserStatus.ACTIVE) {
      await refreshTokenRepository.revoke(refreshToken)
      throw new AppError(403, 'Account is not active')
    }

    await refreshTokenRepository.revoke(refreshToken)

    await auditService.log('user.token_refreshed', 'session', {
      userId: record.user.id,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    }, record.user.id)

    return this.issueSession(record.user, record.user.rememberMe)
  }

  async logout(refreshToken?: string, meta?: AuthRequestMeta): Promise<void> {
    if (refreshToken) {
      const record = await refreshTokenRepository.findValid(refreshToken)
      await refreshTokenRepository.revoke(refreshToken)

      if (record?.user.id) {
        await auditService.log('user.logout', 'session', {
          userId: record.user.id,
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        }, record.user.id)
      }
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError(404, 'User not found')
    }
    return toPublicUser(user)
  }

  private async logFailedLogin(
    userId: string,
    email: string,
    meta: AuthRequestMeta | undefined,
    failReason: string,
  ): Promise<void> {
    await loginHistoryRepository.create({
      userId,
      email,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
      device: parseDevice(meta?.userAgent),
      success: false,
      failReason,
    })
  }

  private async issueSession(
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      status?: UserStatus
      rememberMe?: boolean
      profile?: { avatarUrl: string | null } | null
    },
    rememberMe: boolean,
  ) {
    const refreshToken = generateRefreshToken()
    const expiresAt = getRefreshTokenExpiry(rememberMe)

    await refreshTokenRepository.create(user.id, refreshToken, expiresAt)

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    })

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
      rememberMe,
    }
  }
}

export const authService = new AuthService()
