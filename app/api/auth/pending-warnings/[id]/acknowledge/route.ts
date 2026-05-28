import { noContent, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import { NotFoundError } from '@/lib/api-error';
import prisma from '@/lib/db';

export async function POST(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await props.params;
    const penaltyId = parseInt(id);

    const penalty = await prisma.penalties.findFirst({
      where: { id_penalty: penaltyId, id_user: session.sub },
    });
    if (!penalty) throw new NotFoundError('Penalización');

    await prisma.penalties.update({
      where: { id_penalty: penaltyId },
      data: { acknowledged: true },
    });

    return noContent();
  } catch (error) {
    return handleError(error);
  }
}
