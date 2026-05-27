'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { TOPICS, topicStyle } from '@/lib/topics';

type Activity = {
  id_activity: number;
  name: string;
  description: string;
  topic: string;
  type: string;
  location: string | null;
  status: string;
  date: Date | null;
};

type ModalMode = 'create' | 'edit';

const emptyForm = { name: '', description: '', topic: 'Informática', type: 'online', location: '' };

export default function MyServicesClient({ activities }: { activities: Activity[] }) {
  const router = useRouter();

  // ── Edit/Create modal ─────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Toggle (pause/activate) ───────────────────────────────────────────────
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // ── Delete ────────────────────────────────────────────────────────────────
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; kind: 'success' | 'error' } | null>(null);

  // ── Portal mount guard ────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Auto-dismiss toast after 3.5 s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Escape to close edit/create modal
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalOpen]);

  // Escape to close delete confirm modal
  useEffect(() => {
    if (!confirmDelete) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmDelete(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [confirmDelete]);

  // ── Edit/Create handlers ──────────────────────────────────────────────────
  function openCreate() {
    setMode('create');
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  }

  function openEdit(activity: Activity) {
    setMode('edit');
    setEditingId(activity.id_activity);
    setForm({
      name: activity.name,
      description: activity.description,
      topic: activity.topic,
      type: activity.type,
      location: activity.location ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = mode === 'create' ? '/api/activities' : `/api/activities/${editingId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar.');
      }
      closeModal();
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  }

  // ── Toggle handler ────────────────────────────────────────────────────────
  async function handleToggle(activity: Activity) {
    setTogglingId(activity.id_activity);
    try {
      const res = await fetch(`/api/activities/${activity.id_activity}/status`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert('No se pudo cambiar el estado. Inténtalo de nuevo.');
    } finally {
      setTogglingId(null);
    }
  }

  // ── Delete handler ────────────────────────────────────────────────────────
  async function handleDelete(activity: Activity) {
    setDeletingId(activity.id_activity);
    try {
      const res = await fetch(`/api/activities/${activity.id_activity}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'No se pudo eliminar el servicio.');
      setDeletedIds((prev) => new Set(prev).add(activity.id_activity));
      setToast({ msg: 'Servicio eliminado correctamente.', kind: 'success' });
      setConfirmDelete(null);
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : 'Error inesperado.', kind: 'error' });
      setConfirmDelete(null);
    } finally {
      setDeletingId(null);
    }
  }

  const selectedStyle = topicStyle(form.topic);
  const visibleActivities = activities.filter((a) => !deletedIds.has(a.id_activity));

  return (
    <>
      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <button
          onClick={openCreate}
          className="group relative border-2 border-dashed border-hairline rounded-2xl bg-surface/50 flex flex-col items-center justify-center min-h-[280px] hover:border-brand hover:bg-brand-soft/40 transition-all overflow-hidden btn-press"
        >
          <div className="absolute inset-0 bg-dots opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-16 h-16 bg-surface border-2 border-hairline rounded-2xl flex items-center justify-center text-muted group-hover:text-brand group-hover:border-brand group-hover:shadow-brand transition-all">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="relative mt-4 font-bold text-ink-soft group-hover:text-brand transition-colors">Publicar servicio</span>
          <span className="relative mt-1 text-xs text-muted">Comparte una habilidad</span>
        </button>

        {visibleActivities.map((activity, idx) => {
          const s = topicStyle(activity.topic);
          const isActive = activity.status === 'active';
          const isToggling = togglingId === activity.id_activity;
          const isDeleting = deletingId === activity.id_activity;

          return (
            <article
              key={activity.id_activity}
              className={`bg-surface rounded-2xl border border-hairline overflow-hidden flex flex-col card-hoverable animate-slide-up ${!isActive ? 'opacity-75' : ''}`}
              style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
            >
              <div className={`relative h-32 bg-gradient-to-br ${s.gradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-noise opacity-30" />
                {!isActive && <div className="absolute inset-0 bg-ink/20" />}
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm text-ink-soft">
                  {activity.type === 'online' ? 'Online' : 'Presencial'}
                </div>
                <div className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                  isActive ? 'bg-emerald-500 text-white' : 'bg-surface text-muted border border-hairline'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-muted-soft'}`} />
                  {isActive ? 'Activo' : 'En pausa'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 text-white/85">{s.icon}</div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <span className={`inline-flex self-start items-center px-2 py-0.5 text-[10px] font-bold rounded-full mb-2 ${s.tintBg} ${s.tintText} ${s.tintBorder} border`}>
                  {activity.topic}
                </span>
                <h3 className="text-base font-bold text-ink mb-1 leading-snug line-clamp-2 break-words">{activity.name}</h3>
                <p className="text-sm text-muted mb-3 line-clamp-2 leading-relaxed">{activity.description}</p>

                {activity.location && (
                  <p className="text-[11px] text-muted-soft flex items-center gap-1 mb-3">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {activity.location}
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-hairline-soft">
                  {/* Primary actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEdit(activity)}
                      className="py-2 text-xs font-bold text-brand bg-brand-soft rounded-lg hover:bg-brand hover:text-white transition-all btn-press flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggle(activity)}
                      disabled={isToggling}
                      className="py-2 text-xs font-bold text-ink-soft bg-canvas border border-hairline rounded-lg hover:bg-hairline-soft transition-colors btn-press disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isToggling ? (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isActive ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                          </svg>
                          Pausar
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                          Activar
                        </>
                      )}
                    </button>
                  </div>
                  {/* Destructive action — separated visually */}
                  <button
                    onClick={() => setConfirmDelete(activity)}
                    disabled={isDeleting}
                    className="mt-2 w-full py-2 text-xs font-bold text-danger bg-surface border border-red-200 rounded-lg hover:bg-danger-soft transition-colors btn-press disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isDeleting ? (
                      <span className="w-3.5 h-3.5 border-2 border-danger border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Create / Edit modal ───────────────────────────────────────────── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-scale flex flex-col max-h-[90vh]">
            <div className={`relative px-6 pt-5 pb-5 bg-gradient-to-br ${selectedStyle.gradient} text-white overflow-hidden shrink-0`}>
              <div className="absolute inset-0 bg-noise opacity-30" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 id="service-modal-title" className="text-lg font-bold">
                    {mode === 'create' ? 'Publicar servicio' : 'Editar servicio'}
                  </h2>
                  <p className="text-sm text-white/85 mt-0.5">
                    {mode === 'create' ? 'Comparte una habilidad con la comunidad' : 'Actualiza los detalles de tu servicio'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors btn-press"
                  aria-label="Cerrar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form id="service-modal-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-bold text-ink-soft mb-1.5">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Clases de guitarra para principiantes"
                  className="w-full border border-hairline rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow placeholder-muted-soft"
                />
                <p className="text-[11px] text-muted-soft text-right mt-1">{form.name.length}/50</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-soft mb-1.5">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  maxLength={250}
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe brevemente tu servicio…"
                  className="w-full border border-hairline rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-shadow placeholder-muted-soft"
                />
                <p className="text-[11px] text-muted-soft text-right mt-1">{form.description.length}/250</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-soft mb-2">
                  Tema <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TOPICS.map((t) => {
                    const s = topicStyle(t);
                    const active = form.topic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, topic: t })}
                        className={`relative p-2.5 rounded-xl border-2 transition-all btn-press flex flex-col items-center gap-1.5 ${
                          active
                            ? `${s.tintBg} ${s.tintBorder} shadow-soft`
                            : 'bg-canvas border-hairline hover:border-brand'
                        }`}
                      >
                        <div className={`w-5 h-5 ${active ? s.iconColor : 'text-muted'}`}>{s.icon}</div>
                        <span className={`text-[10px] font-bold ${active ? s.tintText : 'text-muted'}`}>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-ink-soft mb-1.5">
                    Modalidad <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-canvas border border-hairline rounded-xl">
                    {(['online', 'presencial'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          form.type === t
                            ? 'bg-surface shadow-soft text-brand'
                            : 'text-muted hover:text-ink-soft'
                        }`}
                      >
                        {t === 'online' ? 'Online' : 'Presencial'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-soft mb-1.5">
                    Ubicación <span className="text-muted-soft font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Madrid, España"
                    className="w-full border border-hairline rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder-muted-soft"
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 px-3 py-2.5 bg-danger-soft border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                  </svg>
                  {error}
                </div>
              )}
            </form>

            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-hairline-soft shrink-0 bg-surface">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 text-sm font-bold text-ink-soft bg-canvas rounded-xl hover:bg-hairline-soft transition-colors btn-press"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="service-modal-form"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-bold text-white gradient-brand rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando…
                  </>
                ) : mode === 'create' ? 'Publicar servicio' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {confirmDelete && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} aria-hidden="true" />
          <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-scale">
            <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-danger-soft flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h2 id="delete-dialog-title" className="text-base font-bold text-ink mb-1">¿Eliminar este servicio?</h2>
              <p className="text-sm text-muted mb-1">
                <span className="font-semibold text-ink-soft">«{confirmDelete.name}»</span>
              </p>
              <p className="text-xs text-muted-soft">Esta acción no se puede deshacer. Los servicios con intercambios asociados no podrán eliminarse.</p>
            </div>
            <div className="flex gap-2.5 px-6 pb-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 bg-canvas text-ink-soft text-sm font-bold rounded-xl hover:bg-hairline-soft transition-colors btn-press"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete.id_activity}
                className="flex-1 px-4 py-2.5 bg-danger text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all btn-press disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId === confirmDelete.id_activity ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && mounted && createPortal(
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-fade-in-scale max-w-xs ${
            toast.kind === 'success'
              ? 'bg-success-soft border-emerald-200 text-emerald-700'
              : 'bg-danger-soft border-red-200 text-red-700'
          }`}
        >
          {toast.kind === 'success' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          <span className="text-sm font-semibold flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Cerrar">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
