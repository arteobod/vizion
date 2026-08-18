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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="text-center"
          >
            {header}
          </motion.div>
        </motion.div>
      )}

      <div className="w-full" style={{ perspective: 1100 }}>
        <motion.div
          style={tilting ? { rotateX, scale } : undefined}
          initial={{ y: '32%', filter: 'blur(14px)', opacity: 0 }}
          animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full px-3 sm:px-5"
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
