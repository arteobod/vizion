import type { Metadata } from 'next'
import {
  AboutHero, MissionAndStory, Values, Team, AboutCta,
} from '@/components/site/AboutSections'
import ProcessSteps from '@/components/site/ProcessSteps'
import { getProcessSteps, getStats, getTeam } from '@/lib/data'

// ISR: serve a cached render from the edge, refresh from KV every 60s.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'About us',
  description:
    'A web studio in Riga. We build websites and business tools, and explain every step in plain language.',
  alternates: { canonical: 'https://viz-on.net/about' },
}

export default async function AboutPage() {
  const [steps, stats, team] = await Promise.all([
    getProcessSteps(),
    getStats(),
    getTeam(),
  ])

  return (
    <>
      <AboutHero />
      <MissionAndStory stats={stats} />
      <Values />
      <Team members={team} />
      <ProcessSteps steps={steps} tone="soft" />
      <AboutCta />
    </>
  )
}
