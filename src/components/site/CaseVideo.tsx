'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize, Minimize, Pause, Play } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

/**
 * The walkthrough recording on a case page. Starts itself when the reader
 * reaches it and stops when they leave, so nobody has to hunt for a play
 * button to see what was built.
 *
 * Playback is tied to visibility rather than to mount. A 1080p60 clip that
 * keeps decoding while the reader is two screens further down burns battery
 * for nothing, and coming back to a video frozen mid-scroll reads as broken.
 * Leaving the case unmounts the element, which stops it outright.
 *
 * Autoplay only works because the track is muted — browsers block anything
 * that could make noise unprompted, and rightly so. Under
 * `prefers-reduced-motion` it does not start on its own at all; the controls
 * are still there for anyone who wants it.
 *
 * The native controls are gone: a black browser slab across the bottom of a
 * case page is the one piece of UI on the site nobody designed. What replaces
 * it is deliberately just two buttons.
 *
 * - **Pause stays, always.** WCAG 2.2.2 requires a way to stop anything that
 *   plays by itself for more than five seconds, and this clip loops for 30.
 *   Removing every control is not an option, whatever it costs visually.
 * - **Fullscreen stays** because the product UI inside the recording is small
 *   at card width and unreadable on a phone.
 * - **No scrubber.** It is what made the native bar look heavy, and nothing
 *   here needs seeking: the clip is short and repeats.
 */
export default function CaseVideo({
  src,
  poster,
  className = '',
}: {
  src: string
  poster?: string
  className?: string
}) {
  const { t } = useLanguage()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // A deliberate pause outranks the viewport. Scrolling past the video and back
  // must not restart something the reader chose to stop.
  const pausedByReader = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  // Without hover there is nothing to reveal the controls, so on touch they
  // simply stay put. Starts `true` so the server markup and the first client
  // render agree; the effect corrects it before anyone can hover.
  const [canHover, setCanHover] = useState(true)

  // Mirror the element's real state instead of tracking our own: the viewport
  // observer, the loop and the browser all move it too.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const sync = () => setPlaying(!video.paused)
    video.addEventListener('play', sync)
    video.addEventListener('pause', sync)
    sync()

    return () => {
      video.removeEventListener('play', sync)
      video.removeEventListener('pause', sync)
    }
  }, [])

  useEffect(() => {
    const hover = window.matchMedia('(hover: hover)')
    const apply = () => setCanHover(hover.matches)
    apply()
    hover.addEventListener('change', apply)
    return () => hover.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejects if the browser declines; nothing to do but leave the
          // controls for the reader.
          if (video.paused && !pausedByReader.current) void video.play().catch(() => {})
        } else if (!video.paused) {
          video.pause()
        }
      },
      // Low enough that the clip is already running by the time the reader
      // scrolls it into full view — at the top of a case page only about a
      // third of the block is above the fold.
      { threshold: 0.25 }
    )

    io.observe(video)
    return () => {
      io.disconnect()
      video.pause()
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      pausedByReader.current = false
      void video.play().catch(() => {})
    } else {
      pausedByReader.current = true
      video.pause()
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {})
      return
    }

    // The wrapper rather than the video, so our own controls come along.
    // iPhone Safari will not put a div fullscreen at all and only exposes the
    // video's own native path, which is better than no fullscreen.
    if (wrap.requestFullscreen) {
      void wrap.requestFullscreen().catch(() => {})
    } else {
      const legacy = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
      legacy.webkitEnterFullscreen?.()
    }
  }, [])

  // Hidden controls are still focusable, so the panel has to appear on
  // focus-within too or keyboard users tab into nothing.
  const controlsVisible = !canHover || !playing

  return (
    <div
      ref={wrapRef}
      className={`group relative ${
        fullscreen ? 'flex h-full w-full items-center justify-center bg-vz-ink' : ''
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        // Clicking the frame is the habit everyone already has.
        onClick={togglePlay}
        className={
          fullscreen
            ? 'max-h-full w-full cursor-pointer object-contain'
            : `cursor-pointer ${className}`
        }
      />

      <div
        className={`absolute bottom-0 right-0 flex gap-2 p-4 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? t.common.videoPause : t.common.videoPlay}
          className="rounded-full border-2 border-vz-ink bg-vz-white/85 p-2.5 text-vz-text shadow-soft transition-colors hover:bg-vz-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vz-ink"
        >
          {playing ? (
            <Pause className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Play className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? t.common.videoExitFullscreen : t.common.videoFullscreen}
          className="rounded-full border-2 border-vz-ink bg-vz-white/85 p-2.5 text-vz-text shadow-soft transition-colors hover:bg-vz-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vz-ink"
        >
          {fullscreen ? (
            <Minimize className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Maximize className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  )
}
