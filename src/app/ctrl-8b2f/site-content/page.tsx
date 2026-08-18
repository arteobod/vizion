'use client'

import { useEffect, useState, FormEvent } from 'react'
import { SiteContent } from '@/types'
import { phoneList } from '@/lib/site-content'

export default function SiteContentPage() {
  const [content, setContent] = useState<SiteContent>({
    contact: { email: '', phones: [''], location: '', responseTime: '' },
    branding: { foundedYear: 2026, tagline: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/ctrl-8b2f/site-content')
      .then(r => r.json() as Promise<SiteContent>)
      .then(data => {
        // Normalise the legacy single `phone` into the array the editor works
        // with, so an entry written before `phones` existed still loads.
        const phones = phoneList(data.contact)
        setContent({
          ...data,
          contact: { ...data.contact, phones: phones.length ? phones : [''] },
        })
        setLoading(false)
      })
  }, [])

  const setPhone = (index: number, value: string) => {
    const phones = [...(content.contact.phones ?? [])]
    phones[index] = value
    setContent({ ...content, contact: { ...content.contact, phones } })
  }

  const addPhone = () =>
    setContent({
      ...content,
      contact: { ...content.contact, phones: [...(content.contact.phones ?? []), ''] },
    })

  const removePhone = (index: number) =>
    setContent({
      ...content,
      contact: {
        ...content.contact,
        phones: (content.contact.phones ?? []).filter((_, i) => i !== index),
      },
    })

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Drop blank rows and the legacy field on the way out, so the saved entry is
    // the array shape only and an empty row never becomes a dead tel: link.
    const { phone: _legacy, ...contact } = content.contact
    const payload: SiteContent = {
      ...content,
      contact: {
        ...contact,
        phones: (content.contact.phones ?? []).map(p => p.trim()).filter(Boolean),
      },
    }
    await fetch('/api/ctrl-8b2f/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
              <label className="block font-mono text-xs text-fv-text-dim mb-1 tracking-wider">
                PHONE NUMBERS
              </label>
              <p className="font-mono text-[0.6875rem] text-fv-text-muted mb-2">
                Shown in this order on the site. Blank rows are dropped on save.
              </p>
              <div className="space-y-2">
                {(content.contact.phones ?? []).map((phone, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(i, e.target.value)}
                      placeholder="+371 …"
                      className="flex-1 px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                    />
                    <button
                      type="button"
                      onClick={() => removePhone(i)}
                      aria-label={`Remove phone ${i + 1}`}
                      className="px-3 border border-fv-border rounded-lg font-mono text-xs text-fv-text-dim hover:text-fv-orange hover:border-fv-orange transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPhone}
                className="mt-2 px-3 py-2 border border-fv-border rounded-lg font-mono text-xs text-fv-text-dim hover:text-fv-orange hover:border-fv-orange transition tracking-wider"
              >
                + ADD NUMBER
              </button>
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
