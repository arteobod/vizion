import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { getCrmClients, addCrmClient, saveCrmClients } from '@/lib/data'
import { CrmClient } from '@/types'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  const payload = await verifyToken(token)
  return !!payload
}

export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const clients = await getCrmClients()
  return NextResponse.json(clients)
}

export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const clients = await getCrmClients()
    const id = `CRM-${Date.now()}`
    const client: CrmClient = {
      id,
      company: body.company || '',
      website: body.website || '',
      phone: body.phone || '',
      task: body.task || '',
      budget: Number(body.budget) || 0,
      status: body.status || 'НЕТ',
      profit: Number(body.profit) || 0,
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
    }
    await addCrmClient(client)
    return NextResponse.json(client, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await saveCrmClients([])
  return NextResponse.json({ success: true })
}
