'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function LogoutButton() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const modal = confirmOpen && mounted ? createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} aria-hidden="true" />
      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-scale">
        <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-soft flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
          <h2 id="logout-dialog-title" className="text-lg font-bold text-ink mb-1">¿Cerrar sesión?</h2>
          <p className="text-sm text-muted">Tu sesión se cerrará en este dispositivo.</p>
        </div>
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={() => setConfirmOpen(false)}
            className="flex-1 px-4 py-2.5 bg-canvas text-ink-soft text-sm font-bold rounded-xl hover:bg-hairline-soft transition-colors btn-press"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-danger text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all btn-press disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className="group relative w-10 h-10 flex items-center justify-center text-muted hover:text-danger hover:bg-danger-soft rounded-lg transition-all btn-press"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
          Cerrar sesión
        </span>
      </button>
      {modal}
    </>
  );
}
