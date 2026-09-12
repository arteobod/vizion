import type { CaseResult, Project, Service } from '@/types'

/**
 * Narrow shapes for the data that crosses the server → client boundary.
 *
 * Everything a client component receives as a prop is serialised twice: once as
 * rendered markup, and again into the RSC flight payload as inline
 * `self.__next_f.push(...)` scripts. Those inline scripts run synchronously
 * while the browser is parsing the document, so every unread field is paid for
 * on the main thread before the page is interactive.
 *
 * The home page was handing whole `Service` and `Project` records to cards that
 * read five or six fields each. `stages`, `problems`, `benefits`, `task`,
 * `solution`, `testimonial` and `tags` — each in three languages — travelled to
 * every visitor and were never rendered. On a throttled phone that showed up as
 * `domInteractive` at 5.8s.
 *
 * These types are `Pick`s of the full records, so a full `Service` or `Project`
 * is still assignable and the detail pages can keep passing whole objects.
 * Project with the `to*` helpers before crossing into a client component.
 */

/** What `ServiceCard` reads. */
export type ServiceCardData = Pick<
  Service,
  | 'id' | 'slug' | 'icon'
  | 'title' | 'title_ru' | 'title_lv'
  | 'tagline' | 'tagline_ru' | 'tagline_lv'
  | 'description' | 'description_ru' | 'description_lv'
>

/** What the footer's service list reads: a link and its label. */
export type ServiceLinkData = Pick<
  Service,
  'id' | 'slug' | 'title' | 'title_ru' | 'title_lv'
>

/**
 * What `CaseCard` reads. Only the first entry of `results` is shown (as the
 * headline figure), so the rest is dropped.
 */
export type CaseCardData = Pick<
  Project,
  | 'id' | 'slug' | 'client' | 'image'
  | 'title' | 'title_ru' | 'title_lv'
  | 'type' | 'type_ru' | 'type_lv'
  | 'description' | 'description_ru' | 'description_lv'
> & { results?: CaseResult[] }

export function toServiceCardData(s: Service): ServiceCardData {
  return {
    id: s.id, slug: s.slug, icon: s.icon,
    title: s.title, title_ru: s.title_ru, title_lv: s.title_lv,
    tagline: s.tagline, tagline_ru: s.tagline_ru, tagline_lv: s.tagline_lv,
    description: s.description,
    description_ru: s.description_ru,
    description_lv: s.description_lv,
  }
}

export function toServiceLinkData(s: Service): ServiceLinkData {
  return {
    id: s.id, slug: s.slug,
    title: s.title, title_ru: s.title_ru, title_lv: s.title_lv,
  }
}

export function toCaseCardData(p: Project): CaseCardData {
  const headline = p.results?.[0]
  return {
    id: p.id, slug: p.slug, client: p.client, image: p.image,
    title: p.title, title_ru: p.title_ru, title_lv: p.title_lv,
    type: p.type, type_ru: p.type_ru, type_lv: p.type_lv,
    description: p.description,
    description_ru: p.description_ru,
    description_lv: p.description_lv,
    // Kept as a one-element array so `CaseCard` can go on reading `results[0]`
    // and full `Project` records stay assignable to this type.
    results: headline ? [headline] : undefined,
  }
}
