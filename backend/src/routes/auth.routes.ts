import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { validateBody } from '../middlewares/validate.middleware.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, googleLoginSchema } from '../validators/auth.validator.js'
import { asyncHandler } from '../utils/async-handler.js'
import {
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  googleLoginController,
} from '../controllers/auth.controller.js'

export const authRoutes = Router()

authRoutes.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

authRoutes.post('/register', validateBody(registerSchema), asyncHandler(registerController))
authRoutes.post('/login', validateBody(loginSchema), asyncHandler(loginController))
authRoutes.post('/google', validateBody(googleLoginSchema), asyncHandler(googleLoginController))
authRoutes.post('/refresh', asyncHandler(refreshController))
authRoutes.post('/logout', asyncHandler(logoutController))
authRoutes.post('/forgot-password', validateBody(forgotPasswordSchema), asyncHandler(forgotPasswordController))
authRoutes.post('/reset-password', validateBody(resetPasswordSchema), asyncHandler(resetPasswordController))
authRoutes.get('/me', authenticate, asyncHandler(meController))
