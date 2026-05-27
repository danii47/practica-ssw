import { listUsers } from '@/services/users.service';
import { ok, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const users = await listUsers(searchParams.get('search'), session.sub);
    return ok(users);
  } catch (error) {
    return handleError(error);
  }
}
