'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

interface RevealTextProps {
  children: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  delay?: number
  splitBy?: 'word' | 'char'
}

export default function RevealText({
  children,
  className = '',
  tag: Tag = 'span',
  delay = 0,
  splitBy = 'word',
}: RevealTextProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 })

  const units = splitBy === 'word'
    ? children.split(' ').map((word, i, arr) => (i < arr.length - 1 ? word + '\u00A0' : word))
    : children.split('')

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`${className}`}>
      {units.map((unit, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${delay + i * (splitBy === 'word' ? 80 : 25)}ms`,
            }}
          >
            {unit}
          </span>
        </span>
      ))}
    </Tag>
  )
}
