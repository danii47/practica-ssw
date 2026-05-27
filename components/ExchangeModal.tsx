'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { topicStyle } from '@/lib/topics';

interface Activity {
  id_activity: number;
  name: string;
  topic: string;
  type: string;
}

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

export default function ExchangeModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
}: ExchangeModalProps) {
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [targetActivities, setTargetActivities] = useState<Activity[]>([]);
  const [offeredActivity, setOfferedActivity] = useState('');
  const [requestedActivity, setRequestedActivity] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSuccess(false);
    setError('');
    setOfferedActivity('');
    setRequestedActivity('');
    setFetchLoading(true);

    fetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) throw new Error('No autenticado');
        return r.json();
      })
      .then((me: { id_user: string }) =>
        Promise.all([
          fetch(`/api/users/${me.id_user}/activities`).then((r) => r.json()),
          fetch(`/api/users/${targetUserId}/activities`).then((r) => r.json()),
        ])
      )
      .then(([myActs, targetActs]) => {
        const filterActive = (arr: Activity[]) =>
          Array.isArray(arr) ? arr.filter((a: Activity & { status?: string }) => !('status' in a) || a.status === 'active') : [];
        setMyActivities(filterActive(myActs));
        setTargetActivities(filterActive(targetActs));
      })
      .catch(() => setError('No se pudieron cargar las actividades. Recarga e inténtalo de nuevo.'))
      .finally(() => setFetchLoading(false));
  }, [isOpen, targetUserId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  async function handleSubmit() {
    if (!offeredActivity || !requestedActivity) {
      setError('Debes seleccionar las dos actividades antes de continuar.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_id_user: targetUserId,
          requested_activity: Number(requestedActivity),
          offered_activity: Number(offeredActivity),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2200);
      } else {
        const data = await res.json();
        setError(data.error ?? 'Error al enviar la propuesta. Inténtalo de nuevo.');
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const reqAct = targetActivities.find((a) => String(a.id_activity) === requestedActivity);
  const offAct = myActivities.find((a) => String(a.id_activity) === offeredActivity);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exchange-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-scale flex flex-col max-h-[85vh]">
        <div className="relative gradient-brand text-white px-6 py-5 overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-30" />
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <h2 id="exchange-modal-title" className="text-lg font-bold">Proponer intercambio</h2>
              <p className="text-sm text-white/85 mt-0.5">
                Con <span className="font-semibold">{targetUserName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors btn-press"
              aria-label="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 pb-8 pt-5 overflow-y-auto flex-1">
          {fetchLoading ? (
            <div className="bg-surface rounded-xl border border-hairline shadow-soft p-8 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted">Cargando actividades…</p>
            </div>
          ) : success ? (
            <div className="bg-surface rounded-xl border border-hairline shadow-soft p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center animate-fade-in-scale">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-ink text-base">¡Propuesta enviada!</p>
                <p className="text-sm text-muted mt-1">{targetUserName} recibirá tu propuesta.</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-hairline shadow-soft p-5 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  <span className="w-5 h-5 rounded-full gradient-brand text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                  Lo que pides
                </label>
                <select
                  value={requestedActivity}
                  onChange={(e) => { setRequestedActivity(e.target.value); setError(''); }}
                  className="w-full px-3 py-2.5 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm text-ink bg-surface"
                >
                  <option value="">Servicio de {targetUserName.split(' ')[0]}…</option>
                  {targetActivities.map((a) => (
                    <option key={a.id_activity} value={a.id_activity}>
                      {a.name} · {a.topic}
                    </option>
                  ))}
                </select>
                {reqAct && (
                  <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border ${topicStyle(reqAct.topic).tintBg} ${topicStyle(reqAct.topic).tintBorder}`}>
                    <div className={`w-5 h-5 ${topicStyle(reqAct.topic).iconColor}`}>{topicStyle(reqAct.topic).icon}</div>
                    <span className={`text-xs font-semibold ${topicStyle(reqAct.topic).tintText}`}>{reqAct.topic}</span>
                  </div>
                )}
                {targetActivities.length === 0 && (
                  <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5 bg-warning-soft border border-amber-200 rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    </svg>
                    Este usuario no tiene servicios activos.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-hairline" />
                <div className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <div className="flex-1 border-t border-hairline" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  <span className="w-5 h-5 rounded-full gradient-brand text-white flex items-center justify-center text-[10px] font-extrabold">2</span>
                  Lo que ofreces
                </label>
                <select
                  value={offeredActivity}
                  onChange={(e) => { setOfferedActivity(e.target.value); setError(''); }}
                  className="w-full px-3 py-2.5 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm text-ink bg-surface"
                >
                  <option value="">Uno de tus servicios…</option>
                  {myActivities.map((a) => (
                    <option key={a.id_activity} value={a.id_activity}>
                      {a.name} · {a.topic}
                    </option>
                  ))}
                </select>
                {offAct && (
                  <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border ${topicStyle(offAct.topic).tintBg} ${topicStyle(offAct.topic).tintBorder}`}>
                    <div className={`w-5 h-5 ${topicStyle(offAct.topic).iconColor}`}>{topicStyle(offAct.topic).icon}</div>
                    <span className={`text-xs font-semibold ${topicStyle(offAct.topic).tintText}`}>{offAct.topic}</span>
                  </div>
                )}
                {myActivities.length === 0 && (
                  <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5 bg-warning-soft border border-amber-200 rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    </svg>
                    No tienes servicios activos.{' '}
                    <a href="/my-services" className="underline font-bold ml-1">Añadir uno →</a>
                  </p>
                )}
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 px-3 py-2 bg-danger-soft border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-canvas text-ink-soft text-sm font-bold rounded-xl hover:bg-hairline-soft transition-colors btn-press"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || targetActivities.length === 0 || myActivities.length === 0}
                  className="flex-1 px-4 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando…
                    </>
                  ) : 'Enviar propuesta'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  , document.body);
}