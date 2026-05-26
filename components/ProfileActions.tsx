'use client';

import { useState } from 'react';
import ExchangeModal from './ExchangeModal';

interface ProfileActionsProps {
  targetUserId: string;
  targetUserName: string;
}

type ContactStatus = 'idle' | 'loading' | 'added' | 'error';

export default function ProfileActions({ targetUserId, targetUserName }: ProfileActionsProps) {
  const [contactStatus, setContactStatus] = useState<ContactStatus>('idle');
  const [exchangeOpen, setExchangeOpen] = useState(false);

  async function handleAddContact() {
    if (contactStatus === 'loading' || contactStatus === 'added') return;
    setContactStatus('loading');
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friend_id_user: targetUserId }),
      });
      if (res.ok || res.status === 409) setContactStatus('added');
      else {
        setContactStatus('error');
        setTimeout(() => setContactStatus('idle'), 3000);
      }
    } catch {
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 3000);
    }
  }

  return (
    <>
      <div className="flex gap-2.5">
        <button
          onClick={handleAddContact}
          disabled={contactStatus === 'loading' || contactStatus === 'added'}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-press flex items-center gap-2 ${
            contactStatus === 'added'
              ? 'bg-success-soft border border-emerald-200 text-emerald-700'
              : contactStatus === 'error'
              ? 'bg-danger-soft border border-red-200 text-red-700'
              : 'bg-surface border border-hairline text-ink-soft hover:border-brand hover:text-brand'
          } disabled:cursor-not-allowed`}
        >
          {contactStatus === 'loading' && (
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {contactStatus === 'added' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {contactStatus === 'idle' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          )}
          {contactStatus === 'idle' && 'Añadir contacto'}
          {contactStatus === 'loading' && 'Añadiendo…'}
          {contactStatus === 'added' && 'Contacto añadido'}
          {contactStatus === 'error' && 'Reintentar'}
        </button>

        <button
          onClick={() => setExchangeOpen(true)}
          className="px-4 py-2.5 gradient-brand text-white rounded-xl text-sm font-bold shadow-brand hover:shadow-lg transition-all btn-press flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Proponer Intercambio
        </button>
      </div>

      <ExchangeModal
        isOpen={exchangeOpen}
        onClose={() => setExchangeOpen(false)}
        targetUserId={targetUserId}
        targetUserName={targetUserName}
      />
    </>
  );
}
