import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
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
  title: 'Vižon | Digital Infrastructure Studio',
  description: 'Premium web development & business utilities. We engineer digital systems that scale, perform, and endure.',
  keywords: 'web development, next.js, react, business utilities, system architecture, security audit',
  openGraph: {
    title: 'Vižon | Digital Infrastructure Studio',
    description: 'Premium web development & business utilities.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${inter.variable}`}>
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  )
}
