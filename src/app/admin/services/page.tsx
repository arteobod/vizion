'use client'

import { useEffect, useState } from 'react'
import { Service } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/services')
      .then(r => r.json() as Promise<Service[]>)
      .then(data => { setServices(data); setLoading(false) })
  }, [])

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services]
    if (field === 'tags') {
      updated[index] = { ...updated[index], tags: value.split(',').map(t => t.trim()) }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setServices(updated)
  }

  const addService = () => {
    const newId = String(services.length + 1).padStart(2, '0')
    setServices([...services, {
      id: newId,
      title: 'NEW SERVICE',
      description: '',
      tags: [],
      metric: '0',
      metricLabel: 'METRIC',
    }])
  }

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(services),
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
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">SERVICES</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="font-mono text-xs text-green-400">Saved!</span>}
          <button
            onClick={addService}
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

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="bg-fv-surface border border-fv-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs text-fv-text-muted">#{service.id}</span>
              <button
                onClick={() => removeService(index)}
                className="font-mono text-xs text-red-500 hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">TITLE</label>
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => updateService(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">METRIC</label>
                  <input
                    type="text"
                    value={service.metric}
                    onChange={(e) => updateService(index, 'metric', e.target.value)}
                    className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">METRIC LABEL</label>
                  <input
                    type="text"
                    value={service.metricLabel}
                    onChange={(e) => updateService(index, 'metricLabel', e.target.value)}
                    className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">DESCRIPTION</label>
              <textarea
                rows={2}
                value={service.description}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">TAGS (comma-separated)</label>
              <input
                type="text"
                value={service.tags.join(', ')}
                onChange={(e) => updateService(index, 'tags', e.target.value)}
                className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
