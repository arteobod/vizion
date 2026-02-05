'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]=/\\'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  scrambleDuration?: number
}

export default function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30,
  scrambleDuration = 800,
}: TextScrambleProps) {
  const { ref, isVisible } = useScrollReveal<HTMLSpanElement>({ threshold: 0.3 })
  const [display, setDisplay] = useState('')
  const hasPlayed = useRef(false)

  const scramble = useCallback(() => {
    if (hasPlayed.current) return
    hasPlayed.current = true

    const chars = text.split('')
    const resolved = new Array(chars.length).fill(false)
    let frame = 0

    // Phase 1: Random characters appear
    const interval = setInterval(() => {
      frame++
      const progress = Math.min(frame * speed / scrambleDuration, 1)

      const output = chars.map((char, i) => {
        if (char === ' ') return ' '
        if (resolved[i]) return char
        // Resolve characters progressively from left to right
        if (progress > (i / chars.length) * 0.7 + 0.3) {
          resolved[i] = true
          return char
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })

      setDisplay(output.join(''))

      if (resolved.every(Boolean)) {
        clearInterval(interval)
      }
    }, speed)
  }, [text, speed, scrambleDuration])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(scramble, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay, scramble])

  return (
    <span ref={ref} className={className}>
      {display || (isVisible ? text : '\u00A0'.repeat(text.length))}
    </span>
  )
}
