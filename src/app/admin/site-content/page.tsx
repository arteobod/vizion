'use client'

import { useEffect, useState, FormEvent } from 'react'
import { SiteContent } from '@/types'

export default function SiteContentPage() {
  const [content, setContent] = useState<SiteContent>({
    contact: { email: '', location: '', responseTime: '' },
    branding: { foundedYear: 2024, tagline: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/site-content')
      .then(r => r.json() as Promise<SiteContent>)
      .then(data => { setContent(data); setLoading(false) })
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
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
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">SITE CONTENT</h1>
        {saved && <span className="font-mono text-xs text-green-400">Saved!</span>}
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <div className="bg-fv-surface border border-fv-border rounded-xl p-6">
          <h2 className="font-mono text-sm font-bold text-fv-text mb-4 tracking-wider">CONTACT INFORMATION</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">EMAIL</label>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">LOCATION</label>
              <input
                type="text"
                value={content.contact.location}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, location: e.target.value } })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">RESPONSE TIME</label>
              <input
                type="text"
                value={content.contact.responseTime}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, responseTime: e.target.value } })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-fv-surface border border-fv-border rounded-xl p-6">
          <h2 className="font-mono text-sm font-bold text-fv-text mb-4 tracking-wider">BRANDING</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">FOUNDED YEAR</label>
              <input
                type="number"
                value={content.branding.foundedYear}
                onChange={(e) => setContent({ ...content, branding: { ...content.branding, foundedYear: parseInt(e.target.value) } })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">TAGLINE</label>
              <textarea
                rows={2}
                value={content.branding.tagline}
                onChange={(e) => setContent({ ...content, branding: { ...content.branding, tagline: e.target.value } })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition resize-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-fv-orange text-white font-mono text-xs font-medium rounded-lg hover:bg-fv-orange-dim transition disabled:opacity-50 tracking-wider"
        >
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  )
}
