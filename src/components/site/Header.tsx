'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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
    { href: '/services#faq', label: t.nav.faq },
    { href: '/work', label: t.nav.portfolio },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/contacts', label: t.nav.contacts },
  ]

  // Marks the document as hydrated, which switches off the inline fallback in
  // the head that would otherwise force-reveal the scroll entrances. The header
  // is on every page, so this is the cheapest honest place to signal "the bundle
  // arrived and React is running".
  useEffect(() => {
    document.documentElement.setAttribute('data-vz-hydrated', '')
  }, [])

  /*
   * The header gains a shadow once the page has moved off the top.
   *
   * That is one boolean, and it was the most expensive thing on the site while
   * scrolling — 48ms of main thread across a single scroll, more than every
   * visual effect on the page combined and more than the animation library.
   * It was written the obvious way: `setScrolled(window.scrollY > 8)` on every
   * scroll event.
   *
   * Two costs hid in that line. Scroll events fire far more often than frames,
   * so React's dispatch ran repeatedly per frame to re-decide a value that
   * changes once per visit. Worse, reading `scrollY` forces the browser to
   * flush layout — and the hero's scroll-linked tilt is writing inline styles
   * on the same frames, so the two took turns invalidating and re-measuring the
   * page. That is layout thrashing, and it is why the stutter was worst on the
   * first screen, where the tilt lives.
   *
   * There is no scroll listener here at all now. A zero-width sentinel sits at
   * the top of the document and an IntersectionObserver reports when it leaves
   * the viewport. The browser does that work off the main thread and tells us
   * twice per visit instead of a thousand times: no listener, no `scrollY`, no
   * forced layout.
   */
  const sentinelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/*
        The sentinel the observer above watches. Absolutely positioned so it
        takes no space in flow — the header is `sticky`, so anything that
        occupied real height here would push the whole page down by that much.
        9px tall to match the 8px threshold this used to compare `scrollY`
        against, so the shadow still appears at exactly the same point.
      */}
      <span
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[9px] w-px"
      />
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
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`vz-navlink whitespace-nowrap rounded-soft px-2 py-2 text-sm font-medium xl:px-3 xl:text-[0.9375rem] ${
                  isActive(link.href)
                    ? 'vz-navlink-active text-vz-orange-deep'
                    : 'text-vz-body hover:text-vz-text'
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
    </>
  )
}
