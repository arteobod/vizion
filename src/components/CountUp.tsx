'use client'

import { useEffect, useState, useRef } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface CountUpProps {
  value: string
  className?: string
  duration?: number
  delay?: number
}

export default function CountUp({ value, className = '', duration = 2000, delay = 0 }: CountUpProps) {
  const { ref, isVisible } = useScrollReveal<HTMLSpanElement>({ threshold: 0.5 })
  const [display, setDisplay] = useState(value)
  const hasPlayed = useRef(false)

  useEffect(() => {
    if (!isVisible || hasPlayed.current) return
    hasPlayed.current = true

    // Extract numeric part and prefix/suffix
    const match = value.match(/^([<>]?)(\d+\.?\d*)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }

    const prefix = match[1]
    const target = parseFloat(match[2])
    const suffix = match[3]
    const isDecimal = match[2].includes('.')
    const startTime = performance.now() + delay

    function animate(now: number) {
      const elapsed = now - startTime
      if (elapsed < 0) {
        requestAnimationFrame(animate)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      if (isDecimal) {
        setDisplay(`${prefix}${current.toFixed(1)}${suffix}`)
      } else {
        setDisplay(`${prefix}${Math.floor(current)}${suffix}`)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplay(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, value, duration, delay])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
