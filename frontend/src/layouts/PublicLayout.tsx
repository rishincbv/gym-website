import { Outlet } from 'react-router'
import { motion } from 'framer-motion'
import { EliteNavbar } from '@/components/layout/EliteNavbar'
import { EliteFooter } from '@/components/layout/EliteFooter'

export function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      <EliteNavbar />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>
      <EliteFooter />
    </div>
  )
}
