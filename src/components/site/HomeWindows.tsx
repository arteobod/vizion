'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import BrowserWindow from './BrowserWindow'
import ScrollTiltWindow from './ScrollTiltWindow'
import Button from './Button'
import Icon from './Icon'
import ServiceCard from './ServiceCard'
import type { Service } from '@/types'

const WHY_ICONS = ['ShieldCheck', 'MessagesSquare', 'UserRoundCheck', 'LifeBuoy']
const EASE = [0.22, 1, 0.36, 1] as const

// Shared: a block that rises as it enters view.
//
// No `filter: blur()` here any more, and the reason is worth recording because
// the obvious fix was the wrong one.
//
// Animating blur was the freeze people hit halfway down the page: over the
// works window entering view it accounted for a third of the dropped frames and
// pushed the worst frame from 67ms to 83ms — on a discrete GPU, so worse on the
// integrated chips most laptops have. These blocks also sit inside a window that
// is itself a `backdrop-filter`, so every blurred child forces the glass behind
// it to re-sample too.
//
// The first attempt was to soften the radius from 10px to 4px. Measured against
// the old build side by side, that recovered 4 frames where removing blur
// entirely recovered 10. The radius is close to irrelevant: the cost is having a
// filter at all, because it promotes the element to its own layer and forces an
// off-screen pass every frame it animates. Half the effect was costing nearly
// all of the performance, so it goes.
//
// Opacity and travel still carry the entrance — both are compositor-only and
// effectively free.
const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// Staggered container for a window's inner content.
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

/**
 * A full-screen window with a one-shot entrance.
 *
 * The wrapper exists for one reason: `will-change`. These windows are the
 * largest animated things on the site — 82vh tall, and each contains a frosted
 * `backdrop-filter` pane — so the moment an entrance starts, the compositor has
 * to build a layer that big, rasterise it and hand it to the GPU. That single
 * allocation is the stutter people hit as each section arrives: measured over
 * windows 2 and 3 entering view, it was 17 dropped frames and took the
 * 95th-percentile frame to 83ms.
 *
 * Declaring `will-change` up front moves that allocation off the critical
 * moment — it recovered 15 of those 17 frames while keeping the animation
 * exactly as designed, which is the whole point: the alternative was deleting
 * the entrance.
 *
 * It is released again on completion. `will-change` is a standing request for
 * GPU memory, and leaving three viewport-sized layers pinned for the rest of
 * the visit trades one stutter for a permanent tax — the classic way this
 * property makes things slower rather than faster.
 */
function EntranceWindow({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)

  return (
    <motion.div
      className="vz-fx"
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.9, ease: EASE }}
      onAnimationComplete={() => setEntered(true)}
      style={{ willChange: entered ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The home page as three full-screen browser windows, animated with Framer
 * Motion:
 *  - Window 1 lies back in 3D and un-tilts as the reader scrolls through it
 *    (see ScrollTiltWindow) — the reader drives that one, not a timer.
 *  - Window 2 slides up straight; its three cards fly in from the far edges out
 *    settle into the grid, and their borders fade to transparent.
 *  - Window 3 closes with the call to action.
 *
 * There were four. The case grid sat between services and the close, and it is
 * gone deliberately: each of these windows is a full viewport of frosted,
 * shadowed, sometimes 3D-transformed surface, and the page carried four of them
 * down 5.6 screens. Nothing smaller moved the needle — the glass, the shadows,
 * the drifting panes and the scroll-linked tilt were each measured out and each
 * came back at or under the noise floor. The weight was the count, so the count
 * came down.
 *
 * The work is still one click away: the closing window links to /work, and so
 * does the nav.
 *
 * Nothing here animates `filter: blur()` any more — see the note on `rise`.
 * The windows still carry a static `backdrop-filter`; that is the glass, and it
 * is not animated. What was removed is blur that changed value every frame.
 */
export default function HomeWindows({ services }: { services: Service[] }) {
  const { t } = useLanguage()

  // Narrow screens get gentler entrances — see cardVariants below.
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Window 2 card entrances: left card from the left edge, middle from below,
  // right card from the right edge, borders fading out as they settle.
  //
  // On a phone the cards stack, so a ±280px horizontal fly-in starts each one
  // most of a screen width outside the viewport: it drags the page wider and,
  // worse, the card sits invisible until the trigger fires, leaving a
  // screen-tall hole under the heading. There they just rise a little instead.
  const OFFSET = compact ? 0 : 280
  const RISE = compact ? 40 : 200

  // The card itself moves: opacity and transform only, both compositor-only
  // properties, so the fly-in costs the main thread nothing.
  const settle = {
    opacity: 1, x: 0, y: 0,
    transition: { duration: 0.9, ease: EASE },
  }
  const cardVariants: Variants[] = [
    { hidden: { opacity: 0, x: -OFFSET, y: compact ? RISE : 0 }, show: settle },
    { hidden: { opacity: 0, y: RISE }, show: settle },
    { hidden: { opacity: 0, x: OFFSET, y: compact ? RISE : 0 }, show: settle },
  ]

  // The border that outlines a card in flight and is gone once it lands.
  //
  // It used to be `borderColor` tweened on the card. Colour is not a
  // compositor property: every frame of that fade repainted the card and
  // recalculated its style, and the three of them were among the most
  // frequently invalidated nodes in the whole trace. The line is now drawn by
  // an overlay that fades on `opacity` instead - same border, same timing,
  // nothing repainted.
  const cardBorder: Variants = {
    hidden: { opacity: 1 },
    show: { opacity: 0, transition: { delay: 0.7, duration: 0.5, ease: EASE } },
  }

  return (
    <>
      {/* ── Window 1 — Studio: un-tilts under the reader's own scroll ── */}
      <ScrollTiltWindow
        header={
          <>
            <p className="font-display text-lg font-semibold text-vz-body md:text-2xl">
              {t.home.banner.lead}
            </p>
            {/* The page's h1. The window's own headline steps down to h2 —
                two competing h1s would be the alternative. */}
            <h1 className="mt-1 font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-vz-text md:text-7xl lg:text-8xl">
              {t.home.banner.title}
            </h1>
          </>
        }
      >
        <BrowserWindow url="viz-on.net" chapter="01 — Studio">
          {/* Plain elements with a CSS stagger, not framer. This is the first
              screen: driven from JavaScript it reached the browser at opacity 0
              and stayed blank until the bundle hydrated. */}
          <div className="vz-stagger max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-vz-blue-soft px-4 py-1.5 text-sm font-medium text-vz-blue-deep">
              <Icon name="MapPin" className="h-4 w-4" />
              {t.home.hero.eyebrow}
            </span>
            <h2 className="mt-6 font-display text-h1 font-extrabold text-vz-text">
              {t.home.hero.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-vz-body">{t.home.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contacts" size="lg">
                {t.home.hero.ctaPrimary}
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                {t.home.hero.ctaSecondary}
              </Button>
            </div>
            <p className="mt-6 text-sm text-vz-muted">{t.home.hero.trust}</p>
          </div>
        </BrowserWindow>
      </ScrollTiltWindow>

      {/* Windows 2 and 3 keep their one-shot entrances — the scroll-linked
          tilt is the hero's move alone, and repeating it would wear thin. */}
      {/* Tighter rhythm on phones. Each window is already a screen and a half
          tall there, so the desktop 96px gaps read as gaps in the page rather
          than separation between chapters. */}
      <div className="space-y-10 px-3 pb-16 pt-8 sm:space-y-36 sm:px-5 sm:pb-24 sm:pt-28">
      {/* ── Window 2 — Services: slides up, cards fly in from edges ── */}
      <EntranceWindow>
        <BrowserWindow url="viz-on.net/services" chapter="02 — What we do">
          <motion.span
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="inline-flex rounded-full bg-vz-blue-soft px-3 py-1 text-sm font-medium text-vz-blue-deep"
          >
            {t.home.services.eyebrow}
          </motion.span>
          <motion.h2
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-4 max-w-2xl text-h2 font-display"
          >
            {t.home.services.title}
          </motion.h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((service, i) => (
              <motion.div
                // Remounts when the breakpoint resolves. `initial` is applied
                // once and never re-read, so a card mounted with the desktop
                // variant would keep its 280px offset even after `compact`
                // flips — the effect that sets it runs after the first render.
                key={`${service.id}-${compact ? 'c' : 'w'}`}
                variants={cardVariants[i] ?? cardVariants[1]}
                initial="hidden"
                whileInView="show"
                // `some`, not a fraction: an element that starts translated off
                // the edge can never expose enough of itself to clear a
                // percentage threshold, so it waits forever for the entrance
                // that would have brought it into view. Deadlock by geometry.
                viewport={{ once: true, amount: 'some' }}
                className="relative h-full rounded-card"
              >
                <motion.span
                  aria-hidden="true"
                  variants={cardBorder}
                  className="pointer-events-none absolute inset-0 rounded-card border border-vz-border-strong"
                />
                <ServiceCard service={service} flat />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 border-t border-vz-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.why.items.map((item, i) => (
              <motion.div
                key={item.title}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 'some' }}
                transition={{ delay: i * 0.08 }}
                className="flex h-full flex-col"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vz-blue-soft text-vz-blue-deep">
                  <Icon name={WHY_ICONS[i] ?? 'Check'} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-vz-text">{item.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-vz-body">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </BrowserWindow>
      </EntranceWindow>

      {/* ── Window 3 — Close: the call to action ── */}
      <EntranceWindow>
        <BrowserWindow url="viz-on.net/contacts" chapter="03 — Start">
          {/* This window used to open with three headline metrics. They were
              invented, and they named the four placeholder cases that have
              since been deleted — so they went with them. Nothing real has
              been measured yet: the live projects either launched too recently
              or are still pre-launch. When there are numbers, they belong
              here. Inventing them to fill the space is how a studio loses the
              one prospect who checks. */}
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 'some' }}
            // Centred, unlike every other window. The closing statement is
            // short and the frame is a fixed 82vh, so left-aligned it reads as
            // a window someone forgot to finish rather than a deliberate
            // last word.
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-h2 font-display">{t.home.cta.title}</h2>
            <p className="mt-5 text-lead text-vz-body">{t.home.cta.text}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/contacts" size="lg">
                {t.home.cta.button}
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                {t.common.allCases}
              </Button>
            </div>
            <p className="mt-6 text-sm text-vz-muted">{t.home.hero.trust}</p>
          </motion.div>
        </BrowserWindow>
      </EntranceWindow>
      </div>
    </>
  )
}
