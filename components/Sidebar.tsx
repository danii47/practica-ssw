'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';
import UnreadMessagesDot from './UnreadMessagesDot';

interface SidebarProps {
  user: {
    id_user: string;
    name: string;
    surnames: string;
    role: string;
  } | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  match?: (path: string) => boolean;
  danger?: boolean;
}

const ICON_HOME = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const ICON_SERVICES = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const ICON_COMMUNITY = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ICON_CONTACTS = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const ICON_EXCHANGES = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const ICON_MESSAGES = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const ICON_SHIELD = (
  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

const ICON_GEAR = (
  <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';
  const isAdmin = user?.role === 'admin';

  const navItems: NavItem[] = isAdmin
    ? [
        {
          href: '/moderation',
          label: 'Moderación',
          icon: ICON_SHIELD,
          match: (p) => p.startsWith('/moderation'),
          danger: true,
        },
        {
          href: '/messages',
          label: 'Mensajes',
          icon: ICON_MESSAGES,
          badge: <UnreadMessagesDot />,
          match: (p) => p.startsWith('/messages'),
        },
      ]
    : [
        {
          href: '/',
          label: 'Inicio',
          icon: ICON_HOME,
          match: (p) => p === '/',
        },
        {
          href: '/my-services',
          label: 'Mis Servicios',
          icon: ICON_SERVICES,
          match: (p) => p.startsWith('/my-services'),
        },
        {
          href: '/community',
          label: 'Comunidad',
          icon: ICON_COMMUNITY,
          match: (p) => p.startsWith('/community'),
        },
        {
          href: '/my-contacts',
          label: 'Mis Contactos',
          icon: ICON_CONTACTS,
          match: (p) => p.startsWith('/my-contacts'),
        },
        {
          href: '/my-exchanges',
          label: 'Mis Intercambios',
          icon: ICON_EXCHANGES,
          match: (p) => p.startsWith('/my-exchanges'),
        },
        {
          href: '/messages',
          label: 'Mensajes',
          icon: ICON_MESSAGES,
          badge: <UnreadMessagesDot />,
          match: (p) => p.startsWith('/messages'),
        },
      ];

  return (
    <aside className="w-20 bg-surface border-r border-hairline flex flex-col items-center py-5 shrink-0 z-30 relative">
      <Link
        href="/"
        className="group relative w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shrink-0 overflow-hidden gradient-brand shadow-brand transition-transform hover:scale-105 active:scale-95"
        aria-label="KnowledgExchange · Inicio"
      >
        <div className="absolute inset-0 opacity-30 bg-noise pointer-events-none" />
        <svg className="relative z-10 w-7 h-7" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 377 304" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0,304) scale(0.1,-0.1)" fill="#ffffff" stroke="none">
            <path d="M1645 2861 c-89 -25 -182 -79 -255 -146 l-65 -61 -65 14 c-51 11 -82 12 -141 4 -191 -27 -337 -146 -425 -350 l-33 -77 -93 -47 c-254 -129 -378 -327 -378 -605 0 -182 50 -328 155 -455 122 -149 323 -238 534 -238 l67 0 28 -60 c99 -209 366 -296 611 -201 l78 30 57 -52 c68 -64 175 -121 261 -142 88 -20 237 -18 324 5 l70 18 35 -27 c47 -37 78 -95 96 -182 26 -126 70 -183 162 -210 36 -11 48 -10 76 4 76 36 125 155 133 323 l6 101 56 13 c124 27 232 99 299 200 60 89 82 169 82 294 l0 102 39 22 c102 58 193 197 210 324 21 150 -25 284 -136 397 -56 58 -64 70 -69 116 -17 144 -67 256 -149 340 -89 92 -221 151 -355 162 -75 6 -77 6 -96 40 -30 57 -139 150 -203 173 -108 41 -213 48 -289 19 -19 -7 -32 -1 -74 32 -66 52 -168 103 -245 123 -81 21 -230 20 -308 -3z" />
          </g>
        </svg>
      </Link>

      <nav className="flex flex-col gap-1.5 flex-1 w-full items-center px-2">
        {navItems.map((item) => {
          const active = item.match ? item.match(pathname) : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative w-full flex items-center justify-center"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all ${
                  active
                    ? item.danger
                      ? 'h-7 bg-danger'
                      : 'h-7 bg-brand'
                    : 'h-0 bg-transparent'
                }`}
              />
              <span
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all btn-press ${
                  active
                    ? item.danger
                      ? 'bg-danger-soft text-danger shadow-soft'
                      : 'bg-brand-soft text-brand shadow-soft'
                    : item.danger
                    ? 'text-muted hover:bg-danger-soft hover:text-danger'
                    : 'text-muted hover:bg-brand-soft hover:text-brand'
                }`}
              >
                {item.icon}
                {item.badge}
              </span>
              <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-2 mt-auto pt-4 border-t border-hairline-soft w-full px-2">
        <Link
          href={user ? `/user/${user.id_user}` : '/settings'}
          className="group relative w-11 h-11 rounded-full bg-brand-soft border-2 border-brand flex items-center justify-center text-brand font-bold text-sm hover:shadow-brand hover:scale-105 transition-all"
          title={user ? `${user.name} ${user.surnames}` : 'Mi perfil'}
          aria-label={user ? `Perfil de ${user.name} ${user.surnames}` : 'Mi perfil'}
        >
          {initial}
          <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
            Mi perfil
          </span>
        </Link>
        <Link
          href="/settings"
          className={`group relative w-10 h-10 flex items-center justify-center rounded-lg transition-all btn-press ${
            pathname.startsWith('/settings')
              ? 'bg-brand-soft text-brand'
              : 'text-muted hover:bg-brand-soft hover:text-brand'
          }`}
          aria-label="Ajustes"
        >
          {ICON_GEAR}
          <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
            Ajustes
          </span>
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
