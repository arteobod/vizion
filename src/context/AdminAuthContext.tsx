'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthContextType {
  isAuthenticated: boolean
  username: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/ctrl-8b2f/auth/verify')
      if (res.ok) {
        const data = await res.json()
        setIsAuthenticated(true)
        setUsername(data.username)
      } else {
        setIsAuthenticated(false)
        setUsername(null)
      }
    } catch {
      setIsAuthenticated(false)
      setUsername(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/ctrl-8b2f/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (data.success) {
        setIsAuthenticated(true)
        setUsername(username)
        return { success: true }
      }
      return { success: false, error: data.error || 'Login failed' }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    await fetch('/api/ctrl-8b2f/auth/login', { method: 'DELETE' })
    setIsAuthenticated(false)
    setUsername(null)
    router.push('/ctrl-8b2f/login')
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, username, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
