import type { Request, Response } from 'express'
import { prisma } from '../config/database.js'

export async function healthController(_req: Request, res: Response): Promise<void> {
  let database: 'connected' | 'unavailable' = 'connected'
  let databaseMessage: string | undefined

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    database = 'unavailable'
    const message = error instanceof Error ? error.message : 'Unknown database error'
    if (message.includes('YOUR_PASSWORD')) {
      databaseMessage =
        'Replace YOUR_PASSWORD in backend/.env with your Supabase database password'
    } else if (message.includes("Can't reach database server")) {
      databaseMessage =
        'Cannot reach Supabase — copy the connection string from Supabase Dashboard → Database'
    } else {
      databaseMessage = 'Database connection failed — run: npx prisma db push && npm run db:seed'
    }
  }

  res.json({
    success: database === 'connected',
    message: database === 'connected' ? 'Gym API is running' : 'Gym API is running but database is unavailable',
    database,
    databaseMessage,
    timestamp: new Date().toISOString(),
  })
}
