'use client'

import { useLanguage } from '@/context/LanguageContext'
import Section, { SectionHeading } from './Section'
import Reveal from './Reveal'
import Button from './Button'
import Icon from './Icon'
import ServiceCard from './ServiceCard'
import CaseCard from './CaseCard'
import CtaBand from './CtaBand'
import type { Service, Project } from '@/types'

const WHY_ICONS = ['ShieldCheck', 'MessagesSquare', 'UserRoundCheck', 'LifeBuoy']

export function ServicesOverview({ services }: { services: Service[] }) {
  const { t } = useLanguage()

  return (
    <Section tone="white" id="services">
      <SectionHeading
        eyebrow={t.home.services.eyebrow}
        title={t.home.services.title}
        subtitle={t.home.services.subtitle}
        className="mb-12"
      />
      <div className="reveal-3d-scene grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.id} variant="3d" delay={i * 110} className="h-full">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function WhyUs() {
  const { t } = useLanguage()

  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow={t.home.why.eyebrow}
        title={t.home.why.title}
        className="mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {t.home.why.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="h-full">
            <div className="flex h-full flex-col rounded-card border border-vz-border bg-white p-6 text-center shadow-soft-sm sm:text-left">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vz-blue-soft text-vz-blue-deep sm:mx-0">
                <Icon name={WHY_ICONS[i] ?? 'Check'} className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-vz-text">{item.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-vz-body">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function CasesPreview({ projects }: { projects: Project[] }) {
  const { t } = useLanguage()
  if (!projects.length) return null

  return (
    <Section tone="white">
      <SectionHeading
        eyebrow={t.home.cases.eyebrow}
        title={t.home.cases.title}
        subtitle={t.home.cases.subtitle}
        className="mb-12"
      />
      <div className="reveal-3d-scene grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} variant="3d" delay={i * 110} className="h-full">
            <CaseCard project={project} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/work" variant="secondary" size="lg">
          {t.common.allCases}
          <Icon name="ArrowRight" className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  )
}

export function HomeCta() {
  const { t } = useLanguage()
  return (
    <CtaBand
      title={t.home.cta.title}
      text={t.home.cta.text}
      buttonLabel={t.home.cta.button}
    />
  )
}
