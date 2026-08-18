import type { Metadata } from 'next'
import {
  PricingHero, PricingIntro, PricingTable, PricingFactors, PricingCta,
} from '@/components/site/PricingSections'
import { getPricingTiers } from '@/lib/data'

// ISR: serve a cached render from the edge, refresh from KV every 60s.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent price ranges for websites, redesign, and B2B tools. Fixed estimates agreed before work starts.',
  alternates: { canonical: 'https://viz-on.net/pricing' },
}

export default async function PricingPage() {
  const tiers = await getPricingTiers()

  return (
    <>
      <PricingHero />
      <PricingIntro />
      <PricingTable tiers={tiers} />
      <PricingFactors />
      <PricingCta />
    </>
  )
}
