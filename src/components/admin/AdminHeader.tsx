'use client'

import Link from 'next/link'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminHeader() {
  const { username, logout } = useAdminAuth()

  return (
    <header className="h-14 bg-fv-surface border-b border-fv-border flex items-center justify-end px-6 gap-4">
      <Link
        href="/mgr-5k9w"
        className="font-mono text-xs text-fv-text-muted hover:text-[#f97316] transition-colors tracking-wider"
      >
        ← VIZON_RM
      </Link>
      <span className="text-fv-border">|</span>
      <span className="font-mono text-xs text-fv-text-dim tracking-wider">
        {username?.toUpperCase()}
      </span>
      <button
        onClick={logout}
        className="font-mono text-xs text-fv-text-muted hover:text-red-400 transition-colors tracking-wider"
      >
        LOGOUT
      </button>
    </header>
  )
}
