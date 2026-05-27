import { requireAuth } from "@/lib/require-auth";
import { ok, created, handleError } from "@/lib/api-response";
import { BadRequestError } from "@/lib/api-error";
import {
  getUserConversations,
  getOrCreateConversation,
} from "@/services/chat.service";

export async function GET() {
  try {
    const session = await requireAuth();
    const conversations = await getUserConversations(session.sub);
    return ok(conversations);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError("El cuerpo de la petición no es JSON válido.");
    }

    const { target_user_id } = body as Record<string, unknown>;

    if (!target_user_id || typeof target_user_id !== "string") {
      throw new BadRequestError("El campo target_user_id es obligatorio.");
    }
    if (target_user_id === session.sub) {
      throw new BadRequestError(
        "No puedes abrir una conversación contigo mismo."
      );
    }

    const conversation = await getOrCreateConversation(
      session.sub,
      target_user_id
    );
    return created(conversation);
  } catch (error) {
    return handleError(error);
  }
}
