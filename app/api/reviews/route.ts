import { createReview } from '@/services/reviews.service';
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

    const { id_exchange, valoration, content } = body as Record<string, unknown>;

    if (typeof id_exchange !== 'number' || !Number.isInteger(id_exchange)) {
      throw new BadRequestError('El campo id_exchange debe ser un número entero.');
    }
    if (typeof valoration !== 'number') {
      throw new BadRequestError('El campo valoration debe ser un número entero entre 1 y 5.');
    }
    if (typeof content !== 'string') {
      throw new BadRequestError('El campo content es obligatorio.');
    }

    const review = await createReview({
      written_by: session.sub,
      id_exchange,
      valoration,
      content,
    });

    return created(review);
  } catch (error) {
    return handleError(error);
  }
}
