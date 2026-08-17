'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import { useCardMotion } from '@/hooks/useCardMotion'
import Icon from './Icon'
import CountUp from './CountUp'
import type { Project } from '@/types'

export default function CaseCard({ project }: { project: Project }) {
  const { t, locale } = useLanguage()
  const motion = useCardMotion()
  const headline = project.results?.[0]

  return (
    <Link
      {...motion}
      href={`/work/${project.slug}`}
      className="spotlight tilt group flex h-full flex-col overflow-hidden rounded-card border border-vz-border bg-white shadow-soft-sm duration-300 hover:border-vz-blue/40 hover:shadow-soft-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-vz-tint">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={loc(project, 'title', locale)}
            className="h-full w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          // Placeholder until a real screenshot is uploaded via the admin panel
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-vz-blue-soft to-vz-orange-soft">
            <span className="font-display text-3xl font-extrabold text-vz-blue-deep/70">
              {/* Own projects have no client, which would leave the plate
                  blank — fall back to the title. */}
              {(project.client || loc(project, 'title', locale)).slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {headline && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-vz-orange-deep shadow-soft-sm backdrop-blur">
            <CountUp value={headline.value} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-sm font-medium text-vz-blue-deep">
          {loc(project, 'type', locale)}
        </span>
        <h3 className="mt-1.5 text-h3 font-display">{loc(project, 'title', locale)}</h3>
        <p className="mt-2.5 flex-1 text-[0.9375rem] text-vz-body">
          {loc(project, 'description', locale)}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-vz-orange-deep">
          {t.common.viewCase}
          <Icon
            name="ArrowRight"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}
