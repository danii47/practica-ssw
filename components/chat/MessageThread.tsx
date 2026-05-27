'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ExchangeMessageEmbed from './ExchangeMessageEmbed';
import MessageInput from './MessageInput';

interface Sender {
  id_user: string;
  name: string;
  surnames: string;
  username: string;
}

interface ExchangeData {
  id_exchange: number;
  status: string;
  requester_id_user: string;
  target_id_user: string;
  activity_req: { id_activity: number; name: string; topic: string } | null;
  activity_off: { id_activity: number; name: string; topic: string } | null;
  requester: { id_user: string; name: string; surnames: string };
  target: { id_user: string; name: string; surnames: string };
}

interface Message {
  id_message: number;
  content: string | null;
  send_at: string;
  id_exchange: number | null;
  is_read: boolean;
  sender: Sender;
  exchange: ExchangeData | null;
}

interface MessageThreadProps {
  conversationId: number;
  myId: string;
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessageSkeleton({ mine }: { mine: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
      <div className="w-7 h-7 rounded-full skeleton shrink-0" />
      <div className={`space-y-1 ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="h-3 w-20 skeleton rounded" />
        <div className={`h-10 skeleton rounded-2xl ${mine ? 'w-48' : 'w-56'}`} />
      </div>
    </div>
  );
}

export default function MessageThread({ conversationId, myId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherName, setOtherName] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data: Message[] = await res.json();
      setMessages(data);

      // Derive other participant name from the first message not sent by me
      if (!otherName && data.length > 0) {
        const other = data.find((m) => m.sender.id_user !== myId)?.sender;
        if (other) setOtherName(`${other.name} ${other.surnames}`);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [conversationId, myId, otherName]);

  // Mark as read on open
  useEffect(() => {
    fetch(`/api/chat/conversations/${conversationId}/read`, { method: 'POST' }).catch(
      () => {}
    );
  }, [conversationId]);

  // Fetch messages and start polling
  useEffect(() => {
    isFirstLoad.current = true;
    setLoading(true);
    setMessages([]);
    setOtherName('');
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length === 0) return;
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
      isFirstLoad.current = false;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSend(content: string) {
    const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const msg: Message = await res.json();
      setMessages((prev) => [...prev, msg]);
    }
  }

  // Group messages: show date separator when date changes
  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>(
    (groups, msg) => {
      const dateKey = new Date(msg.send_at).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      const last = groups[groups.length - 1];
      if (last && last.date === dateKey) {
        last.msgs.push(msg);
      } else {
        groups.push({ date: dateKey, msgs: [msg] });
      }
      return groups;
    },
    []
  );

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-canvas">
      {/* Header */}
      <div className="px-5 py-4 bg-surface border-b border-hairline shrink-0 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-soft border-2 border-white shadow-soft flex items-center justify-center font-bold text-brand text-sm shrink-0">
          {otherName.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <p className="font-bold text-ink text-sm leading-tight">
            {otherName || 'Conversación'}
          </p>
          <p className="text-xs text-muted">Chat directo</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {loading ? (
          <div className="space-y-4 pt-2">
            <MessageSkeleton mine={false} />
            <MessageSkeleton mine={true} />
            <MessageSkeleton mine={false} />
            <MessageSkeleton mine={true} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
            </div>
            <p className="font-bold text-ink text-sm mb-1">Empieza la conversación</p>
            <p className="text-xs text-muted">Envía el primer mensaje.</p>
          </div>
        ) : (
          groupedMessages.map(({ date, msgs }) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-hairline" />
                <span className="text-[11px] font-semibold text-muted px-2 capitalize">{date}</span>
                <div className="flex-1 h-px bg-hairline" />
              </div>

              <div className="space-y-2">
                {msgs.map((msg) => {
                  const isMe = msg.sender.id_user === myId;

                  // Exchange embed message
                  if (msg.exchange) {
                    return (
                      <div key={msg.id_message} className="flex flex-col items-center py-2">
                        <ExchangeMessageEmbed exchange={msg.exchange} myId={myId} />
                        <span className="text-[10px] text-muted mt-1">
                          {formatMessageTime(msg.send_at)}
                        </span>
                      </div>
                    );
                  }

                  // Regular text message
                  return (
                    <div
                      key={msg.id_message}
                      className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isMe
                            ? 'bg-brand text-white'
                            : 'bg-brand-soft text-brand'
                        }`}
                      >
                        {msg.sender.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Bubble */}
                      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                        <p className="text-[10px] text-muted px-1 font-semibold">
                          {isMe ? 'Tú' : `${msg.sender.name} ${msg.sender.surnames}`}
                        </p>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? 'gradient-brand text-white rounded-br-sm shadow-brand'
                              : 'bg-surface border border-hairline text-ink rounded-bl-sm shadow-soft'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted px-1">
                          {formatMessageTime(msg.send_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
