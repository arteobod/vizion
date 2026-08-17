// Localized text fields follow the flat-suffix convention the admin panel
// already understands: `title` (EN) + `title_ru` + `title_lv`.

export interface ServiceStage {
  title: string
  title_ru?: string
  title_lv?: string
  text: string
  text_ru?: string
  text_lv?: string
}

export interface Service {
  id: string
  slug: string
  /** lucide-react icon name, rendered by components/site/Icon.tsx */
  icon: string
  title: string
  title_ru?: string
  title_lv?: string
  /** One-line promise used on cards */
  tagline: string
  tagline_ru?: string
  tagline_lv?: string
  /** 2-3 sentence description used on the home page and services index */
  description: string
  description_ru?: string
  description_lv?: string
  /** Plain-language explanation on the detail page */
  whatItIs: string
  whatItIs_ru?: string
  whatItIs_lv?: string
  forWhom: string
  forWhom_ru?: string
  forWhom_lv?: string
  problems: string[]
  problems_ru?: string[]
  problems_lv?: string[]
  benefits: string[]
  benefits_ru?: string[]
  benefits_lv?: string[]
  stages: ServiceStage[]
  timeline: string
  timeline_ru?: string
  timeline_lv?: string
  /** Display string, e.g. "€2 500" */
  priceFrom: string
}

export interface CaseResult {
  /** Headline figure, e.g. "+34%" */
  value: string
  label: string
  label_ru?: string
  label_lv?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  title_ru?: string
  title_lv?: string
  /**
   * Client work or the studio's own. Absent means `'client'`, so every case
   * written before this existed keeps its wording.
   *
   * An own project has no commissioning client and never ran in production, so
   * the case page swaps the labels that would otherwise assert both — see
   * PortfolioSections. Calling a self-initiated build a delivered engagement is
   * the kind of thing a prospect checks.
   */
  kind?: 'client' | 'own'
  /** Empty for own projects — nobody commissioned them. */
  client: string
  /** Matches Service.slug — powers portfolio filtering */
  serviceSlug: string
  /** Human-readable service label shown on the card */
  type: string
  type_ru?: string
  type_lv?: string
  year: string
  /** Card summary */
  description: string
  description_ru?: string
  description_lv?: string
  /** Case page: the client's problem */
  task: string
  task_ru?: string
  task_lv?: string
  /** Case page: what we did */
  solution: string
  solution_ru?: string
  solution_lv?: string
  results: CaseResult[]
  testimonial?: {
    text: string
    text_ru?: string
    text_lv?: string
    author: string
    role: string
    role_ru?: string
    role_lv?: string
  }
  tags: string[]
  image: string
  /**
   * Optional screen recording, shown in place of `image` when present. Path
   * under /public, e.g. `/media/voxent.mp4`. A walkthrough of a product that
   * has no public URL is the only honest way to show it working.
   */
  video?: string
  /** Poster frame for `video`, so the block is not blank before playback. */
  videoPoster?: string
  link?: string
}

export interface PricingTier {
  id: string
  /** Matches Service.slug where applicable */
  serviceSlug: string
  name: string
  name_ru?: string
  name_lv?: string
  description: string
  description_ru?: string
  description_lv?: string
  /** Display strings, e.g. "€1 200" — "€2 500" */
  priceFrom: string
  priceTo: string
  timeline: string
  timeline_ru?: string
  timeline_lv?: string
  includes: string[]
  includes_ru?: string[]
  includes_lv?: string[]
  popular?: boolean
}

export interface Testimonial {
  id: string
  text: string
  text_ru?: string
  text_lv?: string
  author: string
  company: string
  role: string
  role_ru?: string
  role_lv?: string
}

export interface ProcessStep {
  id: string
  phase: string
  /** lucide-react icon name for the timeline */
  icon?: string
  title: string
  title_ru?: string
  title_lv?: string
  duration: string
  duration_ru?: string
  duration_lv?: string
  description: string
  description_ru?: string
  description_lv?: string
  deliverables: string[]
  deliverables_ru?: string[]
  deliverables_lv?: string[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  role_ru?: string
  role_lv?: string
  bio: string
  bio_ru?: string
  bio_lv?: string
  image: string
}

export interface Stat {
  id: string
  value: string
  label: string
  label_ru?: string
  label_lv?: string
  sublabel: string
  sublabel_ru?: string
  sublabel_lv?: string
}

export interface CrmClient {
  id: string
  company: string
  website: string
  phone: string
  task: string
  budget: number
  status: 'НЕТ' | 'В работе' | 'Завершено' | 'Отказ'
  profit: number
  notes: string
  createdAt: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  projectType?: string
  message: string
  createdAt: string
}

export interface SiteContent {
  contact: {
    email: string
    phone: string
    location: string
    responseTime: string
  }
  branding: {
    foundedYear: number
    tagline: string
  }
  [key: string]: unknown
}
