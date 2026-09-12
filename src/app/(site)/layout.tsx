import Header from '@/components/site/Header'
import MobileNav from '@/components/site/MobileNav'
import Footer from '@/components/site/Footer'
import GradualBlur from '@/components/site/GradualBlur'
import PageFrame from '@/components/site/PageFrame'
import { getServices, getSiteContent } from '@/lib/data'
import { toServiceLinkData } from '@/lib/view'

// ISR: serve a cached render from the edge, refresh from KV every 60s.
export const revalidate = 60

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [allServices, siteContent] = await Promise.all([getServices(), getSiteContent()])

  // The footer only links to services. Projecting here keeps the full records
  // out of the RSC payload of every single page on the site.
  const services = allServices.map(toServiceLinkData)

  // The wrapper's bottom padding is clearance for the mobile dock, which floats
  // over the end of the page. It belongs here rather than on <main>: the footer
  // is main's sibling, so padding inside main would leave the footer's last row
  // sitting under the dock. Phones only - the dock is lg:hidden.
  return (
    <div className="relative pb-24 lg:pb-0">
      {/* Keyboard and screen-reader users get a way past the nav straight to the
          content. Off-screen until focused, then it lands top-left as the first
          Tab stop. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[2200] focus:rounded-soft focus:border-2 focus:border-vz-ink focus:bg-vz-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-vz-text focus:shadow-window"
      >
        {/* Static English label: the layout is a server component with no locale
            in scope, and this text only surfaces on keyboard focus. */}
        Skip to content
      </a>
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
