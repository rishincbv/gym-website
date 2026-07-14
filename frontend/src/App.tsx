import { RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '@/routes'
import { queryClient } from '@/lib/query-client'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider'

function AppProviders() {
  useAuthBootstrap()

  return <RouterProvider router={router} />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleAuthProvider>
        <AppProviders />
      </GoogleAuthProvider>
    </QueryClientProvider>
  )
}
