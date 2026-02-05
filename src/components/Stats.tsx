'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import CountUp from './CountUp'

const STATS = [
  { value: '50+', label: 'PROJECTS DELIVERED', sublabel: 'Since 2024' },
  { value: '99.9%', label: 'UPTIME GUARANTEED', sublabel: 'SLA Compliance' },
  { value: '<200ms', label: 'AVG RESPONSE TIME', sublabel: 'Edge-deployed' },
  { value: '24/7', label: 'SYSTEM MONITORING', sublabel: 'Automated alerts' },
]

function StatCell({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <div
      ref={ref}
      className={`grid-cell p-8 lg:p-10 text-center ${
        index < 3 ? 'lg:border-r-0' : ''
      } ${index < 2 ? 'border-b lg:border-b' : 'border-b-0 lg:border-b'}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `opacity 0.7s ease-out ${index * 120}ms, transform 0.7s ease-out ${index * 120}ms`,
      }}
    >
      <CountUp
        value={stat.value}
        className="font-mono text-3xl lg:text-4xl font-bold text-white block mb-2"
        delay={index * 150}
      />
      <span
        className="font-mono text-label text-fv-text-dim block mb-1"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.6s ease-out ${index * 120 + 400}ms`,
        }}
      >
        {stat.label}
      </span>
      <span
        className="font-mono text-micro text-fv-text-muted"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.6s ease-out ${index * 120 + 550}ms`,
        }}
      >
        {stat.sublabel}
      </span>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="section-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCell key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
