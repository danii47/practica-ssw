import prisma from '@/lib/db';

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
