import { toggleActivityStatus } from '@/services/activities.service';
import { ok, handleError } from '@/lib/api-response';
import { BadRequestError, ForbiddenError } from '@/lib/api-error';
import { requireAuth } from '@/lib/require-auth';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) throw new BadRequestError('ID de actividad inválido.');

    const activity = await toggleActivityStatus(activityId, session.sub).catch((err) => {
      if (err.message === 'Forbidden') throw new ForbiddenError();
      throw err;
    });

    return ok(activity);
  } catch (error) {
    return handleError(error);
  }
}
