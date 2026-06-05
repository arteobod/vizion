'use client'

import { useLanguage, Locale } from '@/context/LanguageContext'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'lv', label: 'LV' },
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-0.5 font-mono text-micro">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          <button
            onClick={() => setLocale(code)}
            className={`px-1.5 py-0.5 transition-colors duration-200 ${
              locale === code
                ? 'text-fv-orange'
                : 'text-fv-text-muted hover:text-fv-text'
            }`}
          >
            {label}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-fv-border">/</span>
          )}
        </span>
      ))}
    </div>
  )
}
