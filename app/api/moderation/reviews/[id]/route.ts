import { ok, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/require-auth";
import prisma from "@/lib/db";
import { ForbiddenError } from "@/lib/api-error";

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const user = await prisma.users.findUnique({
      where: { id_user: session.sub },
    });
    if (user?.role !== "admin") throw new ForbiddenError("No tienes permisos");

    const params = await props.params;
    await prisma.reviews.delete({ where: { id_review: parseInt(params.id) } });

    return ok({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const user = await prisma.users.findUnique({
      where: { id_user: session.sub },
    });
    if (user?.role !== "admin") throw new ForbiddenError("No tienes permisos");

    const params = await props.params;
    await prisma.reviews.update({
      where: { id_review: parseInt(params.id) },
      data: { is_flagged: false },
    });

    return ok({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
