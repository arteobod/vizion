export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getContacts, addContact, deleteContact } from '@/lib/data'
import { requireAdmin } from '@/lib/api-auth'
import { Resend } from 'resend'

const FROM_EMAIL = 'studio@viz-on.net'
const TO_EMAIL = 'studio@viz-on.net'

// Submissions carry visitor PII (names, emails, phones) — admin only.
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const contacts = await getContacts()
  return NextResponse.json(contacts)
}

/** Escapes user input before it is interpolated into notification HTML. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const row = (label: string, value: string) => `
  <tr>
    <td style="color:#79838E;padding:10px 0;border-bottom:1px solid #E7EAEE;width:150px;vertical-align:top;">${label}</td>
    <td style="color:#212529;padding:10px 0;border-bottom:1px solid #E7EAEE;">${value}</td>
  </tr>`

export async function POST(request: NextRequest) {
  let contact
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    contact = {
      id: `contact-${Date.now()}`,
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : '',
      projectType: body.projectType ? String(body.projectType) : '',
      message: String(body.message),
      createdAt: new Date().toISOString(),
    }

    await addContact(contact)
  } catch {
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }

  // The enquiry is already stored — a mail failure must not lose the lead,
  // so notification errors are swallowed and the request still succeeds.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: contact.email,
      subject: `New enquiry from ${contact.name}`,
      html: `
        <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#F8F9FA;padding:32px;">
          <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;padding:32px;">
            <p style="margin:0 0 8px;color:#FFA500;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">New enquiry</p>
            <h1 style="margin:0 0 24px;font-size:22px;color:#212529;">${esc(contact.name)} got in touch</h1>
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              ${row('Name', esc(contact.name))}
              ${row('Email', `<a href="mailto:${esc(contact.email)}" style="color:#1E93C6;">${esc(contact.email)}</a>`)}
              ${row('Phone', contact.phone ? esc(contact.phone) : '—')}
              ${row('Project type', contact.projectType ? esc(contact.projectType) : '—')}
              ${row('Message', `<span style="white-space:pre-wrap;">${esc(contact.message)}</span>`)}
            </table>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from: FROM_EMAIL,
      to: contact.email,
      subject: 'We received your message — Vižon',
      html: `
        <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#F8F9FA;padding:32px;">
          <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;padding:32px;">
            <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#212529;">Vi<span style="color:#FFA500;">ž</span>on</p>
            <p style="margin:0 0 16px;font-size:16px;color:#212529;">Hello ${esc(contact.name)},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#414A53;line-height:1.6;">
              Thank you for reaching out. Your message has arrived and we will reply within 24 hours.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#414A53;line-height:1.6;">
              If your question is urgent, simply reply to this email — it reaches us directly.
            </p>
            <p style="margin:0;font-size:13px;color:#79838E;">Vižon · Riga, Latvia · viz-on.net</p>
          </div>
        </div>
      `,
    })
  } catch {
    // Notification failed; the enquiry is safely stored and visible in the admin panel.
  }

  return NextResponse.json(contact, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request)
  if (denied) return denied
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
