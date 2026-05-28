'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Warning {
  id_penalty: number;
  reason: string;
  given_at: string;
}

export default function WarningModal() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [penaltiesCount, setPenaltiesCount] = useState(0);
  const [acknowledging, setAcknowledging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/pending-warnings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setWarnings(data.warnings ?? []);
          setPenaltiesCount(data.penalties_count ?? 0);
        }
      })
      .catch(() => {});
  }, []);

  async function handleAcknowledge() {
    if (!warnings.length || acknowledging) return;
    setAcknowledging(true);
    try {
      const current = warnings[0];
      await fetch(`/api/auth/pending-warnings/${current.id_penalty}/acknowledge`, { method: 'POST' });
      setWarnings((prev) => prev.slice(1));
    } catch {
      // silencioso: el usuario puede reintentar
    } finally {
      setAcknowledging(false);
    }
  }

  if (!mounted || warnings.length === 0) return null;

  const current = warnings[0];

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="warning-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-scale">
        <div className="relative bg-danger text-white px-6 py-5 overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-20" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <div>
              <h2 id="warning-modal-title" className="text-base font-bold">Advertencia de la comunidad</h2>
              <p className="text-sm text-white/80 mt-0.5">Acumulas <span className="font-bold">{penaltiesCount}/3 strikes</span></p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-ink-soft">
            Has recibido una penalización por la siguiente reseña:
          </p>
          <blockquote className="bg-canvas border border-hairline rounded-xl px-4 py-3 text-sm text-ink italic">
            «{current.reason}»
          </blockquote>
          {penaltiesCount >= 2 && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-danger-soft border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
              <span>
                {penaltiesCount === 2
                  ? 'Atención: este es tu penúltimo aviso. Un strike más bloqueará tu cuenta permanentemente.'
                  : 'Tu cuenta será bloqueada al recibir otro strike.'}
              </span>
            </div>
          )}
          <p className="text-xs text-muted">
            {warnings.length > 1
              ? `Tienes ${warnings.length} avisos pendientes de reconocer.`
              : 'Una vez que confirmes, podrás continuar navegando con normalidad.'}
          </p>
          <button
            onClick={handleAcknowledge}
            disabled={acknowledging}
            className="w-full px-4 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {acknowledging ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando…
              </>
            ) : 'Entendido'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
