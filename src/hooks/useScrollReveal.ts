'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}

export function useStaggerReveal(
  parentRef: React.RefObject<HTMLElement | null>,
  selector = '[data-reveal]'
) {
  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    const children = parent.querySelectorAll(selector)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.dataset.delay || '0'
            el.style.transitionDelay = `${delay}ms`
            el.classList.add('revealed')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [parentRef, selector])
}

export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  const handleScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = windowHeight / 2
    const distance = elementCenter - viewportCenter
    setOffset(distance * speed * -1)
  }, [speed])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { ref, offset }
}
