'use client';

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [value]);

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || sending || disabled) return;
    setSending(true);
    try {
      await onSend(trimmed);
      setValue('');
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2 p-3 bg-surface border-t border-hairline">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje… (Enter para enviar)"
        rows={1}
        maxLength={500}
        disabled={disabled || sending}
        className="flex-1 resize-none px-3.5 py-2.5 bg-canvas border border-hairline rounded-2xl text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow disabled:opacity-50 overflow-hidden leading-relaxed"
        style={{ minHeight: '42px', maxHeight: '128px' }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || sending || disabled}
        aria-label="Enviar mensaje"
        className="w-10 h-10 rounded-2xl gradient-brand text-white flex items-center justify-center shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        {sending ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        )}
      </button>
    </div>
  );
}
