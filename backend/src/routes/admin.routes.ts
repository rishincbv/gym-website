import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authenticate } from '../middlewares/auth.middleware.js'
import { requireStaff } from '../middlewares/authorize.middleware.js'
import { requirePermission } from '../middlewares/permission.middleware.js'
import { asyncHandler } from '../utils/async-handler.js'
import { adminDashboardController } from '../controllers/admin-dashboard.controller.js'

export const adminRoutes = Router()

adminRoutes.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

adminRoutes.use(authenticate, requireStaff())

adminRoutes.get(
  '/dashboard/overview',
  requirePermission('dashboard.read'),
  asyncHandler(adminDashboardController),
)
