import { requireAuth } from "@/lib/require-auth";
import { ok, created, handleError } from "@/lib/api-response";
import { BadRequestError } from "@/lib/api-error";
import { getConversationMessages, sendMessage } from "@/services/chat.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const convId = parseInt(id, 10);
    if (isNaN(convId)) throw new BadRequestError("ID de conversación inválido.");

    const messages = await getConversationMessages(convId, session.sub);
    return ok(messages);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const convId = parseInt(id, 10);
    if (isNaN(convId)) throw new BadRequestError("ID de conversación inválido.");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError("El cuerpo de la petición no es JSON válido.");
    }

    const { content, exchange_id } = body as Record<string, unknown>;

    if (content !== undefined && content !== null && typeof content !== "string") {
      throw new BadRequestError("El contenido debe ser texto.");
    }
    if (exchange_id !== undefined && exchange_id !== null && typeof exchange_id !== "number") {
      throw new BadRequestError("exchange_id debe ser un número.");
    }

    const message = await sendMessage(
      convId,
      session.sub,
      (content as string | null | undefined) ?? null,
      exchange_id as number | undefined
    );
    return created(message);
  } catch (error) {
    return handleError(error);
  }
}
