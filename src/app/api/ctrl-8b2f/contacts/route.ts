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

// Field caps, mirrored in ContactForm's maxLength attributes.
//
// These are a security control, not tidiness. The success path sends an
// acknowledgement email from our own domain to whatever address the submitter
// typed, with their name in the greeting — so an unbounded name field turns the
// form into a way to mail arbitrary text from studio@viz-on.net to a stranger.
// A name that has to fit in 80 characters is not a usable phishing canvas, and
// the message body only ever reaches our own inbox.
const LIMITS = { name: 80, email: 160, phone: 40, projectType: 60, message: 5000 } as const

// Same shape the client checks, so a submission that passes there passes here.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Trims and truncates one field. */
function field(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max)
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

    const name = field(body.name, LIMITS.name)
    const email = field(body.email, LIMITS.email)
    const message = field(body.message, LIMITS.message)

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // A malformed address cannot receive the acknowledgement anyway, and letting
    // one through would hand Resend a bounce for a lead we can never answer.
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    contact = {
      id: `contact-${Date.now()}`,
      name,
      email,
      phone: field(body.phone, LIMITS.phone),
      projectType: field(body.projectType, LIMITS.projectType),
      message,
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
