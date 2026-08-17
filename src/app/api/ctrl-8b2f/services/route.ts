export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServices, saveServices } from '@/lib/data'
import { requireAdmin } from '@/lib/api-auth'

// Guarded like the writer below it. The content is not secret — the public
// pages read the same data server-side — but leaving one verb on a single
// mechanism is exactly the gap the two-layer rule exists to prevent.
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const services = await getServices()
  return NextResponse.json(services)
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected array' }, { status: 400 })
    }
    await saveServices(body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Failed to save services' }, { status: 500 })
  }
}
