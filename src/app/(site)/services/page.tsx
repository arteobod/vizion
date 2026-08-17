import type { Metadata } from 'next'
import {
  ServicesHero, ServicesGrid, ServicesFaq, ServicesCta,
} from '@/components/site/ServicesSections'
import ProcessSteps from '@/components/site/ProcessSteps'
import { getServices, getProcessSteps } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Website development, redesign, and B2B tools that automate business processes. Clear pricing and fixed timelines.',
  alternates: { canonical: 'https://viz-on.net/services' },
}

export default async function ServicesPage() {
  const [services, steps] = await Promise.all([getServices(), getProcessSteps()])

  return (
    <>
      <ServicesHero />
      <ServicesGrid services={services} />
      <ProcessSteps steps={steps} tone="tint" />
      <ServicesFaq />
      <ServicesCta />
    </>
  )
}
