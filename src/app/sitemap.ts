import type { MetadataRoute } from 'next'
import { getServices, getProjects } from '@/lib/data'

const BASE = 'https://viz-on.net'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServices(), getProjects()])
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE}/services`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE}/work`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/contacts`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/privatuma-politika`, changeFrequency: 'yearly' as const, priority: 0.2 },
  ].map((page) => ({ ...page, lastModified: now }))

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const casePages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...servicePages, ...casePages]
}
