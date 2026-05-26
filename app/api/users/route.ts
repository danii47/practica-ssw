import { listUsers } from '@/services/users.service';
import { ok, handleError } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const users = await listUsers(searchParams.get('search'));
    return ok(users);
  } catch (error) {
    return handleError(error);
  }
}
