import { Metadata } from 'next'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import AdminShell from '@/components/admin/AdminShell'

export const metadata: Metadata = {
  title: 'Admin Panel - Vizon',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminAuthProvider>
  )
}
