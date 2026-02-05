import { NextRequest, NextResponse } from 'next/server'
import { getSiteContent, saveSiteContent } from '@/lib/data'

export async function GET() {
  return NextResponse.json(getSiteContent())
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    await saveSiteContent(body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 })
  }
}
