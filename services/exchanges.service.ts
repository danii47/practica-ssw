import prisma from "@/lib/db";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/lib/api-error";
import { getOrCreateConversation, sendMessage } from "@/services/chat.service";

export interface CreateExchangeInput {
  requester_id_user: string;
  target_id_user: string;
  requested_activity: number;
  offered_activity: number;
}

/**
 * Creates a new exchange proposal.
 * - requester_id_user : the logged-in user who is proposing
 * - target_id_user    : the user being targeted
 * - requested_activity: activity (id) owned by target that the requester wants
 * - offered_activity  : activity (id) owned by requester that they offer in return
 */
export async function createExchange(data: CreateExchangeInput) {
  if (data.requester_id_user === data.target_id_user) {
    throw new BadRequestError(
      "No puedes proponer un intercambio contigo mismo.",
    );
  }

  if (data.requested_activity === data.offered_activity) {
    throw new BadRequestError(
      "Las actividades solicitada y ofrecida deben ser distintas.",
    );
  }

  // Validate both activities exist and belong to the correct users
  const [actRequested, actOffered] = await Promise.all([
    prisma.activities.findUnique({
      where: { id_activity: data.requested_activity },
      select: { id_activity: true, id_user: true, status: true, name: true },
    }),
    prisma.activities.findUnique({
      where: { id_activity: data.offered_activity },
      select: { id_activity: true, id_user: true, status: true, name: true },
    }),
  ]);

  if (!actRequested) throw new NotFoundError("Actividad solicitada");
  if (!actOffered) throw new NotFoundError("Actividad ofrecida");

  if (actRequested.id_user !== data.target_id_user) {
    throw new BadRequestError(
      "La actividad solicitada no pertenece al usuario destino.",
    );
  }
  if (actOffered.id_user !== data.requester_id_user) {
    throw new BadRequestError("La actividad ofrecida debe ser tuya.");
  }
  if (actRequested.status !== "active" || actOffered.status !== "active") {
    throw new BadRequestError("Una o ambas actividades no están activas.");
  }

  const targetUser = await prisma.users.findUnique({
    where: { id_user: data.target_id_user },
    select: { role: true },
  });
  if (targetUser?.role === "admin") {
    throw new ForbiddenError(
      "No puedes proponer un intercambio con una cuenta del sistema."
    );
  }

  const exchange = await prisma.exchanges.create({
    data: {
      requester_id_user: data.requester_id_user,
      target_id_user: data.target_id_user,
      requested_activity: data.requested_activity,
      offered_activity: data.offered_activity,
      status: "pending",
    },
    select: {
      id_exchange: true,
      status: true,
      creation_date: true,
      requester_id_user: true,
      target_id_user: true,
      requested_activity: true,
      offered_activity: true,
    },
  });

  // Auto-create conversation and send the exchange as an embedded message
  const conv = await getOrCreateConversation(
    data.requester_id_user,
    data.target_id_user
  );
  await sendMessage(conv.id_conversation, data.requester_id_user, null, exchange.id_exchange);

  return exchange;
}

export async function getUserExchanges(userId: string) {
  return prisma.exchanges.findMany({
    where: {
      OR: [{ requester_id_user: userId }, { target_id_user: userId }],
    },
    include: {
      requester: {
        select: { id_user: true, name: true, surnames: true, username: true },
      },
      target: {
        select: { id_user: true, name: true, surnames: true, username: true },
      },
      activity_req: { select: { id_activity: true, name: true } },
      activity_off: { select: { id_activity: true, name: true } },
      reviews: {
        where: { written_by: userId },
        select: { id_review: true, valoration: true },
      },
    },
    orderBy: { creation_date: "desc" },
  });
}

export async function updateExchangeStatus(
  exchangeId: number,
  userId: string,
  status: "accepted" | "refused" | "completed",
) {
  const exchange = await prisma.exchanges.findUnique({
    where: { id_exchange: exchangeId },
  });
  if (!exchange) throw new NotFoundError("Intercambio");

  const isRequester = exchange.requester_id_user === userId;
  const isTarget = exchange.target_id_user === userId;

  if (!isRequester && !isTarget) {
    throw new ForbiddenError("No tienes permiso para modificar este intercambio.");
  }

  if ((status === "accepted" || status === "refused") && !isTarget) {
    throw new BadRequestError(
      "Solo el destinatario puede aceptar o rechazar esta propuesta.",
    );
  }

  if (status === "completed") {
    if (exchange.status !== "accepted") {
      throw new BadRequestError(
        "Solo se pueden completar intercambios previamente aceptados.",
      );
    }

    // Set the caller's confirmation flag
    const updateData: {
      requester_completed?: boolean;
      target_completed?: boolean;
      status?: string;
    } = isRequester
      ? { requester_completed: true }
      : { target_completed: true };

    // If the other party already confirmed, also mark the exchange as completed
    const otherAlreadyConfirmed = isRequester
      ? exchange.target_completed
      : exchange.requester_completed;

    if (otherAlreadyConfirmed) {
      updateData.status = "completed";
    }

    return prisma.exchanges.update({
      where: { id_exchange: exchangeId },
      data: updateData,
    });
  }

  return prisma.exchanges.update({
    where: { id_exchange: exchangeId },
    data: { status },
  });
}