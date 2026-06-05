import { NextRequest, NextResponse } from 'next/server'

interface KVNamespace {
  get(key: string, type: 'text'): Promise<string | null>
  get(key: string, type: 'json'): Promise<unknown>
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
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

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  const kv = await getKV()
  if (!kv) {
    return new NextResponse('Not found', { status: 404 })
  }

  const data = await kv.get(`image:${filename}`, 'arrayBuffer')
  if (!data) {
    return new NextResponse('Not found', { status: 404 })
  }

  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  return new NextResponse(data, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
