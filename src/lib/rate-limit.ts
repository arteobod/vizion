// Lightweight login rate limiter to blunt brute-force and credential-stuffing.
//
// Uses Cloudflare KV when available (so the count is shared across the edge),
// and an in-memory map as a local-dev fallback. Not a distributed-perfect
// limiter, but enough to turn an unlimited password-guessing endpoint into one
// that locks after a handful of misses.

interface KVNamespace {
  get(key: string, type: 'json'): Promise<unknown>
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
}

async function getKV(): Promise<KVNamespace | null> {
  try {
    const mod = await import('@opennextjs/cloudflare')
    if (typeof mod.getCloudflareContext === 'function') {
      const ctx = await mod.getCloudflareContext()
      const env = ctx?.env as { VIZON_KV?: KVNamespace } | undefined
      return env?.VIZON_KV || null
    }
  } catch {
    // Not on Cloudflare
  }
  return null
}

const WINDOW_SECONDS = 15 * 60
const MAX_ATTEMPTS = 8

// Dev fallback store
const memory = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

/** Records an attempt for `key` and reports whether it is still under the cap. */
export async function hitRateLimit(key: string): Promise<RateLimitResult> {
  const now = Date.now()
  const kv = await getKV()

  if (kv) {
    const record = (await kv.get(`rl:${key}`, 'json')) as
      | { count: number; resetAt: number }
      | null
    if (record && record.resetAt > now) {
      if (record.count >= MAX_ATTEMPTS) {
        return { allowed: false, retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000) }
      }
      await kv.put(
        `rl:${key}`,
        JSON.stringify({ count: record.count + 1, resetAt: record.resetAt }),
        { expirationTtl: WINDOW_SECONDS }
      )
      return { allowed: true, retryAfterSeconds: 0 }
    }
    await kv.put(
      `rl:${key}`,
      JSON.stringify({ count: 1, resetAt: now + WINDOW_SECONDS * 1000 }),
      { expirationTtl: WINDOW_SECONDS }
    )
    return { allowed: true, retryAfterSeconds: 0 }
  }

  // In-memory fallback
  const record = memory.get(key)
  if (record && record.resetAt > now) {
    if (record.count >= MAX_ATTEMPTS) {
      return { allowed: false, retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000) }
    }
    record.count += 1
    return { allowed: true, retryAfterSeconds: 0 }
  }
  memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 })
  return { allowed: true, retryAfterSeconds: 0 }
}

/** Clears the counter for a key — called on a successful login. */
export async function clearRateLimit(key: string): Promise<void> {
  const kv = await getKV()
  if (kv) {
    await kv.delete(`rl:${key}`).catch(() => {})
    return
  }
  memory.delete(key)
}

/** Best-effort client IP from Cloudflare / proxy headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}
