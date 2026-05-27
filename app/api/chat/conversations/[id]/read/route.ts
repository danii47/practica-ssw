import { requireAuth } from "@/lib/require-auth";
import { noContent, handleError } from "@/lib/api-response";
import { BadRequestError } from "@/lib/api-error";
import { markConversationRead } from "@/services/chat.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const convId = parseInt(id, 10);
    if (isNaN(convId)) throw new BadRequestError("ID de conversación inválido.");

    await markConversationRead(convId, session.sub);
    return noContent();
  } catch (error) {
    return handleError(error);
  }
}
