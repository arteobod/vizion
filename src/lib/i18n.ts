import type { Locale } from '@/context/LanguageContext'

/**
 * Resolves a localized field using the flat-suffix convention:
 * `title` holds English, `title_ru` and `title_lv` hold translations.
 * Falls back to the English value when a translation is missing.
 */
export function loc<T extends object>(
  obj: T,
  key: Extract<keyof T, string>,
  locale: Locale
): string {
  const record = obj as Record<string, unknown>
  if (locale !== 'en') {
    const translated = record[`${key}_${locale}`]
    if (typeof translated === 'string' && translated.length > 0) return translated
  }
  const base = record[key]
  return typeof base === 'string' ? base : ''
}

/** Same as `loc`, for string-array fields (problems, benefits, includes…). */
export function locArray<T extends object>(
  obj: T,
  key: Extract<keyof T, string>,
  locale: Locale
): string[] {
  const record = obj as Record<string, unknown>
  if (locale !== 'en') {
    const translated = record[`${key}_${locale}`]
    if (Array.isArray(translated) && translated.length > 0) return translated as string[]
  }
  const base = record[key]
  return Array.isArray(base) ? (base as string[]) : []
}
