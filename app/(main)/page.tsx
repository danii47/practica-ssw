'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ExchangeModal from '@/components/ExchangeModal';
import { TOPICS, topicStyle } from '@/lib/topics';

interface Activity {
  id_activity: number;
  name: string;
  description: string;
  topic: string;
  type: string;
  location: string | null;
  user: {
    id_user: string;
    name: string;
    surnames: string;
    location: string | null;
  };
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-orange-100 text-orange-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function HomePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [draftSearch, setDraftSearch] = useState(() => searchParams.get('q') ?? '');
  const [filterType, setFilterType] = useState(() => searchParams.get('type') ?? '');
  const [filterTopic, setFilterTopic] = useState(() => searchParams.get('topic') ?? '');
  const [myId, setMyId] = useState<string | null>(null);
  const [exchangeTarget, setExchangeTarget] = useState<{ id: string; name: string; activityId: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setMyId(data.id_user); })
      .catch(() => {});
  }, []);

  function pushParams(params: { search: string; type: string; topic: string }) {
    const sp = new URLSearchParams();
    if (params.search) sp.set('q', params.search);
    if (params.type) sp.set('type', params.type);
    if (params.topic) sp.set('topic', params.topic);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterType) params.set('type', filterType);
    if (filterTopic) params.set('topic', filterTopic);

    const res = await fetch(`/api/activities?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setActivities(data);
    }
    setLoading(false);
  }, [search, filterType, filterTopic]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  function handleDraftChange(value: string) {
    setDraftSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      pushParams({ search: value, type: filterType, topic: filterTopic });
    }, 400);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearch(draftSearch);
    pushParams({ search: draftSearch, type: filterType, topic: filterTopic });
  }

  function handleFilterType(value: string) {
    setFilterType(value);
    pushParams({ search, type: value, topic: filterTopic });
  }

  function handleFilterTopic(value: string) {
    setFilterTopic(value);
    pushParams({ search, type: filterType, topic: value });
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilterType('');
    setFilterTopic('');
    setSearch('');
    setDraftSearch('');
    router.replace(pathname, { scroll: false });
  }

  const hasFilters = !!(filterType || filterTopic || search);

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="bg-surface border-b border-hairline shrink-0 z-10">
        <div className="px-6 md:px-10 py-5 flex items-center gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              Descubre <span className="gradient-text">talento real</span>
            </h1>
            <p className="text-sm text-muted mt-0.5">Habilidades de personas como tú, listas para intercambiar.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md ml-auto">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-soft">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.343-4.343m0 0A8 8 0 103.343 5.657a8 8 0 0013.314 11" />
              </svg>
            </span>
            <input
              type="search"
              value={draftSearch}
              onChange={(e) => handleDraftChange(e.target.value)}
              placeholder="Buscar habilidades, servicios o usuarios…"
              className="w-full pl-11 pr-4 py-2.5 bg-canvas border border-hairline rounded-full focus:outline-none focus:ring-2 focus:ring-brand focus:bg-surface transition-all text-sm placeholder-muted-soft"
              aria-label="Buscar"
            />
          </form>
        </div>

        <div className="px-6 md:px-10 pb-4 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleFilterTopic('')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all btn-press ${
              filterTopic === ''
                ? 'bg-ink text-white border-ink'
                : 'bg-surface text-ink-soft border-hairline hover:border-ink'
            }`}
          >
            Todos los temas
          </button>
          {TOPICS.map((t) => {
            const s = topicStyle(t);
            const active = filterTopic === t;
            return (
              <button
                key={t}
                onClick={() => handleFilterTopic(active ? '' : t)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all btn-press flex items-center gap-1.5 ${
                  active
                    ? `${s.tintBg} ${s.tintBorder} ${s.tintText} shadow-soft`
                    : 'bg-surface text-ink-soft border-hairline hover:border-brand hover:text-brand'
                }`}
              >
                <span className={`w-3.5 h-3.5 ${active ? s.iconColor : ''}`}>{s.icon}</span>
                {t}
              </button>
            );
          })}
          <div className="w-px h-6 bg-hairline mx-1.5" />
          <select
            value={filterType}
            onChange={(e) => handleFilterType(e.target.value)}
            className="appearance-none bg-surface border border-hairline text-ink-soft py-1.5 pl-3.5 pr-8 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer hover:border-brand transition-colors"
            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '14px' }}
          >
            <option value="">Tipo: cualquiera</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </select>
          {hasFilters && (
            <button
              onClick={handleClear}
              className="px-3.5 py-1.5 text-xs font-bold text-muted bg-canvas rounded-full hover:bg-hairline-soft transition-colors btn-press flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar
            </button>
          )}
          <span className="ml-auto text-xs text-muted-soft font-medium">
            {loading ? '…' : `${activities.length} ${activities.length === 1 ? 'resultado' : 'resultados'}`}
          </span>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-6 md:p-10 bg-canvas">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[1600px] mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-hairline overflow-hidden">
                <div className="h-36 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-2/3 skeleton rounded" />
                  <div className="h-4 w-full skeleton rounded" />
                  <div className="h-3 w-5/6 skeleton rounded" />
                  <div className="h-3 w-3/4 skeleton rounded" />
                  <div className="h-9 w-full skeleton rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-brand-soft flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.343-4.343m0 0A8 8 0 103.343 5.657a8 8 0 0013.314 11M9 9h.01M15 9h.01M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink mb-1">No encontramos nada</h3>
            <p className="text-sm text-muted mb-5">Prueba con otros filtros o términos de búsqueda.</p>
            {hasFilters && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors btn-press"
              >
                Quitar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[1600px] mx-auto">
            {activities.map((activity, idx) => {
              const s = topicStyle(activity.topic);
              const isOnline = activity.type === 'online';
              const authorName = `${activity.user.name} ${activity.user.surnames.charAt(0)}.`;
              const authorInitial = activity.user.name.charAt(0).toUpperCase();
              const isMine = activity.user.id_user === myId;

              return (
                <article
                  key={activity.id_activity}
                  className="bg-surface rounded-2xl border border-hairline overflow-hidden flex flex-col card-hoverable animate-slide-up"
                  style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
                >
                  <div className={`relative h-36 bg-gradient-to-br ${s.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 bg-noise opacity-30" />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm">
                      {isOnline ? (
                        <>
                          <svg className="w-2.5 h-2.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                          </svg>
                          <span className="text-brand">Online</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-2.5 h-2.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <span className="text-orange-600">Presencial</span>
                        </>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 inline-flex px-2 py-1 bg-white/95 backdrop-blur rounded-md text-[10px] font-bold tracking-wide uppercase text-ink-soft shadow-sm">
                      {activity.topic}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 text-white/85">{s.icon}</div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={`/user/${activity.user.id_user}`} className="flex items-center gap-2 mb-3 group">
                      <div className={`w-7 h-7 rounded-full ${avatarColor(activity.user.id_user)} flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-soft`}>
                        {authorInitial}
                      </div>
                      <span className="text-xs font-semibold text-ink-soft group-hover:text-brand transition-colors">
                        {authorName}
                      </span>
                      {activity.user.location && (
                        <span className="text-xs text-muted-soft truncate ml-auto">· {activity.user.location.split(',')[0]}</span>
                      )}
                    </Link>

                    <h3 className="text-base font-bold text-ink mb-1.5 leading-snug line-clamp-2 break-words">{activity.name}</h3>
                    <p className="text-sm text-muted mb-4 line-clamp-3 leading-relaxed break-words">{activity.description}</p>

                    <div className="mt-auto">
                      {isMine ? (
                        <Link
                          href="/my-services"
                          className="block w-full text-center py-2.5 bg-canvas border border-hairline text-muted rounded-xl text-sm font-bold hover:bg-hairline-soft transition-colors"
                        >
                          Es tu servicio
                        </Link>
                      ) : (
                        <button
                          onClick={() => setExchangeTarget({ id: activity.user.id_user, name: `${activity.user.name} ${activity.user.surnames}`, activityId: activity.id_activity })}
                          className="w-full py-2.5 bg-brand-soft text-brand rounded-xl text-sm font-bold hover:bg-brand hover:text-white transition-all btn-press flex items-center justify-center gap-2 group"
                        >
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                          </svg>
                          Proponer intercambio
                        </button>
                      )}
                    </div>
                  </div>
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
          targetUserId={exchangeTarget.id}
          targetUserName={exchangeTarget.name}
          initialRequestedActivityId={exchangeTarget.activityId}
        />
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
