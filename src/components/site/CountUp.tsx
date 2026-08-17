'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Splits a display value like "+62%" into prefix / number / suffix so the
 * numeric part can animate while punctuation stays put.
 *
 * Returns null when the value isn't a single clean number — "2 days → 0" or
 * "Fixed" animate badly, so those render static instead.
 */
function parse(value: string): { prefix: string; target: number; suffix: string; decimals: number } | null {
  const match = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(\D*)$/)
  if (!match) return null

  const [, prefix, digits, suffix] = match
  // A second number anywhere means this isn't a simple figure.
  if (/\d/.test(prefix) || /\d/.test(suffix)) return null

  const normalized = digits.replace(',', '.')
  const target = parseFloat(normalized)
  if (!Number.isFinite(target)) return null

  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0
  return { prefix, target, suffix, decimals }
}

const DURATION = 1400

// Decelerating curve — fast start, soft landing.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export default function CountUp({
  value,
  className = '',
}: {
  value: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const parsed = parse(value)
  const [display, setDisplay] = useState(() => (parsed ? null : value))

  useEffect(() => {
    if (!parsed) return

    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    let start = 0

    // Drop to the zero state as soon as JS takes over, so the figure doesn't
    // visibly snap back from its final value when it scrolls into view.
    const zero = (0).toLocaleString('en-US', {
      minimumFractionDigits: parsed.decimals,
      maximumFractionDigits: parsed.decimals,
    })
    setDisplay(parsed.prefix + zero + parsed.suffix)

    const step = (now: number) => {
      if (!start) start = now
      const progress = Math.min((now - start) / DURATION, 1)
      const current = parsed.target * easeOut(progress)

      setDisplay(
        parsed.prefix +
          current.toLocaleString('en-US', {
            minimumFractionDigits: parsed.decimals,
            maximumFractionDigits: parsed.decimals,
          }) +
          parsed.suffix
      )

      if (progress < 1) frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.4 }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
    // `value` fully determines `parsed`; re-parsing on every render is cheap
    // but re-running the animation is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span ref={ref} className={className}>
      {/* Before animation starts, render the final value so the figure is
          present for crawlers and for anyone with JS disabled. */}
      {display ?? value}
    </span>
  )
}
