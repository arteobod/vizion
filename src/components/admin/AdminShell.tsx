'use client'

import { useAdminAuth } from '@/context/AdminAuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [isLoading, isAuthenticated, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fv-black">
        <div className="w-8 h-8 border-2 border-fv-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-fv-black">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
