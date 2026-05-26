import { NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';
import { ok, created, handleError } from '@/lib/api-response';
import { cookieOptions, COOKIE_NAME } from '@/lib/auth';
import { BadRequestError } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError('Cuerpo de la petición inválido.');
    }

    const { session, token } = await registerUser(body);
    const response = created({ id_user: session.sub, username: session.username, role: session.role });
    response.cookies.set(COOKIE_NAME, token, cookieOptions);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
