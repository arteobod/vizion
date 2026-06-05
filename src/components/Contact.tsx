'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useLanguage } from '@/context/LanguageContext'
import TextScramble from './TextScramble'
import RevealText from './RevealText'

const PLAIN_TEXT_BRIEF = `PROJECT BRIEF TEMPLATE

1. ABOUT YOUR PROJECT
- Project name: [Your project name]
- Your business/industry: [e.g., E-commerce, SaaS, Portfolio]
- Main goal: [What problem should the website solve?]

2. KEY FEATURES (check what applies)
[ ] Landing page / Corporate website
[ ] E-commerce / Online store
[ ] Admin panel / Dashboard
[ ] User authentication
[ ] Payment integration
[ ] Blog / News section
[ ] Multi-language support
[ ] API integrations
[ ] Other: ___________

3. DESIGN PREFERENCES
- Style: [Minimalist / Bold / Corporate / Creative]
- Reference sites: [Links to sites you like]
- Brand colors: [If you have them]

4. TECHNICAL REQUIREMENTS
- Deadline: [When do you need it?]
- Budget range: [Your budget]
- Hosting preference: [Own server / Cloud / Not sure]

5. ADDITIONAL INFO
[Any other details that might help us understand your vision]`

function BriefModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
    } else {
      setIsAnimating(false)
      document.body.style.overflow = ''
      const timer = setTimeout(() => setShouldRender(false), 500)
      return () => clearTimeout(timer)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PLAIN_TEXT_BRIEF)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([PLAIN_TEXT_BRIEF], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'project_brief_template.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-fv-black/90 backdrop-blur-sm transition-opacity duration-500"
        style={{ opacity: isAnimating ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-fv-dark border border-fv-border overflow-hidden transition-all duration-500 ease-out"
        style={{
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-fv-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-fv-orange rounded-full animate-pulse" />
              <span className="font-mono text-micro text-fv-text-muted tracking-wider">EXAMPLE_BRIEF</span>
            </div>
            <span className="h-4 w-px bg-fv-border" />
            <span className="font-mono text-micro text-fv-text-muted">Template for your project</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 font-mono text-micro text-fv-text-dim hover:text-fv-orange border border-fv-border hover:border-fv-orange transition-all duration-300"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-500">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  COPIED
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  COPY
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 font-mono text-micro text-fv-text-dim hover:text-fv-orange border border-fv-border hover:border-fv-orange transition-all duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 3V16M12 16L7 11M12 16L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 20H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              .TXT
            </button>
            <button
              onClick={onClose}
              className="p-2 text-fv-text-muted hover:text-white transition-colors ml-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Template Header */}
            <div
              className="border border-fv-border p-6 transition-all duration-700"
              style={{
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '100ms',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-micro text-fv-orange tracking-wider">BRIEF</span>
                  <h3 className="font-mono text-2xl font-bold text-white mt-2">Project Brief Template</h3>
                  <p className="font-mono text-sm text-fv-text-dim mt-1">Fill in the fields below to describe your project</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-fv-orange/10 border border-fv-orange/30">
                  <span className="w-1.5 h-1.5 bg-fv-orange rounded-full" />
                  <span className="font-mono text-micro text-fv-orange">TEMPLATE</span>
                </div>
              </div>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* About Your Project */}
              <div
                className="border border-fv-border p-5 transition-all duration-700 lg:col-span-2"
                style={{
                  opacity: isAnimating ? 1 : 0,
                  transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: '200ms',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-micro text-fv-orange">01</span>
                  <span className="h-px flex-1 bg-fv-border" />
                  <span className="font-mono text-label text-fv-text tracking-wider">ABOUT YOUR PROJECT</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Project name', placeholder: '[Your project name]' },
                    { label: 'Business / Industry', placeholder: '[e.g., E-commerce, SaaS, Portfolio]' },
                    { label: 'Main goal', placeholder: '[What problem should the website solve?]' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-fv-orange mt-2 shrink-0" />
                      <span className="font-mono text-sm text-fv-text whitespace-nowrap">{item.label}:</span>
                      <span className="font-sans text-sm text-fv-text-muted italic">{item.placeholder}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div
                className="border border-fv-border p-5 transition-all duration-700"
                style={{
                  opacity: isAnimating ? 1 : 0,
                  transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: '300ms',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-micro text-fv-orange">02</span>
                  <span className="h-px flex-1 bg-fv-border" />
                  <span className="font-mono text-label text-fv-text tracking-wider">KEY FEATURES</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    'Landing page / Corporate website',
                    'E-commerce / Online store',
                    'Admin panel / Dashboard',
                    'User authentication',
                    'Payment integration',
                    'Blog / News section',
                    'Multi-language support',
                    'API integrations',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <span className="w-3.5 h-3.5 border border-fv-border group-hover:border-fv-orange transition-colors shrink-0" />
                      <span className="font-mono text-sm text-fv-text-dim group-hover:text-fv-text transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design & Tech */}
              <div className="space-y-6">
                {/* Design Preferences */}
                <div
                  className="border border-fv-border p-5 transition-all duration-700"
                  style={{
                    opacity: isAnimating ? 1 : 0,
                    transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: '400ms',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-micro text-fv-orange">03</span>
                    <span className="h-px flex-1 bg-fv-border" />
                    <span className="font-mono text-label text-fv-text tracking-wider">DESIGN</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-fv-orange mt-2 shrink-0" />
                      <span className="font-mono text-sm text-fv-text">Style:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Minimalist', 'Bold', 'Corporate', 'Creative'].map(tag => (
                          <span key={tag} className="font-mono text-micro px-2 py-0.5 border border-fv-border text-fv-text-muted hover:border-fv-orange hover:text-fv-orange transition-colors cursor-default">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-fv-orange mt-2 shrink-0" />
                      <span className="font-mono text-sm text-fv-text whitespace-nowrap">References:</span>
                      <span className="font-sans text-sm text-fv-text-muted italic">[Links to sites you like]</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-fv-orange mt-2 shrink-0" />
                      <span className="font-mono text-sm text-fv-text whitespace-nowrap">Brand colors:</span>
                      <span className="font-sans text-sm text-fv-text-muted italic">[If you have them]</span>
                    </div>
                  </div>
                </div>

                {/* Technical Requirements */}
                <div
                  className="border border-fv-border p-5 transition-all duration-700"
                  style={{
                    opacity: isAnimating ? 1 : 0,
                    transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: '500ms',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-micro text-fv-orange">04</span>
                    <span className="h-px flex-1 bg-fv-border" />
                    <span className="font-mono text-label text-fv-text tracking-wider">REQUIREMENTS</span>
                  </div>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between text-fv-text-dim">
                      <span>Deadline</span>
                      <span className="text-fv-text-muted italic font-sans">[When do you need it?]</span>
                    </div>
                    <div className="flex justify-between text-fv-text-dim">
                      <span>Budget range</span>
                      <span className="text-fv-text-muted italic font-sans">[Your budget]</span>
                    </div>
                    <div className="flex justify-between text-fv-text-dim">
                      <span>Hosting</span>
                      <span className="text-fv-text-muted italic font-sans">[Own / Cloud / Not sure]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div
              className="border border-dashed border-fv-border p-5 transition-all duration-700"
              style={{
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '600ms',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-micro text-fv-orange">05</span>
                <span className="h-px flex-1 bg-fv-border" />
                <span className="font-mono text-label text-fv-text tracking-wider">ADDITIONAL INFO</span>
              </div>
              <p className="font-sans text-sm text-fv-text-muted italic">
                [Any other details that might help us understand your vision]
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-fv-border bg-fv-surface/50">
          <span className="font-mono text-micro text-fv-text-muted">
            Copy or download this template and fill it in
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-micro text-fv-text-muted">ESC to close</span>
            <span className="w-1 h-1 bg-fv-orange rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Contact({ siteContent }: { siteContent: { contact: { email: string; location: string; responseTime: string } } }) {
  const { t } = useLanguage()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showBrief, setShowBrief] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' })
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/ctrl-8b2f/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setForm({ name: '', email: '', projectType: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } catch {
      setError(true)
      setTimeout(() => setError(false), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section-border">
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div
          ref={headerRef}
          className="border-b border-fv-border py-8 flex items-center justify-between"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <div className="flex items-center gap-6">
            <span className="font-mono text-micro text-fv-text-muted">{t.contact.sectionLabel}</span>
            <span
              className="h-px bg-fv-border transition-all ease-out"
              style={{ width: headerVisible ? 64 : 0, transitionDuration: '1s', transitionDelay: '300ms' }}
            />
            <TextScramble text={t.contact.title} className="font-mono text-label text-fv-text-dim" delay={200} />
          </div>
          <span className="font-mono text-micro text-fv-text-muted hidden sm:block">
            {t.contact.status}
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Big CTA text */}
          <div
            ref={leftRef}
            className="border-b lg:border-b-0 lg:border-r border-fv-border py-16 lg:py-24 lg:pr-16"
            style={{
              opacity: leftVisible ? 1 : 0,
              transform: leftVisible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
            }}
          >
            <h3 className="font-mono text-display-sm font-bold text-fv-white mb-8">
              <RevealText tag="span" className="block" delay={0}>
                {t.contact.headline[0]}
              </RevealText>
              <RevealText tag="span" className="block text-fv-orange" delay={200}>
                {t.contact.headline[1]}
              </RevealText>
              <RevealText tag="span" className="block" delay={400}>
                {t.contact.headline[2]}
              </RevealText>
            </h3>

            <p
              className="font-sans text-fv-text-dim leading-relaxed max-w-md mb-12"
              style={{
                opacity: leftVisible ? 1 : 0,
                transition: 'opacity 0.8s ease-out 600ms',
              }}
            >
              {t.contact.description}
            </p>

            {/* Contact details — staggered */}
            <div className="space-y-6">
              {[
                { label: t.contact.emailLabel, value: siteContent.contact.email, href: `mailto:${siteContent.contact.email}` },
                { label: t.contact.responseTimeLabel, value: siteContent.contact.responseTime },
                { label: t.contact.locationLabel, value: siteContent.contact.location },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    opacity: leftVisible ? 1 : 0,
                    transform: leftVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 0.6s ease-out ${700 + i * 120}ms, transform 0.6s ease-out ${700 + i * 120}ms`,
                  }}
                >
                  <span className="font-mono text-micro text-fv-text-muted block mb-2">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className="font-mono text-sm text-fv-text hover:text-fv-orange transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-mono text-sm text-fv-text">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            ref={rightRef}
            className="py-16 lg:py-24 lg:pl-16"
            style={{
              opacity: rightVisible ? 1 : 0,
              transform: rightVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease-out 200ms, transform 0.9s ease-out 200ms',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {[
                { label: t.contact.form.name, type: 'text', placeholder: t.contact.form.namePlaceholder, field: 'name' as const },
                { label: t.contact.form.email, type: 'email', placeholder: t.contact.form.emailPlaceholder, field: 'email' as const },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    opacity: rightVisible ? 1 : 0,
                    transform: rightVisible ? 'translateY(0)' : 'translateY(15px)',
                    transition: `opacity 0.6s ease-out ${300 + i * 100}ms, transform 0.6s ease-out ${300 + i * 100}ms`,
                  }}
                >
                  <label className="font-mono text-micro text-fv-text-muted block mb-3">{f.label}</label>
                  <input
                    type={f.type}
                    required
                    value={form[f.field]}
                    onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                    className="w-full bg-transparent border-b border-fv-border py-3 font-sans text-sm text-fv-text outline-none focus:border-fv-orange transition-colors placeholder:text-fv-text-muted"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}

              <div
                style={{
                  opacity: rightVisible ? 1 : 0,
                  transform: rightVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 0.6s ease-out 500ms, transform 0.6s ease-out 500ms',
                }}
              >
                <label className="font-mono text-micro text-fv-text-muted block mb-3">{t.contact.form.projectType}</label>
                <select
                  value={form.projectType}
                  onChange={e => setForm(prev => ({ ...prev, projectType: e.target.value }))}
                  className="w-full bg-transparent border-b border-fv-border py-3 font-sans text-sm text-fv-text outline-none focus:border-fv-orange transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-fv-dark">{t.contact.form.selectService}</option>
                  <option value="web" className="bg-fv-dark">{t.contact.form.webDev}</option>
                  <option value="utility" className="bg-fv-dark">{t.contact.form.utility}</option>
                  <option value="architecture" className="bg-fv-dark">{t.contact.form.architecture}</option>
                  <option value="audit" className="bg-fv-dark">{t.contact.form.audit}</option>
                </select>
              </div>

              <div
                style={{
                  opacity: rightVisible ? 1 : 0,
                  transform: rightVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 0.6s ease-out 600ms, transform 0.6s ease-out 600ms',
                }}
              >
                <label className="font-mono text-micro text-fv-text-muted block mb-3">{t.contact.form.brief}</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-transparent border-b border-fv-border py-3 font-sans text-sm text-fv-text outline-none focus:border-fv-orange transition-colors resize-none placeholder:text-fv-text-muted"
                  placeholder={t.contact.form.briefPlaceholder}
                />
              </div>

              <div
                className="pt-4"
                style={{
                  opacity: rightVisible ? 1 : 0,
                  transform: rightVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.6s ease-out 700ms, transform 0.6s ease-out 700ms',
                }}
              >
                {sent ? (
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-mono text-label text-green-400">{t.contact.form.success}</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="font-mono text-label text-red-400">Failed to send. Please try again.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative font-mono text-label text-fv-black bg-fv-orange px-8 py-4 hover:bg-fv-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-3">
                        {loading ? 'SENDING...' : t.contact.form.submit}
                        {!loading && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                            <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBrief(true)}
                      className="group relative font-mono text-label text-fv-orange border border-fv-orange px-8 py-4 hover:bg-fv-orange hover:text-fv-black transition-colors duration-300"
                    >
                      <span className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-70">
                          <path d="M13 9L16 12L13 15M11 15L8 12L11 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {t.contact.form.exampleBrief}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Example Brief Modal */}
      <BriefModal isOpen={showBrief} onClose={() => setShowBrief(false)} />
    </section>
  )
}
