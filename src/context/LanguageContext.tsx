'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'
import lv from '@/locales/lv.json'

export type Locale = 'en' | 'ru' | 'lv'

const translations = { en, ru, lv } as const

type TranslationData = typeof en

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem('fv-locale') as Locale | null
    if (stored && (stored === 'en' || stored === 'ru' || stored === 'lv')) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('fv-locale', newLocale)
    document.documentElement.lang = newLocale
  }, [])

  const t = translations[locale]

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
