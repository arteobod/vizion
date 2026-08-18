'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import BrowserWindow from './BrowserWindow'
import ScrollTiltWindow from './ScrollTiltWindow'
import Button from './Button'
import Icon from './Icon'
import CaseCard from './CaseCard'
import ServiceCard from './ServiceCard'
import type { Service, Project } from '@/types'

const WHY_ICONS = ['ShieldCheck', 'MessagesSquare', 'UserRoundCheck', 'LifeBuoy']
const EASE = [0.22, 1, 0.36, 1] as const

// Shared: a block that rises a little out of blur as it enters view.
const rise: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
}

// Staggered container for a window's inner content.
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

/**
 * The home page as four full-screen browser windows, animated with Framer
 * Motion:
 *  - Window 1 lies back in 3D and un-tilts as the reader scrolls through it
 *    (see ScrollTiltWindow) — the reader drives that one, not a timer.
 *  - Window 2 slides up straight; its three cards fly in from the far edges out
 *    of blur, settle into the grid, and their borders fade to transparent.
 *  - Window 3 is the case grid, and drops out entirely when there is no case
 *    data to show.
 *  - Window 4 closes with the call to action.
 *
 * Blur is only ever an entry transition (elements resolving from blur) — it
 * never sits statically over readable text.
 */
export default function HomeWindows({
  services,
  projects,
}: {
  services: Service[]
  projects: Project[]
}) {
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

  // Window 3 shows four cases in one row. With none in the data the window is
  // dropped rather than rendered empty — an empty portfolio window would read
  // as broken, and the case data ships as placeholder (see CONTENT_TODO.md).
  const cases = projects.slice(0, 4)

  // Window 2 card entrances: left card from the left edge, middle from below,
  // right card from the right edge — all out of blur, borders fading out.
  //
  // On a phone the cards stack, so a ±280px horizontal fly-in starts each one
  // most of a screen width outside the viewport: it drags the page wider and,
  // worse, the card sits invisible until the trigger fires, leaving a
  // screen-tall hole under the heading. There they just rise a little instead.
  const OFFSET = compact ? 0 : 280
  const RISE = compact ? 40 : 200
  const settle = {
    opacity: 1, x: 0, y: 0, filter: 'blur(0px)', borderColor: 'rgba(0,0,0,0)',
    transition: { duration: 0.9, ease: EASE, borderColor: { delay: 0.7, duration: 0.5 } },
  }
  const cardVariants: Variants[] = [
    {
      hidden: { opacity: 0, x: -OFFSET, y: compact ? RISE : 0, filter: 'blur(14px)', borderColor: 'rgba(216, 221, 228, 1)' },
      show: settle,
    },
    {
      hidden: { opacity: 0, y: RISE, filter: 'blur(14px)', borderColor: 'rgba(216, 221, 228, 1)' },
      show: settle,
    },
    {
      hidden: { opacity: 0, x: OFFSET, y: compact ? RISE : 0, filter: 'blur(14px)', borderColor: 'rgba(216, 221, 228, 1)' },
      show: settle,
    },
  ]

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
      <motion.div
        className="vz-fx"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
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
                className="h-full rounded-card border"
                style={{ borderColor: 'rgba(216, 221, 228, 1)' }}
              >
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
                viewport={{ once: true, amount: 0.25 }}
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
      </motion.div>

      {/* ── Window 3 — Work: the case grid itself ── */}
      {cases.length > 0 && (
        <motion.div
          className="vz-fx"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <BrowserWindow url="viz-on.net/work" chapter="03 — Work">
            <motion.span
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="inline-flex rounded-full bg-vz-orange-soft px-3 py-1 text-sm font-medium text-vz-orange-deep"
            >
              {t.home.cases.eyebrow}
            </motion.span>
            <motion.h2
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-4 max-w-2xl text-h2 font-display"
            >
              {t.home.cases.title}
            </motion.h2>
            <motion.p
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-4 max-w-xl text-vz-body"
            >
              {t.home.cases.subtitle}
            </motion.p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cases.map((project, i) => (
                <motion.div
                  key={project.id}
                  variants={rise}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.09 }}
                  className="h-full"
                >
                  <CaseCard project={project} />
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-10"
            >
              <Button href="/work" variant="secondary" size="lg">
                {t.common.allCases}
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Button>
            </motion.div>
          </BrowserWindow>
        </motion.div>
      )}

      {/* ── Window 4 — Social proof: metric cards + CTA ── */}
      <motion.div
        className="vz-fx"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <BrowserWindow url="viz-on.net/contacts" chapter="04 — Start">
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
            viewport={{ once: true, amount: 0.25 }}
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
      </motion.div>
      </div>
    </>
  )
}
