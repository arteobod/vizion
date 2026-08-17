import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/site/ServicesSections'
import { getServiceBySlug, getServices, getProjects } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: 'Service not found' }

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `https://viz-on.net/services/${slug}` },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [service, projects] = await Promise.all([getServiceBySlug(slug), getProjects()])

  if (!service) notFound()

  const related = projects.filter((p) => p.serviceSlug === slug).slice(0, 3)

  return <ServiceDetail service={service} relatedProjects={related} />
}
