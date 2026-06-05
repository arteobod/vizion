'use client'

import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 })

  return (
    <footer ref={ref} className="section-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Main footer grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-fv-border"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          {/* Brand */}
          <div className="p-8 lg:p-10 border-b md:border-b-0 md:border-r border-fv-border lg:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-mono text-lg font-bold text-fv-text">Vižon</span>
              <span className="animate-blink text-fv-orange font-mono text-lg font-bold">_</span>
            </div>
            <p className="font-sans text-xs text-fv-text-muted leading-relaxed">
              {t.footer.brand}<br />
              {t.footer.brandSub}
            </p>
          </div>

          {/* Navigation */}
          <div className="p-8 lg:p-10 border-b md:border-b-0 md:border-r border-fv-border">
            <span className="font-mono text-micro text-fv-text-muted block mb-4">{t.footer.navigation}</span>
            <div className="space-y-2">
              {[
                { label: t.nav.services, href: '#services' },
                { label: t.nav.projects, href: '#projects' },
                { label: t.nav.process, href: '#process' },
                { label: t.nav.contact, href: '#contact' },
              ].map(({ label: link, href }, i) => (
                <a
                  key={href}
                  href={href}
                  className="block font-mono text-xs text-fv-text-dim hover:text-fv-orange transition-colors"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `opacity 0.5s ease-out ${200 + i * 60}ms, transform 0.5s ease-out ${200 + i * 60}ms`,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-fv-border">
            <span className="font-mono text-micro text-fv-text-muted block mb-4">{t.footer.coreStack}</span>
            <div className="space-y-2">
              {['NEXT.JS / REACT', 'NODE.JS / TYPESCRIPT', 'POSTGRESQL / REDIS', 'AWS / CLOUDFLARE'].map((tech, i) => (
                <span
                  key={tech}
                  className="block font-mono text-xs text-fv-text-dim"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `opacity 0.5s ease-out ${300 + i * 60}ms, transform 0.5s ease-out ${300 + i * 60}ms`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 lg:p-10">
            <span className="font-mono text-micro text-fv-text-muted block mb-4">{t.footer.connect}</span>
            <div className="space-y-2">
              <a
                href="#contact"
                className="flex items-center gap-2 font-mono text-xs text-fv-text-dim hover:text-fv-orange transition-colors group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'opacity 0.5s ease-out 400ms, transform 0.5s ease-out 400ms',
                }}
              >
                GET IN TOUCH
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          className="py-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 400ms',
          }}
        >
          <span className="font-mono text-micro text-fv-text-muted">
            &copy; {currentYear} VŽN. {t.footer.copyright}
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/privatuma-politika"
              className="font-mono text-micro text-fv-text-muted hover:text-fv-orange transition-colors"
            >
              {t.footer.privacyPolicy}
            </Link>
            <span className="font-mono text-micro text-fv-text-muted">
              {t.footer.engineered}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-fv-orange animate-pulse" />
              <span className="font-mono text-micro text-fv-text-muted">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
