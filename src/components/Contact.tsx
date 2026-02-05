'use client'

import { useState, FormEvent } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import TextScramble from './TextScramble'
import RevealText from './RevealText'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
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
            <span className="font-mono text-micro text-fv-text-muted">SECTION_04</span>
            <span
              className="h-px bg-fv-border transition-all ease-out"
              style={{ width: headerVisible ? 64 : 0, transitionDuration: '1s', transitionDelay: '300ms' }}
            />
            <TextScramble text="INITIATE" className="font-mono text-label text-fv-text-dim" delay={200} />
          </div>
          <span className="font-mono text-micro text-fv-text-muted hidden sm:block">
            OPEN FOR PROJECTS
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
            <h3 className="font-mono text-display-sm font-bold text-white mb-8">
              <RevealText tag="span" className="block" delay={0}>
                LET&apos;S BUILD
              </RevealText>
              <RevealText tag="span" className="block text-fv-orange" delay={200}>
                SOMETHING
              </RevealText>
              <RevealText tag="span" className="block" delay={400}>
                TOGETHER
              </RevealText>
            </h3>

            <p
              className="font-sans text-fv-text-dim leading-relaxed max-w-md mb-12"
              style={{
                opacity: leftVisible ? 1 : 0,
                transition: 'opacity 0.8s ease-out 600ms',
              }}
            >
              Whether you need a complete platform, a business utility, or a technical audit — we&apos;re ready to engineer your next system.
            </p>

            {/* Contact details — staggered */}
            <div className="space-y-6">
              {[
                { label: 'EMAIL', value: 'hello@vizon.dev', href: 'mailto:hello@vizon.dev' },
                { label: 'RESPONSE TIME', value: '< 24 HOURS' },
                { label: 'LOCATION', value: 'RIGA, LATVIA / REMOTE' },
              ].map((item, i) => (
                <div
                  key={item.label}
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
                { label: 'YOUR NAME', type: 'text', placeholder: 'John Smith' },
                { label: 'EMAIL', type: 'email', placeholder: 'john@company.com' },
              ].map((field, i) => (
                <div
                  key={field.label}
                  style={{
                    opacity: rightVisible ? 1 : 0,
                    transform: rightVisible ? 'translateY(0)' : 'translateY(15px)',
                    transition: `opacity 0.6s ease-out ${300 + i * 100}ms, transform 0.6s ease-out ${300 + i * 100}ms`,
                  }}
                >
                  <label className="font-mono text-micro text-fv-text-muted block mb-3">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    className="w-full bg-transparent border-b border-fv-border py-3 font-sans text-sm text-fv-text outline-none focus:border-fv-orange transition-colors placeholder:text-fv-text-muted"
                    placeholder={field.placeholder}
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
                <label className="font-mono text-micro text-fv-text-muted block mb-3">PROJECT TYPE</label>
                <select className="w-full bg-transparent border-b border-fv-border py-3 font-sans text-sm text-fv-text outline-none focus:border-fv-orange transition-colors appearance-none cursor-pointer">
                  <option value="" className="bg-fv-dark">Select service...</option>
                  <option value="web" className="bg-fv-dark">Web Development</option>
                  <option value="utility" className="bg-fv-dark">Business Utility</option>
                  <option value="architecture" className="bg-fv-dark">System Architecture</option>
                  <option value="audit" className="bg-fv-dark">Audit & Security</option>
                </select>
              </div>

              <div
                style={{
                  opacity: rightVisible ? 1 : 0,
                  transform: rightVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 0.6s ease-out 600ms, transform 0.6s ease-out 600ms',
                }}
              >
                <label className="font-mono text-micro text-fv-text-muted block mb-3">PROJECT BRIEF</label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b border-fv-border py-3 font-sans text-sm text-fv-text outline-none focus:border-fv-orange transition-colors resize-none placeholder:text-fv-text-muted"
                  placeholder="Describe your project requirements..."
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
                    <span className="font-mono text-label text-green-400">MESSAGE TRANSMITTED SUCCESSFULLY</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="group relative font-mono text-label text-fv-black bg-fv-orange px-8 py-4 hover:bg-white transition-colors duration-300"
                  >
                    <span className="flex items-center gap-3">
                      TRANSMIT MESSAGE
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                        <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
