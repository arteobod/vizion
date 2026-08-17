import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from './auth-edge'

/**
 * Per-route admin guard, used in addition to the middleware.
 *
 * Middleware is the first line, but authorization should never rest on a single
 * mechanism — a misconfigured matcher or a framework middleware-bypass bug would
 * otherwise expose everything. Each sensitive handler calls this too, so the
 * route itself refuses unauthenticated requests regardless of middleware.
 *
 * Returns a 401 response to return early, or null when the caller may proceed.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (token && (await verifyToken(token))) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
