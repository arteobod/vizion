'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { phoneList, telHref } from '@/lib/site-content'
import Icon from './Icon'
import LanguageSwitcher from './LanguageSwitcher'
import type { SiteContent } from '@/types'

/**
 * Navigation for phones and small tablets.
 *
 * The header's hamburger was the only way in, which meant that reaching the menu
 * from halfway down a 7000px page was a scroll back to the top. This is a dock
 * fixed to the bottom of the viewport instead: it never leaves, it sits where a
 * thumb already rests, and it carries the two actions a visitor on a phone
 * actually wants — call, and start a project — next to the menu itself.
 *
 * It replaces the header trigger rather than joining it. Two controls opening the
 * same sheet is clutter, and the dock is the one that is always in reach.
 *
 * The panel is a bottom sheet: it comes from the same edge as the button that
 * opened it, so the motion reads as the dock unfolding rather than a layer
 * arriving from nowhere. Swipe it down or tap outside to dismiss.
 *
 * Layering: the decorative page frame sits at z-[2000] and the film grain at
 * z-60, so everything here is above 2000 or the grain would mute the dock and
 * the frame's hairline would cross it.
 */
export default function MobileNav({ siteContent }: { siteContent: SiteContent }) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const phones = phoneList(siteContent.contact)
  const primaryPhone = phones[0]

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/services', label: t.nav.services },
    { href: '/work', label: t.nav.portfolio },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/contacts', label: t.nav.contacts },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const close = useCallback(() => setOpen(false), [])

  // Arriving on a new page should not leave the sheet standing over it.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Hold the page still underneath, and put the scroll position back on close —
  // without the second half, dismissing the sheet drops the reader at the top.
  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const { style } = document.body
    const previous = { position: style.position, top: style.top, width: style.width }
    style.position = 'fixed'
    style.top = `-${y}px`
    style.width = '100%'
    return () => {
      style.position = previous.position
      style.top = previous.top
      style.width = previous.width
      window.scrollTo(0, y)
    }
  }, [open])

  // Escape closes, and focus goes back to the button that opened it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {open && (
          <>
            {/* Ink rather than black: the page's own near-black, so the dimmed
                state still belongs to this site. */}
            <motion.button
              type="button"
              aria-label={t.nav.close}
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
              className="fixed inset-0 z-[2090] cursor-default bg-vz-ink/45 backdrop-blur-[3px]"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.menu}
              tabIndex={-1}
              drag={reduceMotion ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 550) close()
              }}
              initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 420, damping: 38, mass: 0.9 }
              }
              className="fixed inset-x-0 bottom-0 z-[2095] max-h-[92svh] overflow-y-auto rounded-t-[26px] border-2 border-b-0 border-vz-ink bg-vz-white shadow-window outline-none"
            >
              {/* A white hairline just inside the ink edge, the same lit-frame
                  trick the browser windows use, so the sheet reads as a solid
                  object and not a hole cut in the page. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-t-[24px] border-2 border-b-0 border-white/70"
              />

              {/* The dock stays on top of the sheet, so the last rows need to clear
                  it — 5.5rem is the dock height plus its own bottom offset. */}
              <div className="relative px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3">
                {/* Grab handle. Doubles as the affordance for the drag gesture,
                    which is otherwise invisible. */}
                <div className="mx-auto mb-5 h-1.5 w-11 rounded-full bg-vz-border-strong" />

                <nav aria-label={t.nav.menu}>
                  <ul>
                    {links.map((link, i) => {
                      const active = isActive(link.href)
                      return (
                        <motion.li
                          key={link.href}
                          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: reduceMotion ? 0 : 0.06 + i * 0.045,
                            duration: 0.42,
                            ease,
                          }}
                          className="border-b border-vz-border last:border-0"
                        >
                          <Link
                            href={link.href}
                            onClick={close}
                            aria-current={active ? 'page' : undefined}
                            className="group flex items-center gap-4 py-3.5"
                          >
                            {/* The chapter-tag numbering from the home page
                                windows, reused so the menu feels like part of
                                the same object rather than a stock drawer. */}
                            <span
                              className={`font-mono text-[0.6875rem] tabular-nums tracking-widest transition-colors ${
                                active ? 'text-vz-orange' : 'text-vz-muted'
                              }`}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={`flex-1 font-display text-[1.375rem] font-bold leading-none tracking-tight transition-colors ${
                                active ? 'text-vz-orange-deep' : 'text-vz-text'
                              }`}
                            >
                              {link.label}
                            </span>
                            {active ? (
                              <span className="h-2 w-2 rounded-full bg-vz-orange" />
                            ) : (
                              <Icon
                                name="ArrowRight"
                                className="h-4 w-4 text-vz-muted transition-transform duration-300 group-active:translate-x-1"
                              />
                            )}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>
                </nav>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.34, duration: 0.42, ease }}
                  className="mt-5 rounded-card border border-vz-border bg-vz-soft p-4"
                >
                  <Link
                    href="/contacts"
                    onClick={close}
                    className="flex items-center justify-center gap-2 rounded-soft bg-vz-orange px-6 py-3.5 text-base font-medium text-white shadow-cta active:translate-y-px"
                  >
                    {t.nav.cta}
                    <Icon name="ArrowRight" className="h-4 w-4" />
                  </Link>

                  <ul className="mt-4 space-y-2">
                    <li>
                      <a
                        href={`mailto:${siteContent.contact.email}`}
                        className="flex items-center gap-2.5 text-[0.9375rem] text-vz-body"
                      >
                        <Icon name="Mail" className="h-4 w-4 shrink-0 text-vz-blue" />
                        {siteContent.contact.email}
                      </a>
                    </li>
                    {phones.map((phone, i) => (
                      <li key={phone}>
                        <a
                          href={telHref(phone)}
                          className="flex items-center gap-2.5 text-[0.9375rem] tabular-nums text-vz-body"
                        >
                          {i === 0 ? (
                            <Icon name="Phone" className="h-4 w-4 shrink-0 text-vz-blue" />
                          ) : (
                            <span className="h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 border-t border-vz-border pt-4">
                    <LanguageSwitcher />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* The dock. Fixed, so it is reachable from anywhere on the page. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[2100] flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto relative flex items-center gap-1 rounded-full border-2 border-vz-ink bg-white/80 p-1.5 shadow-window backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/60"
          />

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold text-vz-text active:bg-vz-soft"
          >
            {/* Three bars that become a cross. Animating the lines rather than
                swapping two icons keeps the control feeling like one object
                through the change. */}
            <span aria-hidden="true" className="relative block h-3.5 w-4">
              <motion.span
                className="absolute left-0 block h-[2px] w-full rounded-full bg-vz-ink"
                animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
              />
              <motion.span
                className="absolute left-0 top-[6px] block h-[2px] w-full rounded-full bg-vz-ink"
                animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              />
              <motion.span
                className="absolute left-0 block h-[2px] w-full rounded-full bg-vz-ink"
                animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
              />
            </span>
            {open ? t.nav.close : t.nav.menu}
          </button>

          <span aria-hidden="true" className="relative h-6 w-px bg-vz-border-strong" />

          {primaryPhone && (
            <a
              href={telHref(primaryPhone)}
              aria-label={`${t.nav.call} ${primaryPhone}`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-vz-text active:bg-vz-soft"
            >
              <Icon name="Phone" className="h-[1.15rem] w-[1.15rem]" />
            </a>
          )}

          <Link
            href="/contacts"
            aria-label={t.nav.cta}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-vz-orange text-white shadow-cta active:translate-y-px"
          >
            <Icon name="ArrowUpRight" className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    </div>
  )
}
