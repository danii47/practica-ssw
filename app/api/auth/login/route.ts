import { loginUser } from '@/services/auth.service';
import { ok, handleError } from '@/lib/api-response';
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

    const { session, token } = await loginUser(body);
    const response = ok({ id_user: session.sub, username: session.username, role: session.role });
    response.cookies.set(COOKIE_NAME, token, cookieOptions);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
