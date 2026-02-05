import { NextRequest, NextResponse } from 'next/server'
import { getContacts, addContact, deleteContact } from '@/lib/data'

export async function GET() {
  const contacts = await getContacts()
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const contact = {
      id: `contact-${Date.now()}`,
      name: body.name,
      email: body.email,
      projectType: body.projectType || '',
      message: body.message,
      createdAt: new Date().toISOString(),
    }
    await addContact(contact)
    return NextResponse.json(contact, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const deleted = await deleteContact(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
