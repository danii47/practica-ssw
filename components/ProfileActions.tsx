'use client';

import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface ProfileActionsProps {
  targetUserId: string;
  targetUserName: string;
  initialIsContact: boolean;
  viewerRole: string;
  onOpenExchange: (activityId?: number | null) => void;
}

export default function ProfileActions({
  targetUserId,
  targetUserName,
  initialIsContact,
  viewerRole,
  onOpenExchange,
}: ProfileActionsProps) {
  const [isContact, setIsContact] = useState(initialIsContact);
  const [loading, setLoading] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  if (viewerRole === 'admin') return null;

  async function handleAddContact() {
    if (loading || isContact) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friend_id_user: targetUserId }),
      });
      if (res.ok || res.status === 409) setIsContact(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveContact() {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts/${targetUserId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setIsContact(false);
        setShowRemoveModal(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex gap-2.5">
        {isContact ? (
          <button
            onClick={() => setShowRemoveModal(true)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-press flex items-center gap-2 bg-danger-soft border border-red-200 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            Eliminar contacto
          </button>
        ) : (
          <button
            onClick={handleAddContact}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-press flex items-center gap-2 bg-surface border border-hairline text-ink-soft hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            )}
            {loading ? 'Añadiendo…' : 'Añadir contacto'}
          </button>
        )}

        <button
          onClick={() => onOpenExchange(null)}
          className="px-4 py-2.5 gradient-brand text-white rounded-xl text-sm font-bold shadow-brand hover:shadow-lg transition-all btn-press flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Proponer Intercambio
        </button>
      </div>

      {showRemoveModal && (
        <ConfirmDialog
          title="Eliminar contacto"
          message={<>¿Seguro que quieres eliminar a <span className="font-bold text-ink">{targetUserName}</span> de tus contactos?</>}
          confirmLabel="Eliminar"
          loading={loading}
          onConfirm={handleRemoveContact}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}
    </>
  );
}
