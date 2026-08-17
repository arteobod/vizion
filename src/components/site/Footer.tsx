'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import Container from './Container'
import Icon from './Icon'
import type { Service, SiteContent } from '@/types'

export default function Footer({
  services,
  siteContent,
}: {
  services: Service[]
  siteContent: SiteContent
}) {
  const { t, locale } = useLanguage()
  const year = new Date().getFullYear()

  // `relative z-10` lifts the footer clear of the home page's fixed decorative
  // layer. That layer is viewport-fixed, so once the reader reaches the bottom
  // its drifting panes land squarely on the footer text and the contact
  // details become unreadable.
  return (
    <footer className="relative z-10 border-t border-vz-border bg-vz-soft">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          <div className="lg:pr-6">
            <Link href="/" className="font-display text-xl font-extrabold text-vz-text">
              Vi<span className="text-vz-orange">ž</span>on
            </Link>
            <p className="mt-3 text-[0.9375rem] font-medium text-vz-text">{t.footer.tagline}</p>
            <p className="mt-2 text-sm text-vz-muted">{t.footer.description}</p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-vz-muted">
              {t.footer.navigation}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: '/about', label: t.nav.about },
                { href: '/services', label: t.nav.services },
                { href: '/work', label: t.nav.portfolio },
                { href: '/pricing', label: t.nav.pricing },
                { href: '/contacts', label: t.nav.contacts },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.9375rem] text-vz-body transition-colors hover:text-vz-orange-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-vz-muted">
              {t.footer.servicesTitle}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[0.9375rem] text-vz-body transition-colors hover:text-vz-orange-deep"
                  >
                    {loc(service, 'title', locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-vz-muted">
              {t.footer.contactTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-[0.9375rem]">
              <li>
                <a
                  href={`mailto:${siteContent.contact.email}`}
                  className="inline-flex items-center gap-2 text-vz-body transition-colors hover:text-vz-orange-deep"
                >
                  <Icon name="Mail" className="h-4 w-4 text-vz-blue" />
                  {siteContent.contact.email}
                </a>
              </li>
              {siteContent.contact.phone && (
                <li>
                  <a
                    href={`tel:${siteContent.contact.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-vz-body transition-colors hover:text-vz-orange-deep"
                  >
                    <Icon name="Phone" className="h-4 w-4 text-vz-blue" />
                    {siteContent.contact.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2 text-vz-body">
                <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0 text-vz-blue" />
                {siteContent.contact.location}
              </li>
              <li className="flex items-start gap-2 text-vz-muted">
                <Icon name="Clock" className="mt-0.5 h-4 w-4 shrink-0 text-vz-blue" />
                {t.footer.responseTime}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-vz-border py-6 text-sm text-vz-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Vižon. {t.footer.copyright}
          </p>
          <Link
            href="/privatuma-politika"
            className="transition-colors hover:text-vz-orange-deep"
          >
            {t.footer.privacyPolicy}
          </Link>
        </div>
      </Container>
    </footer>
  )
}
