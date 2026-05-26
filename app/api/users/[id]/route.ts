import { getUserById, updateUser, type UpdateUserInput } from '@/services/users.service';
import { ok, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import { ForbiddenError, BadRequestError } from '@/lib/api-error';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    return ok(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Users can only update their own profile (admins can update any)
    if (session.sub !== id && session.role !== 'admin') {
      throw new ForbiddenError('Solo puedes editar tu propio perfil.');
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError('El cuerpo de la petición no es JSON válido.');
    }

    const {
      name,
      surnames,
      username,
      description,
      location,
      country,
      language,
    } = body as Record<string, unknown>;

    const input: UpdateUserInput = {
      name: typeof name === 'string' ? name : '',
      surnames: typeof surnames === 'string' ? surnames : '',
      username: typeof username === 'string' ? username : '',
      description: typeof description === 'string' ? description : null,
      location: typeof location === 'string' ? location : null,
      country: typeof country === 'string' ? country : '',
      language: typeof language === 'string' ? language : 'es',
    };

    const updated = await updateUser(id, input);
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
