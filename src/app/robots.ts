import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ctrl-8b2f/', '/mgr-5k9w/', '/api/'],
    },
    sitemap: 'https://viz-on.net/sitemap.xml',
  }
}
