import { getUserExchanges } from "@/services/exchanges.service";
import { ok, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/require-auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const exchanges = await getUserExchanges(session.sub);
    return ok(exchanges);
  } catch (error) {
    return handleError(error);
  }
}
