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
 * The header's hamburger was the only way in, which meant reaching the menu from
 * halfway down a 7000px page was a scroll back to the top. This is a dock fixed
 * to the bottom of the viewport instead: it never leaves and it sits where a
 * thumb already rests. It replaces the header trigger rather than joining it —
 * two controls opening the same panel is clutter.
 *
 * The panel is full-screen, not a partial sheet. A sheet that stopped short left
 * the dock floating over its last rows, covering the phone numbers and the
 * language switch, and reserving space for the dock inside the panel only traded
 * the collision for a band of wasted screen. Full-screen removes the problem
 * rather than working around it: the dock steps out of the way while the panel is
 * up, and closing moves back to the panel's own header.
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

  // Arriving on a new page should not leave the panel standing over it.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Hold the page still underneath, and put the scroll position back on close —
  // without the second half, dismissing the panel drops the reader at the top.
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
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            tabIndex={-1}
            drag={reduceMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 130 || info.velocity.y > 600) close()
            }}
            initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 400, damping: 40, mass: 0.9 }
            }
            // 100svh rather than 100vh: on iOS Safari the large viewport unit
            // sits behind the browser's own toolbars, which would push the last
            // rows out of sight exactly the way the dock used to.
            className="fixed inset-0 z-[2095] flex h-[100svh] flex-col overflow-y-auto bg-vz-white outline-none"
          >
            {/* Same corner ticks and light rig the page runs on, so the panel
                reads as this site going full-screen rather than a system sheet. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-vz-blue-soft/70 to-transparent"
            />

            <div className="relative flex items-center justify-between px-5 pb-2 pt-[calc(0.875rem+env(safe-area-inset-top))]">
              <Link
                href="/"
                onClick={close}
                className="font-display text-xl font-extrabold tracking-tight text-vz-text"
              >
                Vi<span className="text-vz-orange">ž</span>on
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label={t.nav.close}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-vz-ink bg-white text-vz-text shadow-soft-sm active:translate-y-px"
              >
                <Icon name="X" className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>

            {/* The grab handle stays: the panel is still swipe-to-dismiss, and
                without it that gesture is invisible. */}
            <div className="relative mx-auto mt-1 h-1.5 w-11 shrink-0 rounded-full bg-vz-border-strong/70" />

            <div className="relative flex flex-1 flex-col px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
              <nav aria-label={t.nav.menu}>
                <ul>
                  {links.map((link, i) => {
                    const active = isActive(link.href)
                    return (
                      <motion.li
                        key={link.href}
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: reduceMotion ? 0 : 0.05 + i * 0.05,
                          duration: 0.45,
                          ease,
                        }}
                        className="border-b border-vz-border last:border-0"
                      >
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={active ? 'page' : undefined}
                          className="group flex items-center gap-4 py-4"
                        >
                          {/* The chapter-tag numbering from the home page
                              windows, reused so the menu belongs to the same
                              object rather than reading as a stock drawer. */}
                          <span
                            className={`font-mono text-[0.6875rem] tabular-nums tracking-widest transition-colors ${
                              active ? 'text-vz-orange' : 'text-vz-muted'
                            }`}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`flex-1 font-display text-2xl font-bold leading-none tracking-tight transition-colors ${
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

              {/* Pushed to the bottom of whatever height is left, so the panel
                  fills the screen instead of leaving a gap under short content. */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.36, duration: 0.45, ease }}
                className="mt-auto pt-6"
              >
                <Link
                  href="/contacts"
                  onClick={close}
                  className="flex items-center justify-center gap-2 rounded-soft bg-vz-orange px-6 py-4 text-base font-medium text-white shadow-cta active:translate-y-px"
                >
                  {t.nav.cta}
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>

                <ul className="mt-5 space-y-2.5">
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

                <div className="mt-5 border-t border-vz-border pt-5">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The dock. Fixed, so the menu is reachable from anywhere on the page.
          It drops away while the panel is up — the panel carries its own close
          control, and leaving the dock on top of it is what buried the phone
          numbers and the language switch. */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { y: 90, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 90, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[2100] flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          >
            <div className="pointer-events-auto relative flex items-center gap-1 rounded-full border-2 border-vz-ink bg-white/80 p-1.5 shadow-window backdrop-blur-xl">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/60"
              />

              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-label={t.nav.menu}
                className="relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold text-vz-text active:bg-vz-soft"
              >
                <span aria-hidden="true" className="relative block h-3 w-4">
                  <span className="absolute left-0 top-0 block h-[2px] w-full rounded-full bg-vz-ink" />
                  <span className="absolute left-0 top-[5px] block h-[2px] w-full rounded-full bg-vz-ink" />
                  <span className="absolute left-0 top-[10px] block h-[2px] w-full rounded-full bg-vz-ink" />
                </span>
                {t.nav.menu}
              </button>

              <span aria-hidden="true" className="relative h-6 w-px bg-vz-border-strong" />

              <Link
                href="/contacts"
                aria-label={t.nav.cta}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-vz-orange text-white shadow-cta active:translate-y-px"
              >
                <Icon name="ArrowUpRight" className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
