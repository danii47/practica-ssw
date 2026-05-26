import { removeContact } from '@/services/contacts.service';
import { noContent, handleError } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';

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
