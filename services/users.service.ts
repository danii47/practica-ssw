import prisma from '@/lib/db';
import { NotFoundError, ConflictError, BadRequestError } from '@/lib/api-error';

// ─── List / Search ────────────────────────────────────────────────────────────

export async function listUsers(search?: string | null, excludeUserId?: string) {
  const where: NonNullable<Parameters<typeof prisma.users.findMany>[0]>['where'] = {
    status: true,
    role: { not: 'admin' },
    ...(excludeUserId ? { id_user: { not: excludeUserId } } : {}),
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { surnames: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.users.findMany({
    where,
    select: {
      id_user: true,
      name: true,
      surnames: true,
      username: true,
      _count: { select: { activities: { where: { status: 'active' } } } },
    },
    orderBy: { name: 'asc' },
  });

  return users.map((u) => ({
    id_user: u.id_user,
    full_name: `${u.name} ${u.surnames}`,
    username: u.username,
    initial: u.name.charAt(0).toUpperCase(),
    services_count: u._count.activities,
  }));
}

// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getUserById(id: string) {
  const user = await prisma.users.findUnique({
    where: { id_user: id },
    select: {
      id_user: true,
      username: true,
      name: true,
      surnames: true,
      description: true,
      location: true,
      country: true,
      register_date: true,
      role: true,
    },
  });

  if (!user) throw new NotFoundError('Usuario');

  const stats = await prisma.reviews.aggregate({
    where: { written_to_user: id },
    _avg: { valoration: true },
    _count: { id_review: true },
  });

  return {
    ...user,
    rating: stats._avg.valoration ? Number(stats._avg.valoration).toFixed(1) : '0.0',
    reviews_count: stats._count.id_review,
  };
}

// ─── Get current user (for /api/auth/me) ──────────────────────────────────────

export async function getCurrentUser(id: string) {
  const user = await prisma.users.findUnique({
    where: { id_user: id },
    select: {
      id_user: true,
      username: true,
      name: true,
      surnames: true,
      email: true,
      role: true,
      description: true,
      location: true,
      country: true,
      language: true,
    },
  });

  if (!user) throw new NotFoundError('Usuario');
  return user;
}

// ─── Update profile ───────────────────────────────────────────────────────────

export interface UpdateUserInput {
  name: string;
  surnames: string;
  username: string;
  description?: string | null;
  location?: string | null;
  country: string;
  language?: string | null;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  // Validate field lengths
  if (!data.name?.trim() || data.name.length > 15)
    throw new BadRequestError('El nombre es obligatorio (máx. 15 caracteres).', { name: 'El nombre es obligatorio (máx. 15 caracteres).' });
  if (!data.surnames?.trim() || data.surnames.length > 30)
    throw new BadRequestError('Los apellidos son obligatorios (máx. 30 caracteres).', { surnames: 'Los apellidos son obligatorios (máx. 30 caracteres).' });
  if (!data.username?.trim() || data.username.length < 3 || data.username.length > 20)
    throw new BadRequestError('El username debe tener entre 3 y 20 caracteres.', { username: 'El username debe tener entre 3 y 20 caracteres.' });
  if (!/^[a-zA-Z0-9_]+$/.test(data.username))
    throw new BadRequestError('El username solo puede contener letras, números y guiones bajos.', { username: 'Solo letras, números y guiones bajos.' });
  if (!data.country?.trim() || data.country.length > 15)
    throw new BadRequestError('El país es obligatorio (máx. 15 caracteres).', { country: 'El país es obligatorio.' });

  // Check username uniqueness (excluding current user)
  const existing = await prisma.users.findFirst({
    where: { username: data.username, NOT: { id_user: id } },
  });
  if (existing) {
    throw new ConflictError('El nombre de usuario ya está en uso.', {
      username: 'Este nombre de usuario ya está en uso por otra cuenta.',
    });
  }

  const updated = await prisma.users.update({
    where: { id_user: id },
    data: {
      name: data.name.trim(),
      surnames: data.surnames.trim(),
      username: data.username.trim(),
      description: data.description?.trim() || null,
      location: data.location?.trim() || null,
      country: data.country.trim(),
      language: data.language || 'es',
    },
    select: {
      id_user: true,
      username: true,
      name: true,
      surnames: true,
      email: true,
      role: true,
      description: true,
      location: true,
      country: true,
      language: true,
    },
  });

  return updated;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getUserReviews(userId: string) {
  const user = await prisma.users.findUnique({
    where: { id_user: userId },
    select: { id_user: true },
  });
  if (!user) throw new NotFoundError('Usuario');

  const reviews = await prisma.reviews.findMany({
    where: { written_to_user: userId, is_flagged: false },
    orderBy: { date: 'desc' },
    include: {
      author: { select: { id_user: true, name: true, surnames: true, username: true } },
      exchange: {
        select: {
          requester_id_user: true,
          activity_req: { select: { id_activity: true, name: true } },
          activity_off: { select: { id_activity: true, name: true } },
        },
      },
    },
  });

  return reviews.map((review) => {
    const isRecipientRequester = userId === review.exchange?.requester_id_user;
    const providedActivity = isRecipientRequester
      ? review.exchange?.activity_off
      : review.exchange?.activity_req;

    return {
      id_review: review.id_review,
      valoration: review.valoration,
      content: review.content,
      date: review.date,
      author: {
        id: review.author.id_user,
        name: `${review.author.name} ${review.author.surnames.charAt(0)}.`,
        initial: review.author.name.charAt(0).toUpperCase(),
      },
      service_title: providedActivity?.name ?? 'Actividad no disponible',
    };
  });
}

// ─── Email / Password / Delete ───────────────────────────────────────────────

export async function updateEmail(id: string, email: string) {
  const cleaned = email?.trim().toLowerCase() ?? '';
  if (!cleaned || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    throw new BadRequestError('Correo electrónico inválido.');
  }
  const existing = await prisma.users.findFirst({
    where: { email: cleaned, NOT: { id_user: id } },
    select: { id_user: true },
  });
  if (existing) {
    throw new ConflictError('Este correo ya está en uso.');
  }
  await prisma.users.update({ where: { id_user: id }, data: { email: cleaned } });
  return { email: cleaned };
}

export async function changeUserPassword(id: string, current: string, next: string) {
  const { verifyPassword, hashPassword } = await import('@/lib/hash');
  const user = await prisma.users.findUnique({ where: { id_user: id } });
  if (!user) throw new NotFoundError('Usuario');
  const valid = await verifyPassword(current, user.psw_hash);
  if (!valid) throw new BadRequestError('La contraseña actual no es correcta.');
  if (current === next) throw new BadRequestError('La nueva contraseña no puede ser igual a la actual.');
  if (!next || next.length < 8) {
    throw new BadRequestError('La nueva contraseña debe tener al menos 8 caracteres.');
  }
  const hash = await hashPassword(next);
  await prisma.users.update({ where: { id_user: id }, data: { psw_hash: hash } });
}

export async function deleteUser(id: string, password: string) {
  const { verifyPassword } = await import('@/lib/hash');
  const user = await prisma.users.findUnique({ where: { id_user: id } });
  if (!user) throw new NotFoundError('Usuario');
  const valid = await verifyPassword(password, user.psw_hash);
  if (!valid) throw new BadRequestError('Contraseña incorrecta.');
  await prisma.users.delete({ where: { id_user: id } });
}
