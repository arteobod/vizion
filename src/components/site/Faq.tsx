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
              className={`overflow-hidden rounded-card border bg-white transition-colors duration-200 ${
                isOpen ? 'border-vz-blue/40 shadow-soft-sm' : 'border-vz-border'
              }`}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-bold text-vz-text sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                      isOpen ? 'bg-vz-orange text-white' : 'bg-vz-soft text-vz-blue-deep'
                    }`}
                  >
                    <Icon name={isOpen ? 'Minus' : 'Plus'} className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <p className="max-w-prose text-vz-body">{item.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
