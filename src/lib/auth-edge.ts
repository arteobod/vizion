import { jwtVerify, type JWTPayload } from 'jose'

// Edge-safe auth primitives: jose only, no bcrypt. Kept separate from auth.ts
// so the middleware can import token verification without dragging bcryptjs
// (and its weight) into the edge runtime bundle.

export const COOKIE_NAME = 'admin-token'

export interface AdminTokenPayload extends JWTPayload {
  username: string
  role: 'admin'
}

/**
 * Returns the JWT signing secret.
 *
 * Fails closed in production: a missing secret used to fall back to a public
 * default string, which means anyone could forge a valid admin token. Now an
 * unset secret in production throws instead — verification callers catch it and
 * treat every token as invalid, so the admin locks rather than opening wide.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not configured')
    }
    return new TextEncoder().encode('dev-secret-change-me')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Verifies an admin session token.
 *
 * A valid signature is not enough on its own: the claim has to say `admin` too.
 * There is only one issuer and one role today, so nothing can currently mint a
 * signed-but-lesser token — but the day a second token type is signed with the
 * same secret (a client portal, a preview link, a webhook), signature-only
 * verification would silently hand it the admin API. Checking the claim now
 * costs one comparison and closes that door before it opens.
 */
export async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    if (payload.role !== 'admin' || typeof payload.username !== 'string') return null
    return payload as AdminTokenPayload
  } catch {
    return null
  }
}
