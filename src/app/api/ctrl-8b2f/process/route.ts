export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getProcessSteps, saveProcessSteps } from '@/lib/data'

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const steps = await getProcessSteps()
  return NextResponse.json(steps)
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected array' }, { status: 400 })
    }
    await saveProcessSteps(body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Failed to save process steps' }, { status: 500 })
  }
}
