import prisma from '@/lib/db';
import { NotFoundError } from '@/lib/api-error';

type SortMode = 'recent' | 'toxic';

export async function listFlaggedReviews(sort: string) {
  const orderBy: NonNullable<Parameters<typeof prisma.reviews.findMany>[0]>['orderBy'] =
    sort === 'toxic' ? { valoration: 'asc' } : { date: 'desc' };

  const reviews = await prisma.reviews.findMany({
    where: { is_flagged: true },
    orderBy,
    include: {
      author: { select: { id_user: true, name: true, username: true } },
      recipient: { select: { id_user: true, name: true, username: true } },
      exchange: {
        include: {
          activity_off: { select: { id_activity: true, name: true } },
        },
      },
    },
  });

  return reviews.map((review) => ({
    id_review: review.id_review,
    valoration: review.valoration,
    content: review.content,
    date: review.date,
    author: review.author,
    receiver: review.recipient,
    activity: review.exchange?.activity_off ?? { id_activity: 0, name: 'Desconocida' },
    alert_type:
      review.valoration <= 2 ? 'Alerta Automática (Nota Baja)' : 'Reporte de Usuario',
  }));
}

export async function deleteReviewAndPenalize(reviewId: number, adminId: string) {
  const review = await prisma.reviews.findUnique({
    where: { id_review: reviewId },
    select: { id_review: true, written_by: true, content: true },
  });
  if (!review) throw new NotFoundError('Reseña');

  const [, updatedUser] = await prisma.$transaction([
    prisma.penalties.create({
      data: {
        id_user: review.written_by,
        admin_id_user: adminId,
        reason: review.content,
        acknowledged: false,
      },
    }),
    prisma.users.update({
      where: { id_user: review.written_by },
      data: { penalties_count: { increment: 1 } },
      select: { penalties_count: true },
    }),
    prisma.reviews.delete({ where: { id_review: reviewId } }),
  ]);

  return { penalties_count: updatedUser.penalties_count, banned: updatedUser.penalties_count >= 3 };
}
