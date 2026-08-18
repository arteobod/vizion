import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseDetail } from '@/components/site/PortfolioSections'
import { getProjectBySlug, getProjects } from '@/lib/data'

// ISR: serve a cached render from the edge, refresh from KV every 60s.
export const revalidate = 60
// A slug created in the admin panel after build should still render, not 404.
export const dynamicParams = true

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Case not found' }

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `https://viz-on.net/work/${slug}` },
  }
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return <CaseDetail project={project} />
}
