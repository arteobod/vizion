'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useGsap3DReveal } from '@/hooks/useGsap3DReveal'
import { useLanguage } from '@/context/LanguageContext'
import TextScramble from './TextScramble'
import RevealText from './RevealText'
import { ProcessStep as ProcessStepType } from '@/types'

function ProcessStep({ step, index }: { step: ProcessStepType; index: number }) {
  const { t, locale } = useLanguage()
  const title = (locale === 'ru' && step.title_ru) ? step.title_ru : (locale === 'lv' && step.title_lv) ? step.title_lv : step.title
  const description = (locale === 'ru' && step.description_ru) ? step.description_ru : (locale === 'lv' && step.description_lv) ? step.description_lv : step.description
  const deliverables = (locale === 'ru' && step.deliverables_ru?.length) ? step.deliverables_ru : (locale === 'lv' && step.deliverables_lv?.length) ? step.deliverables_lv : step.deliverables
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className="border-b border-fv-border group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s ease-out ${index * 150}ms, transform 0.8s ease-out ${index * 150}ms`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 lg:py-14">
        {/* Phase number */}
        <div className="lg:col-span-2 flex items-start gap-4">
          <span
            className="font-mono text-5xl lg:text-6xl font-bold text-fv-border group-hover:text-fv-orange transition-colors duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
              transition: `opacity 0.6s ease-out ${index * 150 + 100}ms, transform 0.6s ease-out ${index * 150 + 100}ms`,
            }}
          >
            {step.phase}
          </span>
        </div>

        {/* Title + Duration */}
        <div className="lg:col-span-3">
          <h4 className="font-mono text-xl font-bold text-fv-white mb-2 group-hover:text-fv-orange transition-colors duration-500">
            <TextScramble text={title} delay={index * 150 + 200} scrambleDuration={500} />
          </h4>
          <span className="font-mono text-micro text-fv-text-muted">
            {t.process.durationLabel}: {step.duration}
          </span>
        </div>

        {/* Description */}
        <div className="lg:col-span-4">
          <p
            className="font-sans text-sm text-fv-text-dim leading-relaxed"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: `opacity 0.8s ease-out ${index * 150 + 350}ms`,
            }}
          >
            {description}
          </p>
        </div>

        {/* Deliverables */}
        <div className="lg:col-span-3">
          <span className="font-mono text-micro text-fv-text-muted block mb-3">{t.process.deliverablesLabel}</span>
          <div className="space-y-2">
            {deliverables.map((d, dIndex) => (
              <div
                key={d}
                className="flex items-center gap-2"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(15px)',
                  transition: `opacity 0.5s ease-out ${index * 150 + 450 + dIndex * 80}ms, transform 0.5s ease-out ${index * 150 + 450 + dIndex * 80}ms`,
                }}
              >
                <span className="w-1 h-1 bg-fv-orange flex-shrink-0" />
                <span className="font-mono text-xs text-fv-text-dim">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Process({ steps }: { steps: ProcessStepType[] }) {
  const { t } = useLanguage()
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 })
  const stepsRef = useGsap3DReveal<HTMLDivElement>()

  return (
    <section id="process" className="section-border">
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div
          ref={headerRef}
          className="border-b border-fv-border py-8 flex items-center justify-between"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <div className="flex items-center gap-6">
            <span className="font-mono text-micro text-fv-text-muted">{t.process.sectionLabel}</span>
            <span
              className="h-px bg-fv-border transition-all ease-out"
              style={{ width: headerVisible ? 64 : 0, transitionDuration: '1s', transitionDelay: '300ms' }}
            />
            <TextScramble text={t.process.title} className="font-mono text-label text-fv-text-dim" delay={200} />
          </div>
          <span className="font-mono text-micro text-fv-text-muted hidden sm:block">
            {steps.length} {t.process.count}
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Big title with RevealText */}
        <div
          ref={titleRef}
          className="py-12 lg:py-20 border-b border-fv-border"
          style={{
            opacity: titleVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <h3 className="font-mono text-display-sm font-bold text-fv-white">
            <RevealText tag="span" className="block" delay={0}>
              {t.process.headline[0]}
            </RevealText>
            <RevealText tag="span" className="block text-fv-orange" delay={300}>
              {t.process.headline[1]}
            </RevealText>
          </h3>
        </div>

        {/* Steps */}
        <div ref={stepsRef}>
          {steps.map((step, index) => (
            <ProcessStep key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
