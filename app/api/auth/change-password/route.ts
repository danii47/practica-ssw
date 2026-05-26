import { requireAuth } from '@/lib/require-auth';
import { changeUserPassword } from '@/services/users.service';
import { ok, handleError } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = (await req.json().catch(() => ({}))) as {
      current_password?: string;
      new_password?: string;
    };

    await changeUserPassword(
      session.sub,
      body.current_password ?? '',
      body.new_password ?? '',
    );

    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
