import { updateExchangeStatus } from "@/services/exchanges.service";
import { ok, handleError } from "@/lib/api-response";
import { BadRequestError } from "@/lib/api-error";
import { requireAuth } from "@/lib/require-auth";

const ALLOWED_STATUSES = ["accepted", "refused", "completed"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const params = await props.params;

    const exchangeId = parseInt(params.id, 10);
    if (isNaN(exchangeId)) throw new BadRequestError("ID de intercambio inválido.");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError("El cuerpo de la petición no es JSON válido.");
    }

    const { status } = body as Record<string, unknown>;

    if (!status || !ALLOWED_STATUSES.includes(status as AllowedStatus)) {
      throw new BadRequestError(
        `El campo status debe ser uno de: ${ALLOWED_STATUSES.join(", ")}.`,
      );
    }

    const updated = await updateExchangeStatus(
      exchangeId,
      session.sub,
      status as AllowedStatus,
    );
    return ok(updated);
  } catch (error) {
    return handleError(error);
  }
}
