'use client'

import { useLanguage } from '@/context/LanguageContext'
import { loc, locArray } from '@/lib/i18n'
import PageHero from './PageHero'
import Section, { SectionHeading } from './Section'
import Reveal from './Reveal'
import ServiceCard from './ServiceCard'
import CaseCard from './CaseCard'
import Button from './Button'
import Icon from './Icon'
import Faq from './Faq'
import CtaBand from './CtaBand'
import type { Service, Project } from '@/types'

export function ServicesHero() {
  const { t } = useLanguage()
  return (
    <PageHero
      eyebrow={t.services.hero.eyebrow}
      title={t.services.hero.title}
      subtitle={t.services.hero.subtitle}
    />
  )
}

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <Section tone="white">
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

export function ServicesFaq() {
  const { t } = useLanguage()
  return (
    // The header links straight here, so the block needs an anchor — and a
    // scroll margin, because the header is fixed and would otherwise sit on
    // top of the heading it has just jumped to.
    <div id="faq" className="scroll-mt-28">
      <Faq
        title={t.services.faq.title}
        subtitle={t.services.faq.subtitle}
        items={t.services.faq.items}
        tone="soft"
      />
    </div>
  )
}

export function ServicesCta() {
  const { t } = useLanguage()
  return (
    <CtaBand
      title={t.services.cta.title}
      text={t.services.cta.text}
      buttonLabel={t.services.cta.button}
    />
  )
}

/** Full detail view for one service. */
export function ServiceDetail({
  service,
  relatedProjects,
}: {
  service: Service
  relatedProjects: Project[]
}) {
  const { t, locale } = useLanguage()
  const labels = t.services.labels

  return (
    <>
      <PageHero
        eyebrow={loc(service, 'tagline', locale)}
        title={loc(service, 'title', locale)}
        subtitle={loc(service, 'description', locale)}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href={`/contacts?service=${service.slug}`} size="lg">
            {t.common.getQuote}
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Button>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:ml-2">
            <span className="inline-flex items-center gap-1.5 text-vz-body">
              <Icon name="Clock" className="h-4 w-4 text-vz-blue" />
              {labels.timeline}: <strong className="font-semibold">{loc(service, 'timeline', locale)}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-vz-body">
              <Icon name="Gauge" className="h-4 w-4 text-vz-blue" />
              {labels.priceFrom} <strong className="font-semibold">{service.priceFrom}</strong>
            </span>
          </div>
        </div>
      </PageHero>

      {/* What it is / who it is for */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <h2 className="text-h2 font-display">{labels.whatItIs}</h2>
            <p className="mt-4 text-lead text-vz-body">{loc(service, 'whatItIs', locale)}</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-h2 font-display">{labels.forWhom}</h2>
            <p className="mt-4 text-lead text-vz-body">{loc(service, 'forWhom', locale)}</p>
          </Reveal>
        </div>
      </Section>

      {/* Problems and benefits, side by side */}
      <Section tone="soft">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="vz-surface h-full rounded-card p-6 sm:p-8">
              <h2 className="text-h3 font-display">{labels.problems}</h2>
              <ul className="mt-5 space-y-3">
                {locArray(service, 'problems', locale).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-vz-body">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vz-orange-soft">
                      <Icon name="X" className="h-3 w-3 text-vz-orange-deep" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90} className="h-full">
            <div className="vz-surface h-full rounded-card border-vz-blue/30 p-6 sm:p-8">
              <h2 className="text-h3 font-display">{labels.benefits}</h2>
              <ul className="mt-5 space-y-3">
                {locArray(service, 'benefits', locale).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-vz-body">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vz-blue-soft">
                      <Icon name="Check" className="h-3 w-3 text-vz-blue-deep" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Stages */}
      <Section tone="white">
        <SectionHeading title={labels.stages} className="mb-12" />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.stages.map((stage, i) => (
            <Reveal key={stage.title} delay={i * 70} className="h-full">
              <li className="vz-surface flex h-full flex-col rounded-card p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vz-orange-soft font-display text-sm font-extrabold text-vz-orange-deep">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-vz-text">
                  {loc(stage, 'title', locale)}
                </h3>
                <p className="mt-2 text-[0.9375rem] text-vz-body">{loc(stage, 'text', locale)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Related work */}
      {relatedProjects.length > 0 && (
        <Section tone="soft">
          <SectionHeading title={labels.examples} className="mb-12" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 80} className="h-full">
                <CaseCard project={project} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section tone="white" className="!py-0">
        <div className="flex justify-center pb-4">
          <Button href="/services" variant="ghost">
            <Icon name="ArrowLeft" className="h-4 w-4" />
            {t.common.backToServices}
          </Button>
        </div>
      </Section>

      <CtaBand
        title={t.services.cta.title}
        text={t.services.cta.text}
        buttonLabel={t.common.orderService}
      />
    </>
  )
}
