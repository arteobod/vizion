'use client'

import { useEffect, useState } from 'react'
import { Service } from '@/types'

const LANGS = ['EN', 'RU', 'LV'] as const
type Lang = typeof LANGS[number]

function LangTabs({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 mb-4">
      {LANGS.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 font-mono text-xs rounded transition tracking-wider ${
            lang === l
              ? 'bg-fv-orange text-white'
              : 'bg-fv-dark border border-fv-border text-fv-text-muted hover:text-fv-text'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lang, setLang] = useState<Lang>('EN')

  useEffect(() => {
    fetch('/api/ctrl-8b2f/services')
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
    await fetch('/api/ctrl-8b2f/services', {
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
      <div className="flex items-center justify-between mb-4">
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

      <LangTabs lang={lang} setLang={setLang} />

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
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">
                  TITLE {lang !== 'EN' && <span className="text-fv-orange">[{lang}]</span>}
                </label>
                <input
                  type="text"
                  value={lang === 'RU' ? (service.title_ru ?? '') : lang === 'LV' ? (service.title_lv ?? '') : service.title}
                  onChange={(e) => updateService(index, lang === 'RU' ? 'title_ru' : lang === 'LV' ? 'title_lv' : 'title', e.target.value)}
                  placeholder={lang !== 'EN' ? service.title : undefined}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
                />
              </div>
              {lang === 'EN' && (
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
              )}
            </div>

            <div className="mt-4">
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">
                DESCRIPTION {lang !== 'EN' && <span className="text-fv-orange">[{lang}]</span>}
              </label>
              <textarea
                rows={2}
                value={lang === 'RU' ? (service.description_ru ?? '') : lang === 'LV' ? (service.description_lv ?? '') : service.description}
                onChange={(e) => updateService(index, lang === 'RU' ? 'description_ru' : lang === 'LV' ? 'description_lv' : 'description', e.target.value)}
                placeholder={lang !== 'EN' ? service.description : undefined}
                className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition resize-none placeholder:text-fv-text-muted"
              />
            </div>

            {lang === 'EN' && (
              <div className="mt-4">
                <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">TAGS (comma-separated)</label>
                <input
                  type="text"
                  value={service.tags.join(', ')}
                  onChange={(e) => updateService(index, 'tags', e.target.value)}
                  className="w-full px-3 py-2 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
