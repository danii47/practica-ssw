'use client';

import { useState, useEffect } from 'react';
import ConversationList from '@/components/chat/ConversationList';
import MessageThread from '@/components/chat/MessageThread';

export default function MessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.id_user) setMyId(d.id_user); })
      .catch(() => {});
  }, []);

  return (
    <main className="flex-1 flex h-full overflow-hidden bg-canvas">
      <ConversationList
        selectedConvId={selectedConvId}
        myId={myId}
        onSelect={setSelectedConvId}
      />

      {selectedConvId && myId ? (
        <MessageThread
          key={selectedConvId}
          conversationId={selectedConvId}
          myId={myId}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-canvas text-center px-8">
          <div className="w-20 h-20 rounded-2xl bg-brand-soft flex items-center justify-center mb-5 shadow-soft">
            <svg
              className="w-10 h-10 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ink mb-2 tracking-tight">
            Tus mensajes
          </h2>
          <p className="text-sm text-muted max-w-xs leading-relaxed">
            Selecciona una conversación de la lista o propón un intercambio para iniciar un chat.
          </p>
        </div>
      )}
    </main>
  );
}
