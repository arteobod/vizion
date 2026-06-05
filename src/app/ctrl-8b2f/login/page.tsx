'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fv-black">
        <div className="w-8 h-8 border-2 border-fv-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    router.replace('/ctrl-8b2f')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    if (result.success) {
      router.push('/ctrl-8b2f')
    } else {
      setError(result.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fv-black px-4">
      <div className="w-full max-w-sm">
        <div className="bg-fv-surface border border-fv-border rounded-xl p-8">
          <div className="mb-8">
            <h1 className="font-mono text-xl font-bold text-fv-text">VIZON</h1>
            <p className="font-mono text-xs text-fv-text-muted mt-1 tracking-wider">ADMIN PANEL</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="font-mono text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-fv-orange text-white font-mono text-sm font-medium rounded-lg hover:bg-fv-orange-dim transition disabled:opacity-50 tracking-wider"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
