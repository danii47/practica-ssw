import { getUserContacts } from "@/services/contacts.service";
import { ok, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/require-auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const contacts = await getUserContacts(session.sub);
    return ok(contacts);
  } catch (error) {
    return handleError(error);
  }
}
