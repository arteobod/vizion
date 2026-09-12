import type { Metadata } from 'next'
import { Nunito, Inter, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

// Headings — rounded grotesque, per the design brief
const nunito = Nunito({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['600', '700', '800'],
})

// Body — highly legible at 16px+
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

// Admin panel + the privacy page. Never on the marketing pages.
//
// `preload: false` is the whole point. next/font emits a <link rel="preload">
// for every family by default, so this one was downloading on the home page —
// 30-odd KB of a typeface that page never renders a glyph of. Without the
// preload the @font-face rule still ships and the browser fetches the file the
// moment something actually asks for `font-mono`, which is only ever /ctrl-8b2f,
// /mgr-5k9w and /privatuma-politika.
const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://viz-on.net'),
  title: {
    default: 'Vižon — Websites, redesign and business tools for growing companies',
    template: '%s | Vižon',
  },
  description:
    'We build websites, redesign outdated ones, and create B2B tools that automate routine work. Clear pricing, plain language, fixed timelines. Riga, Latvia.',
  keywords: [
    'website development', 'website development Riga', 'web studio Latvia',
    'website redesign', 'business automation', 'B2B tools', 'internal tools',
    'корпоративный сайт', 'разработка сайтов Рига', 'редизайн сайта',
    'веб студия Латвия', 'автоматизация бизнеса', 'B2B утилиты',
    'mājaslapu izstrāde', 'mājaslapu izstrāde Rīgā', 'tīmekļa studija Latvijā',
    'mājaslapas pārveidošana', 'biznesa automatizācija',
  ],
  authors: [{ name: 'Vižon', url: 'https://viz-on.net' }],
  creator: 'Vižon',
  publisher: 'Vižon',
  alternates: { canonical: 'https://viz-on.net' },
  openGraph: {
    title: 'Vižon — Websites, redesign and business tools',
    description:
      'Digital solutions that help your business grow. Clear pricing, plain language, fixed timelines.',
    type: 'website',
    url: 'https://viz-on.net',
    siteName: 'Vižon',
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Vižon — web studio in Riga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vižon — Websites, redesign and business tools',
    description:
      'Digital solutions that help your business grow. Clear pricing, plain language, fixed timelines.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Vižon',
  alternateName: 'viz-on',
  url: 'https://viz-on.net',
  description:
    'Web studio in Riga, Latvia. Website development, redesign, and B2B tools that automate business processes.',
  areaServed: ['Latvia', 'Europe'],
  knowsAbout: [
    'Website development', 'Website redesign', 'Business process automation',
    'B2B tools', 'Admin dashboards', 'CRM systems',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Riga',
    addressCountry: 'LV',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Latvian', 'Russian'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${nunito.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
        {/*
          Last resort for the scroll-triggered entrances, which need an observer
          and therefore need the bundle. If the bundle is slow or never lands,
          this flips an attribute and a stylesheet rule reveals whatever is still
          sitting at opacity 0 — the page gives up on the choreography rather
          than staying blank. Inline and tiny on purpose: it has to be the one
          piece of script that cannot be the thing that failed.

          It checks for the hydration marker first, so a visit where the bundle
          did arrive keeps its entrances.

          Ten seconds, not the three and a half it used to be. This is meant to
          catch a bundle that is never coming, and it was instead firing on every
          slow phone: hydration on a mid-range Android over a weak signal lands
          around the five-second mark, so the old timer beat it and force-revealed
          the whole page — which is a large part of why the entrances were
          reported as "not always working". A threshold for a broken page has to
          sit well clear of a merely slow one.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "setTimeout(function(){var d=document.documentElement;"
              + "if(!d.hasAttribute('data-vz-hydrated'))"
              + "d.setAttribute('data-vz-reveal-all','')},10000)",
          }}
        />
      </head>
      <body className="font-sans">
        {/*
          Rendered in the body rather than <head> — this is what the Next.js
          docs recommend, and it keeps <head> free of React-owned scripts that
          browser extensions can displace and break hydration.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
