'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FlaggedReview {
  id_review: number;
  valoration: number;
  content: string;
  date: string;
  author: {
    id_user: string;
    name: string;
    surnames: string;
    username: string;
    initial: string;
  };
  receiver: {
    id_user: string;
    name: string;
    surnames: string;
    username: string;
    initial: string;
  };
  service_title?: string;
}

type SortKey = 'recent' | 'oldest' | 'lowest';

export default function ModerationPage() {
  const router = useRouter();
  const [forbidden, setForbidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<FlaggedReview[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('recent');

  const fetchFlagged = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/moderation/reviews');
    if (res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchFlagged(); }, [fetchFlagged]);

  async function handleAction(id: number, action: 'delete' | 'ignore') {
    setActionLoading(id);
    try {
      const method = action === 'delete' ? 'DELETE' : 'PATCH';
      const res = await fetch(`/api/moderation/reviews/${id}`, { method });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id_review !== id));
        setConfirmDelete(null);
        router.refresh();
      } else {
        alert('Error al procesar la acción.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setActionLoading(null);
    }
  }

  if (forbidden) {
    return (
      <main className="flex-1 flex items-center justify-center bg-canvas">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 rounded-2xl bg-danger-soft flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">Acceso restringido</h1>
          <p className="text-muted mb-6">Solo los administradores pueden acceder al panel de moderación.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    return a.valoration - b.valoration;
  });

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-canvas">
      <header className="bg-surface border-b border-hairline shrink-0 z-10">
        <div className="px-6 md:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-danger-soft flex items-center justify-center">
              <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
                Panel de moderación
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-danger-soft text-red-700 border border-red-200 uppercase tracking-wider">Admin</span>
              </h1>
              <p className="text-sm text-muted mt-0.5">Revisa y resuelve las reseñas marcadas automáticamente por el sistema.</p>
            </div>
          </div>
          {!loading && reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-muted">Ordenar:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="px-3 py-1.5 bg-surface border border-hairline rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="lowest">Menor valoración</option>
              </select>
            </div>
          )}
        </div>

        <div className="px-6 md:px-10 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-canvas border border-hairline rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Pendientes</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{reviews.length}</p>
          </div>
          <div className="bg-canvas border border-hairline rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Valoración media marcada</p>
            <p className="text-2xl font-extrabold text-ink mt-1">
              {reviews.length === 0 ? '—' : (reviews.reduce((s, r) => s + r.valoration, 0) / reviews.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-canvas border border-hairline rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Usuarios únicos</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{new Set(reviews.map((r) => r.author.id_user)).size}</p>
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-2xl border border-hairline overflow-hidden">
                  <div className="h-14 skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-2/3 skeleton rounded" />
                    <div className="h-3 w-full skeleton rounded" />
                    <div className="h-3 w-5/6 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-success-soft flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-ink mb-1">Todo en orden</h3>
              <p className="text-sm text-muted">No hay reseñas marcadas para revisar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((review, idx) => {
                const isLoading = actionLoading === review.id_review;
                const isConfirming = confirmDelete === review.id_review;

                return (
                  <article
                    key={review.id_review}
                    className="bg-surface rounded-2xl border border-hairline overflow-hidden card-hoverable animate-slide-up"
                    style={{ animationDelay: `${Math.min(idx, 6) * 40}ms` }}
                  >
                    <div className="relative bg-gradient-to-r from-red-500 via-rose-500 to-red-600 px-5 py-3 text-white flex items-center justify-between overflow-hidden">
                      <div className="absolute inset-0 bg-noise opacity-30" />
                      <div className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                        </svg>
                        Reseña marcada
                      </div>
                      <div className="relative flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 fill-current text-amber-200" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold">{review.valoration}/5</span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-4 text-sm">
                        <Link href={`/user/${review.author.id_user}`} className="flex items-center gap-2 group">
                          <div className="w-9 h-9 rounded-full bg-brand-soft border-2 border-white shadow-soft flex items-center justify-center font-bold text-brand text-xs">
                            {review.author.initial}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-ink text-xs group-hover:text-brand transition-colors">{review.author.name} {review.author.surnames}</p>
                            <p className="text-[10px] text-muted">@{review.author.username}</p>
                          </div>
                        </Link>
                        <svg className="w-4 h-4 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                        <Link href={`/user/${review.receiver.id_user}`} className="flex items-center gap-2 group">
                          <div className="w-9 h-9 rounded-full bg-canvas border-2 border-white shadow-soft flex items-center justify-center font-bold text-ink-soft text-xs">
                            {review.receiver.initial}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-ink text-xs group-hover:text-brand transition-colors">{review.receiver.name} {review.receiver.surnames}</p>
                            <p className="text-[10px] text-muted">@{review.receiver.username}</p>
                          </div>
                        </Link>
                        <span className="ml-auto text-[11px] text-muted-soft">
                          {new Date(review.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {review.service_title && (
                        <p className="text-xs text-muted mb-2">
                          Servicio relacionado: <span className="font-bold text-ink-soft">{review.service_title}</span>
                        </p>
                      )}

                      <blockquote className="relative bg-canvas border-l-4 border-red-300 rounded-r-xl px-4 py-3 text-sm text-ink-soft leading-relaxed mb-4">
                        <svg className="absolute top-2 right-2 w-5 h-5 text-red-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                        {review.content}
                      </blockquote>

                      {isConfirming ? (
                        <div className="bg-danger-soft border border-red-200 rounded-xl p-3 flex items-center justify-between gap-3 animate-fade-in">
                          <p className="text-xs font-bold text-red-700">¿Eliminar esta reseña permanentemente?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1.5 text-xs font-bold text-ink-soft bg-surface rounded-lg hover:bg-hairline-soft transition-colors btn-press"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleAction(review.id_review, 'delete')}
                              disabled={isLoading}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-danger rounded-lg hover:bg-red-600 transition-colors btn-press disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isLoading ? (
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : 'Confirmar'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end pt-3 border-t border-hairline-soft">
                          <button
                            onClick={() => handleAction(review.id_review, 'ignore')}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs font-bold text-ink-soft bg-canvas border border-hairline rounded-lg hover:border-ink hover:bg-hairline-soft transition-all btn-press disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isLoading ? (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            Ignorar y aprobar
                          </button>
                          <button
                            onClick={() => setConfirmDelete(review.id_review)}
                            className="px-4 py-2 text-xs font-bold text-white bg-danger rounded-lg hover:bg-red-600 transition-colors btn-press flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166M18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79" />
                            </svg>
                            Eliminar reseña
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
