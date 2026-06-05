export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServices, saveServices } from '@/lib/data'

export async function GET() {
  const services = await getServices()
  return NextResponse.json(services)
}

export async function PUT(request: NextRequest) {
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
