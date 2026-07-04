import type { Request, Response } from 'express'
import { adminDashboardService } from '../services/admin-dashboard.service.js'

export async function adminDashboardController(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await adminDashboardService.getOverview()
  res.json({
    success: true,
    message: 'Admin dashboard overview fetched',
    data,
  })
}
