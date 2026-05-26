import { addContact } from '@/services/contacts.service';
import { created, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import { BadRequestError } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError('El cuerpo de la petición no es JSON válido.');
    }

    const { friend_id_user } = body as Record<string, unknown>;

    if (!friend_id_user || typeof friend_id_user !== 'string') {
      throw new BadRequestError('El campo friend_id_user es obligatorio.');
    }

    const contact = await addContact(session.sub, friend_id_user);
    return created(contact);
  } catch (error) {
    return handleError(error);
  }
}
