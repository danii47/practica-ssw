import { listActivities, createActivity } from '@/services/activities.service';
import { ok, created, handleError } from '@/lib/api-response';
import { BadRequestError } from '@/lib/api-error';
import { requireAuth } from '@/lib/require-auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activities = await listActivities({
      type: searchParams.get('type'),
      topic: searchParams.get('topic'),
      search: searchParams.get('search'),
    });
    return ok(activities);
  } catch (error) {
    return handleError(error);
  }
}

const VALID_TOPICS = ['Informática', 'Idiomas', 'Música', 'Deporte', 'Hogar', 'Cocina', 'Arte', 'Mascotas'];
const VALID_TYPES = ['online', 'presencial'];

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
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

    const activity = await createActivity(session.sub, { name, description, topic, type, location });
    return created(activity);
  } catch (error) {
    return handleError(error);
  }
}
