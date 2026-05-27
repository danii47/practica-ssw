import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { NotFoundError, ForbiddenError, BadRequestError } from '@/lib/api-error';

type ActivityType = 'presencial' | 'online';

export async function listActivities(filters: {
  type?: string | null;
  topic?: string | null;
  search?: string | null;
}) {
  const where: NonNullable<Parameters<typeof prisma.activities.findMany>[0]>['where'] = { status: 'active' };

  if (filters.type === 'presencial' || filters.type === 'online') {
    where.type = filters.type as ActivityType;
  }
  if (filters.topic) {
    where.topic = filters.topic;
  }
  if (filters.search) {
    where.OR = [
      { name:        { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { user: { name:     { contains: filters.search, mode: 'insensitive' } } },
      { user: { surnames: { contains: filters.search, mode: 'insensitive' } } },
      { user: { username: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  return prisma.activities.findMany({
    where,
    include: {
      user: { select: { id_user: true, name: true, surnames: true, location: true } },
    },
    orderBy: { id_activity: 'desc' },
    take: 50,
  });
}

// Devuelve TODAS las actividades del usuario (activas y pausadas)
export async function listUserActivities(userId: string) {
  const user = await prisma.users.findUnique({
    where: { id_user: userId },
    select: { id_user: true },
  });
  if (!user) throw new NotFoundError('Usuario');

  return prisma.activities.findMany({
    where: { id_user: userId },
    orderBy: { id_activity: 'desc' },
  });
}

export async function createActivity(
  userId: string,
  data: {
    name: string;
    description: string;
    topic: string;
    type: ActivityType;
    location?: string;
  }
) {
  return prisma.activities.create({
    data: {
      id_user: userId,
      name: data.name.trim(),
      description: data.description.trim(),
      topic: data.topic,
      type: data.type,
      location: data.location?.trim() || null,
      status: 'active',
    },
  });
}

export async function updateActivity(
  activityId: number,
  userId: string,
  data: {
    name: string;
    description: string;
    topic: string;
    type: ActivityType;
    location?: string;
  }
) {
  const activity = await prisma.activities.findUnique({ where: { id_activity: activityId } });
  if (!activity) throw new NotFoundError('Actividad');
  if (activity.id_user !== userId) throw new Error('Forbidden');

  return prisma.activities.update({
    where: { id_activity: activityId },
    data: {
      name: data.name.trim(),
      description: data.description.trim(),
      topic: data.topic,
      type: data.type,
      location: data.location?.trim() || null,
    },
  });
}

export async function deleteActivity(activityId: number, userId: string) {
  const activity = await prisma.activities.findUnique({ where: { id_activity: activityId } });
  if (!activity) throw new NotFoundError('Actividad');
  if (activity.id_user !== userId) throw new ForbiddenError();

  try {
    await prisma.activities.delete({ where: { id_activity: activityId } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new BadRequestError(
        'No se puede eliminar un servicio que ya tiene intercambios o valoraciones asociadas.'
      );
    }
    throw err;
  }
}

export async function toggleActivityStatus(activityId: number, userId: string) {
  const activity = await prisma.activities.findUnique({ where: { id_activity: activityId } });
  if (!activity) throw new NotFoundError('Actividad');
  if (activity.id_user !== userId) throw new Error('Forbidden');

  const newStatus = activity.status === 'active' ? 'paused' : 'active';

  return prisma.activities.update({
    where: { id_activity: activityId },
    data: { status: newStatus },
  });
}
