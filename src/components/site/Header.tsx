'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Container from './Container'
import Button from './Button'
import LanguageSwitcher from './LanguageSwitcher'

/**
 * The top bar.
 *
 * On desktop it carries the full navigation. On phones it is deliberately only
 * the wordmark and the language switch: the menu lives in `MobileNav`, a dock
 * fixed to the bottom of the viewport, because a trigger up here is unreachable
 * once the reader is a few screens down a long page. Putting the same menu in
 * both places would be two controls for one job.
 */
export default function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

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

          <LanguageSwitcher className="lg:hidden" />
        </div>
      </Container>
    </header>
  )
}
