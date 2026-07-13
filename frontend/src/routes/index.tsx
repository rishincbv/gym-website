import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthenticatedLayout } from '@/layouts/AuthenticatedLayout'
import { UserLayout } from '@/layouts/UserLayout'
import { AdminLayout } from '@/features/admin/layouts/AdminLayout'
import {
  PublicRoute,
  GuestRoute,
  ProtectedRoute,
  RoleProtectedRoute,
} from '@/routes/guards'
import { LegacyAdminRedirect } from '@/routes/LegacyAdminRedirect'
import { STAFF_ROLES, MEMBER_ROLES } from '@/lib/roles'
import { PageLoader } from '@/components/ui/PageLoader'

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const AuthCallbackPage = lazy(() =>
  import('@/pages/auth/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProgressPage = lazy(() =>
  import('@/pages/dashboard/ProgressPage').then((m) => ({ default: m.ProgressPage })),
)
const ComingSoonPage = lazy(() =>
  import('@/pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
)

function withSuspense(element: React.ReactNode): React.ReactNode {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

const adminModuleRoutes = [
  'users',
  'memberships',
  'workouts',
  'nutrition',
  'trainers',
  'gallery',
  'testimonials',
  'notifications',
  'reports',
  'settings',
  'roles',
] as const

const userModuleRoutes = ['workouts', 'nutrition', 'membership', 'settings'] as const

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: withSuspense(<LandingPage />) },
          {
            path: 'about',
            element: withSuspense(<ComingSoonPage audience="user" />),
          },
          {
            path: 'pricing',
            element: withSuspense(<ComingSoonPage audience="user" />),
          },
          {
            path: 'contact',
            element: withSuspense(<ComingSoonPage audience="user" />),
          },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'auth/callback', element: withSuspense(<AuthCallbackPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      { path: 'forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path: 'reset-password', element: withSuspense(<ResetPasswordPage />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            element: <RoleProtectedRoute roles={STAFF_ROLES} />,
            children: [
              {
                element: withSuspense(<AdminLayout />),
                children: [
                  { path: 'dashboard', element: withSuspense(<AdminDashboardPage />) },
                  ...adminModuleRoutes.map((path) => ({
                    path,
                    element: withSuspense(<ComingSoonPage audience="admin" />),
                  })),
                ],
              },
            ],
          },
          {
            element: <RoleProtectedRoute roles={MEMBER_ROLES} />,
            children: [
              {
                element: <UserLayout />,
                children: [
                  { path: 'profile', element: withSuspense(<DashboardPage />) },
                  { path: 'progress', element: withSuspense(<ProgressPage />) },
                  ...userModuleRoutes.map((path) => ({
                    path,
                    element: withSuspense(<ComingSoonPage audience="user" />),
                  })),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: 'admin', element: <LegacyAdminRedirect /> },
  { path: 'admin/*', element: <LegacyAdminRedirect /> },
  { path: '404', element: withSuspense(<NotFoundPage />) },
  { path: '*', element: <Navigate to="/404" replace /> },
])
