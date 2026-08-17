'use client'

import { useLanguage } from '@/context/LanguageContext'
import Container from './Container'
import Button from './Button'
import Icon from './Icon'

export default function Hero() {
  const { t } = useLanguage()

  return (
    // Transparent — the site-wide 3D panels render behind this and sit in the
    // empty right column beside the headline.
    <section className="relative border-b border-vz-border">
      {/* Legibility wash so the headline holds over the panels */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-vz-bg via-vz-bg/85 to-transparent lg:via-vz-bg/55"
      />

      <Container className="relative">
        <div className="flex min-h-[82vh] flex-col justify-center py-20 lg:min-h-[88vh]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-vz-blue-soft px-4 py-1.5 text-sm font-medium text-vz-blue-deep">
            <Icon name="MapPin" className="h-4 w-4" />
            {t.home.hero.eyebrow}
          </span>

          <h1 className="mt-6 max-w-[16ch] font-display text-mega font-extrabold text-vz-text">
            {t.home.hero.title}
          </h1>

          <p className="mt-6 max-w-lg text-lead text-vz-body">{t.home.hero.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contacts" size="lg">
              {t.home.hero.ctaPrimary}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              {t.home.hero.ctaSecondary}
            </Button>
          </div>

          <p className="mt-6 text-sm text-vz-muted">{t.home.hero.trust}</p>
        </div>
      </Container>
    </section>
  )
}
