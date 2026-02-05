'use client'

interface MarqueeProps {
  text: string
  repeat?: number
  speed?: number
  reverse?: boolean
}

export default function Marquee({ text, repeat = 8, speed = 40, reverse = false }: MarqueeProps) {
  const items = Array.from({ length: repeat }, () => text)
  const duration = `${speed}s`

  return (
    <div className="section-border overflow-hidden py-5 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-fv-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-fv-black to-transparent z-10" />

      <div
        className={`flex whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: duration }}
      >
        {items.map((item, i) => (
          <span key={i} className="font-mono text-label text-fv-text-muted mx-8 flex items-center gap-8">
            <span>{item}</span>
            <span className="w-1 h-1 bg-fv-orange rounded-full flex-shrink-0" />
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <span key={`dup-${i}`} className="font-mono text-label text-fv-text-muted mx-8 flex items-center gap-8">
            <span>{item}</span>
            <span className="w-1 h-1 bg-fv-orange rounded-full flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
