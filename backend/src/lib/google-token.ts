import { OAuth2Client, type TokenPayload } from 'google-auth-library'
import { env } from '../config/env.js'
import { AppError } from '../utils/app-error.js'
import { logger } from '../config/logger.js'

const ALLOWED_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com'])

export interface VerifiedGoogleProfile {
  googleId: string
  email: string
  firstName: string
  lastName: string
  picture: string | null
  emailVerified: boolean
}

let oauthClient: OAuth2Client | null = null

function getClient(): OAuth2Client {
  if (!env.googleClientId) {
    throw new AppError(503, 'Google login is not configured on the server')
  }

  if (!oauthClient) {
    oauthClient = new OAuth2Client(env.googleClientId)
  }

  return oauthClient
}

function parseName(payload: TokenPayload, email: string): { firstName: string; lastName: string } {
  const given = payload.given_name?.trim()
  const family = payload.family_name?.trim()
  if (given || family) {
    return {
      firstName: given || email.split('@')[0] || 'Member',
      lastName: family || 'Member',
    }
  }

  const fullName = payload.name?.trim() ?? ''
  const parts = fullName.split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || email.split('@')[0] || 'Member',
    lastName: parts.slice(1).join(' ') || 'Member',
  }
}

/**
 * Verifies a Google ID token (audience, issuer, expiry, signature).
 * Never trust client-provided profile claims without this check.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleProfile> {
  if (!idToken?.trim()) {
    throw new AppError(400, 'Google ID token is required')
  }

  try {
    const client = getClient()
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw new AppError(401, 'Invalid Google ID token')
    }

    if (!payload.iss || !ALLOWED_ISSUERS.has(payload.iss)) {
      throw new AppError(401, 'Invalid Google token issuer')
    }

    if (!payload.sub) {
      throw new AppError(401, 'Invalid Google token subject')
    }

    if (!payload.email) {
      throw new AppError(401, 'Google account did not provide an email address')
    }

    if (payload.email_verified !== true) {
      throw new AppError(401, 'Google email address is not verified')
    }

    const email = payload.email.toLowerCase()
    const { firstName, lastName } = parseName(payload, email)

    return {
      googleId: payload.sub,
      email,
      firstName,
      lastName,
      picture: typeof payload.picture === 'string' ? payload.picture : null,
      emailVerified: true,
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    logger.warn('Google ID token verification failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw new AppError(401, 'Invalid or expired Google ID token')
  }
}
