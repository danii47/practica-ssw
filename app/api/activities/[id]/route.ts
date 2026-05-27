import { updateActivity, deleteActivity } from '@/services/activities.service';
import { ok, handleError } from '@/lib/api-response';
import { BadRequestError, ForbiddenError } from '@/lib/api-error';
import { requireAuth } from '@/lib/require-auth';

const VALID_TOPICS = ['Informática', 'Idiomas', 'Música', 'Deporte', 'Hogar', 'Cocina', 'Arte', 'Mascotas'];
const VALID_TYPES = ['online', 'presencial'];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) throw new BadRequestError('ID de actividad inválido.');

    const body = await request.json();
    const { name, description, topic, type, location } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 50)
      throw new BadRequestError('El nombre es obligatorio (máx. 50 caracteres).');
    if (!description || typeof description !== 'string' || description.trim().length < 1 || description.trim().length > 250)
      throw new BadRequestError('La descripción es obligatoria (máx. 250 caracteres).');
    if (!topic || !VALID_TOPICS.includes(topic))
      throw new BadRequestError('Tema no válido.');
    if (!type || !VALID_TYPES.includes(type))
      throw new BadRequestError('Tipo no válido.');

    const activity = await updateActivity(activityId, session.sub, {
      name, description, topic, type, location,
    }).catch((err) => {
      if (err.message === 'Forbidden') throw new ForbiddenError();
      throw err;
    });

    return ok(activity);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const activityId = parseInt(id, 10);
    if (isNaN(activityId)) throw new BadRequestError('ID de actividad inválido.');

    await deleteActivity(activityId, session.sub);
    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
