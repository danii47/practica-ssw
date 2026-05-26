import { listUserActivities } from '@/services/activities.service';
import { ok, handleError } from '@/lib/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activities = await listUserActivities(id);
    return ok(activities);
  } catch (error) {
    return handleError(error);
  }
}
