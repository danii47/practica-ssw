'use client';

import { useState, useEffect, useCallback } from 'react';

interface OtherParticipant {
  id_user: string;
  name: string;
  surnames: string;
  username: string;
}

interface LastMessage {
  id_message: number;
  content: string | null;
  send_at: string;
  id_user_sender: string;
  id_exchange: number | null;
}

interface Conversation {
  id_conversation: number;
  type: string;
  creation_date: string;
  other_participant: OtherParticipant | null;
  last_message: LastMessage | null;
  unread_count: number;
}

interface ConversationListProps {
  selectedConvId: number | null;
  myId: string | null;
  onSelect: (id: number) => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7)
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="w-11 h-11 rounded-full skeleton shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/5 skeleton rounded" />
        <div className="h-3 w-4/5 skeleton rounded" />
      </div>
    </div>
  );
}

export default function ConversationList({
  selectedConvId,
  myId,
  onSelect,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) setConversations(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const p = c.other_participant;
    if (!p) return false;
    return (
      p.name.toLowerCase().includes(q) ||
      p.surnames.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q)
    );
  });

  const totalUnread = conversations.reduce((s, c) => s + c.unread_count, 0);

  return (
    <aside className="w-80 shrink-0 flex flex-col border-r border-hairline bg-surface h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-hairline-soft shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold text-ink tracking-tight flex-1">Mensajes</h2>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand text-white">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversación…"
            className="w-full pl-9 pr-3 py-2 bg-canvas border border-hairline rounded-xl text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="divide-y divide-hairline-soft">
            {[1, 2, 3, 4].map((i) => <ConversationSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p className="font-bold text-ink text-sm mb-1">
              {search ? 'Sin resultados' : 'Sin conversaciones aún'}
            </p>
            <p className="text-xs text-muted">
              {search
                ? 'Intenta con otro nombre'
                : 'Propón un intercambio para iniciar un chat'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-hairline-soft">
            {filtered.map((conv) => {
              const p = conv.other_participant;
              const initial = p?.name.charAt(0).toUpperCase() ?? '?';
              const isActive = conv.id_conversation === selectedConvId;
              const hasUnread = conv.unread_count > 0;

              let preview = '';
              if (conv.last_message) {
                if (conv.last_message.id_exchange) {
                  preview = '🔄 Propuesta de intercambio';
                } else if (conv.last_message.content) {
                  const isMe = conv.last_message.id_user_sender === myId;
                  preview = `${isMe ? 'Tú: ' : ''}${conv.last_message.content}`;
                }
              } else {
                preview = 'Conversación nueva';
              }

              return (
                <li key={conv.id_conversation}>
                  <button
                    onClick={() => onSelect(conv.id_conversation)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors btn-press ${
                      isActive
                        ? 'bg-brand-soft'
                        : 'hover:bg-canvas'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 ${
                        isActive
                          ? 'bg-brand text-white border-brand'
                          : 'bg-brand-soft text-brand border-white'
                      }`}
                    >
                      {initial}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1 mb-0.5">
                        <p className={`font-bold text-sm truncate ${isActive ? 'text-brand' : 'text-ink'}`}>
                          {p ? `${p.name} ${p.surnames}` : 'Usuario'}
                        </p>
                        {conv.last_message && (
                          <span className="text-[10px] text-muted shrink-0">
                            {formatTime(conv.last_message.send_at)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs truncate flex-1 ${hasUnread ? 'text-ink font-semibold' : 'text-muted'}`}>
                          {preview}
                        </p>
                        {hasUnread && (
                          <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {conv.unread_count > 9 ? '9+' : conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
