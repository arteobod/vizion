'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import dynamic from 'next/dynamic'
const ThreeHero = dynamic(() => import('./ThreeHero'), { ssr: false })

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]'

interface PhraseData {
  lines: string[][]
  highlight: string
}

function RotatingHeadline({ loaded, phrases }: { loaded: boolean; phrases: PhraseData[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displays, setDisplays] = useState<string[][]>([[]])
  const [isVisible, setIsVisible] = useState(false)
  const cycleRef = useRef<NodeJS.Timeout | null>(null)
  const scrambleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset to first phrase on language change
  useEffect(() => {
    setPhraseIndex(0)
  }, [phrases])

  // Scramble animation for current phrase
  useEffect(() => {
    if (!loaded) return

    const currentPhrase = phrases[phraseIndex]
    const allWords = currentPhrase.lines.flat()
    const resolved = allWords.map(() => false)
    let frame = 0

    // Initialize displays with spaces
    setDisplays(currentPhrase.lines.map(line =>
      line.map(word => '\u00A0'.repeat(word.length))
    ))

    // Start animation after small delay
    const startTimer = setTimeout(() => {
      setIsVisible(true)

      scrambleIntervalRef.current = setInterval(() => {
        frame++
        const progress = frame / 35

        let wordIdx = 0
        const newDisplays = currentPhrase.lines.map(line =>
          line.map(word => {
            const idx = wordIdx++
            if (resolved[idx]) return word

            const wordProgress = progress - (idx * 0.15)
            if (wordProgress > 0.6) {
              resolved[idx] = true
              return word
            }

            return word.split('').map((char, i) => {
              if (char === ' ') return ' '
              const charProgress = wordProgress - (i / word.length) * 0.3
              if (charProgress > 0.4) return char
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            }).join('')
          })
        )

        setDisplays(newDisplays)

        if (resolved.every(Boolean)) {
          clearInterval(scrambleIntervalRef.current!)
          scrambleIntervalRef.current = null
        }
      }, 35)
    }, phraseIndex === 0 ? 400 : 100)

    return () => {
      clearTimeout(startTimer)
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current)
        scrambleIntervalRef.current = null
      }
    }
  }, [phraseIndex, loaded, phrases])

  // Cycle to next phrase every 4 seconds
  useEffect(() => {
    if (!loaded) return

    cycleRef.current = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length)
      }, 300)
    }, 4000)

    return () => {
      if (cycleRef.current) clearTimeout(cycleRef.current)
    }
  }, [phraseIndex, loaded, phrases])

  const currentPhrase = phrases[phraseIndex]

  return (
    <div
      className="transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {displays.map((line, lineIdx) => {
        const isHighlighted =
          currentPhrase.highlight === 'all' ||
          (currentPhrase.highlight === 'last-line' && lineIdx === displays.length - 1)

        return (
          <span key={lineIdx} className={`block ${lineIdx > 0 ? 'mt-3' : ''} overflow-hidden`}>
            {line.map((word, wordIdx) => (
              <span key={wordIdx}>
                <span className={`inline-block ${isHighlighted ? 'text-fv-orange' : ''}`}>
                  {word}
                </span>
                {wordIdx < line.length - 1 && '  '}
              </span>
            ))}
          </span>
        )
      })}
    </div>
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
    setDisplay('')
  }, [text])

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
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const subtext = useTypewriter(t.hero.typewriter, 30, 2200)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const metadataRef = useRef<HTMLDivElement>(null)
  const coordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (metadataRef.current) {
        metadataRef.current.style.transform = `translateX(0) translateY(${y * -0.1}px)`
      }
      if (coordsRef.current) {
        coordsRef.current.style.transform = `translateY(${y * -0.05}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <ThreeHero />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-fv-black/30 via-transparent to-fv-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-fv-black/60 via-transparent to-fv-black/20 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 w-full pt-24 pb-16">
        {/* Top metadata — slide from left */}
        <div
          ref={metadataRef}
          className="flex items-center gap-6 mb-12 transition-all duration-1000 ease-out"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateX(0)' : 'translateX(-60px)',
          }}
        >
          <span className="font-mono text-micro text-fv-text-muted uppercase tracking-[0.2em]">
            {t.hero.subtitle}
          </span>
          <span
            className="h-px bg-fv-border transition-all ease-out"
            style={{ width: loaded ? 200 : 0, transitionDuration: '1500ms', transitionDelay: '600ms' }}
          />
          <span className="font-mono text-micro text-fv-text-muted">{t.hero.est}</span>
        </div>

        {/* Headline — rotating scramble phrases */}
        <div className="mb-10">
          <h1 className="font-mono font-bold text-[clamp(3rem,10vw,7rem)] text-fv-white leading-[0.9] tracking-wide min-h-[2.5em]">
            <RotatingHeadline loaded={loaded} phrases={t.hero.phrases as PhraseData[]} />
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
              {t.hero.description}
            </p>
          </div>

          <div className="lg:col-span-3">
            <a href="#contact" className="group inline-flex items-center gap-3 font-mono text-label text-fv-text hover:text-fv-orange transition-colors duration-300">
              <span className="w-10 h-px bg-fv-text-dim group-hover:bg-fv-orange group-hover:w-16 transition-all duration-300" />
              {t.hero.startProject}
            </a>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <div className="inline-flex flex-col items-start lg:items-end gap-2">
              <span className="font-mono text-micro text-fv-text-muted">{t.hero.capabilities}</span>
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
          <span className="font-mono text-micro text-fv-text-muted [writing-mode:vertical-lr] tracking-widest">{t.hero.scroll}</span>
          <div className="w-px h-16 bg-fv-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-fv-orange animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <div ref={coordsRef} className="absolute bottom-8 right-6 lg:right-10 hidden md:block transition-all duration-700" style={{ opacity: loaded ? 1 : 0, transitionDelay: '2800ms' }}>
          <span className="font-mono text-micro text-fv-text-muted">56.9496° N, 24.1052° E</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-fv-border" />
    </section>
  )
}
