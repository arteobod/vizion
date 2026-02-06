'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import GenerativeBackground from './GenerativeBackground'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]'

function ScrambleWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  const [display, setDisplay] = useState('\u00A0'.repeat(word.length))
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
      const chars = word.split('')
      const resolved = new Array(chars.length).fill(false)
      let frame = 0

      const interval = setInterval(() => {
        frame++
        const progress = frame / 30
        const output = chars.map((char, i) => {
          if (char === ' ') return ' '
          if (resolved[i]) return char
          if (progress > (i / chars.length) * 0.6 + 0.4) {
            resolved[i] = true
            return char
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        setDisplay(output.join(''))
        if (resolved.every(Boolean)) clearInterval(interval)
      }, 35)
    }, delay)
    return () => clearTimeout(timer)
  }, [word, delay])

  return (
    <span
      className={`inline-block transition-all duration-500 ${className || ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
      }}
    >
      {display}
    </span>
  )
}

function useTypewriter(text: string, speed = 30, delay = 2200) {
  const [display, setDisplay] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplay(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return display
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const subtext = useTypewriter('We build your vision.', 30, 2200)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const [scrollY, setScrollY] = useState(0)
  const onScroll = useCallback(() => setScrollY(window.scrollY), [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <GenerativeBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-fv-black/30 via-transparent to-fv-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-fv-black/60 via-transparent to-fv-black/20 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 w-full pt-24 pb-16">
        {/* Top metadata — slide from left */}
        <div
          className="flex items-center gap-6 mb-12 transition-all duration-1000 ease-out"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded
              ? `translateX(0) translateY(${scrollY * -0.1}px)`
              : 'translateX(-60px)',
          }}
        >
          <span className="font-mono text-micro text-fv-text-muted uppercase tracking-[0.2em]">
            Digital Infrastructure Studio
          </span>
          <span
            className="h-px bg-fv-border transition-all ease-out"
            style={{ width: loaded ? 200 : 0, transitionDuration: '1500ms', transitionDelay: '600ms' }}
          />
          <span className="font-mono text-micro text-fv-text-muted">EST. 2024</span>
        </div>

        {/* Headline — scramble reveal word by word */}
        <div className="mb-10">
          <h1 className="font-mono font-bold text-display text-white leading-[0.85]">
            <span className="block overflow-hidden">
              <ScrambleWord word="PREMIUM" delay={400} />
              {' '}
              <ScrambleWord word="WEB" delay={600} />
            </span>
            <span className="block mt-2 overflow-hidden">
              <ScrambleWord word="DEVELOPMENT" delay={800} />
              {' '}
              <ScrambleWord word="&" delay={1000} />
            </span>
            <span className="block mt-2 overflow-hidden">
              <span className="relative inline-block">
                <ScrambleWord word="BUSINESS" delay={1100} className="text-fv-orange" />
                <span
                  className="absolute -bottom-2 left-0 h-0.5 bg-fv-orange transition-all duration-1000 ease-out"
                  style={{ width: loaded ? '100%' : '0%', transitionDelay: '1900ms' }}
                />
              </span>
              {' '}
              <ScrambleWord word="UTILITIES" delay={1350} className="text-fv-orange" />
            </span>
          </h1>
        </div>

        {/* Subtext with typewriter */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end transition-all duration-1000 ease-out"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '1600ms' }}
        >
          <div className="lg:col-span-5">
            <p className="font-sans text-lg text-fv-text-dim leading-relaxed max-w-md">
              {subtext}<span className="animate-blink text-fv-orange">|</span>
            </p>
            <p
              className="font-sans text-lg text-fv-text-dim leading-relaxed max-w-md mt-1 transition-opacity duration-700"
              style={{ opacity: subtext.length > 15 ? 1 : 0, transitionDelay: '300ms' }}
            >
              We engineer digital systems that scale, perform, and endure.
            </p>
          </div>

          <div className="lg:col-span-3">
            <a href="#contact" className="group inline-flex items-center gap-3 font-mono text-label text-fv-text hover:text-fv-orange transition-colors duration-300">
              <span className="w-10 h-px bg-fv-text-dim group-hover:bg-fv-orange group-hover:w-16 transition-all duration-300" />
              START A PROJECT
            </a>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <div className="inline-flex flex-col items-start lg:items-end gap-2">
              <span className="font-mono text-micro text-fv-text-muted">CAPABILITIES</span>
              <div className="flex flex-wrap gap-2">
                {['NEXT.JS', 'REACT', 'NODE', 'CLOUD'].map((tag, i) => (
                  <span
                    key={tag}
                    className="font-mono text-micro px-2 py-1 border border-fv-border text-fv-text-dim transition-all duration-500"
                    style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(10px)', transitionDelay: `${2400 + i * 100}ms` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 lg:left-2 flex flex-col items-center gap-2 transition-all duration-700" style={{ opacity: loaded ? 1 : 0, transitionDelay: '2800ms' }}>
          <span className="font-mono text-micro text-fv-text-muted [writing-mode:vertical-lr] tracking-widest">SCROLL</span>
          <div className="w-px h-16 bg-fv-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-fv-orange animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <div className="absolute bottom-8 right-6 lg:right-10 hidden md:block transition-all duration-700" style={{ opacity: loaded ? 1 : 0, transitionDelay: '2800ms', transform: `translateY(${scrollY * -0.05}px)` }}>
          <span className="font-mono text-micro text-fv-text-muted">56.9496° N, 24.1052° E</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-fv-border" />
    </section>
  )
}
