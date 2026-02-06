import { Project, Service, ProcessStep, Stat, ContactSubmission, SiteContent } from '@/types'

// Static imports - bundled at build time, used as defaults
import projectsJson from '../../data/projects.json'
import servicesJson from '../../data/services.json'
import processJson from '../../data/process.json'
import statsJson from '../../data/stats.json'
import siteContentJson from '../../data/site-content.json'
import contactsJson from '../../data/contacts.json'

// Type for KV namespace
interface KVNamespace {
  get(key: string, type?: 'text'): Promise<string | null>
  get(key: string, type: 'json'): Promise<unknown>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

// Get KV namespace from Cloudflare context (only works on Cloudflare)
async function getKV(): Promise<KVNamespace | null> {
  try {
    const mod = await import('@opennextjs/cloudflare')
    if (typeof mod.getCloudflareContext === 'function') {
      const ctx = await mod.getCloudflareContext()
      const env = ctx?.env as { VIZON_KV?: KVNamespace } | undefined
      return env?.VIZON_KV || null
    }
  } catch {
    // Not on Cloudflare or module not available
  }
  return null
}

// Check if running in Node.js (local dev)
const IS_NODE = typeof process !== 'undefined' && process.versions?.node

// Read from filesystem (local dev only)
function readJsonFileLocal<T>(filename: string, bundled: T): T {
  if (!IS_NODE) return bundled
  try {
    const fs = require('fs')
    const path = require('path')
    const filepath = path.join(process.cwd(), 'data', filename)
    if (!fs.existsSync(filepath)) return bundled
    const raw = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return bundled
  }
}

// Write to filesystem (local dev only)
function writeJsonFileLocal<T>(filename: string, data: T): void {
  if (!IS_NODE) return
  try {
    const fs = require('fs')
    const path = require('path')
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8')
  } catch {
    // silently fail
  }
}

// Read data: KV (Cloudflare) → filesystem (local) → bundled default
async function readData<T>(key: string, filename: string, bundled: T): Promise<T> {
  // Try KV first (Cloudflare production)
  const kv = await getKV()
  if (kv) {
    try {
      const data = await kv.get(key, 'json')
      if (data) return data as T
    } catch {
      // KV read failed, continue to fallback
    }
  }

  // Try filesystem (local dev)
  if (IS_NODE) {
    return readJsonFileLocal(filename, bundled)
  }

  // Fallback to bundled
  return bundled
}

// Write data: KV (Cloudflare) or filesystem (local)
async function writeData<T>(key: string, filename: string, data: T): Promise<void> {
  // Try KV first (Cloudflare production)
  const kv = await getKV()
  if (kv) {
    try {
      await kv.put(key, JSON.stringify(data))
      return
    } catch {
      // KV write failed
    }
  }

  // Fallback to filesystem (local dev)
  writeJsonFileLocal(filename, data)
}

// --- Projects ---

export async function getProjects(): Promise<Project[]> {
  return readData<Project[]>('projects', 'projects.json', projectsJson as Project[])
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeData('projects', 'projects.json', projects)
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
  return readData<Service[]>('services', 'services.json', servicesJson as Service[])
}

export async function saveServices(services: Service[]): Promise<void> {
  await writeData('services', 'services.json', services)
}

// --- Process ---

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return readData<ProcessStep[]>('process', 'process.json', processJson as ProcessStep[])
}

export async function saveProcessSteps(steps: ProcessStep[]): Promise<void> {
  await writeData('process', 'process.json', steps)
}

// --- Stats ---

export async function getStats(): Promise<Stat[]> {
  return readData<Stat[]>('stats', 'stats.json', statsJson as Stat[])
}

export async function saveStats(stats: Stat[]): Promise<void> {
  await writeData('stats', 'stats.json', stats)
}

// --- Contact Submissions ---

export async function getContacts(): Promise<ContactSubmission[]> {
  return readData<ContactSubmission[]>('contacts', 'contacts.json', contactsJson as ContactSubmission[])
}

export async function saveContacts(contacts: ContactSubmission[]): Promise<void> {
  await writeData('contacts', 'contacts.json', contacts)
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
  return readData<SiteContent>('site-content', 'site-content.json', siteContentJson as SiteContent)
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeData('site-content', 'site-content.json', content)
}
