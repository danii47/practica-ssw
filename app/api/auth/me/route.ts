import { requireAuth } from '@/lib/require-auth';
import {
  getCurrentUser,
  updateUser,
  updateEmail,
  deleteUser,
} from '@/services/users.service';
import { ok, handleError } from '@/lib/api-response';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await getCurrentUser(session.sub);
    return ok(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const body = (await req.json()) as Record<string, unknown>;

    if (typeof body.email === 'string' && Object.keys(body).length === 1) {
      const result = await updateEmail(session.sub, body.email);
      return ok(result);
    }

    const updated = await updateUser(session.sub, {
      name: body.name as string,
      surnames: body.surnames as string,
      username: body.username as string,
      country: body.country as string,
      description: (body.description as string) ?? null,
      location: (body.location as string) ?? null,
    });
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAuth();
    const body = (await req.json().catch(() => ({}))) as { password?: string };
    await deleteUser(session.sub, body.password ?? '');

    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
