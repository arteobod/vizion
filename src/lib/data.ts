import { Project, Service, ProcessStep, Stat, ContactSubmission, SiteContent } from '@/types'

// Static imports - bundled at build time, used as defaults
import projectsJson from '../../data/projects.json'
import servicesJson from '../../data/services.json'
import processJson from '../../data/process.json'
import statsJson from '../../data/stats.json'
import siteContentJson from '../../data/site-content.json'
import contactsJson from '../../data/contacts.json'

// Get KV namespace from Cloudflare context
async function getKV(): Promise<KVNamespace | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const ctx = getCloudflareContext()
    return (ctx.env as { VIZON_KV?: KVNamespace }).VIZON_KV || null
  } catch {
    return null
  }
}

// Read from KV (production) or return bundled default
async function readData<T>(key: string, bundled: T): Promise<T> {
  const kv = await getKV()
  if (!kv) return bundled
  try {
    const data = await kv.get(key, 'json')
    return (data as T) || bundled
  } catch {
    return bundled
  }
}

// Write to KV (production only)
async function writeData<T>(key: string, data: T): Promise<void> {
  const kv = await getKV()
  if (!kv) return
  try {
    await kv.put(key, JSON.stringify(data))
  } catch {
    // silently skip
  }
}

// --- Projects ---

export async function getProjects(): Promise<Project[]> {
  return readData<Project[]>('projects', projectsJson as Project[])
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeData('projects', projects)
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects()
  return projects.find((p) => p.id === id)
}

export async function addProject(project: Project): Promise<void> {
  const projects = await getProjects()
  projects.push(project)
  await saveProjects(projects)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null
  projects[index] = { ...projects[index], ...updates, id }
  await saveProjects(projects)
  return projects[index]
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  await saveProjects(filtered)
  return true
}

// --- Services ---

export async function getServices(): Promise<Service[]> {
  return readData<Service[]>('services', servicesJson as Service[])
}

export async function saveServices(services: Service[]): Promise<void> {
  await writeData('services', services)
}

// --- Process ---

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return readData<ProcessStep[]>('process', processJson as ProcessStep[])
}

export async function saveProcessSteps(steps: ProcessStep[]): Promise<void> {
  await writeData('process', steps)
}

// --- Stats ---

export async function getStats(): Promise<Stat[]> {
  return readData<Stat[]>('stats', statsJson as Stat[])
}

export async function saveStats(stats: Stat[]): Promise<void> {
  await writeData('stats', stats)
}

// --- Contact Submissions ---

export async function getContacts(): Promise<ContactSubmission[]> {
  return readData<ContactSubmission[]>('contacts', contactsJson as ContactSubmission[])
}

export async function saveContacts(contacts: ContactSubmission[]): Promise<void> {
  await writeData('contacts', contacts)
}

export async function addContact(contact: ContactSubmission): Promise<void> {
  const contacts = await getContacts()
  contacts.unshift(contact)
  await saveContacts(contacts)
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts = await getContacts()
  const filtered = contacts.filter((c) => c.id !== id)
  if (filtered.length === contacts.length) return false
  await saveContacts(filtered)
  return true
}

// --- Site Content ---

export async function getSiteContent(): Promise<SiteContent> {
  return readData<SiteContent>('site-content', siteContentJson as SiteContent)
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeData('site-content', content)
}
