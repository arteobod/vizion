'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import en from '@/locales/en.json'

export type Locale = 'en' | 'ru' | 'lv'

type TranslationData = typeof en

/**
 * English is imported statically because it is what the server renders and what
 * the first client paint has to match. Russian and Latvian are fetched on
 * demand.
 *
 * All three used to be static imports: 52KB of JSON in the shared bundle, of
 * which two thirds were dead weight for any given reader, parsed on the main
 * thread during hydration on every single visit. Now a reader who never
 * switches language never downloads the other two, and one who does pays a
 * single small chunk.
 *
 * The trade is that switching to a stored non-English locale resolves a beat
 * after mount rather than synchronously. That was already true visually — the
 * server has no idea what is in localStorage, so the first paint was always
 * English regardless.
 */
const LOADERS: Record<Exclude<Locale, 'en'>, () => Promise<{ default: TranslationData }>> = {
  ru: () => import('@/locales/ru.json'),
  lv: () => import('@/locales/lv.json'),
}

const cache: Partial<Record<Locale, TranslationData>> = { en }

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationData
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
})

const isLocale = (v: unknown): v is Locale => v === 'en' || v === 'ru' || v === 'lv'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [t, setT] = useState<TranslationData>(en)

  // Applies a locale's strings, fetching them first if they are not in hand.
  // Both the state updates happen together so the label and the copy can never
  // be a frame out of step with each other.
  const apply = useCallback((next: Locale) => {
    const ready = cache[next]
    if (ready) {
      setLocaleState(next)
      setT(ready)
      return
    }
    LOADERS[next as Exclude<Locale, 'en'>]()
      .then((mod) => {
        cache[next] = mod.default
        setLocaleState(next)
        setT(mod.default)
      })
      .catch(() => {
        // A failed chunk should not strand the reader on a half-switched page.
        // English is already loaded, so staying on it is the graceful outcome.
      })
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('fv-locale')
    if (isLocale(stored) && stored !== 'en') apply(stored)
  }, [apply])

  const setLocale = useCallback(
    (next: Locale) => {
      localStorage.setItem('fv-locale', next)
      document.documentElement.lang = next
      apply(next)
    },
    [apply]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
