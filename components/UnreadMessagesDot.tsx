'use client';

import { useState, useEffect } from 'react';

export default function UnreadMessagesDot() {
  const [total, setTotal] = useState(0);

  async function fetchUnread() {
    try {
      const res = await fetch('/api/chat/unread-count');
      if (res.ok) {
        const data = await res.json();
        setTotal(data.total ?? 0);
      }
    } catch {
      // silently ignore network errors
    }
  }

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30_000);

    function onVisibility() {
      if (document.visibilityState === 'visible') fetchUnread();
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (total === 0) return null;

  return (
    <span
      aria-label={`${total} mensaje${total === 1 ? '' : 's'} sin leer`}
      className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-danger ring-2 ring-surface pointer-events-none"
    />
  );
}
