export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getContacts, addContact, deleteContact } from '@/lib/data'
import { Resend } from 'resend'

const FROM_EMAIL = 'studio@viz-on.net'
const TO_EMAIL = 'studio@viz-on.net'

export async function GET() {
  const contacts = await getContacts()
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
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

    // Уведомление команде о новой заявке
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: body.email,
      subject: `New request from ${body.name}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 32px; max-width: 600px;">
          <p style="color: #f97316; font-size: 11px; letter-spacing: 0.1em; margin: 0 0 24px;">NEW_REQUEST // ${new Date().toISOString()}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #666; padding: 8px 0; border-bottom: 1px solid #1a1a1a; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${body.name}</td></tr>
            <tr><td style="color: #666; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #1a1a1a;"><a href="mailto:${body.email}" style="color: #f97316;">${body.email}</a></td></tr>
            <tr><td style="color: #666; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Project type</td><td style="padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${body.projectType || '—'}</td></tr>
            <tr><td style="color: #666; padding: 8px 0; vertical-align: top;">Message</td><td style="padding: 8px 0; white-space: pre-wrap;">${body.message || '—'}</td></tr>
          </table>
        </div>
      `,
    })

    // Автоответ клиенту
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.email,
      subject: 'We received your request — Vizon',
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 32px; max-width: 600px;">
          <p style="color: #f97316; font-size: 11px; letter-spacing: 0.1em; margin: 0 0 24px;">VIZON // REQUEST_RECEIVED</p>
          <p style="margin: 0 0 16px;">Hi ${body.name},</p>
          <p style="color: #999; margin: 0 0 24px;">We got your request and will get back to you within 24 hours.</p>
          <p style="color: #444; font-size: 12px; margin: 0;">vizon.lv</p>
        </div>
      `,
    })

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
