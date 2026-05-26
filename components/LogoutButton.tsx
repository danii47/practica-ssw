'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
      className="group relative w-10 h-10 flex items-center justify-center text-muted hover:text-danger hover:bg-danger-soft rounded-lg transition-all btn-press disabled:opacity-50"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
      )}
      <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
        Cerrar sesión
      </span>
    </button>
  );
}
