import { NextRequest, NextResponse } from 'next/server'
import { getStats, saveStats } from '@/lib/data'

export async function GET() {
  return NextResponse.json(getStats())
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected array' }, { status: 400 })
    }
    await saveStats(body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Failed to save stats' }, { status: 500 })
  }
}
