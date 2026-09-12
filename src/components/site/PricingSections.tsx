'use client'

import { useLanguage } from '@/context/LanguageContext'
import { loc, locArray } from '@/lib/i18n'
import { useCardMotion } from '@/hooks/useCardMotion'
import PageHero from './PageHero'
import Section, { SectionHeading } from './Section'
import Reveal from './Reveal'
import Button from './Button'
import Icon from './Icon'
import CtaBand from './CtaBand'
import type { PricingTier } from '@/types'

const FACTOR_ICONS = ['Layers', 'MessagesSquare', 'Clock']

export function PricingHero() {
  const { t } = useLanguage()
  return (
    <PageHero
      eyebrow={t.pricing.hero.eyebrow}
      title={t.pricing.hero.title}
      subtitle={t.pricing.hero.subtitle}
    />
  )
}

export function PricingIntro() {
  const { t } = useLanguage()
  return (
    <Section tone="white" className="!pb-0">
      <div className="mx-auto max-w-prose text-center">
        <h2 className="text-h2 font-display">{t.pricing.intro.title}</h2>
        <p className="mt-4 text-lead text-vz-body">{t.pricing.intro.text}</p>
      </div>
    </Section>
  )
}

function PricingCard({ tier, labels }: { tier: PricingTier; labels: Record<string, string> }) {
  const { locale } = useLanguage()
  const motion = useCardMotion()

  return (
    <div
      {...motion}
      className={`vz-surface vz-surface-interactive spotlight tilt relative flex h-full flex-col rounded-card p-6 sm:p-7 ${
        // The recommended tier is raised out of the row rather than just
        // outlined: it sits a little proud, carries a warmer drop, and takes the
        // warm pointer glow. An orange border alone was doing all the work of
        // saying "pick this one", which on a four-card row is a very quiet ask.
        tier.popular ? 'spotlight-warm vz-tier-popular' : ''
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-vz-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-soft-sm">
          {labels.popular}
        </span>
      )}

      <h3 className="text-h3 font-display">{loc(tier, 'name', locale)}</h3>
      <p className="mt-2.5 text-[0.9375rem] text-vz-body">
        {loc(tier, 'description', locale)}
      </p>

      <p className="mt-5">
        <span className="text-sm text-vz-muted">{labels.from} </span>
        <span className="font-display text-2xl font-extrabold text-vz-text">
          {tier.priceFrom}
        </span>
        <span className="text-vz-muted"> — {tier.priceTo}</span>
      </p>

      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-vz-muted">
        <Icon name="Clock" className="h-4 w-4 text-vz-blue" />
        {labels.timeline}: {loc(tier, 'timeline', locale)}
      </p>

      <div className="mt-5 flex-1 border-t border-vz-border pt-5">
        <p className="text-sm font-semibold text-vz-text">{labels.includes}</p>
        <ul className="mt-3 space-y-2.5">
          {locArray(tier, 'includes', locale).map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-vz-body">
              <Icon
                name="Check"
                className="mt-1 h-4 w-4 shrink-0 text-vz-blue"
                strokeWidth={2.25}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Button
        href={`/contacts?service=${tier.serviceSlug}`}
        variant={tier.popular ? 'primary' : 'secondary'}
        className="mt-6 w-full"
      >
        {labels.chooseThis}
      </Button>
    </div>
  )
}

export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  const { t } = useLanguage()
  const labels = t.pricing.labels

  return (
    <Section tone="white">
      <div className="reveal-3d-scene grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier, i) => (
          <Reveal key={tier.id} variant="3d" delay={i * 90} className="h-full">
            <PricingCard tier={tier} labels={labels} />
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-vz-muted">{t.pricing.note}</p>
    </Section>
  )
}

export function PricingFactors() {
  const { t } = useLanguage()

  return (
    <Section tone="soft">
      <SectionHeading
        title={t.pricing.factors.title}
        subtitle={t.pricing.factors.subtitle}
        className="mb-12"
      />
      <div className="grid gap-6 md:grid-cols-3">
        {t.pricing.factors.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="h-full">
            <div className="vz-surface h-full rounded-card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-soft bg-vz-blue-soft text-vz-blue-deep">
                <Icon name={FACTOR_ICONS[i] ?? 'Layers'} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-vz-text">{item.title}</h3>
              <p className="mt-2 text-vz-body">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function PricingCta() {
  const { t } = useLanguage()
  return (
    <CtaBand
      title={t.pricing.custom.title}
      text={t.pricing.custom.text}
      buttonLabel={t.pricing.custom.button}
    />
  )
}
