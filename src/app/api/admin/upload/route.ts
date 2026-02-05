import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
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

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filepath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return NextResponse.json([])
    }

    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(f => !f.startsWith('.'))
      .map(filename => ({
        filename,
        url: `/uploads/${filename}`,
      }))

    return NextResponse.json(files)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json()
    const filepath = path.join(UPLOAD_DIR, filename)

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
