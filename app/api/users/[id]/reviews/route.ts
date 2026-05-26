import { getUserReviews } from '@/services/users.service';
import { ok, handleError } from '@/lib/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = await getUserReviews(id);
    return ok(reviews);
  } catch (error) {
    return handleError(error);
  }
}
