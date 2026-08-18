import Header from '@/components/site/Header'
import MobileNav from '@/components/site/MobileNav'
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

  // The wrapper's bottom padding is clearance for the mobile dock, which floats
  // over the end of the page. It belongs here rather than on <main>: the footer
  // is main's sibling, so padding inside main would leave the footer's last row
  // sitting under the dock. Phones only - the dock is lg:hidden.
  return (
    <div className="relative pb-24 lg:pb-0">
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

      <MobileNav siteContent={siteContent} />

      <PageFrame />
    </div>
  )
}
