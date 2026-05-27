'use client';

import { useState } from 'react';

interface Activity {
  id_activity: number;
  name: string;
  topic: string;
}

interface ExchangeData {
  id_exchange: number;
  status: string;
  requester_id_user: string;
  target_id_user: string;
  activity_req: Activity | null;
  activity_off: Activity | null;
  requester: { id_user: string; name: string; surnames: string };
  target: { id_user: string; name: string; surnames: string };
}

interface ExchangeMessageEmbedProps {
  exchange: ExchangeData;
  myId: string;
}

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',   bg: 'bg-warning-soft',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  accepted:  { label: 'Aceptado',    bg: 'bg-brand-soft',    text: 'text-brand',       dot: 'bg-brand' },
  refused:   { label: 'Rechazado',   bg: 'bg-danger-soft',   text: 'text-red-700',     dot: 'bg-danger' },
  completed: { label: 'Completado',  bg: 'bg-success-soft',  text: 'text-emerald-700', dot: 'bg-success' },
} as const;

function ActivityCard({ activity, label }: { activity: Activity | null; label: string }) {
  return (
    <div className="bg-canvas border border-hairline rounded-xl p-3 flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-ink text-xs leading-tight truncate">
            {activity?.name ?? 'Actividad eliminada'}
          </p>
          {activity?.topic && (
            <p className="text-[10px] text-muted truncate">{activity.topic}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExchangeMessageEmbed({ exchange, myId }: ExchangeMessageEmbedProps) {
  const [status, setStatus] = useState(exchange.status);
  const [loading, setLoading] = useState<'accepted' | 'refused' | null>(null);

  const isTarget = exchange.target_id_user === myId;
  const canAct = isTarget && status === 'pending';
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

  async function handleAction(newStatus: 'accepted' | 'refused') {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/exchanges/${exchange.id_exchange}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-hairline bg-surface overflow-hidden shadow-soft">
      {/* Header */}
      <div className="relative gradient-brand px-4 py-3 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Propuesta de intercambio</p>
              <p className="text-white/75 text-[11px] mt-0.5">
                De {exchange.requester.name} {exchange.requester.surnames}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Activities */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <ActivityCard activity={exchange.activity_off} label="Ofrece" />
          <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <ActivityCard activity={exchange.activity_req} label="Solicita" />
        </div>

        {/* Actions */}
        {canAct && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-hairline-soft">
            <button
              onClick={() => handleAction('accepted')}
              disabled={loading !== null}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 gradient-brand text-white text-xs font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-50"
            >
              {loading === 'accepted' ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              Aceptar
            </button>
            <button
              onClick={() => handleAction('refused')}
              disabled={loading !== null}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface border border-hairline text-ink-soft text-xs font-bold rounded-xl hover:border-red-300 hover:text-danger hover:bg-danger-soft transition-all btn-press disabled:opacity-50"
            >
              {loading === 'refused' ? (
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              Rechazar
            </button>
          </div>
        )}

        {!canAct && status === 'pending' && !isTarget && (
          <p className="mt-3 pt-3 border-t border-hairline-soft text-[11px] text-muted italic text-center flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Esperando respuesta…
          </p>
        )}
      </div>
    </div>
  );
}
