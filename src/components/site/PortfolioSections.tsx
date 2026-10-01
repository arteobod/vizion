'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { loc } from '@/lib/i18n'
import PageHero from './PageHero'
import Section from './Section'
import Reveal from './Reveal'
import CaseCard from './CaseCard'
import CaseVideo from './CaseVideo'
import CountUp from './CountUp'
import Button from './Button'
import Icon from './Icon'
import CtaBand from './CtaBand'
import type { Project, Service } from '@/types'

export function PortfolioHero() {
  const { t } = useLanguage()
  return (
    <PageHero
      eyebrow={t.portfolio.hero.eyebrow}
      title={t.portfolio.hero.title}
      subtitle={t.portfolio.hero.subtitle}
    />
  )
}

export function PortfolioGrid({
  projects,
  services,
}: {
  projects: Project[]
  services: Service[]
}) {
  const { t, locale } = useLanguage()
  const [filter, setFilter] = useState<string>('all')

  const visible =
    filter === 'all' ? projects : projects.filter((p) => p.serviceSlug === filter)

  const filters = [
    { slug: 'all', label: t.portfolio.filters.all },
    ...services.map((s) => ({ slug: s.slug, label: loc(s, 'title', locale) })),
  ]

  return (
    <Section tone="white">
      <div
        className="mb-10 flex flex-wrap justify-center gap-2"
        role="group"
        aria-label={t.portfolio.filters.label}
      >
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            onClick={() => setFilter(f.slug)}
            aria-pressed={filter === f.slug}
            className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-all duration-200 ${
              filter === f.slug
                ? 'bg-vz-orange text-white shadow-soft-sm'
                : 'bg-vz-soft text-vz-body hover:bg-vz-blue-soft hover:text-vz-blue-deep'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-lead text-vz-muted">{t.portfolio.empty}</p>
      ) : (
        <div className="reveal-3d-scene grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal key={project.id} variant="3d" delay={i * 90} className="h-full">
              <CaseCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}

export function PortfolioCta() {
  const { t } = useLanguage()
  return (
    <CtaBand
      title={t.portfolio.cta.title}
      text={t.portfolio.cta.text}
      buttonLabel={t.portfolio.cta.button}
    />
  )
}

/** Full case study: task → solution → results → testimonial. */
export function CaseDetail({ project }: { project: Project }) {
  const { t, locale } = useLanguage()
  const labels = t.portfolio.labels

  // Neither an own product nor a concept has a client the work was delivered
  // to, so the headings that would claim one are swapped. "The client's task"
  // and "Results achieved" over a build that never ran for anybody are a quiet
  // lie in the furniture.
  const own = project.kind === 'own' || project.kind === 'concept'
  // The two differ only in what stands in for the client's name.
  const standIn = project.kind === 'concept' ? labels.concept : labels.built

  return (
    <>
      <PageHero
        eyebrow={loc(project, 'type', locale)}
        title={loc(project, 'title', locale)}
        subtitle={loc(project, 'description', locale)}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-sm text-vz-muted">
              {own ? t.common.projectType : t.common.client}
            </dt>
            <dd className="font-semibold text-vz-text">
              {own ? standIn : project.client}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-vz-muted">{t.common.year}</dt>
            <dd className="font-semibold text-vz-text">{project.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-vz-muted">{t.common.service}</dt>
            <dd className="font-semibold text-vz-text">{loc(project, 'type', locale)}</dd>
          </div>
        </dl>

        {/* For a case that is actually live, the site itself is the strongest
            evidence on the page — better than any screenshot of it. */}
        {project.link && (
          <div className="mt-8">
            <Button href={project.link} variant="secondary">
              {t.common.visitSite}
              <Icon name="ArrowUpRight" className="h-4 w-4" />
            </Button>
          </div>
        )}
      </PageHero>

      {/* A walkthrough recording takes precedence over the still: for a product
          with no public URL it is the only way to show the thing actually
          working. It starts itself when scrolled to, with pause and fullscreen
          in the site's own language — see CaseVideo. */}
      {project.video ? (
        <Section tone="white" className="!pb-0">
          <CaseVideo
            src={project.video}
            poster={project.videoPoster || project.image || undefined}
            className="w-full rounded-xl2 border border-vz-border bg-vz-soft shadow-soft"
          />
        </Section>
      ) : (
        project.image && (
          <Section tone="white" className="!pb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={loc(project, 'title', locale)}
              className="w-full rounded-xl2 border border-vz-border object-cover shadow-soft"
            />
          </Section>
        )
      )}

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <h2 className="text-h2 font-display">{own ? labels.taskOwn : labels.task}</h2>
            <p className="mt-4 text-lead text-vz-body">{loc(project, 'task', locale)}</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-h2 font-display">{labels.solution}</h2>
            <p className="mt-4 text-lead text-vz-body">{loc(project, 'solution', locale)}</p>
          </Reveal>
        </div>
      </Section>

      {project.results?.length > 0 && (
        <Section tone="soft">
          <h2 className="mb-10 text-center text-h2 font-display">
            {own ? labels.resultsOwn : labels.results}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {project.results.map((result, i) => (
              <Reveal key={result.label} delay={i * 80} className="h-full">
                <div className="vz-surface h-full rounded-card p-7 text-center">
                  <CountUp
                    value={result.value}
                    className="block font-display text-3xl font-extrabold text-vz-orange-deep sm:text-4xl"
                  />
                  <p className="mt-2 text-vz-body">{loc(result, 'label', locale)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {project.testimonial && (
        <Section tone="white">
          <figure className="mx-auto max-w-3xl rounded-xl2 border border-vz-blue/30 bg-vz-tint p-8 sm:p-10">
            <Icon name="Quote" className="h-8 w-8 text-vz-blue" />
            <blockquote className="mt-5 text-lead text-vz-text">
              {loc(project.testimonial, 'text', locale)}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-vz-border pt-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-display font-extrabold text-vz-blue-deep shadow-soft-sm">
                {project.testimonial.author.slice(0, 1)}
              </span>
              <span>
                <span className="block font-semibold text-vz-text">
                  {project.testimonial.author}
                </span>
                <span className="block text-sm text-vz-muted">
                  {loc(project.testimonial, 'role', locale)}, {project.client}
                </span>
              </span>
            </figcaption>
          </figure>
        </Section>
      )}

      <Section tone="white" className="!py-0">
        <div className="flex justify-center pb-4">
          <Button href="/work" variant="ghost">
            <Icon name="ArrowLeft" className="h-4 w-4" />
            {t.common.backToPortfolio}
          </Button>
        </div>
      </Section>

      <CtaBand
        title={t.portfolio.cta.title}
        text={t.portfolio.cta.text}
        buttonLabel={t.common.discussSimilar}
      />
    </>
  )
}
