import type { Metadata } from 'next'
import {
  PortfolioHero, PortfolioGrid, PortfolioCta,
} from '@/components/site/PortfolioSections'
import { getProjects, getServices } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our work',
  description:
    'Projects we have delivered, with the business results they produced — websites, redesigns, and B2B tools.',
  alternates: { canonical: 'https://viz-on.net/work' },
}

export default async function PortfolioPage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()])

  return (
    <>
      <PortfolioHero />
      <PortfolioGrid projects={projects} services={services} />
      <PortfolioCta />
    </>
  )
}
