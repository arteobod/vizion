'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    client: '',
    type: 'WEB APPLICATION',
    year: new Date().getFullYear().toString(),
    description: '',
    tags: '',
    image: '',
    link: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const project = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })

    if (res.ok) {
      router.push('/admin/projects')
    }
    setSaving(false)
  }

  return (
    <div>
      <h1 className="font-mono text-xl font-bold text-fv-text mb-6 tracking-wider">ADD PROJECT</h1>

      <form onSubmit={handleSubmit} className="bg-fv-surface border border-fv-border rounded-xl p-6 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">TITLE</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
              placeholder="LOGISTICS PLATFORM"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">CLIENT</label>
              <input
                type="text"
                required
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">YEAR</label>
              <input
                type="text"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">TYPE</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition appearance-none cursor-pointer"
            >
              <option value="WEB APPLICATION">WEB APPLICATION</option>
              <option value="BUSINESS UTILITY">BUSINESS UTILITY</option>
              <option value="FULL SYSTEM">FULL SYSTEM</option>
              <option value="MOBILE APP">MOBILE APP</option>
              <option value="API SERVICE">API SERVICE</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">DESCRIPTION</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition resize-none placeholder:text-fv-text-muted"
              placeholder="Project description..."
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">TAGS (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
              placeholder="NEXT.JS, REACT, POSTGRES"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">IMAGE URL (optional)</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
              placeholder="/uploads/project.jpg"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-fv-text-dim mb-2 tracking-wider">LINK (optional)</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-sm text-fv-text outline-none focus:ring-1 focus:ring-fv-orange focus:border-fv-orange transition placeholder:text-fv-text-muted"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-4 py-2 font-mono text-xs text-fv-text-dim bg-fv-dark border border-fv-border rounded-lg hover:bg-fv-surface transition tracking-wider"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-fv-orange text-white font-mono text-xs font-medium rounded-lg hover:bg-fv-orange-dim transition disabled:opacity-50 tracking-wider"
          >
            {saving ? 'SAVING...' : 'SAVE PROJECT'}
          </button>
        </div>
      </form>
    </div>
  )
}
