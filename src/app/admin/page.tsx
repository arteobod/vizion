'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  projects: number
  services: number
  contacts: number
  images: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ projects: 0, services: 0, contacts: 0, images: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/projects').then(r => r.json()) as Promise<unknown[]>,
      fetch('/api/admin/services').then(r => r.json()) as Promise<unknown[]>,
      fetch('/api/admin/contacts').then(r => r.json()) as Promise<unknown[]>,
      fetch('/api/admin/upload').then(r => r.json()) as Promise<unknown[]>,
    ]).then(([projects, services, contacts, images]) => {
      setStats({
        projects: projects.length,
        services: services.length,
        contacts: contacts.length,
        images: images.length,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Projects', value: stats.projects, color: 'text-fv-orange', href: '/admin/projects' },
    { label: 'Services', value: stats.services, color: 'text-blue-400', href: '/admin/services' },
    { label: 'Contacts', value: stats.contacts, color: 'text-green-400', href: '/admin/contacts' },
    { label: 'Images', value: stats.images, color: 'text-purple-400', href: '/admin/images' },
  ]

  const quickActions = [
    { label: 'ADD PROJECT', href: '/admin/projects/new' },
    { label: 'EDIT SERVICES', href: '/admin/services' },
    { label: 'SITE CONTENT', href: '/admin/site-content' },
    { label: 'VIEW SITE', href: '/', external: true },
  ]

  return (
    <div>
      <h1 className="font-mono text-xl font-bold text-fv-text mb-6 tracking-wider">DASHBOARD</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-fv-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-fv-surface border border-fv-border rounded-xl p-6 hover:border-fv-border-light transition group"
              >
                <span className={`font-mono text-3xl font-bold ${card.color} block mb-1`}>
                  {card.value}
                </span>
                <span className="font-mono text-xs text-fv-text-muted tracking-wider">
                  {card.label.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>

          <div className="bg-fv-surface border border-fv-border rounded-xl p-6">
            <h2 className="font-mono text-sm font-bold text-fv-text mb-4 tracking-wider">QUICK ACTIONS</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  className="px-4 py-3 bg-fv-dark border border-fv-border rounded-lg font-mono text-xs text-fv-text-dim hover:text-fv-orange hover:border-fv-orange/30 transition text-center tracking-wider"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
