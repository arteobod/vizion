'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * The hero window's entrance, split between two drivers on purpose.
 *
 * On load the window drives up out of the page's blurred bottom edge and
 * resolves into focus — a one-shot that finishes in about a second. That part
 * is a true entry transition, so the blur is gone the moment anyone could be
 * reading the hero. Tying the blur to scroll instead would leave the headline
 * smeared for as long as the reader sat still, which is the one thing the
 * brand rules forbid, and it would be the state visitors land on.
 *
 * The tilt is the reader's: the window lies back 30° in 3D and flattens as
 * they scroll through it, finishing at 70% of the range.
 *
 * Nothing is pinned here. The window sits centred in a container taller than
 * the viewport, so ordinary document flow carries it up the screen while the
 * tilt resolves — it drives out toward the reader instead of straightening on
 * the spot. Pinning it with `position: sticky` kills exactly that; the tilt
 * still plays, but the window goes nowhere and the move falls flat.
 */
export default function ScrollTiltWindow({
  header,
  children,
}: {
  header?: React.ReactNode
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  // The pane the tilt is written to — watched during the CSS→framer handover.
  const paneRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [compact, setCompact] = useState(false)
  // Whether the scroll transforms are attached at all is a client-only decision,
  // and an inline transform that differs between the server HTML and the first
  // client render is a hydration mismatch React refuses to patch up. So the
  // first render on both sides attaches nothing, and the transforms go on once
  // mounted. Nothing flashes: the window spends that frame invisible inside its
  // own entrance animation.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Phones do not tilt at all any more, and the container is no longer taller
  // than the viewport there. That extra height was never decoration: it is the
  // scroll distance the rotation needs. At 390px the tilt had already been
  // dialled down to a barely visible 17 degrees, and it was buying that with
  // 460px of empty page between this window and the next — over half a screen
  // of nothing to scroll through. The trade only pays on a large screen.
  const rotateX = useTransform(scrollYProgress, [0, 0.7], [30, 0])
  // Grows into place rather than shrinking: at full width the window would
  // otherwise start wider than the viewport and clip its own corners.
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.96, 1])

  // The banner lives in the empty band above the centred window, so it costs
  // the window no height. It pulls away faster than the page scrolls and is
  // gone by 0.45 — it must not still be over the pane once the pane is flat.
  const bannerY = useTransform(scrollYProgress, [0, 0.5], [0, -140])
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  // The tilt runs only on a mounted, non-phone viewport.
  const tilting = mounted && !compact

  // Hands the resting angle over from the stylesheet to the live transform.
  //
  // The handover waits for evidence, not for a timer. The animation library
  // does not write the transform during render — it writes on a later frame —
  // so dropping the CSS angle as soon as `tilting` flipped just moved the flat
  // flash a few milliseconds later instead of removing it. This watches the
  // element's own inline style and only releases the stylesheet once a real
  // transform is actually sitting on it.
  useEffect(() => {
    if (!tilting) return
    const root = document.documentElement
    let frame = 0
    let tries = 0

    const check = () => {
      const written = paneRef.current?.style.transform
      if (written && written !== 'none') {
        root.setAttribute('data-vz-tilt-live', '')
        return
      }
      // Give up after ~2s rather than spin forever; the CSS angle simply stays,
      // which is the correct-looking state anyway.
      if (++tries < 120) frame = requestAnimationFrame(check)
    }

    frame = requestAnimationFrame(check)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      root.removeAttribute('data-vz-tilt-live')
    }
  }, [tilting])

  // Respect the OS setting: no tall scroll container, no 3D, just the window.
  if (reducedMotion) {
    return (
      <div className="px-4 py-16 sm:px-6 sm:py-24">
        {header && <div className="mb-12 text-center">{header}</div>}
        {children}
      </div>
    )
  }

  return (
    <section
      ref={ref}
      // Phones: height follows the content, so there is no empty tail below the
      // window. Tablet and up: taller than the viewport, which is what gives the
      // rotation somewhere to happen while ordinary flow carries the window up
      // the screen. Layout is decided in CSS rather than from the `compact`
      // flag, so the server markup and the first client render agree.
      className="relative flex flex-col justify-center py-10 md:h-[132vh] md:flex-row md:items-center md:py-0"
    >
      {header && (
        <motion.div
          style={tilting ? { y: bannerY, opacity: bannerOpacity } : undefined}
          // In flow above the window on a phone; lifted into the empty band over
          // the centred window from md up, where it costs the window no height.
          className="relative z-10 mb-8 flex items-center justify-center px-4 md:absolute md:inset-x-0 md:top-0 md:mb-0 md:h-[25vh]"
        >
          {/* CSS, not framer: this is the first thing on the page, and a
              JavaScript-driven `opacity: 0` would leave it invisible in the
              server HTML until the bundle hydrates. */}
          <div className="vz-banner-in text-center">{header}</div>
        </motion.div>
      )}

      <div className="w-full" style={{ perspective: 1100 }}>
        <motion.div
          ref={paneRef}
          style={tilting ? { rotateX, scale } : undefined}
          // `vz-tilt-rest` carries the window's starting angle in CSS.
          //
          // Without it the window arrives flat and snaps into its 30° lean the
          // moment the bundle hydrates — which is the "it appears vertical, then
          // jumps" report. It was invisible on a warm cache because hydration
          // beat the eye, and came back after a couple of minutes because the
          // cache had gone cold again and the wait grew.
          //
          // The angle cannot be an inline style: the server has no idea whether
          // this viewport tilts, and an inline transform that disagreed with the
          // first client render is a hydration mismatch. A stylesheet rule is in
          // the document from the very first paint, is identical on both sides,
          // and is outranked by framer's inline style the instant it takes over
          // — and framer's first value at scroll position 0 is this same angle,
          // so the handover is invisible.
          className="vz-tilt-rest w-full px-3 sm:px-5"
        >
          {/* The rise out of blur lives here, in CSS, on its own element. Two
              reasons. It paints without waiting for JavaScript, and a CSS
              animation outranks an inline style — sharing the element with the
              tilt above would let this animation's final `transform: none` erase
              the rotation for good. */}
          <div className="vz-hero-in">{children}</div>
        </motion.div>
      </div>
    </section>
  )
}
