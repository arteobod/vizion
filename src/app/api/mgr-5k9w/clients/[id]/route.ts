export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { updateCrmClient, deleteCrmClient } from '@/lib/data'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  const payload = await verifyToken(token)
  return !!payload
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await updateCrmClient(id, {
      company: body.company,
      website: body.website,
      phone: body.phone,
      task: body.task,
      budget: Number(body.budget) || 0,
      status: body.status,
      profit: Number(body.profit) || 0,
      notes: body.notes,
    })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const deleted = await deleteCrmClient(id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
