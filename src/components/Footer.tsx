'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Footer() {
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
              Digital infrastructure studio.<br />
              We build systems that scale.
            </p>
          </div>

          {/* Navigation */}
          <div className="p-8 lg:p-10 border-b md:border-b-0 md:border-r border-fv-border">
            <span className="font-mono text-micro text-fv-text-muted block mb-4">NAVIGATION</span>
            <div className="space-y-2">
              {['SERVICES', 'PROJECTS', 'PROCESS', 'CONTACT'].map((link, i) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
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
            <span className="font-mono text-micro text-fv-text-muted block mb-4">CORE STACK</span>
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

          {/* Social / Links */}
          <div className="p-8 lg:p-10">
            <span className="font-mono text-micro text-fv-text-muted block mb-4">CONNECT</span>
            <div className="space-y-2">
              {[
                { label: 'GITHUB', href: '#' },
                { label: 'LINKEDIN', href: '#' },
                { label: 'TWITTER / X', href: '#' },
                { label: 'TELEGRAM', href: '#' },
              ].map((social, i) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center gap-2 font-mono text-xs text-fv-text-dim hover:text-fv-orange transition-colors group"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `opacity 0.5s ease-out ${400 + i * 60}ms, transform 0.5s ease-out ${400 + i * 60}ms`,
                  }}
                >
                  {social.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </a>
              ))}
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
            &copy; {currentYear} VŽN. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-6">
            <span className="font-mono text-micro text-fv-text-muted">
              ENGINEERED WITH PRECISION
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
