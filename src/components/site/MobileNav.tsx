'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
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
 *
 * The panel and the dock move on CSS transitions, and the swipe-to-dismiss is a
 * pointer handler, where both used to be framer-motion. This component is the
 * one piece of the site that only ever renders on a phone, so it was the worst
 * possible place to pull in a 125KB animation library: it put the whole thing on
 * the critical path of exactly the devices that could least afford it.
 *
 * The panel stays mounted and is moved off-screen rather than unmounted, which
 * is what makes the closing transition possible without a presence library.
 * `visibility: hidden` while closed keeps it out of the tab order and the
 * accessibility tree, and because `visibility` is itself transitionable it flips
 * only once the panel has finished sliding away.
 */
export default function MobileNav({ siteContent }: { siteContent: SiteContent }) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  // Live drag offset, written straight to the node so a swipe does not re-render
  // the panel on every pointer move.
  const dragStart = useRef<number | null>(null)
  const dragOffset = useRef(0)

  const phones = phoneList(siteContent.contact)

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/services', label: t.nav.services },
    { href: '/services#faq', label: t.nav.faq },
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

  // Swipe down to dismiss. Only from a touch or pen, and only when the panel is
  // already scrolled to the top — otherwise the gesture would fight the panel's
  // own scrolling.
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    const panel = panelRef.current
    if (!panel || panel.scrollTop > 0) return
    dragStart.current = e.clientY
    dragOffset.current = 0
    panel.style.transition = 'none'
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const from = dragStart.current
    const panel = panelRef.current
    if (from === null || !panel) return
    // Downward only, and eased past the halfway mark so it resists rather than
    // tracking the finger all the way out.
    const raw = e.clientY - from
    if (raw <= 0) {
      dragOffset.current = 0
      panel.style.transform = ''
      return
    }
    dragOffset.current = raw
    panel.style.transform = `translateY(${raw}px)`
  }, [])

  const endDrag = useCallback(() => {
    const panel = panelRef.current
    if (dragStart.current === null || !panel) return
    const travelled = dragOffset.current
    dragStart.current = null
    dragOffset.current = 0
    panel.style.transition = ''
    panel.style.transform = ''
    if (travelled > 130) close()
  }, [close])

  return (
    <div className="lg:hidden">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        aria-hidden={!open}
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // 100svh rather than 100vh: on iOS Safari the large viewport unit
        // sits behind the browser's own toolbars, which would push the last
        // rows out of sight exactly the way the dock used to.
        //
        // Kept mounted and translated away rather than unmounted, so the close
        // transition has something to animate. `invisible` is what takes it out
        // of the tab order while it is parked.
        className={`vz-sheet fixed inset-0 z-[2095] flex h-[100svh] flex-col overflow-y-auto bg-vz-white outline-none ${
          open ? 'translate-y-0' : 'invisible translate-y-full'
        }`}
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
                      <li
                        key={link.href}
                        // Rows rise in behind the panel. Driven off the panel's
                        // open state in CSS, so the stagger costs one class and
                        // a custom property instead of a component per row.
                        style={{ '--vz-rd': `${50 + i * 50}ms` } as React.CSSProperties}
                        className="vz-sheet-row border-b border-vz-border last:border-0"
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
                            className={`font-tag text-[0.6875rem] tabular-nums tracking-widest transition-colors ${
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
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Pushed to the bottom of whatever height is left, so the panel
                  fills the screen instead of leaving a gap under short content. */}
              <div
                style={{ '--vz-rd': '360ms' } as React.CSSProperties}
                className="vz-sheet-row mt-auto pt-6"
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
              </div>
            </div>
      </div>

      {/* The dock. Fixed, so the menu is reachable from anywhere on the page.
          It drops away while the panel is up — the panel carries its own close
          control, and leaving the dock on top of it is what buried the phone
          numbers and the language switch. */}
      <div
        className={`vz-dock pointer-events-none fixed inset-x-0 bottom-0 z-[2100] flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] ${
          open ? 'vz-dock-away' : ''
        }`}
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
      </div>
    </div>
  )
}
