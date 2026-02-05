export interface Project {
  id: string
  title: string
  client: string
  type: string
  year: string
  description: string
  tags: string[]
  image: string
  link?: string
}

export interface Service {
  id: string
  title: string
  description: string
  tags: string[]
  metric: string
  metricLabel: string
}

export interface ProcessStep {
  id: string
  phase: string
  title: string
  duration: string
  description: string
  deliverables: string[]
}

export interface Stat {
  id: string
  value: string
  label: string
  sublabel: string
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
