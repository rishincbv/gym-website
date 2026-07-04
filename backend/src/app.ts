import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { requestLogger } from './middlewares/request-logger.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { healthRoutes } from './routes/health.routes.js'
import { authRoutes } from './routes/auth.routes.js'
import { adminRoutes } from './routes/admin.routes.js'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)

  app.use(helmet())
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  )
  app.use(compression())
  app.use(cookieParser())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(requestLogger)

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )

  app.use('/api', healthRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/admin', adminRoutes)

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
  })

  app.use(errorHandler)

  return app
}
