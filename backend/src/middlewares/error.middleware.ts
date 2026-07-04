import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { logger } from '../config/logger.js'
import { AppError } from '../utils/app-error.js'

function getDatabaseErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    if (error.message.includes('YOUR_PASSWORD') || error.message.includes('authentication failed')) {
      return 'Database password is not configured. Set your real Supabase password in backend/.env (DATABASE_URL and DIRECT_URL), then run: cd backend && npx prisma db push && npm run db:seed'
    }
    if (error.errorCode === 'P1001') {
      return 'Cannot reach Supabase database. Check DATABASE_URL in backend/.env — use the connection string from Supabase Dashboard → Project Settings → Database, then run: cd backend && npx prisma db push && npm run db:seed'
    }
    return 'Database connection failed. Verify backend/.env and run: cd backend && npx prisma db push && npm run db:seed'
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2021' || error.code === 'P2022') {
      return 'Database tables are missing. Run: cd backend && npx prisma db push && npm run db:seed'
    }
    if (error.code === 'P1001') {
      return 'Cannot reach Supabase database. Check DATABASE_URL in backend/.env, then run: cd backend && npx prisma db push && npm run db:seed'
    }
  }

  return 'Database is unavailable. Run: cd backend && npx prisma db push && npm run db:seed'
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten().fieldErrors,
    })
    return
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    logger.error('Database error', { error })
    res.status(503).json({
      success: false,
      message: getDatabaseErrorMessage(error),
    })
    return
  }

  logger.error('Unhandled error', { error })

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
}
