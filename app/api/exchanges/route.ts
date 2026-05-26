import { createExchange } from '@/services/exchanges.service';
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

    const { target_id_user, requested_activity, offered_activity } =
      body as Record<string, unknown>;

    if (!target_id_user || typeof target_id_user !== 'string') {
      throw new BadRequestError('El campo target_id_user es obligatorio.');
    }
    if (
      requested_activity === undefined ||
      requested_activity === null ||
      typeof requested_activity !== 'number'
    ) {
      throw new BadRequestError('El campo requested_activity debe ser un número.');
    }
    if (
      offered_activity === undefined ||
      offered_activity === null ||
      typeof offered_activity !== 'number'
    ) {
      throw new BadRequestError('El campo offered_activity debe ser un número.');
    }

    const exchange = await createExchange({
      requester_id_user: session.sub,
      target_id_user,
      requested_activity,
      offered_activity,
    });

    return created(exchange);
  } catch (error) {
    return handleError(error);
  }
}
