'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  const navLinks = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.contact, href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-fv-black/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="border-b border-fv-border">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-1 group">
              <span className="font-mono text-xl font-bold tracking-tight text-fv-text group-hover:text-fv-white transition-colors">
                VIŽON
              </span>
              <span className="animate-blink text-fv-orange font-mono text-xl font-bold">_</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-label px-4 py-2 text-fv-text-dim hover:text-fv-orange transition-colors duration-200"
                >
                  [{link.label}]
                </a>
              ))}
            </div>

            {/* Right side: switchers + time + status */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <span className="h-4 w-px bg-fv-border" />
              <ThemeSwitcher />
              <span className="h-4 w-px bg-fv-border" />
              <span className="font-mono text-micro text-fv-text-muted">
                {currentTime}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-micro text-fv-text-muted">{t.nav.systemsOnline}</span>
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-fv-text transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
              <span className={`block w-5 h-px bg-fv-text transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-fv-text transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-fv-black/98 backdrop-blur-md border-b border-fv-border">
          <div className="px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block font-mono text-sm text-fv-text-dim hover:text-fv-orange py-3 border-b border-fv-border/50 transition-colors"
              >
                [{link.label}]
              </a>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
