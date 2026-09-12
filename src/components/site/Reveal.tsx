'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Variant = 'fade' | '3d'

/**
 * Entrance animation triggered when an element scrolls into view.
 *
 * The transition itself lives in CSS (`.vz-reveal` in globals.css); this
 * component only decides *when* to add `data-shown`. That split is deliberate —
 * the styles ship in the stylesheet, so nothing here depends on how fast the
 * bundle arrives, and the element is never left parked at `opacity: 0` by a
 * JavaScript library that has not booted yet.
 *
 * Three things it must never do, each of which has bitten this page before:
 *
 *  - Deadlock on tall elements. The observer used `threshold: 0.12`, but a
 *    2000px window inside an 844px phone viewport can only ever expose ~42% of
 *    itself, and a full-height section can drop under 12% outright — the
 *    element then waits forever for an entrance that would have brought it into
 *    view. `threshold: 0` fires on the first pixel, at any element height.
 *  - Hide content when it cannot reveal it. If IntersectionObserver is missing,
 *    the element shows immediately rather than staying blank.
 *  - Stay hidden when the reader is already past it. Content restored from
 *    bfcache, or an anchor landing mid-page, starts already intersecting, and
 *    the observer reports that on its very first callback.
 *
 * Deliberately no local "reveal anyway after N seconds" timer. It looks like
 * cheap insurance and it is the opposite: it fires for blocks the reader has not
 * reached yet, so by the time they scroll down the entrances have all already
 * played to an empty room. The catastrophic case — the bundle never arriving at
 * all — is covered once, globally, by the inline script in the document head.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'fade',
  x = 0,
  y,
  blur = 0,
  duration,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  /** ms, applied as a transition-delay for stagger. */
  delay?: number
  className?: string
  variant?: Variant
  /** Horizontal offset to travel from, in px. */
  x?: number
  /** Vertical offset to travel from, in px. Defaults to the CSS default (28). */
  y?: number
  /** Blur to resolve out of, in px. */
  blur?: number
  /** Transition duration in ms. */
  duration?: number
  as?: 'div' | 'span' | 'li'
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      // threshold 0 — any sliver counts, so element height is irrelevant.
      // The negative bottom margin holds the trigger back until the block has
      // properly entered rather than firing on its first pixel.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties & Record<string, string | number> = {}
  if (delay) style['--vz-rd'] = `${delay}ms`
  if (x) style['--vz-rx'] = `${x}px`
  if (y !== undefined) style['--vz-ry'] = `${y}px`
  if (blur) style['--vz-rb'] = `${blur}px`
  if (duration) style['--vz-rt'] = `${duration}ms`

  return (
    <Tag
      ref={ref as never}
      className={`${variant === '3d' ? 'vz-reveal vz-reveal-3d' : 'vz-reveal'} ${className}`}
      style={Object.keys(style).length ? style : undefined}
      {...(shown ? { 'data-shown': '' } : null)}
    >
      {children}
    </Tag>
  )
}
