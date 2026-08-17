export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'

// MIME → extension. The extension is derived from the validated type, never
// from the user-supplied filename, so an attacker cannot smuggle a .html or
// .svg extension onto a stored file.
const TYPE_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}
const ALLOWED_TYPES = Object.keys(TYPE_EXT)
const MAX_SIZE = 5 * 1024 * 1024

interface KVNamespace {
  get(key: string, type: 'text'): Promise<string | null>
  get(key: string, type: 'json'): Promise<unknown>
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
  put(key: string, value: string | ArrayBuffer): Promise<void>
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

async function getImagesList(kv: KVNamespace): Promise<{ filename: string; type: string }[]> {
  const data = await kv.get('images-list', 'json')
  return (data as { filename: string; type: string }[]) || []
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 })
    }

    const ext = TYPE_EXT[file.type]
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const kv = await getKV()
    if (kv) {
      const buffer = await file.arrayBuffer()
      await kv.put(`image:${filename}`, buffer)

      const list = await getImagesList(kv)
      list.push({ filename, type: file.type })
      await kv.put('images-list', JSON.stringify(list))

      return NextResponse.json({
        success: true,
        url: `/api/images/${filename}`,
        filename,
      })
    }

    // Local dev fallback: filesystem
    const fs = require('fs')
    const path = require('path')
    const dir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(path.join(dir, filename), buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const kv = await getKV()
    if (kv) {
      const list = await getImagesList(kv)
      return NextResponse.json(
        list.map((item) => ({
          filename: item.filename,
          url: `/api/images/${item.filename}`,
        }))
      )
    }

    // Local dev fallback
    const fs = require('fs')
    const path = require('path')
    const dir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(dir)) return NextResponse.json([])
    const files = fs.readdirSync(dir).filter((f: string) => !f.startsWith('.'))
    return NextResponse.json(
      files.map((filename: string) => ({ filename, url: `/uploads/${filename}` }))
    )
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const { filename: raw } = await request.json()
    // Strip any path component so a crafted name can't escape the uploads dir
    // in the local-dev filesystem path (e.g. "../../server.js").
    const filename = String(raw ?? '').replace(/^.*[\\/]/, '')
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    const kv = await getKV()
    if (kv) {
      await kv.delete(`image:${filename}`)
      const list = await getImagesList(kv)
      const filtered = list.filter((item) => item.filename !== filename)
      await kv.put('images-list', JSON.stringify(filtered))
      return NextResponse.json({ success: true })
    }

    // Local dev fallback
    const fs = require('fs')
    const path = require('path')
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
