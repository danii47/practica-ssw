import { ok, handleError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/require-auth';
import prisma from '@/lib/db';
import { deleteReviewAndPenalize } from '@/services/moderation.service';

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAdmin();
    const { id } = await props.params;
    const result = await deleteReviewAndPenalize(parseInt(id), session.sub);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await props.params;
    await prisma.reviews.update({
      where: { id_review: parseInt(id) },
      data: { is_flagged: false },
    });
    return ok({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
