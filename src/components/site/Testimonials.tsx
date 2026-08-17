'use client'

import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import Section, { SectionHeading } from './Section'
import Reveal from './Reveal'
import Icon from './Icon'
import type { Testimonial } from '@/types'

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const { t, locale } = useLanguage()
  if (!items.length) return null

  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow={t.home.testimonials.eyebrow}
        title={t.home.testimonials.title}
        className="mb-12"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 80} className="h-full">
            <figure className="flex h-full flex-col rounded-card border border-vz-border bg-white p-6 shadow-soft-sm sm:p-7">
              <Icon name="Quote" className="h-7 w-7 text-vz-blue" />
              <blockquote className="mt-4 flex-1 text-vz-body">
                {loc(item, 'text', locale)}
              </blockquote>
              <figcaption className="mt-6 border-t border-vz-border pt-4">
                <span className="block font-semibold text-vz-text">{item.author}</span>
                <span className="block text-sm text-vz-muted">
                  {loc(item, 'role', locale)}, {item.company}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
