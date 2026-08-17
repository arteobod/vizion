'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/**
 * A full-screen browser-window frame around real page content.
 *
 * The whole site is presented as sites inside browser windows. Each window
 * fills the viewport (the parent Framer Motion wrapper handles its entrance),
 * and a loading bar sweeps the chrome the first time it scrolls into view.
 *
 * Every window is the same size. At these dimensions a window reads as a
 * website; anything smaller reads as a card with a picture of one, which
 * defeats the whole device. Keep them uniform — one window sized differently
 * from its neighbours looks like a mistake rather than emphasis.
 */
export default function BrowserWindow({
  url,
  chapter,
  children,
  className = '',
}: {
  url: string
  chapter: string
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`browser-window relative mx-auto flex min-h-[82vh] w-full max-w-window flex-col overflow-hidden rounded-xl2 border-2 border-vz-ink bg-white/55 shadow-window backdrop-blur-2xl ${className}`}
    >
      {/* Light. Two decorative layers, both under the content:
          a sheen falling from the top edge, so the glass looks lit from above
          rather than evenly filled, and a white hairline just inside the black
          outline — the bevel that stops the dark edge reading as a flat cutout. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/75 via-white/5 to-transparent to-60%"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/70"
      />

      {/* Chrome — frosted glass bar */}
      <div className="relative flex h-12 shrink-0 items-center gap-3 border-b border-vz-ink/15 bg-white/45 px-4 backdrop-blur-md">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-vz-orange" />
          <span className="h-3 w-3 rounded-full bg-vz-blue" />
          <span className="h-3 w-3 rounded-full bg-vz-border-strong" />
        </div>

        <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-1.5 truncate rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs text-vz-muted">
          <Icon name="Lock" className="h-3 w-3 text-vz-blue" />
          <span className="truncate">{url}</span>
        </div>

        <span className="hidden shrink-0 font-mono text-[0.6875rem] uppercase tracking-widest text-vz-muted sm:block">
          {chapter}
        </span>

        <span
          className={`absolute bottom-0 left-0 h-[2px] bg-vz-orange transition-[width] duration-[1100ms] ease-out ${
            open ? 'w-full' : 'w-0'
          }`}
        />
      </div>

      {/* Viewport — content centred vertically so the window reads as a page */}
      <div className="relative flex flex-1 items-center px-6 py-16 sm:px-14 sm:py-24 lg:px-24 lg:py-28">
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
