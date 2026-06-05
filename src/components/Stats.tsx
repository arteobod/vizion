'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useGsap3DReveal } from '@/hooks/useGsap3DReveal'
import { useLanguage } from '@/context/LanguageContext'
import CountUp from './CountUp'
import { Stat } from '@/types'

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const { locale } = useLanguage()
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })
  const label = (locale === 'ru' && stat.label_ru) ? stat.label_ru : (locale === 'lv' && stat.label_lv) ? stat.label_lv : stat.label
  const sublabel = (locale === 'ru' && stat.sublabel_ru) ? stat.sublabel_ru : (locale === 'lv' && stat.sublabel_lv) ? stat.sublabel_lv : stat.sublabel

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
        className="font-mono text-3xl lg:text-4xl font-bold text-fv-white block mb-2"
        delay={index * 150}
      />
      <span
        className="font-mono text-label text-fv-text-dim block mb-1"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.6s ease-out ${index * 120 + 400}ms`,
        }}
      >
        {label}
      </span>
      <span
        className="font-mono text-micro text-fv-text-muted"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.6s ease-out ${index * 120 + 550}ms`,
        }}
      >
        {sublabel}
      </span>
    </div>
  )
}

export default function Stats({ stats }: { stats: Stat[] }) {
  const gridRef = useGsap3DReveal<HTMLDivElement>()

  return (
    <section className="section-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCell key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
