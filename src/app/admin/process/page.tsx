'use client'

import { useEffect, useState } from 'react'
import { ProcessStep } from '@/types'

export default function ProcessPage() {
  const [steps, setSteps] = useState<ProcessStep[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/process')
      .then(r => r.json())
      .then(data => { setSteps(data); setLoading(false) })
  }, [])

  const updateStep = (index: number, field: string, value: string) => {
    const updated = [...steps]
    if (field === 'deliverables') {
      updated[index] = { ...updated[index], deliverables: value.split(',').map(d => d.trim()) }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setSteps(updated)
  }

  const addStep = () => {
    const phase = String(steps.length + 1).padStart(2, '0')
    setSteps([...steps, {
      id: `step-${phase}`,
      phase,
      title: 'NEW PHASE',
      duration: '1 WEEK',
      description: '',
      deliverables: [],
    }])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/process', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(steps),
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
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">PROCESS</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="font-mono text-xs text-green-400">Saved!</span>}
          <button
            onClick={addStep}
            className="px-4 py-2 font-mono text-xs text-fv-text-dim bg-fv-dark border border-fv-border rounded-lg hover:bg-fv-surface transition tracking-wider"
          >
            + ADD PHASE
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
        {steps.map((step, index) => (
          <div key={index} className="bg-fv-surface border border-fv-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-2xl font-bold text-fv-border">{step.phase}</span>
              <button
                onClick={() => removeStep(index)}
                className="font-mono text-xs text-red-500 hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">PHASE</label>
                <input
                  type="text"
                  value={step.phase}
                  onChange={(e) => updateStep(index, 'phase', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">TITLE</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">DURATION</label>
                <input
                  type="text"
                  value={step.duration}
                  onChange={(e) => updateStep(index, 'duration', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">DESCRIPTION</label>
              <textarea
                rows={2}
                value={step.description}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
                className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">DELIVERABLES (comma-separated)</label>
              <input
                type="text"
                value={step.deliverables.join(', ')}
                onChange={(e) => updateStep(index, 'deliverables', e.target.value)}
                className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
