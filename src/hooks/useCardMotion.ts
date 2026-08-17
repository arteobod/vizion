'use client'

import { useCallback, useRef } from 'react'

/**
 * Pointer-reactive card behaviour: a soft light that follows the cursor plus
 * a subtle 3D lean toward it.
 *
 * Spread onto the card's own root element (not a wrapper) together with
 * `className="spotlight tilt …"`. The glow is painted by a `::before` that
 * has to sit above the card's background but below its content, which only
 * works inside the card's own stacking context. See `.spotlight` and `.tilt`
 * in globals.css.
 *
 * Both effects share one pointermove listener and one rAF write, so the card
 * does a single style update per frame rather than two.
 *
 * Mouse only — on touch there's no hover, so the card would stay stuck tilted.
 *
 * Non-generic on purpose: an explicit type argument in .tsx parses as a JSX
 * tag under SWC. A callback ref typed to HTMLElement accepts any concrete
 * element by contravariance.
 */
export function useCardMotion({
  tilt = 6,
  lift = 12,
}: { tilt?: number; lift?: number } = {}) {
  const node = useRef<HTMLElement | null>(null)
  const frame = useRef(0)

  const ref = useCallback((element: HTMLElement | null) => {
    node.current = element
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = node.current
      if (!el || e.pointerType !== 'mouse') return

      const { clientX, clientY } = e
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()

        // Spotlight: position within the card, in pixels
        el.style.setProperty('--spot-x', `${clientX - rect.left}px`)
        el.style.setProperty('--spot-y', `${clientY - rect.top}px`)

        // Tilt: -0.5..0.5 from the card's centre. Pointer above centre tips
        // the card back, hence the negation on X.
        const px = (clientX - rect.left) / rect.width - 0.5
        const py = (clientY - rect.top) / rect.height - 0.5
        el.style.setProperty('--tilt-x', `${(-py * tilt).toFixed(2)}deg`)
        el.style.setProperty('--tilt-y', `${(px * tilt).toFixed(2)}deg`)
      })
    },
    [tilt]
  )

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== 'mouse') return
      const el = node.current
      if (!el) return
      el.setAttribute('data-spot', 'on')
      el.setAttribute('data-tilting', 'on')
      el.style.setProperty('--tilt-z', `${lift}px`)
    },
    [lift]
  )

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current)
    const el = node.current
    if (!el) return
    el.removeAttribute('data-spot')
    // Dropping the tracking flag restores the slower easing, so the card
    // settles back rather than snapping.
    el.removeAttribute('data-tilting')
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--tilt-z', '0px')
  }, [])

  return { ref, onPointerMove, onPointerEnter, onPointerLeave }
}
