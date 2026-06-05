'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function VizonRmLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/ctrl-8b2f/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push('/mgr-5k9w')
      } else {
        setError(data.error || 'Access denied')
      }
    } catch {
      setError('Network error')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border border-[#f97316]/40 mb-4">
            <span className="font-mono text-[#f97316] font-bold text-lg">V</span>
          </div>
          <h1 className="font-mono text-lg font-bold text-white tracking-[0.2em]">VIZON_RM</h1>
          <p className="font-mono text-xs text-neutral-600 mt-1 tracking-widest">RESTRICTED ACCESS</p>
        </div>

        <div className="border border-neutral-800 bg-neutral-950 p-8">
          {error && (
            <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/5">
              <p className="font-mono text-xs text-red-400 tracking-wider">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-neutral-500 mb-2 tracking-widest">
                USERNAME
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-neutral-800 font-mono text-sm text-white outline-none focus:border-[#f97316] transition-colors placeholder:text-neutral-700"
                placeholder="—"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-neutral-500 mb-2 tracking-widest">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-neutral-800 font-mono text-sm text-white outline-none focus:border-[#f97316] transition-colors placeholder:text-neutral-700"
                placeholder="—"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#f97316] font-mono text-xs font-bold text-white tracking-widest hover:bg-[#ea580c] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'VERIFYING...' : 'ENTER'}
            </button>
          </form>
        </div>

        <p className="font-mono text-xs text-neutral-800 text-center mt-6 tracking-widest">
          VIZON © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
