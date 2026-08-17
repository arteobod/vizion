'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import { useCardMotion } from '@/hooks/useCardMotion'
import Icon from './Icon'
import type { Service } from '@/types'

export default function ServiceCard({
  service,
  flat = false,
}: {
  service: Service
  /** Drop the card's own border — used when a wrapper supplies an animated one. */
  flat?: boolean
}) {
  const { t, locale } = useLanguage()
  const motion = useCardMotion()

  return (
    <Link
      {...motion}
      href={`/services/${service.slug}`}
      className={`spotlight tilt group flex h-full flex-col rounded-card bg-white p-6 shadow-soft-sm duration-300 hover:shadow-soft-lg sm:p-7 ${
        flat ? '' : 'border border-vz-border hover:border-vz-blue/40'
      }`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-soft bg-vz-blue-soft text-vz-blue-deep transition-colors duration-300 group-hover:bg-vz-blue group-hover:text-white">
        <Icon name={service.icon} className="h-6 w-6" />
      </span>

      <h3 className="mt-5 text-h3 font-display">{loc(service, 'title', locale)}</h3>
      <p className="mt-1.5 text-[0.9375rem] font-medium text-vz-blue-deep">
        {loc(service, 'tagline', locale)}
      </p>
      <p className="mt-3 flex-1 text-vz-body">{loc(service, 'description', locale)}</p>

      <span className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-vz-orange-deep">
        {t.common.learnMore}
        <Icon
          name="ArrowRight"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </Link>
  )
}
