import bcrypt from 'bcrypt'
import { randomBytes } from 'node:crypto'
import { AuthProvider, UserStatus } from '@prisma/client'
import { AppError } from '../utils/app-error.js'
import { verifyGoogleIdToken, type VerifiedGoogleProfile } from '../lib/google-token.js'
import { userRepository, type UserWithProfile } from '../repositories/user.repository.js'
import { loginHistoryRepository } from '../repositories/login-history.repository.js'
import { auditService } from './audit.service.js'
import { parseDevice } from '../utils/request-meta.js'

export interface GoogleAuthRequestMeta {
  ipAddress?: string
  userAgent?: string
}

const BCRYPT_ROUNDS = 12

/**
 * Google account lookup / creation / linking.
 * Session (JWT + refresh cookie) is still issued by AuthService.
 */
export class GoogleAuthService {
  async verifyAndResolveUser(
    idToken: string,
    meta?: GoogleAuthRequestMeta,
  ): Promise<UserWithProfile> {
    const profile = await verifyGoogleIdToken(idToken)
    return this.findOrCreateUser(profile, meta)
  }

  private async findOrCreateUser(
    profile: VerifiedGoogleProfile,
    meta?: GoogleAuthRequestMeta,
  ): Promise<UserWithProfile> {
    const { googleId, email, firstName, lastName, picture } = profile

    let user =
      (await userRepository.findByGoogleId(googleId)) ??
      (await userRepository.findByEmail(email))

    if (user) {
      await this.assertAccountActive(user, email, meta)

      if (user.googleId && user.googleId !== googleId) {
        throw new AppError(409, 'This email is linked to a different Google account')
      }

      if (!user.googleId) {
        const nextProvider =
          user.provider === AuthProvider.EMAIL || user.provider === AuthProvider.EMAIL_GOOGLE
            ? AuthProvider.EMAIL_GOOGLE
            : AuthProvider.GOOGLE

        await userRepository.linkGoogleAccount(user.id, googleId, nextProvider)
        user = (await userRepository.findById(user.id)) ?? user
      }

      if (picture && !user.profile?.avatarUrl) {
        await userRepository.updateAvatar(user.id, picture)
        user = (await userRepository.findById(user.id)) ?? user
      }

      return user
    }

    const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), BCRYPT_ROUNDS)
    user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      googleId,
      provider: AuthProvider.GOOGLE,
      isVerified: true,
      avatarUrl: picture,
    })

    await auditService.log(
      'user.registered',
      'user',
      {
        userId: user.id,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      },
      user.id,
      { provider: AuthProvider.GOOGLE },
    )

    return user
  }

  private async assertAccountActive(
    user: UserWithProfile,
    email: string,
    meta?: GoogleAuthRequestMeta,
  ): Promise<void> {
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
  }

  private async logFailedLogin(
    userId: string,
    email: string,
    meta: GoogleAuthRequestMeta | undefined,
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
}

export const googleAuthService = new GoogleAuthService()
