'use client'

import { useState, useEffect, FormEvent, use } from 'react'
import { useRouter } from 'next/navigation'

const LANGS = ['EN', 'RU', 'LV'] as const
type Lang = typeof LANGS[number]

function LangTabs({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1">
      {LANGS.map(l => (
        <button key={l} type="button" onClick={() => setLang(l)}
          className={`px-3 py-1 font-mono text-xs rounded transition tracking-wider ${lang === l ? 'bg-fv-orange text-white' : 'bg-fv-dark border border-fv-border text-fv-text-muted hover:text-fv-text'}`}
        >{l}</button>
      ))}
    </div>
  )
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<Lang>('EN')
  const [form, setForm] = useState({
    title: '', title_ru: '', title_lv: '',
    client: '',
    type: 'WEB APPLICATION', type_ru: '', type_lv: '',
    year: '',
    description: '', description_ru: '', description_lv: '',
    tags: '', image: '', link: '',
  })

  useEffect(() => {
    fetch(`/api/ctrl-8b2f/projects/${id}`)
      .then(r => r.json() as Promise<Record<string, unknown>>)
      .then(data => {
        setForm({
          title: String(data.title || ''),
          title_ru: String(data.title_ru || ''),
          title_lv: String(data.title_lv || ''),
          client: String(data.client || ''),
          type: String(data.type || 'WEB APPLICATION'),
          type_ru: String(data.type_ru || ''),
          type_lv: String(data.type_lv || ''),
          year: String(data.year || ''),
          description: String(data.description || ''),
          description_ru: String(data.description_ru || ''),
          description_lv: String(data.description_lv || ''),
          tags: ((data.tags as string[]) || []).join(', '),
          image: String(data.image || ''),
          link: String(data.link || ''),
        })
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const project = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const res = await fetch(`/api/ctrl-8b2f/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
    if (res.ok) router.push('/ctrl-8b2f/projects')
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-fv-orange border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">EDIT PROJECT</h1>
        <LangTabs lang={lang} setLang={setLang} />
      </div>

      <form onSubmit={handleSubmit} className="bg-fv-surface border border-fv-border rounded-xl p-6 max-w-2xl">
        <div className="space-y-5">

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">
              TITLE {lang !== 'EN' && <span className="text-fv-orange">[{lang}]</span>}
            </label>
            <input type="text" required={lang === 'EN'}
              value={lang === 'RU' ? form.title_ru : lang === 'LV' ? form.title_lv : form.title}
              onChange={e => setForm({ ...form, [lang === 'RU' ? 'title_ru' : lang === 'LV' ? 'title_lv' : 'title']: e.target.value })}
              placeholder={lang !== 'EN' ? form.title : undefined}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
            />
          </div>

          {lang === 'EN' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">CLIENT</label>
                <input type="text" required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
                  className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">YEAR</label>
                <input type="text" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">
              TYPE {lang !== 'EN' && <span className="text-fv-orange">[{lang}]</span>}
            </label>
            {lang === 'EN' ? (
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition appearance-none cursor-pointer"
              >
                <option>WEB APPLICATION</option>
                <option>BUSINESS UTILITY</option>
                <option>FULL SYSTEM</option>
                <option>MOBILE APP</option>
                <option>API SERVICE</option>
              </select>
            ) : (
              <input type="text"
                value={lang === 'RU' ? form.type_ru : form.type_lv}
                onChange={e => setForm({ ...form, [lang === 'RU' ? 'type_ru' : 'type_lv']: e.target.value })}
                placeholder={form.type}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
              />
            )}
          </div>

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">
              DESCRIPTION {lang !== 'EN' && <span className="text-fv-orange">[{lang}]</span>}
            </label>
            <textarea required={lang === 'EN'} rows={3}
              value={lang === 'RU' ? form.description_ru : lang === 'LV' ? form.description_lv : form.description}
              onChange={e => setForm({ ...form, [lang === 'RU' ? 'description_ru' : lang === 'LV' ? 'description_lv' : 'description']: e.target.value })}
              placeholder={lang !== 'EN' ? form.description : undefined}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition resize-none placeholder:text-fv-text-muted"
            />
          </div>

          {lang === 'EN' && (
            <>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">TAGS (comma-separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">IMAGE URL (optional)</label>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">LINK (optional)</label>
                <input type="text" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                  className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button type="button" onClick={() => router.push('/ctrl-8b2f/projects')}
            className="px-4 py-2 font-mono text-xs text-fv-text-dim bg-fv-dark border border-fv-border rounded-lg hover:bg-fv-surface transition tracking-wider"
          >CANCEL</button>
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-fv-orange text-white font-mono text-xs font-medium rounded-lg hover:bg-fv-orange-dim transition disabled:opacity-50 tracking-wider"
          >{saving ? 'SAVING...' : 'UPDATE PROJECT'}</button>
        </div>
      </form>
    </div>
  )
}
