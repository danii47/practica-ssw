import { requireAdmin } from '@/lib/require-auth';
import { listFlaggedReviews } from '@/services/moderation.service';
import { ok, handleError } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const reviews = await listFlaggedReviews(searchParams.get('sort') ?? 'recent');
    return ok(reviews);
  } catch (error) {
    return handleError(error);
  }
}
