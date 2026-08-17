export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getSiteContent, saveSiteContent } from '@/lib/data'

export async function GET() {
  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const body = await request.json()
    await saveSiteContent(body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 })
  }
}
