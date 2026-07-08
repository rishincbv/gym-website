import { Navigate, useParams } from 'react-router'

const legacyAdminPaths: Record<string, string> = {
  login: '/login',
  register: '/register',
  'forgot-password': '/forgot-password',
  'reset-password': '/reset-password',
}

export function LegacyAdminRedirect() {
  const { '*': rest } = useParams()

  if (!rest || rest === '') {
    return <Navigate to="/dashboard" replace />
  }

  if (rest in legacyAdminPaths) {
    return <Navigate to={legacyAdminPaths[rest]} replace />
  }

  return <Navigate to={`/${rest}`} replace />
}
