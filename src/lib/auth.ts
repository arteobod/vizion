import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me')
const TOKEN_EXPIRY = '8h'
export const COOKIE_NAME = 'admin-token'

export interface AdminTokenPayload extends JWTPayload {
  username: string
  role: 'admin'
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (!validUsername || !validPasswordHash) return false
  if (username !== validUsername) return false
  return bcrypt.compare(password, validPasswordHash)
}

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username, role: 'admin' } as AdminTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as AdminTokenPayload
  } catch {
    return null
  }
}
