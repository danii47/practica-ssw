import { requireAuth } from '@/lib/require-auth';
import { ok, handleError } from '@/lib/api-response';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();
    const total = await prisma.messages.count({
      where: {
        is_read: false,
        id_user_sender: { not: session.sub },
        conversation: { participants: { some: { id_user: session.sub } } },
      },
    });
    return ok({ total });
  } catch (e) {
    return handleError(e);
  }
}
