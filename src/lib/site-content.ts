import type { SiteContent } from '@/types'

/**
 * The published phone numbers, in display order.
 *
 * Reads the current `phones` array and falls back to the legacy single `phone`
 * field. Both shapes are live at once: the repo's JSON carries `phones`, while
 * the KV entry the deployed site actually reads was written before the field
 * existed. Without the fallback the footer would simply lose its phone line in
 * production until the next admin save.
 *
 * Blank entries are dropped so an empty row left in the admin editor does not
 * render as a link to nothing.
 */
export function phoneList(contact: SiteContent['contact']): string[] {
  const list = Array.isArray(contact?.phones)
    ? contact.phones
    : contact?.phone
      ? [contact.phone]
      : []
  return list.map((p) => String(p ?? '').trim()).filter(Boolean)
}

/** Strips spacing so a displayed number works as a `tel:` target. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s()-]/g, '')}`
}
