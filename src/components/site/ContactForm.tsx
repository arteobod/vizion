'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import Button from './Button'
import Icon from './Icon'

type Status = 'idle' | 'sending' | 'success' | 'error'

const FIELD =
  'w-full rounded-soft border border-vz-border-strong bg-white px-4 py-3 text-vz-text ' +
  'placeholder:text-vz-muted transition-colors duration-200 ' +
  'hover:border-vz-blue/60 focus:border-vz-blue focus:outline-none'

/** `preset` pre-selects a project type when arriving from a service page. */
export default function ContactForm({ preset }: { preset?: string }) {
  const { t } = useLanguage()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: preset ?? '',
    message: '',
  })

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = t.contacts.form.required
    if (!form.email.trim()) next.email = t.contacts.form.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t.contacts.form.invalidEmail
    if (!form.message.trim()) next.message = t.contacts.form.required
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    try {
      const res = await fetch('/api/ctrl-8b2f/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', projectType: preset ?? '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-card border border-vz-blue/40 bg-vz-blue-soft p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-soft-sm">
          <Icon name="Check" className="h-7 w-7 text-vz-blue-deep" strokeWidth={2.25} />
        </span>
        <p className="mt-5 text-lead font-medium text-vz-text">{t.contacts.form.success}</p>
      </div>
    )
  }

  const typeOptions = [
    { value: 'website', label: t.contacts.form.types.website },
    { value: 'redesign', label: t.contacts.form.types.redesign },
    { value: 'utility', label: t.contacts.form.types.utility },
    { value: 'other', label: t.contacts.form.types.other },
  ]

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-vz-text">
            {t.contacts.form.name}
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={set('name')}
            placeholder={t.contacts.form.namePlaceholder}
            aria-invalid={!!errors.name}
            className={`${FIELD} ${errors.name ? 'border-vz-orange' : ''}`}
          />
          {errors.name && <p className="mt-1.5 text-sm text-vz-orange-deep">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-vz-text">
            {t.contacts.form.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder={t.contacts.form.emailPlaceholder}
            aria-invalid={!!errors.email}
            className={`${FIELD} ${errors.email ? 'border-vz-orange' : ''}`}
          />
          {errors.email && <p className="mt-1.5 text-sm text-vz-orange-deep">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-vz-text">
            {t.contacts.form.phone}{' '}
            <span className="font-normal text-vz-muted">({t.contacts.form.optional})</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder={t.contacts.form.phonePlaceholder}
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-vz-text">
            {t.contacts.form.projectType}
          </label>
          <select
            id="projectType"
            name="projectType"
            value={form.projectType}
            onChange={set('projectType')}
            className={FIELD}
          >
            <option value="">{t.contacts.form.projectTypePlaceholder}</option>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-vz-text">
          {t.contacts.form.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={set('message')}
          placeholder={t.contacts.form.messagePlaceholder}
          aria-invalid={!!errors.message}
          className={`${FIELD} resize-y ${errors.message ? 'border-vz-orange' : ''}`}
        />
        {errors.message && <p className="mt-1.5 text-sm text-vz-orange-deep">{errors.message}</p>}
      </div>

      {status === 'error' && (
        <p className="rounded-soft bg-vz-orange-soft px-4 py-3 text-sm text-vz-orange-deep">
          {t.contacts.form.error}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? t.contacts.form.sending : t.contacts.form.submit}
          {status !== 'sending' && <Icon name="ArrowRight" className="h-4 w-4" />}
        </Button>
        <p className="text-sm text-vz-muted">
          <Link href="/privatuma-politika" className="underline hover:text-vz-orange-deep">
            {t.contacts.form.privacy}
          </Link>
        </p>
      </div>
    </form>
  )
}
