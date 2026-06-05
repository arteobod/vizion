import { useEffect, useRef } from 'react'

export function useGsap3DReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)

      const el = ref.current
      if (!el) return

      const tween = gsap.fromTo(
        el,
        { transformPerspective: 1200, z: -300, rotateX: 14 },
        {
          z: 0,
          rotateX: 0,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        }
      )

      cleanup = () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })()

    return () => cleanup?.()
  }, [])

  return ref
}
