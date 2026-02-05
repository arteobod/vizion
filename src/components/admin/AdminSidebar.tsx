'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'D' },
  { href: '/admin/projects', label: 'Projects', icon: 'P' },
  { href: '/admin/services', label: 'Services', icon: 'S' },
  { href: '/admin/process', label: 'Process', icon: 'M' },
  { href: '/admin/stats', label: 'Stats', icon: '#' },
  { href: '/admin/contacts', label: 'Contacts', icon: '@' },
  { href: '/admin/site-content', label: 'Site Content', icon: 'C' },
  { href: '/admin/images', label: 'Images', icon: 'I' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-fv-dark border-r border-fv-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-fv-border">
        <Link href="/admin" className="block">
          <h1 className="font-mono text-xl font-bold text-fv-text tracking-wider">VIZON</h1>
          <p className="font-mono text-xs text-fv-text-muted mt-1 tracking-widest">ADMIN PANEL</p>
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 font-mono text-sm transition-colors ${
                isActive
                  ? 'bg-fv-orange text-white'
                  : 'text-fv-text-dim hover:bg-fv-surface hover:text-fv-text'
              }`}
            >
              <span className="w-5 text-center font-bold text-xs">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-fv-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-fv-text-muted hover:text-fv-text font-mono text-xs transition-colors tracking-wider"
        >
          <span>&#8599;</span>
          <span>VIEW PUBLIC SITE</span>
        </Link>
      </div>
    </aside>
  )
}
