'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CrmClient } from '@/types'

const STATUS_OPTIONS = ['НЕТ', 'В работе', 'Завершено', 'Отказ'] as const
const STATUS_COLORS: Record<string, string> = {
  'НЕТ': 'text-neutral-500',
  'В работе': 'text-blue-400',
  'Завершено': 'text-green-400',
  'Отказ': 'text-red-400',
}

const EMPTY_FORM: Omit<CrmClient, 'id' | 'createdAt'> = {
  company: '',
  website: '',
  phone: '',
  task: '',
  budget: 0,
  status: 'НЕТ',
  profit: 0,
  notes: '',
}

export default function VizonRmPage() {
  const router = useRouter()
  const [clients, setClients] = useState<CrmClient[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<CrmClient, 'id' | 'createdAt'>>(EMPTY_FORM)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<Omit<CrmClient, 'id' | 'createdAt'>>(EMPTY_FORM)
  const [aiText, setAiText] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const editRowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    try {
      const res = await fetch('/api/mgr-5k9w/clients')
      if (!res.ok) { router.replace('/mgr-5k9w/login'); return }
      const data = await res.json()
      setClients(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  // Stats
  const totalClients = clients.length
  const successfulDeals = clients.filter(c => c.status === 'Завершено').length
  const totalProfit = clients.reduce((sum, c) => sum + (c.profit || 0), 0)
  const conversion = totalClients > 0 ? Math.round((successfulDeals / totalClients) * 100) : 0

  // Inline edit
  function startEdit(client: CrmClient) {
    setEditingId(client.id)
    setEditForm({
      company: client.company,
      website: client.website,
      phone: client.phone,
      task: client.task,
      budget: client.budget,
      status: client.status,
      profit: client.profit,
      notes: client.notes,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  async function saveEdit(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/mgr-5k9w/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        const updated = await res.json()
        setClients(prev => prev.map(c => c.id === id ? updated : c))
        setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteClient(id: string) {
    if (!confirm('Удалить клиента?')) return
    await fetch(`/api/mgr-5k9w/clients/${id}`, { method: 'DELETE' })
    setClients(prev => prev.filter(c => c.id !== id))
  }

  async function addClient() {
    setSaving(true)
    try {
      const res = await fetch('/api/mgr-5k9w/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      if (res.ok) {
        const newClient = await res.json()
        setClients(prev => [newClient, ...prev])
        setShowAddModal(false)
        setAddForm(EMPTY_FORM)
      }
    } finally {
      setSaving(false)
    }
  }

  async function clearAll() {
    await fetch('/api/mgr-5k9w/clients', { method: 'DELETE' })
    setClients([])
    setConfirmClear(false)
  }

  function exportCsv() {
    const headers = ['ID', 'Компания', 'Сайт', 'Телефон', 'Задача', 'Бюджет', 'Статус', 'Прибыль', 'Заметки', 'Дата']
    const rows = clients.map(c => [
      c.id, c.company, c.website, c.phone, c.task,
      c.budget, c.status, c.profit, c.notes, c.createdAt
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crm-clients-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function parseAiText() {
    // Try to extract fields from free text
    const form = { ...EMPTY_FORM }
    const lines = aiText.split('\n')
    for (const line of lines) {
      const lower = line.toLowerCase()
      if (lower.includes('компания') || lower.includes('company') || lower.includes('клиент')) {
        form.company = line.split(/[:—\-]/)[1]?.trim() || form.company
      } else if (lower.includes('сайт') || lower.includes('website') || lower.includes('http')) {
        const match = line.match(/https?:\/\/\S+/)
        if (match) form.website = match[0]
        else form.website = line.split(/[:—\-]/)[1]?.trim() || form.website
      } else if (lower.includes('телефон') || lower.includes('phone') || lower.includes('+')) {
        const match = line.match(/[\+\d][\d\s\-\(\)]{6,}/)
        if (match) form.phone = match[0].trim()
      } else if (lower.includes('задача') || lower.includes('task') || lower.includes('проект')) {
        form.task = line.split(/[:—\-]/)[1]?.trim() || form.task
      } else if (lower.includes('бюджет') || lower.includes('budget')) {
        const match = line.match(/\d[\d\s]*/)
        if (match) form.budget = parseInt(match[0].replace(/\s/g, ''))
      } else if (lower.includes('прибыль') || lower.includes('profit')) {
        const match = line.match(/\d[\d\s]*/)
        if (match) form.profit = parseInt(match[0].replace(/\s/g, ''))
      } else if (lower.includes('статус') || lower.includes('status')) {
        for (const s of STATUS_OPTIONS) {
          if (line.includes(s)) { form.status = s; break }
        }
      }
    }
    setAddForm(form)
    setAiResult('Данные извлечены. Проверьте и нажмите "Добавить".')
    setShowAddModal(true)
  }

  const handleLogout = async () => {
    await fetch('/api/ctrl-8b2f/auth/login', { method: 'DELETE' })
    router.push('/mgr-5k9w/login')
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">

      {/* Top bar */}
      <header className="border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-[#f97316]/40 flex items-center justify-center">
              <span className="text-[#f97316] font-bold text-sm">V</span>
            </div>
            <div>
              <span className="text-white font-bold tracking-[0.15em] text-sm">VIZON_RM</span>
              <span className="ml-3 text-neutral-600 text-xs tracking-widest">CRM PANEL</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="/ctrl-8b2f" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors tracking-widest">
              ADMIN →
            </a>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-neutral-500 tracking-widest">ONLINE</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-neutral-600 hover:text-[#f97316] transition-colors tracking-widest"
            >
              LOGOUT →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'ВСЕГО КЛИЕНТОВ', value: totalClients, sub: 'В базе' },
            { label: 'УСПЕШНЫХ СДЕЛОК', value: successfulDeals, sub: 'Завершено' },
            { label: 'ОБЩАЯ ПРИБЫЛЬ', value: `$${totalProfit.toLocaleString()}`, sub: 'USD' },
            { label: 'КОНВЕРСИЯ', value: `${conversion}%`, sub: 'Закрытых сделок' },
          ].map(s => (
            <div key={s.label} className="border border-neutral-900 bg-neutral-950 p-5">
              <p className="text-xs text-neutral-600 tracking-widest mb-3">{s.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs text-neutral-700">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* AI quick-fill */}
        <div className="border border-neutral-900 bg-neutral-950">
          <div className="px-6 py-4 border-b border-neutral-900 flex items-center gap-3">
            <span className="text-xs text-[#f97316] tracking-widest">AI АНАЛИЗ</span>
            <span className="text-xs text-neutral-700">— вставьте текст с данными клиента</span>
          </div>
          <div className="p-6 space-y-4">
            <textarea
              value={aiText}
              onChange={e => { setAiText(e.target.value); setAiResult('') }}
              placeholder={"Компания: Acme\nСайт: https://acme.com\nТелефон: +371 20 123456\nЗадача: Разработка сайта\nБюджет: 3000\nПрибыль: 1200\nСтатус: В работе"}
              rows={5}
              className="w-full bg-black border border-neutral-800 text-xs text-neutral-300 p-4 outline-none focus:border-[#f97316] transition-colors resize-none placeholder:text-neutral-800"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={parseAiText}
                disabled={!aiText.trim()}
                className="px-5 py-2 bg-[#f97316] text-xs font-bold tracking-widest hover:bg-[#ea580c] transition-colors disabled:opacity-40"
              >
                АНАЛИЗИРОВАТЬ →
              </button>
              {aiResult && <span className="text-xs text-green-400">{aiResult}</span>}
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="border border-neutral-900 bg-neutral-950">
          <div className="px-6 py-4 border-b border-neutral-900 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-neutral-400 tracking-widest">КЛИЕНТЫ</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setAddForm(EMPTY_FORM); setShowAddModal(true) }}
                className="px-4 py-2 border border-[#f97316]/40 text-xs text-[#f97316] hover:bg-[#f97316]/10 transition-colors tracking-widest"
              >
                + ДОБАВИТЬ
              </button>
              <button
                onClick={exportCsv}
                disabled={clients.length === 0}
                className="px-4 py-2 border border-neutral-800 text-xs text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 transition-colors tracking-widest disabled:opacity-40"
              >
                ЭКСПОРТ CSV
              </button>
              <button
                onClick={() => setConfirmClear(true)}
                disabled={clients.length === 0}
                className="px-4 py-2 border border-neutral-800 text-xs text-neutral-600 hover:border-red-500/40 hover:text-red-400 transition-colors tracking-widest disabled:opacity-40"
              >
                ОЧИСТИТЬ
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-5 h-5 border border-[#f97316] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-neutral-800 text-xs tracking-widest">НЕТ КЛИЕНТОВ</p>
              <p className="text-neutral-900 text-xs mt-2">Добавьте первого клиента нажав "+ ДОБАВИТЬ"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-neutral-900">
                    {['КЛИЕНТ / КОНТАКТЫ', 'ЗАДАЧА', 'БЮДЖЕТ', 'СТАТУС', 'ПРИБЫЛЬ', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-neutral-700 tracking-widest font-normal whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    editingId === client.id ? (
                      <tr key={client.id} ref={editRowRef} className="border-b border-[#f97316]/20 bg-[#f97316]/5">
                        <td className="px-4 py-3 space-y-1">
                          <input
                            className="w-full bg-black border border-neutral-700 px-2 py-1 text-white outline-none focus:border-[#f97316]"
                            placeholder="Компания"
                            value={editForm.company}
                            onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))}
                          />
                          <input
                            className="w-full bg-black border border-neutral-700 px-2 py-1 text-neutral-400 outline-none focus:border-[#f97316]"
                            placeholder="Сайт"
                            value={editForm.website}
                            onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))}
                          />
                          <input
                            className="w-full bg-black border border-neutral-700 px-2 py-1 text-neutral-400 outline-none focus:border-[#f97316]"
                            placeholder="Телефон"
                            value={editForm.phone}
                            onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            className="w-full bg-black border border-neutral-700 px-2 py-1 text-white outline-none focus:border-[#f97316] resize-none"
                            rows={3}
                            placeholder="Задача проекта"
                            value={editForm.task}
                            onChange={e => setEditForm(f => ({ ...f, task: e.target.value }))}
                          />
                          <textarea
                            className="w-full mt-1 bg-black border border-neutral-700 px-2 py-1 text-neutral-500 outline-none focus:border-[#f97316] resize-none"
                            rows={2}
                            placeholder="Заметки"
                            value={editForm.notes}
                            onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="w-24 bg-black border border-neutral-700 px-2 py-1 text-white outline-none focus:border-[#f97316]"
                            value={editForm.budget}
                            onChange={e => setEditForm(f => ({ ...f, budget: Number(e.target.value) }))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="bg-black border border-neutral-700 px-2 py-1 text-white outline-none focus:border-[#f97316]"
                            value={editForm.status}
                            onChange={e => setEditForm(f => ({ ...f, status: e.target.value as CrmClient['status'] }))}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="w-24 bg-black border border-neutral-700 px-2 py-1 text-white outline-none focus:border-[#f97316]"
                            value={editForm.profit}
                            onChange={e => setEditForm(f => ({ ...f, profit: Number(e.target.value) }))}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => saveEdit(client.id)}
                            disabled={saving}
                            className="text-green-400 hover:text-green-300 mr-3 tracking-widest disabled:opacity-50"
                          >
                            {saving ? '...' : 'СОХРАНИТЬ'}
                          </button>
                          <button onClick={cancelEdit} className="text-neutral-600 hover:text-neutral-400 tracking-widest">
                            ОТМЕНА
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={client.id} className="border-b border-neutral-900/60 hover:bg-neutral-900/30 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="text-white font-bold">{client.company || '—'}</p>
                          {client.website && (
                            <a href={client.website} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-[#f97316] transition-colors">
                              {client.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                          {client.phone && <p className="text-neutral-600">{client.phone}</p>}
                        </td>
                        <td className="px-4 py-3 max-w-[220px]">
                          <p className="text-neutral-300 line-clamp-2">{client.task || '—'}</p>
                          {client.notes && <p className="text-neutral-700 mt-1 line-clamp-1">{client.notes}</p>}
                        </td>
                        <td className="px-4 py-3 text-neutral-300">
                          {client.budget ? `$${client.budget.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${STATUS_COLORS[client.status] || 'text-neutral-500'} tracking-widest`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-neutral-300">
                          {client.profit ? `$${client.profit.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(client)}
                            className="text-neutral-500 hover:text-[#f97316] mr-3 transition-colors tracking-widest"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => deleteClient(client.id)}
                            className="text-neutral-700 hover:text-red-400 transition-colors tracking-widest"
                          >
                            DEL
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add client modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg border border-neutral-800 bg-neutral-950">
            <div className="px-6 py-4 border-b border-neutral-900 flex items-center justify-between">
              <span className="text-xs text-neutral-400 tracking-widest">НОВЫЙ КЛИЕНТ</span>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-700 hover:text-white text-lg leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'КОМПАНИЯ', key: 'company', type: 'text' },
                { label: 'САЙТ', key: 'website', type: 'text' },
                { label: 'ТЕЛЕФОН', key: 'phone', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs text-neutral-600 mb-1 tracking-widest">{label}</label>
                  <input
                    type={type}
                    value={String(addForm[key as keyof typeof addForm])}
                    onChange={e => setAddForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-black border border-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-neutral-600 mb-1 tracking-widest">ЗАДАЧА ПРОЕКТА</label>
                <textarea
                  rows={3}
                  value={addForm.task}
                  onChange={e => setAddForm(f => ({ ...f, task: e.target.value }))}
                  className="w-full bg-black border border-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-[#f97316] transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1 tracking-widest">БЮДЖЕТ ($)</label>
                  <input
                    type="number"
                    value={addForm.budget}
                    onChange={e => setAddForm(f => ({ ...f, budget: Number(e.target.value) }))}
                    className="w-full bg-black border border-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1 tracking-widest">ПРИБЫЛЬ ($)</label>
                  <input
                    type="number"
                    value={addForm.profit}
                    onChange={e => setAddForm(f => ({ ...f, profit: Number(e.target.value) }))}
                    className="w-full bg-black border border-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1 tracking-widest">СТАТУС</label>
                <select
                  value={addForm.status}
                  onChange={e => setAddForm(f => ({ ...f, status: e.target.value as CrmClient['status'] }))}
                  className="w-full bg-black border border-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-[#f97316] transition-colors"
                >
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1 tracking-widest">ЗАМЕТКИ</label>
                <textarea
                  rows={2}
                  value={addForm.notes}
                  onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-black border border-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-[#f97316] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={addClient}
                  disabled={saving || !addForm.company.trim()}
                  className="flex-1 py-3 bg-[#f97316] text-xs font-bold tracking-widest hover:bg-[#ea580c] transition-colors disabled:opacity-50"
                >
                  {saving ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-neutral-800 text-xs text-neutral-600 hover:text-neutral-400 tracking-widest transition-colors"
                >
                  ОТМЕНА
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm clear modal */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-sm border border-red-500/30 bg-neutral-950 p-8 text-center">
            <p className="text-xs text-red-400 tracking-widest mb-2">ПОДТВЕРДИТЬ УДАЛЕНИЕ</p>
            <p className="text-xs text-neutral-600 mb-8">Удалить всех {clients.length} клиентов? Действие необратимо.</p>
            <div className="flex gap-3">
              <button
                onClick={clearAll}
                className="flex-1 py-3 border border-red-500/40 text-xs text-red-400 hover:bg-red-500/10 transition-colors tracking-widest"
              >
                УДАЛИТЬ ВСЁ
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-3 border border-neutral-800 text-xs text-neutral-500 hover:text-neutral-300 transition-colors tracking-widest"
              >
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
