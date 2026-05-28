'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ExchangeModal from '@/components/ExchangeModal';
import ConfirmDialog from '@/components/ConfirmDialog';

interface User {
  id_user: string;
  full_name: string;
  username: string;
  initial: string;
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

type ContactStatus = 'idle' | 'loading' | 'added' | 'error';

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [contactMap, setContactMap] = useState<Record<string, ContactStatus>>({});
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Hidratación inicial: cargar contactos existentes al montar
  useEffect(() => {
    fetch('/api/contacts/me')
      .then((r) => (r.ok ? r.json() : []))
      .then((contacts: { id_user: string }[]) => {
        if (contacts.length) {
          const initial: Record<string, ContactStatus> = {};
          for (const c of contacts) initial[c.id_user] = 'added';
          setContactMap(initial);
        }
      })
      .catch(() => {});
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const res = await fetch(`/api/users?${params.toString()}`);
    if (res.ok) {
      const data: User[] = await res.json();
      setUsers(data);
      setSelected((prev) => prev && data.find((u) => u.id_user === prev.id_user) ? prev : data[0] ?? null);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  async function handleAddContact(userId: string) {
    const current = contactMap[userId];
    if (current === 'loading' || current === 'added') return;
    setContactMap((prev) => ({ ...prev, [userId]: 'loading' }));
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friend_id_user: userId }),
      });
      if (res.ok || res.status === 409) {
        setContactMap((prev) => ({ ...prev, [userId]: 'added' }));
      } else {
        setContactMap((prev) => ({ ...prev, [userId]: 'error' }));
        setTimeout(() => setContactMap((prev) => ({ ...prev, [userId]: 'idle' })), 3000);
      }
    } catch {
      setContactMap((prev) => ({ ...prev, [userId]: 'error' }));
      setTimeout(() => setContactMap((prev) => ({ ...prev, [userId]: 'idle' })), 3000);
    }
  }

  async function handleRemoveContact() {
    if (!selected) return;
    setRemoveLoading(true);
    try {
      const res = await fetch(`/api/contacts/${selected.id_user}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setContactMap((prev) => ({ ...prev, [selected.id_user]: 'idle' }));
        setShowRemoveModal(false);
      }
    } finally {
      setRemoveLoading(false);
    }
  }

  const isAdded = selected ? contactMap[selected.id_user] === 'added' : false;
  const isContactLoading = selected
    ? contactMap[selected.id_user] === 'loading' || removeLoading
    : false;

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <section className="hidden md:flex w-80 bg-surface border-r border-hairline flex-col h-full shrink-0 z-10">
        <div className="p-5 border-b border-hairline shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold text-ink tracking-tight">Comunidad</h2>
            {!loading && (
              <span className="text-xs font-bold text-muted bg-canvas px-2 py-0.5 rounded-full">{users.length}</span>
            )}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-soft">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.343-4.343m0 0A8 8 0 103.343 5.657a8 8 0 0013.314 11" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Buscar usuarios…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-canvas border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:bg-surface text-sm transition-all placeholder-muted-soft"
              aria-label="Buscar usuarios"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full skeleton shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 skeleton rounded" />
                    <div className="h-2.5 w-1/2 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-muted text-sm">No se encontraron usuarios.</div>
          ) : (
            users.map((user) => {
              const isSelected = selected?.id_user === user.id_user;
              const color = avatarColor(user.id_user);
              return (
                <button
                  key={user.id_user}
                  onClick={() => setSelected(user)}
                  className={`w-full px-4 py-3 flex items-center gap-3 border-l-[3px] transition-all text-left ${
                    isSelected
                      ? 'bg-brand-soft border-brand'
                      : 'hover:bg-canvas border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white shadow-soft shrink-0`}>
                    {user.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-brand' : 'text-ink'}`}>
                      {user.full_name}
                    </h4>
                    <p className="text-xs text-muted truncate">
                      @{user.username} · {user.services_count} {user.services_count === 1 ? 'servicio' : 'servicios'}
                    </p>
                  </div>
                  {isSelected && (
                    <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      <div className="flex-1 flex flex-col h-full min-h-0 bg-canvas overflow-hidden">
        {selected ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="bg-surface rounded-3xl shadow-soft border border-hairline overflow-hidden">
                  <div className="relative h-32 gradient-brand overflow-hidden">
                    <div className="absolute inset-0 bg-noise opacity-30" />
                  </div>
                  <div className="px-8 pb-8 -mt-14 relative z-10">
                    <div className="w-28 h-28 rounded-3xl bg-surface border-[5px] border-surface shadow-lg flex items-center justify-center text-5xl font-extrabold text-brand mb-5">
                      {selected.initial}
                    </div>
                    <h2 className="text-2xl font-extrabold text-ink mb-1 tracking-tight">{selected.full_name}</h2>
                    <p className="text-muted text-sm mb-1">@{selected.username}</p>
                    <p className="text-sm text-muted">
                      <span className="font-bold text-ink-soft">{selected.services_count}</span> {selected.services_count === 1 ? 'servicio activo' : 'servicios activos'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-7">
                      <Link
                        href={`/user/${selected.id_user}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 gradient-brand text-white rounded-xl text-sm font-bold shadow-brand hover:shadow-lg transition-all btn-press"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ver perfil
                      </Link>

                      {isAdded ? (
                        <button
                          onClick={() => setShowRemoveModal(true)}
                          disabled={isContactLoading}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-press border bg-danger-soft border-red-200 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed"
                        >
                          {isContactLoading ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                          )}
                          Eliminar contacto
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddContact(selected.id_user)}
                          disabled={isContactLoading}
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-press border ${
                            contactMap[selected.id_user] === 'error'
                              ? 'bg-danger-soft border-red-200 text-red-700'
                              : 'bg-surface border-hairline text-ink-soft hover:border-brand hover:text-brand'
                          } disabled:cursor-not-allowed`}
                        >
                          {isContactLoading ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                          )}
                          {contactMap[selected.id_user] === 'loading' ? 'Añadiendo…'
                            : contactMap[selected.id_user] === 'error' ? 'Reintentar'
                            : 'Añadir como contacto'}
                        </button>
                      )}

                      <button
                        onClick={() => setExchangeOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-hairline rounded-xl text-sm font-bold text-ink-soft hover:border-brand hover:text-brand transition-all btn-press"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                        Intercambio
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-muted mt-6">
                  Selecciona otro usuario en la barra lateral para ver su perfil rápido.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="font-bold text-ink">Selecciona un usuario</p>
              <p className="text-sm mt-1">Elige un miembro de la lista para ver su información.</p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ExchangeModal
          isOpen={exchangeOpen}
          onClose={() => setExchangeOpen(false)}
          targetUserId={selected.id_user}
          targetUserName={selected.full_name}
        />
      )}

      {showRemoveModal && selected && (
        <ConfirmDialog
          title="Eliminar contacto"
          message={<>¿Seguro que quieres eliminar a <span className="font-bold text-ink">{selected.full_name}</span> de tus contactos?</>}
          confirmLabel="Eliminar"
          loading={removeLoading}
          onConfirm={handleRemoveContact}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}
    </div>
  );
}
