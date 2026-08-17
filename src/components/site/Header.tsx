'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Container from './Container'
import Button from './Button'
import Icon from './Icon'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/services', label: t.nav.services },
    { href: '/work', label: t.nav.portfolio },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/contacts', label: t.nav.contacts },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-soft-sm' : 'border-b border-vz-border'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-tight text-vz-text"
          >
            Vi<span className="text-vz-orange">ž</span>on
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-soft px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-vz-orange-deep'
                    : 'text-vz-body hover:bg-vz-soft hover:text-vz-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Button href="/contacts">{t.nav.cta}</Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t.nav.close : t.nav.menu}
              className="rounded-soft p-2 text-vz-text transition-colors hover:bg-vz-soft"
            >
              <Icon name={menuOpen ? 'X' : 'Menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div className="border-t border-vz-border bg-white lg:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-soft px-3 py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-vz-orange-soft text-vz-orange-deep'
                      : 'text-vz-body hover:bg-vz-soft'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button href="/contacts" size="lg" className="mt-3 w-full">
                {t.nav.cta}
              </Button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
