'use client'

import { useLanguage, type Locale } from '@/context/LanguageContext'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'lv', label: 'LV' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div
      className={`inline-flex items-center rounded-full bg-vz-soft p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-current={locale === code}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
            locale === code
              ? 'bg-white text-vz-text shadow-soft-sm'
              : 'text-vz-muted hover:text-vz-text'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
