export interface Project {
  id: string
  title: string
  title_ru?: string
  title_lv?: string
  client: string
  type: string
  type_ru?: string
  type_lv?: string
  year: string
  description: string
  description_ru?: string
  description_lv?: string
  tags: string[]
  image: string
  link?: string
}

export interface Service {
  id: string
  title: string
  title_ru?: string
  title_lv?: string
  description: string
  description_ru?: string
  description_lv?: string
  tags: string[]
  metric: string
  metricLabel: string
}

export interface ProcessStep {
  id: string
  phase: string
  title: string
  title_ru?: string
  title_lv?: string
  duration: string
  description: string
  description_ru?: string
  description_lv?: string
  deliverables: string[]
  deliverables_ru?: string[]
  deliverables_lv?: string[]
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
  projectType?: string
  message: string
  createdAt: string
}

export interface SiteContent {
  contact: {
    email: string
    location: string
    responseTime: string
  }
  branding: {
    foundedYear: number
    tagline: string
  }
  [key: string]: unknown
}
