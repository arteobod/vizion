import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import GradualBlur from '@/components/site/GradualBlur'
import PageFrame from '@/components/site/PageFrame'
import { getServices, getSiteContent } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [services, siteContent] = await Promise.all([getServices(), getSiteContent()])

  return (
    <div className="relative">
      <Header />
      <main id="main">{children}</main>
      <Footer services={services} siteContent={siteContent} />

      {/* A short, soft blur locked to the very bottom edge — the extreme
          padding/gutter zone, below where any window's text sits. Kept short on
          purpose so it never covers readable content, only softens the seam
          where a window meets the page edge. */}
      <GradualBlur
        target="page"
        position="bottom"
        height="3rem"
        strength={1.4}
        divCount={4}
        curve="bezier"
      />

      <PageFrame />
    </div>
  )
}
