import { updateExchangeStatus } from "@/services/exchanges.service";
import { ok, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/require-auth";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const params = await props.params;
    const body = await request.json();

    const updated = await updateExchangeStatus(
      parseInt(params.id),
      session.sub,
      body.status,
    );
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
