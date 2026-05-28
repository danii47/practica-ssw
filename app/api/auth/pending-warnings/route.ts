import { ok, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();

    const [warnings, user] = await Promise.all([
      prisma.penalties.findMany({
        where: { id_user: session.sub, acknowledged: false },
        select: { id_penalty: true, reason: true, given_at: true },
        orderBy: { given_at: 'asc' },
      }),
      prisma.users.findUnique({
        where: { id_user: session.sub },
        select: { penalties_count: true },
      }),
    ]);

    return ok({ warnings, penalties_count: user?.penalties_count ?? 0 });
  } catch (error) {
    return handleError(error);
  }
}
