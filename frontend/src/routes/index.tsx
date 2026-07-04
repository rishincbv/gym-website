import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AdminProtectedRoute } from '@/routes/AdminProtectedRoute'
import { PageLoader } from '@/components/ui/PageLoader'

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
)
const ProgressPage = lazy(() =>
  import('@/pages/dashboard/ProgressPage').then((m) => ({
    default: m.ProgressPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const AdminLoginPage = lazy(() =>
  import('@/features/admin/pages/AdminLoginPage').then((m) => ({
    default: m.AdminLoginPage,
  })),
)
const AdminLayout = lazy(() =>
  import('@/features/admin/layouts/AdminLayout').then((m) => ({
    default: m.AdminLayout,
  })),
)
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
)
const AdminComingSoonPage = lazy(() =>
  import('@/features/admin/pages/AdminComingSoonPage').then((m) => ({
    default: m.AdminComingSoonPage,
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
  'contact',
  'notifications',
  'reports',
  'settings',
  'roles',
] as const

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ index: true, element: withSuspense(<LandingPage />) }],
  },
  { path: 'login', element: withSuspense(<LoginPage />) },
  { path: 'register', element: withSuspense(<RegisterPage />) },
  { path: 'admin/login', element: withSuspense(<AdminLoginPage />) },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: 'admin',
        element: withSuspense(<AdminLayout />),
        children: [
          { index: true, element: withSuspense(<AdminDashboardPage />) },
          ...adminModuleRoutes.map((path) => ({
            path,
            element: withSuspense(<AdminComingSoonPage />),
          })),
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(<DashboardPage />) },
          { path: 'progress', element: withSuspense(<ProgressPage />) },
        ],
      },
    ],
  },
  { path: '404', element: withSuspense(<NotFoundPage />) },
  { path: '*', element: <Navigate to="/404" replace /> },
])
