export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getStats, saveStats } from '@/lib/data'

export async function GET() {
  const stats = await getStats()
  return NextResponse.json(stats)
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
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
