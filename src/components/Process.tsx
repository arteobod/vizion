'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import TextScramble from './TextScramble'
import RevealText from './RevealText'

const STEPS = [
  {
    phase: '01',
    title: 'DISCOVERY',
    duration: '1-2 WEEKS',
    description: 'We audit your current systems, analyze requirements, and map the technical landscape. Every project begins with understanding the problem space completely.',
    deliverables: ['Technical Audit', 'Architecture Map', 'Scope Document'],
  },
  {
    phase: '02',
    title: 'ARCHITECTURE',
    duration: '1 WEEK',
    description: 'We design the system blueprint — database schemas, API contracts, infrastructure topology. Nothing is built until the foundation is mathematically sound.',
    deliverables: ['System Blueprint', 'API Contracts', 'Tech Stack Decision'],
  },
  {
    phase: '03',
    title: 'ENGINEERING',
    duration: '4-8 WEEKS',
    description: 'Sprint-based development with weekly deployments. You see progress in real-time. Every commit is tested, every deployment is automated.',
    deliverables: ['Working Product', 'CI/CD Pipeline', 'Test Coverage'],
  },
  {
    phase: '04',
    title: 'DEPLOYMENT',
    duration: '1 WEEK',
    description: 'Production launch with monitoring, alerting, and documentation. We don\'t disappear after launch — we ensure the system is battle-tested.',
    deliverables: ['Production Deploy', 'Monitoring Setup', 'Handover Docs'],
  },
]

function ProcessStep({ step, index }: { step: typeof STEPS[number]; index: number }) {
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
          <h4 className="font-mono text-xl font-bold text-white mb-2 group-hover:text-fv-orange transition-colors duration-500">
            <TextScramble text={step.title} delay={index * 150 + 200} scrambleDuration={500} />
          </h4>
          <span className="font-mono text-micro text-fv-text-muted">
            DURATION: {step.duration}
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
            {step.description}
          </p>
        </div>

        {/* Deliverables */}
        <div className="lg:col-span-3">
          <span className="font-mono text-micro text-fv-text-muted block mb-3">DELIVERABLES</span>
          <div className="space-y-2">
            {step.deliverables.map((d, dIndex) => (
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

export default function Process() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 })

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
            <span className="font-mono text-micro text-fv-text-muted">SECTION_03</span>
            <span
              className="h-px bg-fv-border transition-all ease-out"
              style={{ width: headerVisible ? 64 : 0, transitionDuration: '1s', transitionDelay: '300ms' }}
            />
            <TextScramble text="METHODOLOGY" className="font-mono text-label text-fv-text-dim" delay={200} />
          </div>
          <span className="font-mono text-micro text-fv-text-muted hidden sm:block">
            4 PHASES
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
          <h3 className="font-mono text-display-sm font-bold text-white">
            <RevealText tag="span" className="block" delay={0}>
              FROM ZERO TO
            </RevealText>
            <RevealText tag="span" className="block text-fv-orange" delay={300}>
              PRODUCTION
            </RevealText>
          </h3>
        </div>

        {/* Steps */}
        {STEPS.map((step, index) => (
          <ProcessStep key={step.phase} step={step} index={index} />
        ))}
      </div>
    </section>
  )
}
