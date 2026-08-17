'use client'

import { useMemo, type CSSProperties } from 'react'

/**
 * Progressive ("gradual") blur overlay for an edge of the viewport or a parent.
 *
 * A single backdrop-filter blur has a hard seam. This stacks several masked
 * layers whose blur ramps up along a gradient, so content dissolves smoothly
 * into the edge — the windows on the home page rise up out of the blurred
 * bottom into focus. Ported to TypeScript from the React Bits component
 * (github.com/ansh-dhanani); no external deps, SSR-safe.
 */

type Position = 'top' | 'bottom' | 'left' | 'right'
type Curve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'

const CURVES: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
}

const DIRECTION: Record<Position, string> = {
  top: 'to top',
  bottom: 'to bottom',
  left: 'to left',
  right: 'to right',
}

export default function GradualBlur({
  position = 'bottom',
  height = '6rem',
  width,
  strength = 2,
  divCount = 5,
  exponential = false,
  curve = 'linear',
  opacity = 1,
  target = 'parent',
  zIndex = 1000,
  className = '',
  style,
}: {
  position?: Position
  height?: string
  width?: string
  strength?: number
  divCount?: number
  exponential?: boolean
  curve?: Curve
  opacity?: number
  target?: 'parent' | 'page'
  zIndex?: number
  className?: string
  style?: CSSProperties
}) {
  const layers = useMemo(() => {
    const increment = 100 / divCount
    const curveFn = CURVES[curve] ?? CURVES.linear
    const direction = DIRECTION[position]
    const out: CSSProperties[] = []

    for (let i = 1; i <= divCount; i++) {
      const progress = curveFn(i / divCount)
      const blur = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength

      const p1 = Math.round((increment * i - increment) * 10) / 10
      const p2 = Math.round(increment * i * 10) / 10
      const p3 = Math.round((increment * i + increment) * 10) / 10
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10

      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      const mask = `linear-gradient(${direction}, ${gradient})`
      out.push({
        position: 'absolute',
        inset: 0,
        maskImage: mask,
        WebkitMaskImage: mask,
        backdropFilter: `blur(${blur.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
        opacity,
      })
    }
    return out
  }, [position, strength, divCount, exponential, curve, opacity])

  const isVertical = position === 'top' || position === 'bottom'
  const isPage = target === 'page'

  const containerStyle: CSSProperties = {
    position: isPage ? 'fixed' : 'absolute',
    pointerEvents: 'none',
    zIndex: isPage ? zIndex + 100 : zIndex,
    ...(isVertical
      ? { height, width: width || '100%', left: 0, right: 0, [position]: 0 }
      : { width: width || height, height: '100%', top: 0, bottom: 0, [position]: 0 }),
    ...style,
  }

  return (
    <div
      aria-hidden="true"
      className={`isolate ${className}`}
      style={containerStyle}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {layers.map((s, i) => (
          <div key={i} style={s} />
        ))}
      </div>
    </div>
  )
}
