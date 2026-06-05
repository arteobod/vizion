'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function VizonRmLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  const isLoginPage = pathname === '/mgr-5k9w/login'

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }
    fetch('/api/ctrl-8b2f/auth/verify')
      .then(res => {
        if (!res.ok) {
          router.replace('/mgr-5k9w/login')
        } else {
          setChecking(false)
        }
      })
      .catch(() => router.replace('/mgr-5k9w/login'))
  }, [router, isLoginPage])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-5 h-5 border border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
