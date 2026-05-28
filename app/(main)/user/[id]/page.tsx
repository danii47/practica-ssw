import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getUserById, getUserReviews } from '@/services/users.service';
import { listUserActivities } from '@/services/activities.service';
import { isContact } from '@/services/contacts.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProfileInteractive from '@/components/ProfileInteractive';
import StarRating from '@/components/StarRating';
import { topicStyle } from '@/lib/topics';

interface ActivityRow {
  id_activity: number;
  name: string;
  description: string;
  topic: string;
  type: string;
  location: string | null;
  status: string;
}

interface ReviewRow {
  id_review: number;
  valoration: number;
  content: string;
  date: string | Date;
  service_title?: string | null;
  author: { id: string; name: string; initial: string };
}

async function getSessionInfo(): Promise<{ sub: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const session = await verifyToken(token);
    if (!session) return null;
    return { sub: session.sub, role: session.role };
  } catch {
    return null;
  }
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSessionInfo();
  const sessionUserId = session?.sub ?? null;
  const viewerRole = session?.role ?? 'user';

  const [user, reviews, activities] = await Promise.all([
    getUserById(id).catch(() => null),
    getUserReviews(id).catch(() => []),
    listUserActivities(id).catch(() => []),
  ]);

  if (!user) notFound();

  const isOwnProfile = sessionUserId === id;
  const activitiesList = (activities as unknown as ActivityRow[]).filter((a) => a.status === 'active');
  const reviewsList = reviews as unknown as ReviewRow[];

  const initialIsContact = (!isOwnProfile && sessionUserId)
    ? await isContact(sessionUserId, id).catch(() => false)
    : false;

  const fullName = `${user.name} ${user.surnames}`;
  const memberSince = new Date(user.register_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-canvas">
      <header className="h-16 bg-surface/80 backdrop-blur border-b border-hairline flex items-center justify-between px-6 md:px-10 shrink-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver
        </Link>
        {isOwnProfile && (
          <Link href="/settings" className="flex items-center gap-2 px-4 py-2 bg-surface border border-hairline rounded-lg text-sm font-bold text-ink-soft hover:border-brand hover:text-brand transition-colors btn-press">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Editar perfil
          </Link>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6 md:space-y-8">

          {!isOwnProfile ? (
            /* Perfil ajeno — delegado completamente al wrapper cliente */
            <ProfileInteractive
              targetUserId={user.id_user}
              targetUserName={fullName}
              initialIsContact={initialIsContact}
              viewerRole={viewerRole}
              activities={activitiesList}
              heroData={{
                initial: user.name.charAt(0).toUpperCase(),
                fullName,
                username: user.username,
                description: user.description ?? null,
                location: user.location ?? null,
                country: user.country ?? null,
                memberSince,
                role: user.role,
                rating: user.rating,
                reviews_count: user.reviews_count,
              }}
              reviews={reviewsList}
            />
          ) : (
            /* Perfil propio — render estático server */
            <>
              <section className="bg-surface rounded-3xl shadow-soft border border-hairline overflow-hidden animate-slide-up">
                <div className="relative h-36 md:h-44 gradient-brand overflow-hidden">
                  <div className="absolute inset-0 bg-noise opacity-30" />
                  <div className="absolute inset-0 bg-grid opacity-15 mix-blend-overlay" />
                  <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-20 -left-12 w-48 h-48 rounded-full bg-fuchsia-300/30 blur-3xl" />
                </div>

                <div className="px-6 md:px-10 pb-8">
                  <div className="flex items-end justify-between -mt-14 mb-5 gap-4 flex-wrap relative z-10">
                    <div className="w-28 h-28 rounded-3xl bg-surface border-[5px] border-surface shadow-lg flex items-center justify-center text-5xl font-extrabold text-brand">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-hairline rounded-xl text-sm font-bold text-ink-soft hover:border-brand hover:text-brand transition-colors btn-press">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                      Editar perfil
                    </Link>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">{fullName}</h1>
                        {user.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-danger-soft text-red-700 text-xs font-bold rounded-full border border-red-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                            Admin
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 bg-success-soft text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Tú</span>
                      </div>
                      <p className="text-muted text-sm mb-3">@{user.username}</p>
                      {user.description && (
                        <p className="text-ink-soft text-sm leading-relaxed max-w-xl mb-4">{user.description}</p>
                      )}
                      <div className="flex items-center gap-5 flex-wrap text-xs text-muted">
                        {user.location && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="font-semibold text-ink-soft">{user.location}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          Miembro desde <span className="font-semibold text-ink-soft" suppressHydrationWarning>{memberSince}</span>
                        </span>
                        {user.country && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a8.949 8.949 0 004.951-1.488A3.987 3.987 0 0013 16.8h-2a3.987 3.987 0 00-3.951 2.712A8.949 8.949 0 0012 21zm3-11.25a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-semibold text-ink-soft">{user.country}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 md:flex-shrink-0">
                      <div className="bg-canvas border border-hairline rounded-2xl px-5 py-4 md:min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-2xl font-extrabold text-ink leading-none">{Number(user.rating ?? 0).toFixed(1)}</span>
                        </div>
                        <p className="text-[11px] text-muted font-semibold uppercase tracking-wide">
                          {user.reviews_count} {user.reviews_count === 1 ? 'valoración' : 'valoraciones'}
                        </p>
                      </div>
                      <div className="bg-canvas border border-hairline rounded-2xl px-5 py-4 md:min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                          </svg>
                          <span className="text-2xl font-extrabold text-ink leading-none">{activitiesList.length}</span>
                        </div>
                        <p className="text-[11px] text-muted font-semibold uppercase tracking-wide">
                          {activitiesList.length === 1 ? 'servicio activo' : 'servicios activos'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {activitiesList.length > 0 && (
                <section className="animate-slide-up" style={{ animationDelay: '60ms' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-ink tracking-tight">Servicios ofrecidos</h2>
                    <span className="text-xs text-muted font-semibold">{activitiesList.length} {activitiesList.length === 1 ? 'servicio' : 'servicios'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activitiesList.map((activity) => {
                      const s = topicStyle(activity.topic);
                      return (
                        <article key={activity.id_activity} className="bg-surface rounded-2xl border border-hairline overflow-hidden card-hoverable">
                          <div className={`relative h-24 bg-gradient-to-br ${s.gradient}`}>
                            <div className="absolute inset-0 bg-noise opacity-30" />
                            <div className="absolute top-2.5 right-2.5 inline-flex px-2 py-0.5 bg-white/95 backdrop-blur rounded text-[10px] font-bold tracking-wide uppercase text-ink-soft">
                              {activity.type === 'online' ? 'Online' : 'Presencial'}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-11 h-11 text-white/85">{s.icon}</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full mb-1.5 ${s.tintBg} ${s.tintText} ${s.tintBorder} border`}>
                              {activity.topic}
                            </span>
                            <h3 className="font-bold text-ink text-sm mb-1 leading-snug">{activity.name}</h3>
                            <p className="text-xs text-muted line-clamp-2 leading-relaxed">{activity.description}</p>
                            {activity.location && (
                              <p className="text-[11px] text-muted-soft mt-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {activity.location}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="animate-slide-up" style={{ animationDelay: '120ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-ink tracking-tight">Valoraciones recibidas</h2>
                  {reviewsList.length > 0 && (
                    <span className="text-xs text-muted font-semibold">{reviewsList.length} {reviewsList.length === 1 ? 'valoración' : 'valoraciones'}</span>
                  )}
                </div>

                {reviewsList.length === 0 ? (
                  <div className="bg-surface rounded-3xl border border-hairline p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-canvas border border-hairline flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                    <p className="font-bold text-ink mb-1">Sin valoraciones todavía</p>
                    <p className="text-sm text-muted">Las reseñas aparecerán aquí tras completar intercambios.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviewsList.map((review) => (
                      <article key={review.id_review} className="bg-surface rounded-2xl border border-hairline p-5 card-hoverable">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <Link href={`/user/${review.author.id}`} className="flex items-center gap-3 group min-w-0">
                            <div className="w-10 h-10 rounded-full bg-brand-soft border-2 border-white shadow-soft flex items-center justify-center font-bold text-brand shrink-0">
                              {review.author.initial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-ink text-sm truncate group-hover:text-brand transition-colors">{review.author.name}</p>
                              <p className="text-[11px] text-muted-soft" suppressHydrationWarning>
                                {new Date(review.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </Link>
                          <StarRating value={review.valoration} />
                        </div>

                        {review.service_title && (
                          <p className="text-[11px] text-muted mb-2 font-semibold">
                            Servicio: <span className="text-ink-soft font-bold">{review.service_title}</span>
                          </p>
                        )}

                        <p className="text-sm text-ink-soft leading-relaxed">{review.content}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
