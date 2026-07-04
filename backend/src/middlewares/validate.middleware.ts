import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { AppError } from '../utils/app-error.js'

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      next(
        new AppError(400, 'Validation failed', result.error.flatten().fieldErrors),
      )
      return
    }
    req.body = result.data
    next()
  }
}
