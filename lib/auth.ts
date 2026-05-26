import { SignJWT, jwtVerify, type JWTPayload as JosePayload } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ALG = 'HS256';
const EXPIRY = '7d';
export const COOKIE_NAME = 'kx_token';

export interface SessionPayload {
  sub: string;
  username: string;
  role: string;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const p = payload as JosePayload & SessionPayload;
    if (!p.sub || !p.username || !p.role) return null;
    return { sub: p.sub, username: p.username, role: p.role };
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};
