import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME, type SessionPayload } from './auth';
import { UnauthorizedError, ForbiddenError } from './api-error';

export async function requireAuth(): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) throw new UnauthorizedError();
  const session = await verifyToken(token);
  if (!session) throw new UnauthorizedError('Sesión inválida o expirada.');
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== 'admin') throw new ForbiddenError();
  return session;
}
