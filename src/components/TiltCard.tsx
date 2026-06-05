'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export default function TiltCard({ children, className = '', maxTilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 260, damping: 28 }
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)

  // Glare position follows mouse
  const glareX = useTransform(rawX, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(rawY, [-0.5, 0.5], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.07), transparent 55%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div ref={ref} className={`perspective-wrapper ${className}`} style={{ perspective: '1200px' }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full"
      >
        {children}

        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 rounded-[inherit]"
          style={{ background: glareBackground }}
        />
      </motion.div>
    </div>
  )
}
