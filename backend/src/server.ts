import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { prisma } from './config/database.js'

const app = createApp()

async function startServer(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL ?? ''
  if (databaseUrl.includes('YOUR_PASSWORD')) {
    logger.warn(
      'DATABASE_URL still contains YOUR_PASSWORD — login and all DB features will fail until you set your Supabase database password in backend/.env',
    )
  }

  try {
    await prisma.$connect()
    logger.info('Database connected')
  } catch (error) {
    if (env.nodeEnv === 'development') {
      logger.warn('Database unavailable — API will start without DB', { error })
    } else {
      logger.error('Failed to connect to database', { error })
      process.exit(1)
    }
  }

  app.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`)
  })
}

void startServer()
