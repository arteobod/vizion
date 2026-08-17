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

export async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as AdminTokenPayload
  } catch {
    return null
  }
}
