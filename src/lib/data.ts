import { Project, Service, ProcessStep, Stat, ContactSubmission, SiteContent } from '@/types'

// Static imports - bundled at build time, works on Cloudflare Edge
import projectsJson from '../../data/projects.json'
import servicesJson from '../../data/services.json'
import processJson from '../../data/process.json'
import statsJson from '../../data/stats.json'
import siteContentJson from '../../data/site-content.json'
import contactsJson from '../../data/contacts.json'

const IS_NODE = typeof process !== 'undefined' && process.versions?.node

// Read from filesystem (dev mode with live admin edits) or bundled JSON (production)
function readJsonFile<T>(filename: string, bundled: T): T {
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

function writeJsonFile<T>(filename: string, data: T): void {
  if (!IS_NODE) return
  try {
    const fs = require('fs')
    const path = require('path')
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8')
  } catch {
    // Writes not available (Cloudflare Edge) - silently skip
  }
}

// Simple mutex for concurrent writes
const locks = new Map<string, Promise<void>>()

async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  while (locks.has(key)) {
    await locks.get(key)
  }
  let resolve: () => void
  const promise = new Promise<void>((r) => { resolve = r })
  locks.set(key, promise)
  try {
    return await fn()
  } finally {
    locks.delete(key)
    resolve!()
  }
}

// --- Projects ---

export function getProjects(): Project[] {
  return readJsonFile<Project[]>('projects.json', projectsJson as Project[])
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await withLock('projects', async () => { writeJsonFile('projects.json', projects) })
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id)
}

export async function addProject(project: Project): Promise<void> {
  const projects = getProjects()
  projects.push(project)
  await saveProjects(projects)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null
  projects[index] = { ...projects[index], ...updates, id }
  await saveProjects(projects)
  return projects[index]
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  await saveProjects(filtered)
  return true
}

// --- Services ---

export function getServices(): Service[] {
  return readJsonFile<Service[]>('services.json', servicesJson as Service[])
}

export async function saveServices(services: Service[]): Promise<void> {
  await withLock('services', async () => { writeJsonFile('services.json', services) })
}

// --- Process ---

export function getProcessSteps(): ProcessStep[] {
  return readJsonFile<ProcessStep[]>('process.json', processJson as ProcessStep[])
}

export async function saveProcessSteps(steps: ProcessStep[]): Promise<void> {
  await withLock('process', async () => { writeJsonFile('process.json', steps) })
}

// --- Stats ---

export function getStats(): Stat[] {
  return readJsonFile<Stat[]>('stats.json', statsJson as Stat[])
}

export async function saveStats(stats: Stat[]): Promise<void> {
  await withLock('stats', async () => { writeJsonFile('stats.json', stats) })
}

// --- Contact Submissions ---

export function getContacts(): ContactSubmission[] {
  return readJsonFile<ContactSubmission[]>('contacts.json', contactsJson as ContactSubmission[])
}

export async function saveContacts(contacts: ContactSubmission[]): Promise<void> {
  await withLock('contacts', async () => { writeJsonFile('contacts.json', contacts) })
}

export async function addContact(contact: ContactSubmission): Promise<void> {
  const contacts = getContacts()
  contacts.unshift(contact)
  await saveContacts(contacts)
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts = getContacts()
  const filtered = contacts.filter((c) => c.id !== id)
  if (filtered.length === contacts.length) return false
  await saveContacts(filtered)
  return true
}

// --- Site Content ---

export function getSiteContent(): SiteContent {
  return readJsonFile<SiteContent>('site-content.json', siteContentJson as SiteContent)
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await withLock('site-content', async () => { writeJsonFile('site-content.json', content) })
}
