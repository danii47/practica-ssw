'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ExchangeModal from '@/components/ExchangeModal';

interface Contact {
  id_user: string;
  full_name: string;
  username: string;
  initial: string;
  location: string | null;
  services_count: number;
}

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-orange-400 to-orange-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-teal-400 to-teal-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function MyContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [exchangeTarget, setExchangeTarget] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/contacts/me');
    if (res.ok) setContacts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id_user !== id));
        setConfirmId(null);
      } else {
        alert('No se pudo eliminar el contacto.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setRemovingId(null);
    }
  }

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return c.full_name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q);
  });

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-canvas">
      <header className="bg-surface border-b border-hairline shrink-0 z-10">
        <div className="px-6 md:px-10 py-5 flex items-center gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Mis Contactos</h1>
            <p className="text-sm text-muted mt-0.5">
              {loading ? 'Cargando…' : `${contacts.length} ${contacts.length === 1 ? 'persona' : 'personas'} en tu red`}
            </p>
          </div>
          <div className="relative w-full sm:max-w-md sm:ml-auto">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-soft">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.343-4.343m0 0A8 8 0 103.343 5.657a8 8 0 0013.314 11" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Buscar contacto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-canvas border border-hairline rounded-full focus:outline-none focus:ring-2 focus:ring-brand focus:bg-surface text-sm transition-all placeholder-muted-soft"
            />
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-6 md:p-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[1600px] mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-hairline p-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl skeleton" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-3/4 skeleton rounded" />
                    <div className="h-3 w-1/2 skeleton rounded" />
                  </div>
                </div>
                <div className="h-9 w-full skeleton rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-brand-soft flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink mb-1">Aún no tienes contactos</h3>
            <p className="text-sm text-muted mb-5">Explora la comunidad y conecta con otros usuarios para empezar.</p>
            <Link href="/community" className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press">
              Explorar comunidad
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted max-w-md mx-auto animate-fade-in">
            <p className="font-bold text-ink mb-1">No hay coincidencias</p>
            <p className="text-sm">Prueba con otro término de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[1600px] mx-auto">
            {filtered.map((contact, idx) => {
              const color = avatarColor(contact.id_user);
              const isConfirming = confirmId === contact.id_user;
              const isRemoving = removingId === contact.id_user;

              return (
                <article
                  key={contact.id_user}
                  className="bg-surface rounded-2xl border border-hairline p-5 flex flex-col card-hoverable animate-slide-up"
                  style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
                >
                  <Link href={`/user/${contact.id_user}`} className="flex items-center gap-3 mb-4 group">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-xl font-extrabold text-white shadow-soft shrink-0`}>
                      {contact.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-ink text-sm truncate group-hover:text-brand transition-colors">{contact.full_name}</h3>
                      <p className="text-xs text-muted truncate">@{contact.username}</p>
                    </div>
                  </Link>

                  <div className="space-y-1.5 text-xs text-muted mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      </svg>
                      <span><span className="font-bold text-ink-soft">{contact.services_count}</span> {contact.services_count === 1 ? 'servicio' : 'servicios'}</span>
                    </div>
                    {contact.location && (
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-muted-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate">{contact.location}</span>
                      </div>
                    )}
                  </div>

                  {isConfirming ? (
                    <div className="mt-auto bg-danger-soft border border-red-200 rounded-xl p-3 animate-fade-in">
                      <p className="text-xs font-semibold text-red-700 mb-2.5 text-center">¿Eliminar de tus contactos?</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1.5 text-xs font-bold text-ink-soft bg-surface rounded-lg hover:bg-hairline-soft transition-colors btn-press"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleRemove(contact.id_user)}
                          disabled={isRemoving}
                          className="px-2 py-1.5 text-xs font-bold text-white bg-danger rounded-lg hover:bg-red-600 transition-colors btn-press disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          {isRemoving ? (
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-hairline-soft">
                      <button
                        onClick={() => setExchangeTarget(contact)}
                        className="py-2 text-xs font-bold text-brand bg-brand-soft rounded-lg hover:bg-brand hover:text-white transition-all btn-press flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                        Intercambio
                      </button>
                      <button
                        onClick={() => setConfirmId(contact.id_user)}
                        className="py-2 text-xs font-bold text-muted bg-canvas border border-hairline rounded-lg hover:border-red-300 hover:text-danger hover:bg-danger-soft transition-all btn-press flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {exchangeTarget && (
        <ExchangeModal
          isOpen={!!exchangeTarget}
          onClose={() => setExchangeTarget(null)}
          targetUserId={exchangeTarget.id_user}
          targetUserName={exchangeTarget.full_name}
        />
      )}
    </main>
  );
}
