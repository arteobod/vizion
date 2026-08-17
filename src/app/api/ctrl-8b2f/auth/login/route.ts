export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createToken, COOKIE_NAME } from '@/lib/auth'
import { hitRateLimit, clearRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)

    // Throttle before touching credentials, so guessing is capped per IP.
    const limit = await hitRateLimit(`login:${ip}`)
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      )
    }

    const valid = await verifyCredentials(username, password)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Successful login clears the counter so a legitimate user isn't punished
    // for a few earlier typos.
    await clearRateLimit(`login:${ip}`)

    const token = await createToken(username)
    const response = NextResponse.json({ success: true })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch {
    // Never echo the internal error back to the client.
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
