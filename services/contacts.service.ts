import prisma from '@/lib/db';
import { NotFoundError, ConflictError, BadRequestError } from '@/lib/api-error';

export async function addContact(userId: string, friendId: string) {
  if (userId === friendId) {
    throw new BadRequestError('No puedes añadirte a ti mismo como contacto.');
  }

  const friend = await prisma.users.findUnique({
    where: { id_user: friendId },
    select: { id_user: true },
  });
  if (!friend) throw new NotFoundError('Usuario');

  const existing = await prisma.contacts.findUnique({
    where: {
      id_user_friend_id_user: {
        id_user: userId,
        friend_id_user: friendId,
      },
    },
  });
  if (existing) {
    throw new ConflictError('Este usuario ya está en tu lista de contactos.');
  }

  return prisma.contacts.create({
    data: {
      id_user: userId,
      friend_id_user: friendId,
    },
  });
}

export async function isContact(userId: string, friendId: string): Promise<boolean> {
  const existing = await prisma.contacts.findUnique({
    where: {
      id_user_friend_id_user: {
        id_user: userId,
        friend_id_user: friendId,
      },
    },
  });
  return !!existing;
}

export async function getUserContacts(userId: string) {
  const relations = await prisma.contacts.findMany({
    where: { id_user: userId },
    select: { friend_id_user: true },
  });

  const friendIds = relations.map((r) => r.friend_id_user);

  const users = await prisma.users.findMany({
    where: { id_user: { in: friendIds } },
    select: {
      id_user: true,
      name: true,
      surnames: true,
      username: true,
      location: true,
      _count: { select: { activities: true } },
    },
  });

  return users.map((u) => ({
    id_user: u.id_user,
    full_name: `${u.name} ${u.surnames}`,
    username: u.username,
    initial: u.name.charAt(0).toUpperCase(),
    location: u.location,
    services_count: u._count.activities,
  }));
}

export async function removeContact(userId: string, friendId: string) {
  const existing = await prisma.contacts.findUnique({
    where: {
      id_user_friend_id_user: {
        id_user: userId,
        friend_id_user: friendId,
      },
    },
  });
  if (!existing) throw new NotFoundError('Contacto');

  await prisma.contacts.delete({
    where: {
      id_user_friend_id_user: {
        id_user: userId,
        friend_id_user: friendId,
      },
    },
  });
}