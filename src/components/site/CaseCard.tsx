'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import { cardImage } from '@/lib/media'
import { useCardMotion } from '@/hooks/useCardMotion'
import Icon from './Icon'
import CountUp from './CountUp'
import type { CaseCardData } from '@/lib/view'

// Narrowed to the fields this card renders — see `toCaseCardData`.
export default function CaseCard({ project }: { project: CaseCardData }) {
  const { t, locale } = useLanguage()
  const motion = useCardMotion()
  const headline = project.results?.[0]

  // Case images are lazy-loaded, so they arrive well after the card and used to
  // snap in at full opacity over the placeholder — the most-looked-at element on
  // the page was also the only one that appeared without any transition.
  //
  // The ref check covers the cached case: an image already in the browser cache
  // can finish decoding before React attaches the handler, and `onLoad` never
  // fires. Without it a returning visitor gets cards that stay blank.
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const markLoaded = () => setLoaded(true)

  // Start on the card-sized variant and fall back to the stored original if it
  // is not there. Images uploaded through the admin panel have no variant, and
  // a missing screenshot would be a far worse bug than a large one.
  const [src, setSrc] = useState(() => cardImage(project.image))

  const onImageError = () => {
    if (src !== project.image) {
      setSrc(project.image)
      return
    }
    // The original failed too — stop hiding the frame behind a fade that will
    // never complete.
    markLoaded()
  }

  return (
    <Link
      {...motion}
      href={`/work/${project.slug}`}
      className="vz-surface vz-surface-interactive spotlight tilt group flex h-full flex-col overflow-hidden rounded-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-vz-tint">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={(el) => {
              imgRef.current = el
              // Already decoded from cache before the handler existed.
              if (el?.complete && el.naturalWidth > 0) setLoaded(true)
            }}
            src={src}
            alt={loc(project, 'title', locale)}
            onLoad={markLoaded}
            // A broken image should not leave the frame permanently blank.
            onError={onImageError}
            // The hover zoom lives in `.vz-img` too — see globals.css. Declaring
            // it here as well would put two rules on one property.
            className={`vz-img h-full w-full object-cover ${loaded ? 'vz-img-in' : ''}`}
            loading="lazy"
            decoding="async"
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
