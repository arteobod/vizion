'use client'

import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import PageHero from './PageHero'
import Section from './Section'
import Icon from './Icon'
import ContactForm from './ContactForm'
import type { SiteContent } from '@/types'

// Service slugs used across the site map onto the form's project types.
const SERVICE_TO_TYPE: Record<string, string> = {
  'website-development': 'website',
  redesign: 'redesign',
  'b2b-tools': 'utility',
}

export function ContactsHero() {
  const { t } = useLanguage()
  return (
    <PageHero
      eyebrow={t.contacts.hero.eyebrow}
      title={t.contacts.hero.title}
      subtitle={t.contacts.hero.subtitle}
    />
  )
}

export function ContactsBody({ siteContent }: { siteContent: SiteContent }) {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const preset = SERVICE_TO_TYPE[searchParams.get('service') ?? ''] ?? ''

  const details = [
    {
      icon: 'Mail',
      label: t.contacts.info.emailLabel,
      value: siteContent.contact.email,
      href: `mailto:${siteContent.contact.email}`,
    },
    {
      icon: 'Phone',
      label: t.contacts.info.phoneLabel,
      value: siteContent.contact.phone,
      href: `tel:${(siteContent.contact.phone ?? '').replace(/\s/g, '')}`,
    },
    {
      icon: 'MapPin',
      label: t.contacts.info.locationLabel,
      // Prefer the translated value; fall back to the admin-editable field.
      value: t.contacts.info.locationValue || siteContent.contact.location,
    },
    {
      icon: 'Clock',
      label: t.contacts.info.responseLabel,
      value: t.contacts.info.responseValue || siteContent.contact.responseTime,
    },
  ].filter((d) => d.value)

  return (
    <Section tone="white">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
        <div className="lg:col-span-3">
          <h2 className="text-h2 font-display">{t.contacts.form.title}</h2>
          <p className="mt-3 text-vz-body">{t.contacts.form.subtitle}</p>
          <div className="mt-8">
            <ContactForm preset={preset} />
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-card border border-vz-border bg-vz-soft p-6 sm:p-7">
            <h2 className="font-display text-lg font-bold text-vz-text">
              {t.contacts.info.title}
            </h2>
            <ul className="mt-5 space-y-5">
              {details.map((detail) => (
                <li key={detail.label} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-soft bg-white text-vz-blue-deep shadow-soft-sm">
                    <Icon name={detail.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-vz-muted">{detail.label}</p>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="font-medium text-vz-text transition-colors hover:text-vz-orange-deep"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="font-medium text-vz-text">{detail.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  )
}
