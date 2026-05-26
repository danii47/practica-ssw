import crypto from 'crypto';
import prisma from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/hash';
import { signToken, type SessionPayload } from '@/lib/auth';
import { validateRegisterInput, validateLoginInput } from '@/lib/validate';
import { UnprocessableError, ConflictError, UnauthorizedError, ForbiddenError } from '@/lib/api-error';

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  name: string;
  surnames: string;
  country: string;
  born_date: string;
  description?: string;
  location?: string;
}

export interface AuthResult {
  session: SessionPayload;
  token: string;
}

export async function registerUser(body: Record<string, unknown>): Promise<AuthResult> {
  const errors = validateRegisterInput(body);
  if (errors) throw new UnprocessableError('Datos inválidos.', errors);

  const email = (body.email as string).toLowerCase().trim();
  const username = (body.username as string).trim();

  const existing = await prisma.users.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });

  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    const message =
      field === 'email' ? 'Este email ya está registrado.' : 'Este nombre de usuario ya está en uso.';
    throw new ConflictError(message, { [field]: message });
  }

  const id_user = crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');
  const psw_hash = await hashPassword(body.password as string);

  const user = await prisma.users.create({
    data: {
      id_user,
      username,
      email,
      psw_hash,
      name: (body.name as string).trim(),
      surnames: (body.surnames as string).trim(),
      country: (body.country as string).trim(),
      born_date: new Date(body.born_date as string),
      description: body.description ? (body.description as string).trim() : null,
      location: body.location ? (body.location as string).trim() : null,
    },
    select: { id_user: true, username: true, role: true },
  });

  const session: SessionPayload = { sub: user.id_user, username: user.username, role: user.role };
  const token = await signToken(session);
  return { session, token };
}

export async function loginUser(body: Record<string, unknown>): Promise<AuthResult> {
  const errors = validateLoginInput(body);
  if (errors) throw new UnprocessableError('Datos inválidos.', errors);

  const email = (body.email as string).toLowerCase().trim();

  const user = await prisma.users.findUnique({
    where: { email },
    select: { id_user: true, username: true, role: true, psw_hash: true, status: true },
  });

  if (!user) throw new UnauthorizedError('Credenciales incorrectas.');
  if (!user.status) throw new ForbiddenError('Esta cuenta ha sido suspendida.');

  const valid = await verifyPassword(body.password as string, user.psw_hash);
  if (!valid) throw new UnauthorizedError('Credenciales incorrectas.');

  const session: SessionPayload = { sub: user.id_user, username: user.username, role: user.role };
  const token = await signToken(session);
  return { session, token };
}
