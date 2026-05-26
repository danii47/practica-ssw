'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface RawActivity {
  id_activity: number;
  name: string;
}

interface RawUser {
  id_user: string;
  name: string;
  surnames: string;
  username: string;
}

interface RawReview {
  id_review: number;
  valoration: number;
}

interface RawExchange {
  id_exchange: number;
  status: string;
  creation_date: string;
  requester_id_user: string;
  target_id_user: string;
  requester: RawUser;
  target: RawUser;
  activity_req: RawActivity | null;
  activity_off: RawActivity | null;
  reviews: RawReview[];
}

const STATUS_META: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  pending:   { label: 'Propuesto',  bg: 'bg-warning-soft',  text: 'text-amber-700',   border: 'border-amber-200',  dot: 'bg-amber-500' },
  accepted:  { label: 'Aceptado',   bg: 'bg-brand-soft',    text: 'text-brand',        border: 'border-indigo-200', dot: 'bg-brand' },
  refused:   { label: 'Rechazado',  bg: 'bg-danger-soft',   text: 'text-red-700',      border: 'border-red-200',    dot: 'bg-danger' },
  completed: { label: 'Completado', bg: 'bg-success-soft',  text: 'text-emerald-700',  border: 'border-emerald-200',dot: 'bg-success' },
  cancelled: { label: 'Cancelado',  bg: 'bg-canvas',        text: 'text-muted',        border: 'border-hairline',   dot: 'bg-muted-soft' },
};

const FALLBACK_META = { label: 'Desconocido', bg: 'bg-canvas', text: 'text-muted', border: 'border-hairline', dot: 'bg-muted-soft' };

function ActivityBox({ activity, label }: { activity: RawActivity | null; label: string }) {
  return (
    <div className="bg-canvas border border-hairline rounded-xl p-3.5 flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="font-bold text-ink text-sm leading-tight truncate">
          {activity?.name ?? 'Actividad eliminada'}
        </p>
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Valoración">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-1 btn-press"
          aria-label={`${star} estrellas`}
        >
          <svg
            className={`w-8 h-8 transition-colors ${(hover || value) >= star ? 'text-amber-400' : 'text-hairline'}`}
            viewBox="0 0 20 20"
            fill={(hover || value) >= star ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function MyExchangesPage() {
  const [exchanges, setExchanges] = useState<RawExchange[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const [reviewModal, setReviewModal] = useState<RawExchange | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [meRes, exRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/exchanges/me'),
      ]);
      if (meRes.ok) {
        const me = await meRes.json();
        setMyId(me.id_user);
      }
      if (exRes.ok) {
        setExchanges(await exRes.json());
      }
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!reviewModal) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeReview(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [reviewModal]);

  async function handleAction(id: number, status: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/exchanges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await fetchAll();
      else alert('Error al actualizar el intercambio.');
    } catch { alert('Error de conexión.'); }
    finally { setActionLoading(null); }
  }

  function openReview(ex: RawExchange) {
    setReviewModal(ex);
    setReviewRating(5);
    setReviewContent('');
    setReviewError('');
  }

  function closeReview() { setReviewModal(null); }

  async function submitReview() {
    if (!reviewModal) return;
    if (reviewContent.trim().length < 10) {
      setReviewError('La reseña debe tener al menos 10 caracteres.');
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_exchange: reviewModal.id_exchange,
          valoration: reviewRating,
          content: reviewContent.trim(),
        }),
      });
      if (res.ok) { closeReview(); await fetchAll(); }
      else {
        const d = await res.json().catch(() => ({}));
        setReviewError(d.error ?? 'Error al enviar la reseña.');
      }
    } catch { setReviewError('Error de conexión.'); }
    finally { setReviewSubmitting(false); }
  }

  const filtered = statusFilter === 'all'
    ? exchanges
    : exchanges.filter((e) => e.status === statusFilter);

  const counts = exchanges.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  const filters = [
    { v: 'all',      label: 'Todos',      count: exchanges.length },
    { v: 'pending',  label: 'Propuestos', count: counts.pending ?? 0 },
    { v: 'accepted', label: 'Aceptados',  count: counts.accepted ?? 0 },
    { v: 'completed',label: 'Completados',count: counts.completed ?? 0 },
    { v: 'refused',  label: 'Rechazados', count: counts.refused ?? 0 },
  ];

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-canvas">
      <header className="bg-surface border-b border-hairline shrink-0 z-10">
        <div className="px-6 md:px-10 py-5">
          <h1 className="text-2xl font-bold text-ink tracking-tight">Mis Intercambios</h1>
          <p className="text-sm text-muted mt-0.5">Gestiona tus propuestas y valoraciones.</p>
        </div>
        <div className="px-6 md:px-10 pb-4 flex items-center gap-2 flex-wrap">
          {filters.map((f) => {
            const active = statusFilter === f.v;
            return (
              <button
                key={f.v}
                onClick={() => setStatusFilter(f.v)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all btn-press flex items-center gap-2 ${
                  active ? 'bg-ink text-white border-ink' : 'bg-surface text-ink-soft border-hairline hover:border-ink'
                }`}
              >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20' : 'bg-canvas text-muted'}`}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-2xl border border-hairline p-6">
                  <div className="h-4 w-2/5 skeleton rounded mb-3" />
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-16 skeleton rounded-xl" />
                    <div className="h-16 skeleton rounded-xl" />
                  </div>
                  <div className="h-9 w-32 skeleton rounded-lg" />
                </div>
              ))}
            </div>
          ) : exchanges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-brand-soft flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-ink mb-1">Sin intercambios todavía</h3>
              <p className="text-sm text-muted mb-5">Cuando propongas o recibas propuestas aparecerán aquí.</p>
              <Link href="/" className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press">
                Descubrir servicios
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p className="font-bold text-ink mb-1">No hay intercambios con este filtro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ex, idx) => {
                const isCreator = ex.requester_id_user === myId;
                const counterpart = isCreator ? ex.target : ex.requester;
                const meta = STATUS_META[ex.status] ?? FALLBACK_META;
                const isLoading = actionLoading === ex.id_exchange;
                const myReview = ex.reviews?.[0] ?? null;

                const offeredActivity = isCreator ? ex.activity_off : ex.activity_req;
                const requestedActivity = isCreator ? ex.activity_req : ex.activity_off;

                return (
                  <article
                    key={ex.id_exchange}
                    className="bg-surface rounded-2xl border border-hairline overflow-hidden card-hoverable animate-slide-up"
                    style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                        <Link href={`/user/${counterpart?.id_user ?? ''}`} className="flex items-center gap-3 group">
                          <div className="w-11 h-11 rounded-full bg-brand-soft border-2 border-white shadow-soft flex items-center justify-center font-bold text-brand">
                            {counterpart?.name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <p className="font-bold text-ink text-sm group-hover:text-brand transition-colors">
                              {counterpart ? `${counterpart.name} ${counterpart.surnames}` : 'Usuario'}
                            </p>
                            <p className="text-xs text-muted">
                              {isCreator ? 'Tú propusiste' : 'Te propuso'} ·{' '}
                              {new Date(ex.creation_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </Link>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${meta.bg} ${meta.text} ${meta.border} border rounded-full text-xs font-bold`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                        <ActivityBox activity={offeredActivity} label={isCreator ? 'Tú ofreces' : 'Te ofrecen'} />
                        <div className="self-center w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                          </svg>
                        </div>
                        <ActivityBox activity={requestedActivity} label={isCreator ? 'Tú pides' : 'Te piden'} />
                      </div>

                      {myReview && (
                        <div className="mt-4 bg-canvas border border-hairline rounded-xl p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Tu reseña</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className={`w-3.5 h-3.5 fill-current ${i < myReview.valoration ? 'text-amber-400' : 'text-hairline'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        {ex.status === 'pending' && !isCreator && (
                          <>
                            <button
                              onClick={() => handleAction(ex.id_exchange, 'accepted')}
                              disabled={isLoading}
                              className="px-4 py-2 gradient-brand text-white text-xs font-bold rounded-lg shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleAction(ex.id_exchange, 'refused')}
                              disabled={isLoading}
                              className="px-4 py-2 bg-surface border border-hairline text-ink-soft text-xs font-bold rounded-lg hover:border-red-300 hover:text-danger hover:bg-danger-soft transition-all btn-press disabled:opacity-50"
                            >
                              Rechazar
                            </button>
                          </>
                        )}

                        {ex.status === 'pending' && isCreator && (
                          <span className="text-xs text-muted italic flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Esperando respuesta de {counterpart?.name ?? 'usuario'}…
                          </span>
                        )}

                        {ex.status === 'accepted' && (
                          <button
                            onClick={() => handleAction(ex.id_exchange, 'completed')}
                            disabled={isLoading}
                            className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors btn-press disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            Marcar completado
                          </button>
                        )}

                        {ex.status === 'completed' && !myReview && (
                          <button
                            onClick={() => openReview(ex)}
                            className="px-4 py-2 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all btn-press flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Dejar reseña
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {reviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) closeReview(); }}
        >
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-scale">
            <div className="relative gradient-brand text-white px-6 py-5 overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-30" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Valorar intercambio</h2>
                  <p className="text-sm text-white/85 mt-0.5">
                    Con <span className="font-semibold">
                      {reviewModal.requester_id_user === myId
                        ? `${reviewModal.target.name} ${reviewModal.target.surnames}`
                        : `${reviewModal.requester.name} ${reviewModal.requester.surnames}`}
                    </span>
                  </p>
                </div>
                <button onClick={closeReview} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors btn-press" aria-label="Cerrar">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm font-bold text-ink-soft mb-3 text-center">¿Qué tal fue tu experiencia?</p>
                <div className="flex justify-center">
                  <StarPicker value={reviewRating} onChange={setReviewRating} />
                </div>
                <p className="text-center text-xs text-muted mt-2 font-semibold">
                  {['', 'Muy malo', 'Malo', 'Aceptable', 'Bueno', 'Excelente'][reviewRating]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-soft mb-1.5">Tu reseña</label>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Comparte tu experiencia con este intercambio…"
                  className="w-full px-3 py-2.5 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-shadow placeholder-muted-soft"
                />
                <p className="text-[11px] text-muted-soft text-right mt-1">{reviewContent.length}/500</p>
              </div>

              {reviewError && (
                <div role="alert" className="flex items-start gap-2 px-3 py-2.5 bg-danger-soft border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                  </svg>
                  {reviewError}
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2 border-t border-hairline-soft">
                <button onClick={closeReview} className="px-4 py-2.5 text-sm font-bold text-ink-soft bg-canvas rounded-xl hover:bg-hairline-soft transition-colors btn-press">
                  Cancelar
                </button>
                <button
                  onClick={submitReview}
                  disabled={reviewSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white gradient-brand rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-60 flex items-center gap-2"
                >
                  {reviewSubmitting ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando…</>
                  ) : 'Publicar reseña'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
