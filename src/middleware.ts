import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-edge'

/**
 * Central authorization for the admin APIs.
 *
 * The panel's login gate was only enforced in the frontend shell — the API
 * routes under /api/ctrl-8b2f and /api/mgr-5k9w accepted unauthenticated
 * requests, so anyone could read submissions, overwrite content, or upload
 * files by calling the endpoints directly. This middleware requires a valid
 * admin token for every admin API call, so a route can never accidentally ship
 * unprotected.
 *
 * Two exceptions stay public because the visitor-facing site depends on them:
 *   - the login/logout endpoint itself
 *   - POST to the contact endpoint (the contact form)
 */

// method + exact pathname pairs that skip the auth check
const PUBLIC_ENDPOINTS: { method: string; path: string }[] = [
  { method: 'POST', path: '/api/ctrl-8b2f/auth/login' },
  { method: 'DELETE', path: '/api/ctrl-8b2f/auth/login' },
  { method: 'GET', path: '/api/ctrl-8b2f/auth/verify' },
  // Public contact form submission. Reading/deleting submissions stays locked.
  { method: 'POST', path: '/api/ctrl-8b2f/contacts' },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminApi =
    pathname.startsWith('/api/ctrl-8b2f/') || pathname.startsWith('/api/mgr-5k9w/')
  if (!isAdminApi) return NextResponse.next()

  const isPublic = PUBLIC_ENDPOINTS.some(
    (e) => e.method === request.method && e.path === pathname
  )
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (token && (await verifyToken(token))) {
    return NextResponse.next()
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export const config = {
  matcher: ['/api/ctrl-8b2f/:path*', '/api/mgr-5k9w/:path*'],
}
