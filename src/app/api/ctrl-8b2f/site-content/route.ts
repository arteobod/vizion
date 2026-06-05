import { NextRequest, NextResponse } from 'next/server'
import { getSiteContent, saveSiteContent } from '@/lib/data'

export async function GET() {
  const content = await getSiteContent()
  return NextResponse.json(content)
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
