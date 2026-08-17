'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Entrance animation triggered when an element scrolls into view.
 *
 * `variant="3d"` brings the element forward through a shared perspective —
 * wrap a group of them in `.reveal-3d-scene` so they resolve toward one
 * vanishing point instead of each tilting independently.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'fade',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: 'fade' | '3d'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const base = variant === '3d' ? 'reveal-3d' : 'reveal'

  return (
    <div
      ref={ref}
      className={`${base} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
