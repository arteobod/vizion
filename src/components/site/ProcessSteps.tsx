'use client'

import { useLanguage } from '@/context/LanguageContext'
import { loc, locArray } from '@/lib/i18n'
import Section, { SectionHeading } from './Section'
import Reveal from './Reveal'
import Icon from './Icon'
import type { ProcessStep } from '@/types'

/**
 * Visual timeline. The icons carry the four stages; text is trimmed to a
 * single supporting line plus compact chips, so the section is read at a
 * glance rather than word by word.
 */
export default function ProcessSteps({
  steps,
  tone = 'white',
  title,
  subtitle,
  eyebrow,
}: {
  steps: ProcessStep[]
  tone?: 'white' | 'soft' | 'tint'
  title?: string
  subtitle?: string
  eyebrow?: string
}) {
  const { t, locale } = useLanguage()

  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow={eyebrow ?? t.process.eyebrow}
        title={title ?? t.process.title}
        subtitle={subtitle ?? t.process.subtitle}
        className="mb-14"
      />

      <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Connecting rail behind the icons on desktop */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-vz-border via-vz-blue/40 to-vz-border lg:block"
        />

        {steps.map((step, i) => (
          <Reveal key={step.id} delay={i * 90} className="h-full">
            <li className="relative flex h-full flex-col items-start text-left">
              {/* Large icon marker */}
              <div className="relative flex items-center gap-3 lg:block">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-vz-border">
                  <Icon name={step.icon ?? 'Layers'} className="h-7 w-7 text-vz-blue-deep" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-vz-orange font-display text-xs font-extrabold text-white shadow-cta">
                    {step.phase}
                  </span>
                </span>
                <h3 className="text-h3 font-display lg:hidden">{loc(step, 'title', locale)}</h3>
              </div>

              <h3 className="mt-5 hidden text-lg font-bold font-display text-vz-text lg:block">
                {loc(step, 'title', locale)}
              </h3>

              <p className="mt-2 text-[0.9375rem] text-vz-body">
                {loc(step, 'description', locale)}
              </p>

              {/* Duration pill */}
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-vz-blue-soft px-3 py-1 text-sm font-medium text-vz-blue-deep">
                <Icon name="Clock" className="h-3.5 w-3.5" />
                {loc(step, 'duration', locale)}
              </span>

              {/* Deliverable chips */}
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {locArray(step, 'deliverables', locale).map((del) => (
                  <li
                    key={del}
                    className="inline-flex items-center gap-1 rounded-full bg-vz-soft px-2.5 py-1 text-xs text-vz-body"
                  >
                    <Icon name="Check" className="h-3 w-3 text-vz-blue" strokeWidth={2.5} />
                    {del}
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
