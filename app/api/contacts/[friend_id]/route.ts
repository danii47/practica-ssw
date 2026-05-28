import { removeContact, isContact } from '@/services/contacts.service';
import { ok, noContent, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ friend_id: string }> }
) {
  try {
    const session = await requireAuth();
    const { friend_id } = await params;
    const result = await isContact(session.sub, friend_id);
    return ok({ isContact: result });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ friend_id: string }> }
) {
  try {
    const session = await requireAuth();
    const { friend_id } = await params;
    await removeContact(session.sub, friend_id);
    return noContent();
  } catch (error) {
    return handleError(error);
  }
}
