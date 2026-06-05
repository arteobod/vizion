import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://viz-on.net'),
  title: 'Vižon | Digital Infrastructure Studio — Riga, Latvia',
  description: 'Premium web development & digital infrastructure studio in Riga, Latvia. We engineer Next.js, React, and Node.js systems that scale, perform, and endure. Custom web apps, CRM dashboards, business utilities, and system architecture.',
  keywords: [
    // Core services
    'web development', 'web development Riga', 'web development Latvia',
    'Next.js development', 'React development', 'full-stack development',
    'Node.js development', 'TypeScript development',
    // Business utilities
    'business utilities', 'admin panel development', 'CRM development',
    'dashboard development', 'internal tools development',
    // Architecture & Security
    'system architecture', 'cloud infrastructure', 'CI/CD pipeline',
    'security audit', 'code audit', 'performance optimization',
    // Studio / Agency
    'web studio Riga', 'web agency Latvia', 'digital agency Riga',
    'digital infrastructure studio', 'Vižon', 'viz-on',
    // Application types
    'custom web application', 'SaaS development', 'enterprise web development',
    // Geo
    'Riga web developer', 'Latvia web developer',
    // Latvian
    'tīmekļa izstrāde', 'tīmekļa izstrāde Rīgā', 'web studija Latvijā',
    // Russian
    'веб разработка', 'веб разработка Рига', 'веб студия Латвия', 'разработка сайтов Латвия',
  ],
  authors: [{ name: 'Vižon', url: 'https://viz-on.net' }],
  creator: 'Vižon',
  publisher: 'Vižon',
  alternates: {
    canonical: 'https://viz-on.net',
  },
  openGraph: {
    title: 'Vižon | Digital Infrastructure Studio — Riga, Latvia',
    description: 'Premium web development & digital infrastructure studio. We engineer Next.js, React, and Node.js systems that scale, perform, and endure.',
    type: 'website',
    url: 'https://viz-on.net',
    siteName: 'Vižon',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vižon | Digital Infrastructure Studio — Riga, Latvia',
    description: 'Premium web development & digital infrastructure studio. Next.js, React, Node.js systems built to scale.',
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
  '@type': 'Organization',
  name: 'Vižon',
  alternateName: 'viz-on',
  url: 'https://viz-on.net',
  description: 'Premium web development & digital infrastructure studio based in Riga, Latvia. We engineer scalable Next.js, React, and Node.js systems.',
  foundingDate: '2026',
  areaServed: ['Latvia', 'Europe', 'Worldwide'],
  knowsAbout: [
    'Web Development', 'Next.js', 'React', 'Node.js', 'TypeScript',
    'System Architecture', 'Cloud Infrastructure', 'CI/CD Pipelines',
    'CRM Systems', 'Admin Dashboards', 'Security Audit',
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

// Prevent FOUC: apply saved theme before React hydrates
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('fv-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch(e){}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" translate="no" className={`${jetbrains.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="noise-overlay">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
