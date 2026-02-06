'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import TextScramble from './TextScramble'
import { Service } from '@/types'

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`grid-cell p-8 lg:p-12 group cursor-default ${
        index % 2 === 0 ? 'md:border-r-0' : ''
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${index * 150}ms, transform 0.8s ease-out ${index * 150}ms`,
      }}
    >
      {/* Top row: number + metric */}
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono text-micro text-fv-text-muted">
          [{service.id}]
        </span>
        <div className="text-right">
          <span className="font-mono text-2xl lg:text-3xl font-bold text-fv-text group-hover:text-fv-orange transition-colors duration-500">
            {service.metric}
          </span>
          <span className="block font-mono text-micro text-fv-text-muted mt-1">
            {service.metricLabel}
          </span>
        </div>
      </div>

      {/* Title with scramble effect */}
      <h3 className="font-mono text-2xl lg:text-3xl font-bold text-white leading-tight whitespace-pre-line mb-6 group-hover:text-fv-orange transition-colors duration-500">
        <TextScramble text={service.title} delay={index * 200} scrambleDuration={600} />
      </h3>

      {/* Description */}
      <p className="font-sans text-sm text-fv-text-dim leading-relaxed mb-8 max-w-sm">
        {service.description}
      </p>

      {/* Tags — staggered fade in */}
      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag, tagIndex) => (
          <span
            key={tag}
            className="font-mono text-micro px-2 py-1 border border-fv-border text-fv-text-muted group-hover:border-fv-orange/30 transition-colors duration-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.5s ease-out ${index * 150 + 400 + tagIndex * 60}ms, transform 0.5s ease-out ${index * 150 + 400 + tagIndex * 60}ms`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom accent line on hover */}
      <div className="mt-8 h-px bg-fv-border relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-fv-orange w-0 group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  )
}

export default function Services({ services }: { services: Service[] }) {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section id="services" className="section-border">
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
            <span className="font-mono text-micro text-fv-text-muted">SECTION_01</span>
            <span
              className="h-px bg-fv-border transition-all ease-out"
              style={{ width: headerVisible ? 64 : 0, transitionDuration: '1s', transitionDelay: '300ms' }}
            />
            <TextScramble text="CAPABILITIES" className="font-mono text-label text-fv-text-dim" delay={200} />
          </div>
          <span className="font-mono text-micro text-fv-text-muted hidden sm:block">
            {services.length} SERVICES
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
