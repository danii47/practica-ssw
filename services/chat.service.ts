import prisma from "@/lib/db";
import { BadRequestError, ForbiddenError } from "@/lib/api-error";

export async function getOrCreateConversation(userId1: string, userId2: string) {
  const targetUser = await prisma.users.findUnique({
    where: { id_user: userId2 },
    select: { role: true },
  });
  if (targetUser?.role === "admin") {
    throw new ForbiddenError(
      "No puedes iniciar una conversación con una cuenta del sistema."
    );
  }

  const existing = await prisma.conversations.findFirst({
    where: {
      type: "direct",
      AND: [
        { participants: { some: { id_user: userId1 } } },
        { participants: { some: { id_user: userId2 } } },
      ],
    },
  });

  if (existing) return existing;

  return prisma.conversations.create({
    data: {
      type: "direct",
      participants: {
        create: [
          { id_user: userId1, rol: "member" },
          { id_user: userId2, rol: "member" },
        ],
      },
    },
  });
}

export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversations.findMany({
    where: {
      participants: { some: { id_user: userId } },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id_user: true,
              name: true,
              surnames: true,
              username: true,
            },
          },
        },
      },
      messages: {
        orderBy: { send_at: "desc" },
        take: 1,
        select: {
          id_message: true,
          content: true,
          send_at: true,
          id_user_sender: true,
          id_exchange: true,
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              is_read: false,
              id_user_sender: { not: userId },
            },
          },
        },
      },
    },
  });

  return conversations
    .map((conv) => ({
      id_conversation: conv.id_conversation,
      type: conv.type,
      creation_date: conv.creation_date,
      other_participant:
        conv.participants.find((p) => p.id_user !== userId)?.user ?? null,
      last_message: conv.messages[0] ?? null,
      unread_count: conv._count.messages,
    }))
    .sort((a, b) => {
      const dateA = new Date(
        a.last_message?.send_at ?? a.creation_date
      ).getTime();
      const dateB = new Date(
        b.last_message?.send_at ?? b.creation_date
      ).getTime();
      return dateB - dateA;
    });
}

async function verifyParticipant(convId: number, userId: string) {
  const participant = await prisma.participants.findUnique({
    where: {
      id_conversation_id_user: {
        id_conversation: convId,
        id_user: userId,
      },
    },
  });
  if (!participant)
    throw new ForbiddenError("No eres participante de esta conversación.");
}

export async function getConversationMessages(convId: number, userId: string) {
  await verifyParticipant(convId, userId);

  return prisma.messages.findMany({
    where: { id_conversation: convId },
    orderBy: { send_at: "asc" },
    select: {
      id_message: true,
      content: true,
      send_at: true,
      id_exchange: true,
      is_read: true,
      sender: {
        select: {
          id_user: true,
          name: true,
          surnames: true,
          username: true,
        },
      },
      exchange: {
        select: {
          id_exchange: true,
          status: true,
          requester_id_user: true,
          target_id_user: true,
          activity_req: {
            select: { id_activity: true, name: true, topic: true },
          },
          activity_off: {
            select: { id_activity: true, name: true, topic: true },
          },
          requester: {
            select: { id_user: true, name: true, surnames: true },
          },
          target: {
            select: { id_user: true, name: true, surnames: true },
          },
        },
      },
    },
  });
}

export async function sendMessage(
  convId: number,
  senderId: string,
  content: string | null,
  exchangeId?: number
) {
  await verifyParticipant(convId, senderId);

  if (!content?.trim() && !exchangeId) {
    throw new BadRequestError(
      "El mensaje debe tener contenido o un intercambio asociado."
    );
  }

  return prisma.messages.create({
    data: {
      id_conversation: convId,
      id_user_sender: senderId,
      content: content?.trim() ?? null,
      id_exchange: exchangeId ?? null,
    },
    select: {
      id_message: true,
      content: true,
      send_at: true,
      id_exchange: true,
      is_read: true,
      sender: {
        select: {
          id_user: true,
          name: true,
          surnames: true,
          username: true,
        },
      },
      exchange: {
        select: {
          id_exchange: true,
          status: true,
          requester_id_user: true,
          target_id_user: true,
          activity_req: {
            select: { id_activity: true, name: true, topic: true },
          },
          activity_off: {
            select: { id_activity: true, name: true, topic: true },
          },
          requester: {
            select: { id_user: true, name: true, surnames: true },
          },
          target: {
            select: { id_user: true, name: true, surnames: true },
          },
        },
      },
    },
  });
}

export async function markConversationRead(convId: number, userId: string) {
  await verifyParticipant(convId, userId);

  await prisma.messages.updateMany({
    where: {
      id_conversation: convId,
      id_user_sender: { not: userId },
      is_read: false,
    },
    data: { is_read: true },
  });
}
