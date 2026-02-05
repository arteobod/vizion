'use client'

import { useEffect, useState } from 'react'
import { Stat } from '@/types'

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json() as Promise<Stat[]>)
      .then(data => { setStats(data); setLoading(false) })
  }, [])

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const updated = [...stats]
    updated[index] = { ...updated[index], [field]: value }
    setStats(updated)
  }

  const addStat = () => {
    setStats([...stats, {
      id: `stat-${Date.now()}`,
      value: '0',
      label: 'NEW STAT',
      sublabel: 'Description',
    }])
  }

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-fv-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">STATS</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="font-mono text-xs text-green-400">Saved!</span>}
          <button
            onClick={addStat}
            className="px-4 py-2 font-mono text-xs text-fv-text-dim bg-fv-dark border border-fv-border rounded-lg hover:bg-fv-surface transition tracking-wider"
          >
            + ADD
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-fv-orange text-white font-mono text-xs font-medium rounded-lg hover:bg-fv-orange-dim transition disabled:opacity-50 tracking-wider"
          >
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-fv-surface border border-fv-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs text-fv-text-muted">#{stat.id}</span>
              <button
                onClick={() => removeStat(index)}
                className="font-mono text-xs text-red-500 hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">VALUE</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">LABEL</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">SUBLABEL</label>
                <input
                  type="text"
                  value={stat.sublabel}
                  onChange={(e) => updateStat(index, 'sublabel', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
