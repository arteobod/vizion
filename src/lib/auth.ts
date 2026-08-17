import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { getJwtSecret, COOKIE_NAME, verifyToken, type AdminTokenPayload } from './auth-edge'

const TOKEN_EXPIRY = '8h'

// Re-export the edge-safe pieces so existing imports from '@/lib/auth' keep working.
export { COOKIE_NAME, verifyToken }
export type { AdminTokenPayload }

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (!validUsername || !validPasswordHash) return false
  // Compare the username too, but always run bcrypt so the response time does
  // not reveal whether the username existed.
  const passwordOk = await bcrypt.compare(password, validPasswordHash)
  return username === validUsername && passwordOk
}

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username, role: 'admin' } as AdminTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getJwtSecret())
}
