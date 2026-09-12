'use client'

import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import PageHero from './PageHero'
import Section, { SectionHeading } from './Section'
import Reveal from './Reveal'
import Icon from './Icon'
import CtaBand from './CtaBand'
import type { Stat, TeamMember } from '@/types'

const VALUE_ICONS = ['MessagesSquare', 'Target', 'HandHeart', 'ShieldCheck']

export function AboutHero() {
  const { t } = useLanguage()
  return (
    <PageHero
      eyebrow={t.about.hero.eyebrow}
      title={t.about.hero.title}
      subtitle={t.about.hero.subtitle}
    />
  )
}

export function MissionAndStory({ stats }: { stats: Stat[] }) {
  const { t, locale } = useLanguage()

  return (
    <Section tone="white">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="text-h2 font-display">{t.about.mission.title}</h2>
          <p className="mt-5 text-lead text-vz-body">{t.about.mission.text}</p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="text-h2 font-display">{t.about.story.title}</h2>
          <p className="mt-5 text-lead text-vz-body">{t.about.story.text}</p>
        </Reveal>
      </div>

      {stats.length > 0 && (
        <div className="mt-14 grid gap-5 rounded-xl2 border border-vz-border bg-vz-soft p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.id} delay={i * 60}>
              <div className="text-center sm:text-left">
                <span className="font-display text-2xl font-extrabold text-vz-orange-deep">
                  {stat.value}
                </span>
                <p className="mt-1 font-medium text-vz-text">{loc(stat, 'label', locale)}</p>
                <p className="text-sm text-vz-muted">{loc(stat, 'sublabel', locale)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}

export function Values() {
  const { t } = useLanguage()

  return (
    <Section tone="soft">
      <SectionHeading title={t.about.values.title} className="mb-12" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {t.about.values.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="h-full">
            <div className="vz-surface flex h-full flex-col rounded-card p-6 text-center sm:text-left">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vz-orange-soft text-vz-orange-deep sm:mx-0">
                <Icon name={VALUE_ICONS[i] ?? 'Check'} className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-vz-text">{item.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-vz-body">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

/** Renders nothing while data/team.json is empty — the team block is optional. */
export function Team({ members }: { members: TeamMember[] }) {
  const { t, locale } = useLanguage()
  if (!members.length) return null

  return (
    <Section tone="white">
      <SectionHeading
        title={t.about.team.title}
        subtitle={t.about.team.subtitle}
        className="mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, i) => (
          <Reveal key={member.id} delay={i * 70} className="h-full">
            <div className="vz-surface h-full rounded-card p-6 text-center">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-vz-blue-soft font-display text-2xl font-extrabold text-vz-blue-deep">
                  {member.name.slice(0, 1)}
                </span>
              )}
              <h3 className="mt-4 font-display text-lg font-bold text-vz-text">{member.name}</h3>
              <p className="text-sm font-medium text-vz-blue-deep">{loc(member, 'role', locale)}</p>
              <p className="mt-3 text-[0.9375rem] text-vz-body">{loc(member, 'bio', locale)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function AboutCta() {
  const { t } = useLanguage()
  return (
    <CtaBand
      title={t.about.cta.title}
      text={t.about.cta.text}
      buttonLabel={t.about.cta.button}
    />
  )
}
