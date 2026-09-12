'use client'

import { useState } from 'react'
import Section, { SectionHeading } from './Section'
import Icon from './Icon'

export default function Faq({
  title,
  subtitle,
  items,
  tone = 'white',
}: {
  title: string
  subtitle?: string
  items: { q: string; a: string }[]
  tone?: 'white' | 'soft' | 'tint'
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section tone={tone}>
      <SectionHeading title={title} subtitle={subtitle} className="mb-10" />

      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i
          return (
            <div
              key={item.q}
              className={`vz-surface overflow-hidden rounded-card ${
                isOpen ? 'vz-faq-open' : ''
              }`}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="vz-faq-trigger flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-bold text-vz-text sm:text-lg">
                    {item.q}
                  </span>
                  {/* One glyph that rotates, not two that swap. A plus replaced
                      by a minus is a jump cut; the same mark turning through 45°
                      is the control acknowledging the press. */}
                  <span
                    aria-hidden="true"
                    className={`vz-faq-mark flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isOpen ? 'bg-vz-orange text-white' : 'bg-vz-soft text-vz-blue-deep'
                    }`}
                  >
                    <Icon name="Plus" className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              {/*
                Always rendered, and opened by animating a grid track from 0fr to
                1fr — the one way to transition to a height the content decides.
                It used to be `{isOpen && …}`, so the answer appeared and vanished
                instantly and the card below it jumped: the single most-used
                control on these pages was also the least considered.
              */}
              <div className="vz-faq-panel">
                <div className="overflow-hidden">
                  <p className="max-w-prose px-5 pb-5 text-vz-body sm:px-6 sm:pb-6">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
