import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ContactsHero, ContactsBody } from '@/components/site/ContactsSections'
import { getSiteContent } from '@/lib/data'

// ISR: serve a cached render from the edge, refresh from KV every 60s.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contacts',
  description:
    'Tell us about your project. We read every message and reply within 24 hours. Riga, Latvia.',
  alternates: { canonical: 'https://viz-on.net/contacts' },
}

export default async function ContactsPage() {
  const siteContent = await getSiteContent()

  return (
    <>
      <ContactsHero />
      {/* useSearchParams needs a Suspense boundary during prerendering */}
      <Suspense fallback={<div className="py-20" />}>
        <ContactsBody siteContent={siteContent} />
      </Suspense>
    </>
  )
}
